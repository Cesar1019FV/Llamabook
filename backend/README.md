# Llamabook Backend — Documentación de la API

Backend FastAPI para el workspace de IA local-first Llamabook.

## Levantar el backend y ver la documentación interactiva

1. **Clonar e instalar dependencias:**

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate       # Windows
# source .venv/bin/activate   # Linux/macOS

pip install -e .[dev]
```

2. **Configurar el entorno:** El archivo `.env` va en la raíz del proyecto, NO dentro de `backend/`.

```bash
# Desde la raíz del proyecto (Llamabook/)
cp .env.example .env
# Editar .env con tus valores (al menos LLAMABOOK_SECRET_KEY)
```

3. **Iniciar el servidor:**

```bash
# Desde la raíz del proyecto (Llamabook/)
python -m uvicorn llamabook.main:app --host 127.0.0.1 --port 8000 --app-dir backend/src --reload
```

4. **Abrir la documentación interactiva en el navegador:**

- **Swagger UI** (probar endpoints): [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc** (documentación legible): [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

En Swagger UI puedes:
- Ver todos los endpoints agrupados por tag
- Probar cada endpoint directamente desde el navegador
- Usar el botón **Authorize** 🔓 para autenticarte con JWT y probar endpoints protegidos
  - Haz click en **Authorize**, ingresa tu email en `username` y tu contraseña en `password`
  - O pega un `access_token` directamente en el campo de Bearer

> **Usuario admin por defecto:** El servidor crea automáticamente un usuario admin con las credenciales configuradas en `.env` (`LLAMABOOK_ADMIN_EMAIL` / `LLAMABOOK_ADMIN_PASSWORD`). Defaults: `admin@llamabook.local` / `admin`.

5. **Verificar que funciona:**

```bash
curl http://127.0.0.1:8000/health
# Respuesta: {"status":"ok"}
```

---

## Inicio rápido (resumen)

```bash
cd backend && .venv\Scripts\activate
pip install -e .[dev]
cd .. && cp .env.example .env
python -m uvicorn llamabook.main:app --host 127.0.0.1 --port 8000 --app-dir backend/src --reload
# Abrir http://127.0.0.1:8000/docs
```

---

## Configuración — Variables de entorno

El archivo `.env` se ubica en la **raíz del proyecto** (no dentro de `backend/`). La ruta la resuelve automáticamente `config.py`.

| Variable | Descripción | Default |
|----------|-------------|---------|
| `LLAMABOOK_SECRET_KEY` | Clave de firma JWT (≥32 caracteres, obligatoria) | — |
| `LLAMABOOK_ADMIN_EMAIL` | Email del admin que se crea al iniciar | `admin@llamabook.local` |
| `LLAMABOOK_ADMIN_PASSWORD` | Password del admin seed | `admin` |
| `LLAMABOOK_HOST` | Host del servidor | `127.0.0.1` |
| `LLAMABOOK_PORT` | Puerto del servidor | `8000` |
| `LLAMABOOK_RELOAD` | Hot-reload en desarrollo | `true` |
| `LLAMABOOK_CORS_ORIGINS` | Orígenes permitidos (JSON array o comma-separated) | `["http://localhost:5173","http://127.0.0.1:5173"]` |
| `LLAMABOOK_DATA_DIR` | Directorio de datos (se resuelve contra la raíz del proyecto) | `backend/data` |
| `LLAMABOOK_MAX_UPLOAD_SIZE` | Tamaño máximo de archivo en bytes | `52428800` (50 MB) |
| `OLLAMA_BASE_URL` | URL de la API de Ollama | `http://localhost:11434` |
| `OLLAMA_API_KEY` | API key para Ollama Cloud (opcional) | — |
| `OLLAMA_DEFAULT_MODEL` | Modelo de chat por defecto | `llama3.2` |
| `OLLAMA_EMBED_MODEL` | Modelo de embeddings | `nomic-embed-text` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Duración del access token en minutos | `15` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Duración del refresh token en días | `7` |

---

## Autenticación

Llamabook usa JWT con dos tokens: **access token** (corto plazo) y **refresh token** (largo plazo).

### Flujo de autenticación

1. **Registrar usuario** → `POST /api/v1/auth/register`
2. **Iniciar sesión** → `POST /api/v1/auth/login` → devuelve `{ access_token, refresh_token }`
3. **Usar access token** en cada request protegido:  
   `Authorization: Bearer <access_token>`
4. **Cuando el access token expire** (15 min por default), usar el refresh token:  
   `POST /api/v1/auth/refresh` con `{ refresh_token }` → devuelve nuevos `{ access_token, refresh_token }`
5. **Obtener info del usuario actual** → `GET /api/v1/auth/me`

### Ejemplo en el frontend

