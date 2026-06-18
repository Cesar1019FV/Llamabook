from __future__ import annotations

import sqlite3
import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from llamabook.adapters.ollama.client import OllamaClient
from llamabook.config import Settings
from llamabook.exceptions import NotFoundError, ValidationError
from llamabook.models.embedding import Embedding
from llamabook.models.user import User
from llamabook.repositories.embedding_repository import EmbeddingRepository
from llamabook.repositories.file_repository import FileRepository
from llamabook.services.file_service import FileService

CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200


class EmbeddingService:
    def __init__(
        self,
        settings: Settings,
        ollama: OllamaClient,
        embedding_repo: EmbeddingRepository,
        file_repo: FileRepository,
    ) -> None:
        self.settings = settings
        self.ollama = ollama
        self.embedding_repo = embedding_repo
        self.file_repo = file_repo
        self.vec_db_path = settings.data_dir / "llamabook_vec.db"

    def _sync_connection(self) -> sqlite3.Connection:
        import sqlite_vec

        conn = sqlite3.connect(str(self.vec_db_path))
        conn.enable_load_extension(True)
        sqlite_vec.load(conn)
        conn.execute(
            """
            CREATE VIRTUAL TABLE IF NOT EXISTS embeddings USING vec0(
                embedding_id TEXT PRIMARY KEY,
                file_id TEXT,
                chunk_index INTEGER,
                embedding FLOAT[768] distance_metric=cosine
            )
            """
        )
        return conn

    def _chunk_text(self, text: str) -> list[str]:
        chunks: list[str] = []
        start = 0
        while start < len(text):
            end = min(start + CHUNK_SIZE, len(text))
            if end < len(text) and text[end] != " ":
                space_pos = text.rfind(" ", start, end)
                if space_pos != -1:
                    end = space_pos
            chunks.append(text[start:end].strip())
            start = end - CHUNK_OVERLAP if end < len(text) else end
        return [c for c in chunks if c]

    async def index_file(self, db: AsyncSession, user: User, file_id: uuid.UUID) -> int:
        file_record = await self.file_repo.get_by_id_and_user(db, file_id, user.id)
        if not file_record:
            raise NotFoundError("File not found")

        file_service = FileService(self.file_repo, self.settings)
        content = await file_service.get_file_content(db, file_id, user.id)
        if content is None or not content.strip():
            raise ValidationError("File has no readable text content")

        existing = await self.embedding_repo.list_by_file(db, file_id)
        for emb in existing:
            await self.embedding_repo.delete(db, emb)

        chunks = self._chunk_text(content)
        model = self.settings.ollama_embed_model

        for index, chunk_text in enumerate(chunks):
            embedding = await self.ollama.embed(model, chunk_text)
            emb_id = str(uuid.uuid4())

            db_emb = Embedding(
                id=uuid.UUID(emb_id),
                file_id=file_id,
                chunk_index=index,
                chunk_text=chunk_text,
                embedding_model=model,
            )
            await self.embedding_repo.create(db, db_emb)

            conn = self._sync_connection()
            try:
                conn.execute(
                    "INSERT INTO embeddings(embedding_id, file_id, chunk_index, embedding) VALUES (?, ?, ?, ?)",
                    (emb_id, str(file_id), index, serialize_f32(embedding)),
                )
                conn.commit()
            finally:
                conn.close()

        return len(chunks)

    async def search(
        self, db: AsyncSession, user: User, query: str, top_k: int
    ) -> list[dict]:
        query_embedding = await self.ollama.embed(self.settings.ollama_embed_model, query)

        conn = self._sync_connection()
        try:
            rows = conn.execute(
                """
                SELECT file_id, chunk_index, distance
                FROM embeddings
                WHERE embedding MATCH ?
                ORDER BY distance
                LIMIT ?
                """,
                (serialize_f32(query_embedding), top_k),
            ).fetchall()
        finally:
            conn.close()

        results = []
        for file_id_str, chunk_index, distance in rows:
            file_id = uuid.UUID(file_id_str)
            file_record = await self.file_repo.get_by_id_and_user(db, file_id, user.id)
            if not file_record:
                continue

            emb = await self._get_embedding_by_file_and_index(db, file_id, chunk_index)
            if emb:
                results.append(
                    {
                        "chunk_text": emb.chunk_text,
                        "distance": distance,
                        "file_id": str(file_id),
                        "chunk_index": chunk_index,
                    }
                )
        return results

    async def _get_embedding_by_file_and_index(
        self, db: AsyncSession, file_id: uuid.UUID, chunk_index: int
    ) -> Embedding | None:
        from sqlalchemy import select

        statement = select(Embedding).where(
            Embedding.file_id == file_id, Embedding.chunk_index == chunk_index
        )
        result = await db.execute(statement)
        return result.scalar_one_or_none()


def serialize_f32(vector: list[float]) -> bytes:
    import struct

    return struct.pack(f"{len(vector)}f", *vector)
