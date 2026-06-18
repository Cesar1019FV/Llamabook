from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse


class LlamabookError(Exception):
    status_code: int = 500
    code: str = "internal_error"

    def __init__(self, detail: str | None = None) -> None:
        self.detail = detail or "An unexpected error occurred"


class NotFoundError(LlamabookError):
    status_code = 404
    code = "not_found"


class ConflictError(LlamabookError):
    status_code = 409
    code = "conflict"


class UnauthorizedError(LlamabookError):
    status_code = 401
    code = "unauthorized"


class ForbiddenError(LlamabookError):
    status_code = 403
    code = "forbidden"


class ValidationError(LlamabookError):
    status_code = 422
    code = "validation_error"


class ExternalServiceError(LlamabookError):
    status_code = 502
    code = "external_service_error"


async def _handle_llamabook_error(request: Request, exc: LlamabookError) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": {"code": exc.code, "detail": exc.detail, "path": request.url.path}},
    )


def add_exception_handlers(app: FastAPI) -> None:
    app.add_exception_handler(LlamabookError, _handle_llamabook_error)