```typescript
// Login
const loginRes = await fetch("http://127.0.0.1:8000/api/v1/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ username: "user@email.com", password: "mypassword" }),
});
const { access_token, refresh_token } = await loginRes.json();

// Guardar tokens (localStorage, sessionStorage, o estado global)
localStorage.setItem("access_token", access_token);
localStorage.setItem("refresh_token", refresh_token);

// Request autenticado
const res = await fetch("http://127.0.0.1:8000/api/v1/chats/", {
  headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
});

// Refresh cuando expire el access token
const refreshRes = await fetch("http://127.0.0.1:8000/api/v1/auth/refresh", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ refresh_token: localStorage.getItem("refresh_token") }),
});
const newTokens = await refreshRes.json();
localStorage.setItem("access_token", newTokens.access_token);
localStorage.setItem("refresh_token", newTokens.refresh_token);
```

### Roles

| Rol | Descripción |
|-----|-------------|
| `admin` | Se crea automáticamente al iniciar el servidor. Puede acceder a endpoints de administración (`/api/v1/users/`). |
| `user` | Rol por defecto al registrarse. Acceso a sus propios recursos. |

---

## Formato de errores

Todos los errores de la API siguen el mismo formato:

```json
{
  "error": {
    "code": "not_found",
    "detail": "Chat not found",
    "path": "/api/v1/chats/abc-123"
  }
}
```

### Códigos de error

| Código HTTP | `code` | Descripción |
|-------------|--------|-------------|
| 400 | `validation_error` | Datos inválidos en la request |
| 401 | `unauthorized` | Token ausente, inválido o expirado |
| 403 | `forbidden` | Permiso insuficiente (ej. no es admin) |
| 404 | `not_found` | Recurso no encontrado |
| 409 | `conflict` | Conflicto (ej. email ya registrado) |
| 422 | — | Error de validación de Pydantic (formato propio de FastAPI) |
| 500 | `internal_error` | Error inesperado del servidor |
| 502 | `external_service_error` | Error al comunicarse con Ollama |

---

## Endpoints

Todos los endpoints están bajo el prefijo `/api/v1/`.

---

### Auth

#### `POST /api/v1/auth/login`

Inicia sesión y obtiene tokens JWT. Usa **OAuth2 Password Flow** (form-urlencoded).

**Headers:** `Content-Type: application/x-www-form-urlencoded`

**Parámetros (form):**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `username` | `string` | Email del usuario |
| `password` | `string` | Contraseña |

**Respuesta `200 OK`:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Errores:**

| Status | `code` | Detalle |
|--------|--------|---------|
| 401 | `unauthorized` | Credenciales inválidas o usuario inactivo |

---

#### `POST /api/v1/auth/register`

Registra un nuevo usuario. No requiere autenticación.

**Headers:** `Content-Type: application/json`

**Body:**

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `email` | `string` (EmailStr) | Sí | Email único |
| `password` | `string` | Sí | Contraseña |
| `name` | `string \| null` | No | Nombre del usuario |

**Ejemplo:**

```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "Juan Pérez"
}
```

**Respuesta `201 Created`:**

```json
{
  "id": "a1b2c3d4e5f6...",
  "email": "user@example.com",
  "name": "Juan Pérez",
  "role": "user",
  "is_active": true
}
```

**Errores:**

| Status | `code` | Detalle |
|--------|--------|---------|
| 409 | `conflict` | Email ya registrado |

---

#### `POST /api/v1/auth/refresh`

Renueva los tokens usando un refresh token válido.

**Headers:** `Content-Type: application/json`

**Body:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `refresh_token` | `string` | Refresh token JWT |

**Respuesta `200 OK`:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

**Errores:**

| Status | `code` | Detalle |
|--------|--------|---------|
| 401 | `unauthorized` | Refresh token inválido o expirado |

---

#### `GET /api/v1/auth/me`

Obtiene la información del usuario autenticado actual.

**Headers:** `Authorization: Bearer <access_token>`

**Respuesta `200 OK`:**

```json
{
  "id": "a1b2c3d4e5f6...",
  "email": "user@example.com",
  "name": "Juan Pérez",
  "role": "user",
  "is_active": true
}
```

---

### Users (solo admin)

> **Requiere rol `admin`**. Un usuario con rol `user` recibe `403 Forbidden`.

#### `GET /api/v1/users/`

Lista todos los usuarios del sistema.

**Query params:**

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `skip` | `int` | `0` | Cantidad de registros a saltar |
| `limit` | `int` | `100` | Cantidad máxima de registros |

**Respuesta `200 OK`:**

```json
[
  {
    "id": "a1b2c3d4...",
    "email": "admin@llamabook.local",
    "name": "Admin",
    "role": "admin",
    "is_active": true
  },
  {
    "id": "e5f6a1b2...",
    "email": "user@example.com",
    "name": "Juan Pérez",
    "role": "user",
    "is_active": true
  }
]
```

---

#### `POST /api/v1/users/`

Crea un usuario (admin). Permite asignar cualquier rol.

**Headers:** `Content-Type: application/json` + `Authorization: Bearer <admin_token>`

