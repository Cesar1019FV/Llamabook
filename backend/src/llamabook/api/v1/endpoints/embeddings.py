from __future__ import annotations

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from llamabook.adapters.ollama.client import OllamaClient
from llamabook.config import Settings, get_settings
from llamabook.database import get_db
from llamabook.dependencies import CurrentUserDep
from llamabook.repositories.embedding_repository import EmbeddingRepository
from llamabook.repositories.file_repository import FileRepository
from llamabook.schemas.embedding import EmbeddingIndexRequest, SearchRequest, SearchResult
from llamabook.services.embedding_service import EmbeddingService

router = APIRouter(prefix="/embeddings", tags=["embeddings"])


async def _embedding_service(
    settings: Annotated[Settings, Depends(get_settings)]
) -> EmbeddingService:
    return EmbeddingService(
        settings,
        OllamaClient(settings),
        EmbeddingRepository(),
        FileRepository(),
    )


EmbeddingServiceDep = Annotated[EmbeddingService, Depends(_embedding_service)]
DbDep = Annotated[AsyncSession, Depends(get_db)]


@router.post("/index")
async def index_file(
    body: EmbeddingIndexRequest,
    service: EmbeddingServiceDep,
    db: DbDep,
    current_user: CurrentUserDep,
):
    count = await service.index_file(db, current_user, uuid.UUID(body.file_id))
    return {"indexed_chunks": count}


@router.post("/search", response_model=list[SearchResult])
async def search(
    body: SearchRequest,
    service: EmbeddingServiceDep,
    db: DbDep,
    current_user: CurrentUserDep,
):
    results = await service.search(db, current_user, body.query, body.top_k)
    return [SearchResult(**r) for r in results]
