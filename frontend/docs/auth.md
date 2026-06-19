# Autenticación en Llamabook Frontend

Documentación completa del sistema de autenticación: cómo funciona, cómo integrarlo, estructura de archivos y flujos.

---

## Visión general

El frontend usa autenticación JWT con dos tokens:

- **Access token** — corto plazo (15 min por defecto). Se envía en cada request como `Authorization: Bearer <token>`.
- **Refresh token** — largo plazo (7 días por defecto). Se usa para renovar el access token cuando expira.

Los tokens se almacenan en `localStorage` con versionado de claves:

- `llamabook:access_token:v1`
- `llamabook:refresh_token:v1`

El flujo completo:

1. Usuario se registra (`/signup`) o inicia sesión (`/login`)
2. El backend devuelve `{ access_token, refresh_token }`
3. El frontend guarda los tokens en localStorage
4. Cada request autenticado incluye `Authorization: Bearer <access_token>`
5. Si el access token expira (401), el cliente HTTP intenta renovarlo automáticamente con el refresh token
6. Si la renovación falla, se limpian los tokens y se redirige a `/login`
7. Al cerrar sesión, el backend revoca el access token (blacklist) y se limpian los tokens locales

---

## Roles de usuario

| Rol | Valor | Descripción |
|-----|-------|-------------|
| Admin | `admin` | Se crea automáticamente al iniciar el backend. Puede acceder a endpoints de administración (`/api/v1/users/`). |
| User | `user` | Rol por defecto al registrarse. Acceso solo a sus propios recursos. |

El rol se obtiene de `user.role` y se usa en los guards de rutas (`RequireAdmin`) y para condicionar elementos de UI.

---

## Estructura de archivos

```
src/
├── shared/
│   ├── config/
│   │   └── env.ts                          # VITE_API_URL
│   ├── api/
│   │   ├── httpClient.ts                   # fetch wrapper con auth + refresh
│   │   └── index.ts                        # public API
│   └── ...
├── entities/
│   └── user/
│       ├── model/types.ts                  # User, UserRole, AuthTokens, etc.
│       └── index.ts
├── features/
│   └── auth/
│       ├── api/
│       │   └── authApi.ts                  # loginApi, registerApi, meApi, logoutApi
│       ├── model/
│       │   ├── auth-context.ts             # AuthContext (React context)
│       │   ├── auth-provider.tsx           # AuthProvider (restaura sesión, maneja estado)
│       │   └── useAuth.ts                  # hook useAuth()
│       ├── ui/
│       │   ├── LoginForm.tsx               # formulario de login
│       │   └── SignupForm.tsx              # formulario de registro
│       ├── lib/
│       │   └── guards.tsx                  # RequireAuth, RequireGuest, RequireAdmin
│       └── index.ts                        # public API del feature
├── pages/
│   ├── login/
│   │   ├── ui/LoginPage.tsx
│   │   └── index.ts
│   └── signup/
│       ├── ui/SignupPage.tsx
│       └── index.ts
├── app/
│   ├── index.tsx                           # AuthProvider en el provider tree
│   └── router/AppRouter.tsx               # rutas con guards
└── ...
```

---

## Cliente HTTP (`shared/api/httpClient.ts`)

Wrapper de `fetch` que maneja automáticamente la autenticación.

### Funcionalidades

1. **Base URL**: Usa `VITE_API_URL` de las variables de entorno
2. **Token injection**: Agrega `Authorization: Bearer <access_token>` a cada request (excepto endpoints de auth)
3. **Refresh automático**: Si recibe `401`, intenta renovar el access token con el refresh token y reintentar la request original
4. **Limpieza en fallo**: Si el refresh también falla, limpia los tokens (forzando re-login)
5. **Parseo de errores**: Convierte respuestas de error al formato `{ code, detail, path }`
6. **Soporte multipart**: Acepta `FormData` para subida de archivos

### Métodos disponibles