**Body:**

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `email` | `string` (EmailStr) | Sí | Email único |
| `password` | `string` | Sí | Contraseña |
| `name` | `string \| null` | No | Nombre del usuario |

**Respuesta `201 Created`:** Igual que `auth/register`.

**Errores:**

| Status | `code` | Detalle |
|--------|--------|---------|
| 403 | — | No es admin (`Admin role required`, respuesta HTTP estándar) |
| 409 | `conflict` | Email ya registrado |

---

### Chats

#### `POST /api/v1/chats/`

Crea un nuevo chat. Opcionalmente envía un primer mensaje del usuario.

**Headers:** `Authorization: Bearer <access_token>` + `Content-Type: application/json`

**Body:**

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `title` | `string \| null` | No | Título del chat. Si no se envía y hay `message`, se usan los primeros 60 caracteres del mensaje. Default: "New chat" |
| `notebook_id` | `string \| null` | No | UUID del notebook asociado |
| `agent_id` | `string \| null` | No | UUID del agente asociado |
| `model` | `string \| null` | No | Modelo de Ollama a usar. Default: configuración `OLLAMA_DEFAULT_MODEL` |
| `message` | `string \| null` | No | Primer mensaje del usuario. Si se envía, se crea un mensaje con rol "user" |

**Ejemplo:**

```json
{
  "title": "Mi conversación",
  "model": "llama3.2",
  "message": "Hola, ¿puedes ayudarme con Python?"
}
```

**Respuesta `201 Created`:**

```json
{
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "title": "Mi conversación",
  "model": "llama3.2",
  "created_at": "2025-06-18T12:34:56.789000",
  "updated_at": "2025-06-18T12:34:56.789000"
}
```

---

#### `GET /api/v1/chats/`

Lista los chats del usuario autenticado, ordenados por `updated_at` descendente.

**Headers:** `Authorization: Bearer <access_token>`

**Query params:**

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `skip` | `int` | `0` | Cantidad de registros a saltar |
| `limit` | `int` | `100` | Cantidad máxima de registros |

**Respuesta `200 OK`:**

```json
[
  {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "title": "Mi conversación",
    "model": "llama3.2",
    "created_at": "2025-06-18T12:34:56.789000",
    "updated_at": "2025-06-18T12:34:56.789000"
  }
]
```

---

#### `GET /api/v1/chats/{chat_id}`

Obtiene un chat por su ID. Solo el dueño puede acceder.

**Headers:** `Authorization: Bearer <access_token>`

**Path params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `chat_id` | `string` (UUID) | ID del chat |

**Respuesta `200 OK`:** Igual que la creación de chat.

**Errores:**

| Status | `code` | Detalle |
|--------|--------|---------|
| 404 | `not_found` | Chat no encontrado o no pertenece al usuario |

---

#### `GET /api/v1/chats/{chat_id}/messages`

Lista todos los mensajes de un chat, ordenados cronológicamente.

**Headers:** `Authorization: Bearer <access_token>`

**Path params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `chat_id` | `string` (UUID) | ID del chat |

**Respuesta `200 OK`:**

```json
[
  {
    "id": "a1b2c3d4-...",
    "role": "user",
    "content": "Hola, ¿puedes ayudarme con Python?",
    "created_at": "2025-06-18T12:34:56.789000"
  },
  {
    "id": "e5f6a1b2-...",
    "role": "assistant",
    "content": "¡Claro! ¿En qué necesitas ayuda?",
    "created_at": "2025-06-18T12:34:57.123000"
  }
]
```

---

#### `POST /api/v1/chats/{chat_id}/messages`

Envía un mensaje al chat y recibe la respuesta del asistente como **Server-Sent Events (SSE)**.

**Headers:**  
`Authorization: Bearer <access_token>`  
`Content-Type: application/json`

**Path params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `chat_id` | `string` (UUID) | ID del chat |

**Body:**

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `content` | `string` | Sí | Mensaje del usuario (min 1 carácter) |

**Respuesta:** `200 OK` con `Content-Type: text/event-stream`

El streaming emite eventos SSE con el siguiente formato:

```
data: {"type":"delta","content":"¡Cl","message_id":null,"done":false}\n\n
data: {"type":"delta","content":"aro!","message_id":null,"done":false}\n\n
data: {"type":"done","content":null,"message_id":null,"done":true}\n\n
event: done\ndata: {}\n\n
```

Cada `data` es un JSON con la estructura `ChatStreamEvent`:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `type` | `string` | `"delta"` para fragmentos de texto, `"done"` cuando termina |
| `content` | `string \| null` | Fragmento de texto generado (solo en `type: "delta"`) |
| `message_id` | `string \| null` | Reservado para futuro uso |
| `done` | `boolean` | `true` cuando el streaming termina |

**Ejemplo de consumo en el frontend:**

