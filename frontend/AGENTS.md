# Frontend — Llamabook

> Compact guidance for agents working on the React + Vite frontend.

## Quick start

All commands run from `frontend/`:

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # tsc + vite build → dist/
npm run preview   # preview the production build
```

## Stack

- **Vite 8** with React plugin (`@vitejs/plugin-react-swc`)
- **React 19** + **TypeScript 6** (`jsx: react-jsx`)
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- **react-i18next + i18next** for ES/EN translations
- ESM only (`"type": "module`)

## Things an agent is likely to miss

### 1. Tailwind v4 is CSS-first
No `tailwind.config.js`. Tokens and custom utilities live in `src/index.css` using `@theme`.
Custom colors are defined as `--color-llama-*` and consumed as `bg-llama-canvas`, `text-llama-primary`, etc.

### 2. i18n is initialized synchronously in `main.tsx`
`src/i18n/config.ts` is imported before `App.tsx`. Do not wrap it in a provider or load it lazily.
Default language is Spanish (`es`), fallback is `es`.
New strings require updating `src/i18n/locales/es.json` **and** `en.json`.

### 3. TypeScript is strict about unused code
`tsconfig.json` enables `noUnusedLocals` and `noUnusedParameters`. Builds fail on unused imports/variables/params.

### 4. Path aliases
There is no `@/` alias configured. Use relative imports (e.g. `../components/Header`).

### 5. No linting or formatting tooling yet
There is no ESLint, Prettier, or similar configured. Do not assume defaults exist. Add new tooling only after confirming with the user.

### 6. Build artifact
`npm run build` outputs to `frontend/dist/`. The root `.gitignore` already ignores it.

## Component conventions

- Components are function components with named exports.
- Props use explicit TypeScript interfaces.
- Keep UI components in `src/components/`.
- Shared types go in `src/types/`.
- Translations live in `src/i18n/locales/`.

## Gotchas

- `@vitejs/plugin-react-swc` currently emits a Vite 8 warning about switching to `@vitejs/plugin-react` for Rolldown. The project still builds and runs; only change this if asked.
- The dev server binds to `localhost:5173` by default. Use `vite --host` to expose to the network.