```typescript
http.get<T>(path, options?)        // GET
http.post<T>(path, body?, options?) // POST con JSON
http.postForm<T>(path, formData)   // POST con multipart/form-data
http.patch<T>(path, body?, options?) // PATCH con JSON
http.del<T>(path, options?)         // DELETE
```

### Helpers de tokens exportados

```typescript
getAccessToken(): string | null
getRefreshToken(): string | null
setTokens(access: string, refresh: string): void
clearTokens(): void
```

---

## Contexto de Auth (`features/auth/model/`)

### `AuthProvider`

Componente que envuelve la app y provee el estado de autenticación.

**Estado:**

```typescript
interface AuthContextValue {
  user: User | null              // usuario actual o null si no autenticado
  isAuthenticated: boolean       // true si user !== null
  isLoading: boolean             // true mientras verifica sesión inicial
  login: (email, password) => Promise<void>
  register: (email, password, name?) => Promise<void>
  logout: () => Promise<void>
}
```

**Comportamiento al montar:**

1. Lee el access token de localStorage
2. Si existe, llama `GET /auth/me` para verificar si sigue válido
3. Si es válido, setea el usuario en el estado
4. Si falla, limpia los tokens (sesión expirada)
5. Marca `isLoading = false` al terminar

### `useAuth()`

Hook para consumir el contexto. Lanza error si se usa fuera de `AuthProvider`.

```typescript
const { user, isAuthenticated, login, logout } = useAuth()
```

---

## API de Auth (`features/auth/api/authApi.ts`)

Funciones que llaman al backend:

| Función | Endpoint | Descripción |
|---------|----------|-------------|
| `loginApi(email, password)` | `POST /auth/login` | OAuth2 form-urlencoded. Guarda tokens en localStorage. |
| `registerApi(data)` | `POST /auth/register` | Registra usuario. Retorna `User`. |
| `meApi()` | `GET /auth/me` | Obtiene usuario actual con el token almacenado. |
| `logoutApi()` | `POST /auth/logout` | Revoca el token en el backend (blacklist) + limpia localStorage. |

> **Nota:** `loginApi` usa `fetch` directamente (no `http`) porque el login usa `application/x-www-form-urlencoded`, no JSON.

---

## Guards de rutas (`features/auth/lib/guards.tsx`)

### `RequireAuth`

Envuelve rutas protegidas. Si no hay sesión, redirige a `/login`.

```tsx
<RequireAuth>
  <LlamabookDashboard />
</RequireAuth>
```

### `RequireGuest`

Envuelve rutas de auth (login/signup). Si ya hay sesión, redirige a `/`.

```tsx
<RequireGuest>
  <LoginPage />
</RequireGuest>
```

### `RequireAdmin`

Envuelve rutas de admin. Si no es admin, redirige a `/`.

```tsx
<RequireAdmin>
  <AdminPage />
</RequireAdmin>
```

Todos los guards muestran un estado de "Cargando..." mientras `isLoading` es true (verificando sesión inicial).

---

## Router (`app/router/AppRouter.tsx`)

```
/        → RequireAuth    → LlamabookDashboard
/login   → RequireGuest   → LoginPage
/signup  → RequireGuest   → SignupPage
*       → Navigate to "/"
```

---

## Provider tree (`app/index.tsx`)

```tsx
<StrictMode>
  <BrowserRouter>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </BrowserRouter>
</StrictMode>
```

`AuthProvider` debe estar **dentro** de `BrowserRouter` (los guards usan `useNavigate`) y **fuera** de `AppRouter` (para que todas las rutas tengan acceso al contexto).

---

## Formularios

### `LoginForm` (`features/auth/ui/LoginForm.tsx`)

- Campos: email, password
- Validación: `email.includes('@')` y `password.length >= 1` (derivado en render, no con useEffect)
- Submit: event handler `onSubmit`, no state+effect
- Errores: muestra mensaje si `login()` falla (mapea códigos de error a i18n)
- Loading: deshabilita inputs y botón mientras `isSubmitting`
- Link a `/signup` para usuarios sin cuenta

### `SignupForm` (`features/auth/ui/SignupForm.tsx`)