```typescript
async function streamChat(chatId: string, message: string, accessToken: string) {
  const response = await fetch(`http://127.0.0.1:8000/api/v1/chats/${chatId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ content: message }),
  });

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n");

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const event = JSON.parse(line.slice(6));
          if (event.type === "delta" && event.content) {
            fullText += event.content;
            // Actualizar la UI con el texto acumulado
            updateAssistantMessage(fullText);
          }
          if (event.type === "done") {
            // Streaming completado
          }
        } catch {
          // Ignorar líneas que no sean JSON válido
        }
      }
    }
  }

  return fullText;
}
```

---

### Files

#### `POST /api/v1/files/`

Sube un archivo al servidor. El archivo se almacena en el filesystem local y se registra su metadata en la base de datos.

**Headers:**  
`Authorization: Bearer <access_token>`  
`Content-Type: multipart/form-data`

**Form data:**

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `upload` | `file` | Sí | Archivo a subir |

**Tipos MIME permitidos:**  
Prefijos: `text/`, `application/pdf`, `application/json`, `application/xml`, `application/markdown`, `application/x-yaml`, `application/vnd.openxmlformats`, `application/msword`, `application/vnd.ms-excel`, `application/vnd.ms-powerpoint`, `application/rtf`, `image/`, `audio/`, `video/`

**Extensiones bloqueadas:** `.exe`, `.dll`, `.bat`, `.cmd`, `.sh`, `.com`, `.app`, `.msi`, `.jar`, `.py`, `.pyc`, `.js`, `.vbs`, `.ps1`

**Tamaño máximo:** 50 MB por default (configurable con `LLAMABOOK_MAX_UPLOAD_SIZE`).

**Ejemplo (frontend):**

```typescript
const formData = new FormData();
formData.append("upload", fileInput.files[0]);

const res = await fetch("http://127.0.0.1:8000/api/v1/files/", {
  method: "POST",
  headers: { Authorization: `Bearer ${accessToken}` },
  body: formData,
  // NO establecer Content-Type, el navegador lo hace automáticamente con el boundary
});
```

**Respuesta `201 Created`:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "documento.pdf",
  "mime_type": "application/pdf",
  "size": 1048576,
  "created_at": "2025-06-18T12:34:56.789000"
}
```

---

#### `GET /api/v1/files/`

Lista los archivos del usuario autenticado.

**Headers:** `Authorization: Bearer <access_token>`

**Query params:**

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `skip` | `int` | `0` | Cantidad de registros a saltar |
| `limit` | `int` | `100` | Cantidad máxima de registros |

**Respuesta `200 OK`:** Array de `FileUploadResponse` (igual que la subida).

---

#### `GET /api/v1/files/{file_id}`

Obtiene la metadata de un archivo.

**Headers:** `Authorization: Bearer <access_token>`

**Path params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `file_id` | `string` (UUID) | ID del archivo |

**Respuesta `200 OK`:** `FileUploadResponse`

**Errores:**

| Status | `code` | Detalle |
|--------|--------|---------|
| 404 | `not_found` | Archivo no encontrado o no pertenece al usuario |

---

#### `GET /api/v1/files/{file_id}/content`

Obtiene el contenido textual de un archivo. Solo funciona para archivos con tipo MIME que empiece con `text/`.

**Headers:** `Authorization: Bearer <access_token>`

**Path params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `file_id` | `string` (UUID) | ID del archivo |

