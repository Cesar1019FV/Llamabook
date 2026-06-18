from pydantic import BaseModel


class PaginationParams(BaseModel):
    skip: int = 0
    limit: int = 100


class PaginatedResponse(BaseModel):
    skip: int
    limit: int
    total: int
    data: list
