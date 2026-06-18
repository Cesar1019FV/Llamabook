# Llamabook — Agent Instructions

> Monorepo: local-first AI chat workspace. Backend (Python/FastAPI) + Frontend (React/Vite).

## Commands

### Backend

```bash
cd backend
pip install -e .[dev]              # install deps (venv at backend/.venv)
python -m uvicorn llamabook.main:app --host 127.0.0.1 --port 8000 --app-dir src --reload
ruff check src/llamabook/           # lint
ruff check --fix src/llamabook/      # lint + auto-fix
```

Run uvicorn from the **project root** (not `backend/`):
```bash
python -m uvicorn llamabook.main:app --host 127.0.0.1 --port 8000 --app-dir backend/src
```

### Frontend

```bash
cd frontend
yarn install
yarn build      # tsc + vite build → dist/
```

**Use `yarn` only.** Do not run `npm install`. See `frontend/AGENTS.md` for full frontend conventions.

## Architecture

```
Llamabook/
├── .env                    # single env file for whole project (gitignored)
├── .env.example            # template (committed)
├── backend/
│   ├── pyproject.toml      # deps, ruff, mypy config
│   └── src/llamabook/      # Python package
│       ├── config.py        # Settings (pydantic-settings, reads .env from project root)
│       ├── database.py      # async engine, session maker, create_all_tables()
│       ├── lifespan.py      # FastAPI lifespan: create tables + seed admin
│       ├── main.py          # app factory + uvicorn entrypoint
│       ├── dependencies.py  # FastAPI deps: get_db, get_current_user, etc.
│       ├── core/security.py  # JWT + argon2id password hashing
│       ├── models/          # SQLModel tables (GUID custom type for UUID as CHAR(32))
│       ├── schemas/         # Pydantic request/response schemas
│       ├── services/        # business logic (auth, chat, file, embedding)
│       ├── repositories/     # data access layer
│       ├── adapters/        # external integrations (ollama client, file validators)
│       ├── api/v1/endpoints/ # FastAPI routers (auth, chat, files, embeddings, users)
│       └── exceptions.py    # domain exceptions + handlers
└── frontend/               # React 19 + Vite 8 + Tailwind v4 (FSD architecture)
```

## Critical gotchas

### 1. `.env` is at the project root, not in `backend/`
`Settings` in `config.py` resolves the `.env` path using `Path(__file__).resolve().parents[3] / ".env"` (absolute, CWD-independent). Never place `.env` in `backend/`.

### 2. `database_url` is a computed property, not a field
It derives from `data_dir / "llamabook.db"` as an absolute path. There is no `LLAMABOOK_DATABASE_URL` env var. Do not add one — the URL is computed automatically and is always absolute, eliminating the CWD-relative path bug.

### 3. `data_dir` resolves relative paths against project root
`LLAMABOOK_DATA_DIR=backend/data` in `.env` becomes `C:\...\Llamabook\backend\data` at runtime via `field_validator`. This is CWD-independent.

### 4. UUID columns use custom `GUID` type (CHAR(32))
All UUID fields store as 32-char hex strings in SQLite. Do not change to native UUID — SQLite doesn't have one. See `models/base.py`.

### 5. No ORM relationships in models
`from __future__ import annotations` breaks SQLModel's `Relationship()` with generic types. All joins are done manually in repositories.

### 6. Lifespan handles table creation and admin seed
`lifespan.py` calls `create_all_tables()` and seeds the admin user on startup. The database file and directories are created automatically. Do not add a separate init-db script.

### 7. Auth uses argon2id via passlib
Passwords are hashed with `argon2`. JWT tokens use HS256 with the `LLAMABOOK_SECRET_KEY`.

### 8. No code comments
Do not add comments to source files. Code should be self-explanatory through naming and structure.

## Key env vars

| Variable | Purpose |
|----------|---------|
| `LLAMABOOK_SECRET_KEY` | JWT signing key (≥32 chars, required) |
| `LLAMABOOK_DATA_DIR` | Storage root (default: `backend/data`, resolves to absolute) |
| `LLAMABOOK_ADMIN_EMAIL` | Default admin email for seed |
| `LLAMABOOK_ADMIN_PASSWORD` | Default admin password for seed |
| `OLLAMA_BASE_URL` | Ollama API endpoint |
| `OLLAMA_DEFAULT_MODEL` | Chat model (default: `llama3.2`) |
| `OLLAMA_EMBED_MODEL` | Embedding model (default: `nomic-embed-text`) |

## API

All endpoints under `/api/v1/`. Swagger UI at `/docs`, ReDoc at `/redoc`.

- `POST /api/v1/auth/login` — OAuth2 password flow
- `POST /api/v1/auth/register` — self-registration
- `GET /api/v1/auth/me` — current user info
- `POST /api/v1/chats/` — create chat
- `GET /api/v1/chats/` — list user chats
- `POST /api/v1/chats/{id}/messages` — send message (SSE streaming)
- `POST /api/v1/files/` — upload file
- `POST /api/v1/embeddings/index` — index file for vector search
- `POST /api/v1/embeddings/search` — semantic search