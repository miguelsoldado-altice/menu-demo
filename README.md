# Header Footer Demo

Reference Next.js implementations for integrating `@ddg-frontend/header-footer`.

## Routes

- `/` explains the repo structure and links to the examples.
- `/examples/server` shows a server-first setup:
  header and footer are fetched in the layout on the server.
- `/examples/client` shows a client-first setup:
  header and footer are fetched with TanStack Query and render package skeletons while loading.

## Project Structure

```text
src/
  app/
    examples/
      client/
      server/
    globals.scss
    layout.tsx
    page.tsx
    providers.tsx
  features/
    menu/
      config/
      hooks/
      services/
      queryKeys.ts
      utils.ts
```

## Shared Integration Code

`src/features/menu` contains the reusable pieces:

- `config/` loads the environment-specific header/footer configuration JSON.
- `services/server.ts` contains server-side taxonomy requests.
- `services/client.ts` contains client-side requests for header, footer, campaigns, and identified user.
- `hooks/useIdentifiedUser.ts` wraps the identified-user query.
- `queryKeys.ts` centralizes TanStack Query keys.
- `utils.ts` contains config helpers and header transformation logic.

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000` and choose the example you want to inspect.

## Notes

- The client example uses the package-level `skeleton` prop while queries are pending.
- The server example still uses a small client header wrapper for user-specific enrichment after hydration.
- `src/app/providers.tsx` is intentionally minimal and only sets up TanStack Query.

