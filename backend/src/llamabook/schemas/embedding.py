from __future__ import annotations

from pydantic import BaseModel, Field


class EmbeddingIndexRequest(BaseModel):
    file_id: str


class SearchRequest(BaseModel):
    query: str = Field(min_length=1)
    top_k: int = Field(default=5, ge=1, le=50)


class SearchResult(BaseModel):
    chunk_text: str
    distance: float
    file_id: str
    chunk_index: int