- Campos: name (opcional), email, password
- Validación: misma que login
- Submit: llama `register()` que registra + loguea automáticamente
- Errores: mapea `conflict` → "email ya registrado"
- Link a `/login` para usuarios con cuenta

### Decisiones de diseño (skill `frontend-design`)

- **Tema oscuro continuo**: mismo `bg-llama-bg` que el dashboard — no una página blanca aislada
- **Marca Llamabook**: logo con gradiente `llama-accent → llama-accent-light`, título en `font-serif`
- **Un solo acento**: terracota `#c96442` en el botón primario. Todo lo demás silencioso.
- **Card centrada**: `max-w-sm` con `border-llama-border` y fondo `llama-surface`
- **Foco visible**: heredado del `:focus-visible` global con outline del accent
- **Copy intencional**: botones que dicen qué pasa ("Iniciar sesión", "Crear cuenta")

---

## Flujos detallados

### Login

```
Usuario entra a /login
  → RequireGuest verifica: si ya hay sesión, redirect a /
  → Usuario completa email + password
  → Submit → loginApi(email, password)
    → POST /auth/login (form-urlencoded)
    → Respuesta: { access_token, refresh_token }
    → setTokens() guarda en localStorage
  → meApi() obtiene datos del usuario
    → GET /auth/me con Bearer token
    → setUser() actualiza el contexto
  → navigate('/') al dashboard
```

### Registro (Signup)

```
Usuario entra a /signup
  → RequireGuest verifica sesión
  → Usuario completa name? + email + password
  → Submit → register(email, password, name)
    → registerApi({ email, password, name })
      → POST /auth/register (JSON)
      → Respuesta: User (201)
    → loginApi(email, password) — login automático tras registro
    → meApi() obtiene datos del usuario
    → setUser() actualiza el contexto
  → navigate('/') al dashboard
```

### Logout

```
Usuario clickea "Cerrar sesión" en ProfileDropdown
  → handleLogout()
    → logoutApi()
      → POST /auth/logout con Bearer token
      → Backend agrega jti a la blacklist
      → clearTokens() limpia localStorage
    → setUser(null) limpia el contexto
  → navigate('/login')
  → RequireAuth detecta no autenticado → muestra /login
```

### Refresh automático (transparente para el usuario)

```
Cualquier request autenticado recibe 401
  → httpClient detecta 401
  → refreshTokens()
    → POST /auth/refresh con { refresh_token }
    → Si éxito: setTokens() con nuevos tokens + reintenta request original
    → Si fallo: clearTokens() + throw error → el guard redirige a /login
```

### Restauración de sesión (al recargar la página)

```
AuthProvider monta
  → isLoading = true
  → getAccessToken() lee localStorage
  → Si no hay token: isLoading = false, user = null
  → Si hay token: meApi()
    → GET /auth/me
    → Si éxito: setUser(u), isLoading = false
    → Si fallo: clearTokens(), isLoading = false
  → Mientras isLoading = true, guards muestran "Cargando..."
```

---

## Integración con el dashboard

### ProfileDropdown (`widgets/llamabook-sidebar/ui/ProfileDropdown.tsx`)

El botón "Cerrar sesión" ahora:

1. Llama `logout()` del contexto (revoca token en backend + limpia localStorage)
2. Redirige a `/login` con `useNavigate()`

### SidebarProfile (`widgets/llamabook-sidebar/ui/SidebarProfile.tsx`)

Muestra datos reales del usuario:

- **Avatar**: inicial del nombre o email del usuario autenticado
- **Nombre**: `user.name ?? user.email`
- **Subtítulo**: `user.email`

Si no hay usuario (no debería pasar por el guard), usa fallback de i18n.

---

## Variables de entorno

| Variable | Archivo | Descripción |
|----------|---------|-------------|
| `VITE_API_URL` | `frontend/.env` | URL base de la API. Default: `http://127.0.0.1:8000/api/v1` |

Declarada en `src/vite-env.d.ts` para tipado de TypeScript.

---

## i18n