**Respuesta `200 OK`:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "content": "Contenido del archivo de texto..."
}
```

**Errores:**

| Status | `code` | Detalle |
|--------|--------|---------|
| 404 | `not_found` | Archivo no encontrado, no es de texto, o no pertenece al usuario |

---

#### `DELETE /api/v1/files/{file_id}`

Elimina un archivo (metadata + archivo físico del filesystem).

**Headers:** `Authorization: Bearer <access_token>`

**Path params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `file_id` | `string` (UUID) | ID del archivo |

**Respuesta `204 No Content`:** Sin body.

**Errores:**

| Status | `code` | Detalle |
|--------|--------|---------|
| 404 | `not_found` | Archivo no encontrado |

---

### Embeddings

#### `POST /api/v1/embeddings/index`

Indexa un archivo para búsqueda semántica. Divide el contenido textual del archivo en chunks, genera embeddings con Ollama, y los almacena en `sqlite-vec`.

**Headers:** `Authorization: Bearer <access_token>` + `Content-Type: application/json`

**Body:**

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `file_id` | `string` (UUID) | Sí | ID del archivo ya subido que se desea indexar |

**Ejemplo:**

```json
{
  "file_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Respuesta `200 OK`:**

```json
{
  "indexed_chunks": 12
}
```

> **Nota:** Solo se pueden indexar archivos con contenido de texto legible (`text/*`). Si se re-indexa un archivo, los embeddings anteriores se eliminan y se reemplazan.

**Errores:**

| Status | `code` | Detalle |
|--------|--------|---------|
| 404 | `not_found` | Archivo no encontrado |
| 422 | `validation_error` | Archivo sin contenido textual |

---

#### `POST /api/v1/embeddings/search`

Búsqueda semántica en los documentos indexados del usuario.

**Headers:** `Authorization: Bearer <access_token>` + `Content-Type: application/json`

**Body:**

| Campo | Tipo | Obligatorio | Default | Descripción |
|-------|------|-------------|---------|-------------|
| `query` | `string` | Sí | — | Texto de búsqueda |
| `top_k` | `int` | No | `5` | Cantidad de resultados (1-50) |

**Ejemplo:**

```json
{
  "query": "¿Cómo funciona la herencia en Python?",
  "top_k": 5
}
```

**Respuesta `200 OK`:**

```json
[
  {
    "chunk_text": "La herencia en Python permite crear una clase...",
    "distance": 0.234,
    "file_id": "550e8400-e29b-41d4-a716-446655440000",
    "chunk_index": 3
  }
]
```

> `distance` es la distancia coseno: menor valor = mayor similitud.

---

### Notebooks

#### `POST /api/v1/notebooks/`

Crea un nuevo notebook.

**Headers:** `Authorization: Bearer <access_token>` + `Content-Type: application/json`

**Body:**

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `name` | `string` | Sí | Nombre del notebook (1-255 caracteres) |
| `context` | `string \| null` | No | Contexto/descripción del notebook |
| `color` | `string \| null` | No | Color identificador (max 20 caracteres, ej. `"#FF5733"`) |

**Ejemplo:**

```json
{
  "name": "Proyecto de Investigación",
  "context": "Notas sobre machine learning aplicado",
  "color": "#3B82F6"
}
```

**Respuesta `201 Created`:**

```json
{
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "name": "Proyecto de Investigación",
  "context": "Notas sobre machine learning aplicado",
  "color": "#3B82F6",
  "created_at": "2025-06-18T12:34:56.789000",
  "updated_at": "2025-06-18T12:34:56.789000"
}
```

---

#### `GET /api/v1/notebooks/`

Lista los notebooks del usuario autenticado.

**Headers:** `Authorization: Bearer <access_token>`

**Query params:**

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `skip` | `int` | `0` | Cantidad de registros a saltar |
| `limit` | `int` | `100` | Cantidad máxima de registros |

**Respuesta `200 OK`:** Array de `NotebookResponse`.

---

#### `GET /api/v1/notebooks/{notebook_id}`

Obtiene un notebook por su ID.

**Headers:** `Authorization: Bearer <access_token>`

**Path params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `notebook_id` | `string` (UUID) | ID del notebook |

**Respuesta `200 OK`:** `NotebookResponse`

**Errores:**

| Status | `code` | Detalle |
|--------|--------|---------|
| 404 | `not_found` | Notebook no encontrado o no pertenece al usuario |

---

#### `PATCH /api/v1/notebooks/{notebook_id}`

Actualiza parcialmente un notebook. Solo se modifican los campos enviados.

**Headers:** `Authorization: Bearer <access_token>` + `Content-Type: application/json`

**Path params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `notebook_id` | `string` (UUID) | ID del notebook |

**Body:**

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `name` | `string \| null` | No | Nuevo nombre (1-255 caracteres) |
| `context` | `string \| null` | No | Nuevo contexto/descripción |
| `color` | `string \| null` | No | Nuevo color (max 20 caracteres) |

> Solo los campos enviados se actualizan. Enviar `null` en `context` o `color` los establece como `null`.

**Ejemplo:**

```json
{
  "name": "Proyecto Actualizado",
  "color": "#10B981"
}
```

**Respuesta `200 OK`:** `NotebookResponse`

---

#### `DELETE /api/v1/notebooks/{notebook_id}`

Elimina un notebook.

**Headers:** `Authorization: Bearer <access_token>`

**Path params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `notebook_id` | `string` (UUID) | ID del notebook |

**Respuesta `204 No Content`:** Sin body.

**Errores:**

| Status | `code` | Detalle |
|--------|--------|---------|
| 404 | `not_found` | Notebook no encontrado |

---

### Agents

#### `POST /api/v1/agents/`

Crea un nuevo agente con configuración personalizada.

**Headers:** `Authorization: Bearer <access_token>` + `Content-Type: application/json`

**Body:**

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `name` | `string` | Sí | Nombre del agente (1-255 caracteres) |
| `description` | `string \| null` | No | Descripción del agente |
| `system_prompt` | `string \| null` | No | Prompt del sistema que define el comportamiento |
| `avatar` | `string \| null` | No | URL o identificador del avatar (max 255) |
| `color` | `string \| null` | No | Color identificador (max 20 caracteres) |
| `model` | `string \| null` | No | Modelo de Ollama a usar. Default: configuración global |
| `is_public` | `boolean` | No | Si el agente es visible para otros usuarios. Default: `false` |

**Ejemplo:**

```json
{
  "name": "Tutor de Python",
  "description": "Agente especializado en enseñar Python",
  "system_prompt": "Eres un tutor de Python paciente y didáctico. Explicas con ejemplos claros.",
  "color": "#8B5CF6",
  "model": "llama3.2",
  "is_public": true
}
```

**Respuesta `201 Created`:**

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "Tutor de Python",
  "description": "Agente especializado en enseñar Python",
  "system_prompt": "Eres un tutor de Python paciente y didáctico...",
  "avatar": null,
  "color": "#8B5CF6",
  "model": "llama3.2",
  "is_public": true,
  "created_at": "2025-06-18T12:34:56.789000",
  "updated_at": "2025-06-18T12:34:56.789000"
}
```

---

#### `GET /api/v1/agents/`

Lista los agentes del usuario autenticado.

**Headers:** `Authorization: Bearer <access_token>`

**Query params:**

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `skip` | `int` | `0` | Cantidad de registros a saltar |
| `limit` | `int` | `100` | Cantidad máxima de registros |

**Respuesta `200 OK`:** Array de `AgentResponse`.

---

#### `GET /api/v1/agents/{agent_id}`

Obtiene un agente por su ID.

**Headers:** `Authorization: Bearer <access_token>`

**Path params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `agent_id` | `string` (UUID) | ID del agente |

**Respuesta `200 OK`:** `AgentResponse`

**Errores:**

| Status | `code` | Detalle |
|--------|--------|---------|
| 404 | `not_found` | Agente no encontrado o no pertenece al usuario |

---

#### `PATCH /api/v1/agents/{agent_id}`

Actualiza parcialmente un agente.

**Headers:** `Authorization: Bearer <access_token>` + `Content-Type: application/json`

**Path params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `agent_id` | `string` (UUID) | ID del agente |

**Body:**

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `name` | `string \| null` | No | Nuevo nombre |
| `description` | `string \| null` | No | Nueva descripción |
| `system_prompt` | `string \| null` | No | Nuevo prompt del sistema |
| `avatar` | `string \| null` | No | Nuevo avatar |
| `color` | `string \| null` | No | Nuevo color |
| `model` | `string \| null` | No | Nuevo modelo |
| `is_public` | `boolean \| null` | No | Nueva visibilidad |

**Respuesta `200 OK`:** `AgentResponse`

---

#### `DELETE /api/v1/agents/{agent_id}`

Elimina un agente.

**Headers:** `Authorization: Bearer <access_token>`

**Path params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `agent_id` | `string` (UUID) | ID del agente |

**Respuesta `204 No Content`:** Sin body.

**Errores:**

| Status | `code` | Detalle |
|--------|--------|---------|
| 404 | `not_found` | Agente no encontrado |

---

### Documents (Documentos Generados)

#### `POST /api/v1/documents/`

Crea un documento generado (salida estructurada de un chat, notas, resúmenes, etc.).

**Headers:** `Authorization: Bearer <access_token>` + `Content-Type: application/json`

**Body:**

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `title` | `string` | Sí | Título del documento (1-255 caracteres) |
| `content` | `string` | Sí | Contenido del documento (min 1 carácter) |
| `type` | `string` | No | Tipo de documento (max 20 caracteres). Default: `"draft"` |
| `chat_id` | `string \| null` | No | UUID del chat asociado (opcional) |

**Ejemplo:**

```json
{
  "title": "Resumen de la conversación",
  "content": "# Resumen\n\nLos puntos principales discutidos fueron...",
  "type": "summary",
  "chat_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
}
```

**Respuesta `201 Created`:**

```json
{
  "id": "c3d4e5f6-7890-abcd-ef12-345678901234",
  "title": "Resumen de la conversación",
  "content": "# Resumen\n\nLos puntos principales discutidos fueron...",
  "type": "summary",
  "chat_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "created_at": "2025-06-18T12:34:56.789000",
  "updated_at": "2025-06-18T12:34:56.789000"
}
```

---

#### `GET /api/v1/documents/`

Lista los documentos generados del usuario autenticado.

**Headers:** `Authorization: Bearer <access_token>`

**Query params:**

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `skip` | `int` | `0` | Cantidad de registros a saltar |
| `limit` | `int` | `100` | Cantidad máxima de registros |

**Respuesta `200 OK`:** Array de `GeneratedDocumentResponse`.

---

#### `GET /api/v1/documents/{document_id}`

Obtiene un documento por su ID.

**Headers:** `Authorization: Bearer <access_token>`

**Path params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `document_id` | `string` (UUID) | ID del documento |

**Respuesta `200 OK`:** `GeneratedDocumentResponse`

**Errores:**

| Status | `code` | Detalle |
|--------|--------|---------|
| 404 | `not_found` | Documento no encontrado o no pertenece al usuario |

---

#### `PATCH /api/v1/documents/{document_id}`

Actualiza parcialmente un documento.

**Headers:** `Authorization: Bearer <access_token>` + `Content-Type: application/json`

**Path params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `document_id` | `string` (UUID) | ID del documento |

**Body:**

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `title` | `string \| null` | No | Nuevo título |
| `content` | `string \| null` | No | Nuevo contenido |
| `type` | `string \| null` | No | Nuevo tipo (max 20 caracteres) |

**Respuesta `200 OK`:** `GeneratedDocumentResponse`

---

#### `DELETE /api/v1/documents/{document_id}`

Elimina un documento.

**Headers:** `Authorization: Bearer <access_token>`

**Path params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `document_id` | `string` (UUID) | ID del documento |

**Respuesta `204 No Content`:** Sin body.

**Errores:**

| Status | `code` | Detalle |
|--------|--------|---------|
| 404 | `not_found` | Documento no encontrado |

---

### Health

#### `GET /health`

Verifica que el servidor está funcionando. No requiere autenticación.

**Respuesta `200 OK`:**

```json
{
  "status": "ok"
}
```

---

## Modelos de datos

### User

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `string` (UUID) | ID único del usuario |
| `email` | `string` | Email (único) |
| `name` | `string \| null` | Nombre del usuario |
| `role` | `string` | Rol: `"admin"` o `"user"` |
| `is_active` | `boolean` | Si la cuenta está activa |

### Chat

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `string` (UUID) | ID único del chat |
| `title` | `string \| null` | Título del chat |
| `model` | `string` | Modelo de Ollama usado |
| `created_at` | `string` (ISO 8601) | Fecha de creación |
| `updated_at` | `string` (ISO 8601) | Fecha de última actualización |

### Message

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `string` (UUID) | ID único del mensaje |
| `role` | `string` | `"user"` o `"assistant"` |
| `content` | `string` | Contenido del mensaje |
| `created_at` | `string` (ISO 8601) | Fecha de creación |

### Notebook

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `string` (UUID) | ID único del notebook |
| `name` | `string` | Nombre del notebook |
| `context` | `string \| null` | Contexto/descripción |
| `color` | `string \| null` | Color identificador |
| `created_at` | `string` (ISO 8601) | Fecha de creación |
| `updated_at` | `string` (ISO 8601) | Fecha de actualización |

### Agent

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `string` (UUID) | ID único del agente |
| `name` | `string` | Nombre del agente |
| `description` | `string \| null` | Descripción |
| `system_prompt` | `string \| null` | Prompt del sistema |
| `avatar` | `string \| null` | Avatar del agente |
| `color` | `string \| null` | Color identificador |
| `model` | `string \| null` | Modelo de Ollama |
| `is_public` | `boolean` | Visibilidad pública |
| `created_at` | `string` (ISO 8601) | Fecha de creación |
| `updated_at` | `string` (ISO 8601) | Fecha de actualización |

### File

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `string` (UUID) | ID único del archivo |
| `name` | `string` | Nombre original del archivo |
| `mime_type` | `string` | Tipo MIME |
| `size` | `integer` | Tamaño en bytes |
| `created_at` | `string` (ISO 8601) | Fecha de subida |

### GeneratedDocument

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `string` (UUID) | ID único del documento |
| `title` | `string` | Título |
| `content` | `string` | Contenido del documento |
| `type` | `string` | Tipo (default: `"draft"`) |
| `chat_id` | `string \| null` | UUID del chat asociado |
| `created_at` | `string` (ISO 8601) | Fecha de creación |
| `updated_at` | `string` (ISO 8601) | Fecha de actualización |

---

## Resumen de endpoints

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| `POST` | `/api/v1/auth/login` | No | Iniciar sesión (OAuth2 form) |
| `POST` | `/api/v1/auth/register` | No | Registrar nuevo usuario |
| `POST` | `/api/v1/auth/refresh` | No | Renovar tokens |
| `GET` | `/api/v1/auth/me` | User | Info del usuario actual |
| `GET` | `/api/v1/users/` | Admin | Listar todos los usuarios |
| `POST` | `/api/v1/users/` | Admin | Crear usuario (admin) |
| `POST` | `/api/v1/chats/` | User | Crear chat |
| `GET` | `/api/v1/chats/` | User | Listar chats del usuario |
| `GET` | `/api/v1/chats/{id}` | User | Obtener un chat |
| `GET` | `/api/v1/chats/{id}/messages` | User | Listar mensajes de un chat |
| `POST` | `/api/v1/chats/{id}/messages` | User | Enviar mensaje (SSE streaming) |
| `POST` | `/api/v1/files/` | User | Subir archivo |
| `GET` | `/api/v1/files/` | User | Listar archivos |
| `GET` | `/api/v1/files/{id}` | User | Obtener metadata de archivo |
| `GET` | `/api/v1/files/{id}/content` | User | Obtener contenido textual |
| `DELETE` | `/api/v1/files/{id}` | User | Eliminar archivo |
| `POST` | `/api/v1/embeddings/index` | User | Indexar archivo para búsqueda |
| `POST` | `/api/v1/embeddings/search` | User | Búsqueda semántica |
| `POST` | `/api/v1/notebooks/` | User | Crear notebook |
| `GET` | `/api/v1/notebooks/` | User | Listar notebooks |
| `GET` | `/api/v1/notebooks/{id}` | User | Obtener notebook |
| `PATCH` | `/api/v1/notebooks/{id}` | User | Actualizar notebook |
| `DELETE` | `/api/v1/notebooks/{id}` | User | Eliminar notebook |
| `POST` | `/api/v1/agents/` | User | Crear agente |
| `GET` | `/api/v1/agents/` | User | Listar agentes |
| `GET` | `/api/v1/agents/{id}` | User | Obtener agente |
| `PATCH` | `/api/v1/agents/{id}` | User | Actualizar agente |
| `DELETE` | `/api/v1/agents/{id}` | User | Eliminar agente |
| `POST` | `/api/v1/documents/` | User | Crear documento generado |
| `GET` | `/api/v1/documents/` | User | Listar documentos |
| `GET` | `/api/v1/documents/{id}` | User | Obtener documento |
| `PATCH` | `/api/v1/documents/{id}` | User | Actualizar documento |
| `DELETE` | `/api/v1/documents/{id}` | User | Eliminar documento |
| `GET` | `/health` | No | Health check |

---

## Notas para la integración con el frontend

### CORS

El servidor ya incluye middleware CORS configurado con los orígenes permitidos. En desarrollo, los defaults son:
- `http://localhost:5173`
- `http://127.0.0.1:5173`

