from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from llamabook.api.v1.router import router as api_router
from llamabook.config import get_settings
from llamabook.exceptions import add_exception_handlers
from llamabook.lifespan import lifespan


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title="Llamabook API",
        version="0.1.0",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router)
    add_exception_handlers(app)

    @app.get("/health")
    async def health():
        return {"status": "ok"}

    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn

    settings = get_settings()
    uvicorn.run(
        "llamabook.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.reload,
    )
