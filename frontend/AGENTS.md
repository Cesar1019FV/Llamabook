# Frontend — Llamabook

> Compact guidance for agents working on the React + Vite frontend.

## Quick start

**Use `yarn` only.** Do not run `npm install` or generate `package-lock.json` files.

```bash
yarn install
yarn build      # tsc + vite build → dist/
yarn preview    # preview the production build
```

**Do not run `yarn dev`**. The user is responsible for starting the development server.

## Stack

- **Vite 8** with React plugin (`@vitejs/plugin-react-swc`)
- **React 19** + **TypeScript 6** (`jsx: react-jsx`)
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- **react-i18next + i18next** for ES/EN translations
- **react-router-dom** for client-side routing
- ESM only (`"type": "module`)

## Things an agent is likely to miss

### 1. Tailwind v4 is CSS-first
No `tailwind.config.js`. Tokens and custom utilities live in `src/app/styles/index.css` using `@theme`.
Custom colors are defined as `--color-llama-*` and consumed as `bg-llama-canvas`, `text-llama-primary`, etc.

### 2. i18n is initialized synchronously in `app/index.tsx`
`@/shared/i18n/config.ts` is imported before the router. Do not wrap it in a provider or load it lazily.
Default language is Spanish (`es`), fallback is `es`.
New strings require updating `src/shared/i18n/locales/es.json` **and** `en.json`.

### 3. TypeScript is strict about unused code
`tsconfig.json` enables `noUnusedLocals` and `noUnusedParameters`. Builds fail on unused imports/variables/params.

### 4. Path aliases
`@/*` points to `src/*`. Use it for all cross-slice imports. Relative imports are allowed only inside the same slice/segment.

### 5. No linting or formatting tooling yet
There is no ESLint, Prettier, or similar configured. Do not assume defaults exist. Add new tooling only after confirming with the user.

### 6. Build artifact
`npm run build` outputs to `frontend/dist/`. The root `.gitignore` already ignores it.

### 7. No comments in code
Do not add comments to source code. Code should be self-explanatory through clear naming, small functions, and explicit types. The only exception is a `TODO` comment when something is temporarily broken or intentionally left for immediate follow-up — and only if it is truly required. Do not write explanatory, section, or inline comments.

## Architecture — Feature-Sliced Design (FSD)

This frontend follows [Feature-Sliced Design](https://feature-sliced.design/). Every directory inside `src/` belongs to one of these layers, ordered from most abstract to most specific:

```
app > pages > widgets > features > entities > shared
```

### Layer responsibilities

- `app/` — application initialization, root render, global styles, and providers.
- `pages/` — top-level routes/views.
- `widgets/` — composite UI blocks reused across pages (e.g. header, footer, feature list).
- `features/` — user scenarios with business value (e.g. language switcher).
- `entities/` — business entities (e.g. feature-card, message, chat).
- `shared/` — reusable primitives not tied to business logic (UI-kit, i18n, helpers, config, constants, global types).

### Dependency rule

A file may only import from layers **below** it:

```
shared ← entities ← features ← widgets ← pages ← app
```

Never import sideways or upwards. Example: a `widget` can import from `features`, `entities`, and `shared`, but never from `pages` or `app`.

### Public API via `index.ts`

Every slice and every segment exposes its public surface only through an `index.ts`. All external imports must go through that entry point.

```ts
// ✅ Good
import { Header } from '@/widgets/header'
import { LanguageSwitcher } from '@/features/language-switcher'

// ❌ Bad — bypasses Public API
import { Header } from '@/widgets/header/ui/Header'
```

Inside the same slice or segment, relative imports are allowed:

```ts
// ✅ Good inside widgets/header/ui/
import { HeaderNav } from './HeaderNav'
```

### Segment conventions

Use these standard segments inside a slice when needed:

- `ui/` — React components.
- `model/` — business logic, state, types, constants.
- `lib/` — pure helpers used inside the slice.
- `config/` — slice-specific configuration.
- `api/` — server requests and API clients.

Create only the segments you need. A slice may start with just `ui/` and `index.ts`.

### File separation

No file may mix unrelated responsibilities:

- UI components go in `ui/`.
- Types go in `model/types.ts`.
- Constants go in `model/consts.ts` (or `shared/consts/` if global).
- Helpers go in `lib/`.
- Hooks that belong to a slice go in `lib/hooks.ts` or `model/`.

### Naming conventions

- Folders: `kebab-case`.
- React components: `PascalCase`.
- Hooks: `camelCase` starting with `use`.
- Utilities/helpers: `camelCase`.

### Translations

All locale files live in `shared/i18n/locales/`. Add new keys to `es.json` first, then `en.json`.

### Routing

Routes are declared in `app/router/AppRouter.tsx` using `react-router-dom`. Pages live under `pages/` and are assembled from `widgets/` and `features/`.

## Component conventions

- Components are function components with named exports.
- Props use explicit TypeScript interfaces.
- Components live inside the appropriate FSD slice under a `ui/` segment.
- Shared types go in the `model/` segment of their owning slice or in `shared/types/` only if truly global.

## Gotchas

- `@vitejs/plugin-react-swc` currently emits a Vite 8 warning about switching to `@vitejs/plugin-react` for Rolldown. The project still builds and runs; only change this if asked.
- The dev server binds to `localhost:5173` by default. Use `vite --host` to expose to the network.