Configurar orígenes adicionales en `LLAMABOOK_CORS_ORIGINS` (formato JSON array o comma-separated).

### Manejo de tokens en el frontend

1. **Almacenar tokens:** Usar `localStorage` o `sessionStorage` para `access_token` y `refresh_token`.
2. **Interceptor:** Implementar un interceptor en tu cliente HTTP (axios, fetch wrapper) que:
   - Agregue `Authorization: Bearer <access_token>` a cada request.
   - Si recibe un `401`, intente renovar el token con `/api/v1/auth/refresh` y reintentar la request original.
   - Si el refresh también falla, redirigir al login.
3. **Login usa form-urlencoded:** Recordar que `POST /api/v1/auth/login` usa `application/x-www-form-urlencoded`, no JSON.

### Streaming SSE

El endpoint `POST /api/v1/chats/{id}/messages` devuelve `text/event-stream`. Es un streaming **unidireccional** (servidor → cliente). El flujo es:

1. El frontend envía un `POST` con el mensaje del usuario.
2. El backend guarda el mensaje del usuario y empieza a generar la respuesta con Ollama.
3. Se envían eventos `delta` con fragmentos de texto.
4. Al finalizar, se envía un evento `done`.
5. Se envía un `event: done` para señalizar el fin del stream.

**Headers importantes de la respuesta:**
- `Content-Type: text/event-stream`
- `Cache-Control: no-cache`
- `Connection: keep-alive`
- `X-Accel-Buffering: no`