Claves de traducción en `shared/i18n/locales/es.json` y `en.json`:

```
auth.login.title           — "Iniciar sesión" / "Sign in"
auth.login.subtitle        — subtítulo
auth.login.email           — "Email"
auth.login.password        — "Contraseña"
auth.login.submit          — "Iniciar sesión"
auth.login.loading         — "Iniciando..."
auth.login.noAccount       — "¿No tienes cuenta?"
auth.login.signupLink      — "Regístrate"
auth.signup.title          — "Crear cuenta"
auth.signup.subtitle       — subtítulo
auth.signup.name           — "Nombre"
auth.signup.namePlaceholder— placeholder
auth.signup.email          — "Email"
auth.signup.password       — "Contraseña"
auth.signup.submit        — "Crear cuenta"
auth.signup.loading       — "Creando..."
auth.signup.haveAccount   — "¿Ya tienes cuenta?"
auth.signup.loginLink     — "Inicia sesión"
auth.errors.invalidCredentials — "Email o contraseña incorrectos"
auth.errors.emailExists   — "Este email ya está registrado"
auth.errors.network       — "No se pudo conectar con el servidor"
auth.errors.unknown       — "Ocurrió un error inesperado"
```

---

## Backend — Endpoints de auth

| Método | Endpoint | Auth | Body | Respuesta |
|--------|----------|------|------|-----------|
| `POST` | `/api/v1/auth/login` | No | form: `username`, `password` | `{ access_token, refresh_token, token_type }` |
| `POST` | `/api/v1/auth/register` | No | JSON: `{ email, password, name? }` | `{ id, email, name, role, is_active }` (201) |
| `POST` | `/api/v1/auth/refresh` | No | JSON: `{ refresh_token }` | `{ access_token, refresh_token, token_type }` |
| `GET` | `/api/v1/auth/me` | Sí | — | `{ id, email, name, role, is_active }` |
| `POST` | `/api/v1/auth/logout` | Sí | — | 204 No Content |

### Blacklist de tokens (logout)

El backend revoca tokens agregando su `jti` (JWT ID único) a una tabla `revoked_token` en SQLite. En cada request autenticado, `get_current_user` verifica que el `jti` no esté en la blacklist. Al iniciar el servidor, los tokens expirados se purgan automáticamente.

---

## Mejores prácticas aplicadas

### React (skill `vercel-react-best-practices`)

| Práctica | Dónde se aplica |
|----------|-----------------|
| No definir componentes dentro de componentes | `LoginForm` y `SignupForm` son archivos separados, importados |
| Derivar estado en render, no en effects | `isFormValid = email.includes('@') && password.length >= 1` |
| Lógica de interacción en event handlers | Submit ocurre en `onSubmit`, no en state+effect |
| Rendering condicional explícito | `error ? <Error/> : null` (ternario, no `&&`) |
| Functional setState | `setErrors(prev => ...)` |
| Lazy state initialization | `useState(() => localStorage.getItem(...))` |
| Versionar localStorage | `llamabook:access_token:v1` con try-catch |

### Diseño (skill `frontend-design`)

| Práctica | Dónde se aplica |
|----------|-----------------|
| Tema oscuro continuo | Login usa `bg-llama-bg` igual que el dashboard |
| Un elemento signature | Logo con gradiente terracota + `font-serif` |
| Restraint | Una sola pantalla centrada, sin columnas ni ilustraciones |
| Copy intencional | Botones que describen la acción |
| Foco visible | `:focus-visible` global con outline del accent |

### Backend (skill `backend-development/backend-authentication`)

| Práctica | Dónde se aplica |
|----------|-----------------|
| JWT con `jti` (RFC 7519) | `create_token` incluye `jti` único |
| Blacklist en DB | Tabla `revoked_token` para logout |
| Short expiration | Access: 15 min, Refresh: 7 días |
| Refresh rotation | Cada refresh emite un nuevo refresh token |
| Argon2id | Passwords hasheadas con Argon2id |
| Purge periódico | Tokens expirados se limpian al iniciar el servidor |