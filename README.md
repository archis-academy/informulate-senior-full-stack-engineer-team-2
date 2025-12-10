# Project Monorepo

A Node + React monorepo with a frontend and backend application and shared packages.

## Monorepo layout

- app/frontend — React single-page application (frontend).
- app/backend — Node/Express (or similar) API server (backend).
- packages/ — shared packages and utilities:
  - packages/types — shared TypeScript types (e.g. User) used by both frontend and backend.

## Requirements

- Node.js (LTS)
- Yarn (workspace)
- turbo (Turborepo) installed globally

## Quickstart

1. Install dependencies:

```bash
yarn install
```

2. Development — run both apps concurrently:

```bash
  yarn dev
```

This runs the dev pipelines so app/frontend and app/backend start together.

3. Build — run monorepo build:

```bash
yarn build
```

## Working with shared types

Shared TypeScript types live in packages/types. Import them from apps like:

```ts
import { User, Role } from "packages/types"; // or your package alias if configured
```

If you use TypeScript path mappings or a package alias, ensure tsconfig and package exports are configured.

## Running apps individually

- Run frontend only:

  ```bash
  cd app/frontend
  yarn dev
  ```

- Run backend only:

  ```bash
  cd app/backend
  yarn dev
  ```

- Or use turbo filtering from the repo root:

  ```bash
  yarn turbo dev --filter=frontend...
  yarn turbo dev --filter=backend...
  ```

## Notes

- This repo expects Yarn workspaces; commands use Yarn to run turbo.
- Ensure packages/types is exported/typed so both apps can import from it without additional path hacks.