### IDs

Todos los IDs son **UUID v4** representados como strings hexadecimales de 32 caracteres (sin guiones en la DB, con guiones en las respuestas JSON). Ejemplo: `"f47ac10b58cc4372a5670e02b2c3d479"` o `"f47ac10b-58cc-4372-a567-0e02b2c3d479"`.

### Fechas

Todas las fechas están en formato **ISO 8601** (UTC): `"2025-06-18T12:34:56.789000"`.

### Paginación

Todos los endpoints de listado soportan los parámetros `skip` y `limit`:
- `skip`: número de registros a omitir (default: `0`)
- `limit`: número máximo de registros a devolver (default: `100`)

### Ordenamiento

| Recurso | Orden |
|---------|-------|
| Chats | `updated_at` descendente (más recientes primero) |
| Files | `created_at` descendente |
| Notebooks | `updated_at` descendente |
| Agents | `updated_at` descendente |
| Documents | `updated_at` descendente |
| Messages | `created_at` ascendente (cronológico) |

### Propiedad de recursos

Todos los endpoints de recursos (chats, files, notebooks, agents, documents) están **scoping por usuario**. Un usuario solo puede acceder y modificar sus propios recursos. Intentar acceder al recurso de otro usuario devuelve `404 Not Found` (no `403`, para no revelar existencia).

### Modelo de Ollama

El campo `model` en chats y agentes acepta cualquier string que corresponda a un modelo disponible en la instancia de Ollama. Para listar los modelos disponibles, usar la API de Ollama directamente (`GET http://localhost:11434/api/tags`). Los defaults son:
- Chat: `llama3.2` (configurable con `OLLAMA_DEFAULT_MODEL`)
- Embeddings: `nomic-embed-text` (configurable con `OLLAMA_EMBED_MODEL`)