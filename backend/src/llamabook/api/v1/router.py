from fastapi import APIRouter

from llamabook.api.v1.endpoints import (
    agents,
    auth,
    chat,
    documents,
    embeddings,
    files,
    notebooks,
    users,
)

router = APIRouter(prefix="/api/v1")

router.include_router(auth.router)
router.include_router(users.router)
router.include_router(chat.router)
router.include_router(files.router)
router.include_router(embeddings.router)
router.include_router(notebooks.router)
router.include_router(agents.router)
router.include_router(documents.router)
