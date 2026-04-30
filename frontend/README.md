# Snippet Vault Frontend

Next.js App Router frontend for Mini Snippet Vault.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- TanStack Query

## Setup

```bash
npm install
cp .env.example .env.local
```

`.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

## Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## Features

- List snippets with pagination
- Search by `title/content` (`q`)
- Filter by tag (`tag`)
- Create snippet
- View details
- Edit and delete snippet
- Loading / empty / error states

## API requirement

Backend should be running at `http://localhost:3001` with endpoints:

- `GET /snippets`
- `GET /snippets/:id`
- `POST /snippets`
- `PATCH /snippets/:id`
- `DELETE /snippets/:id`
