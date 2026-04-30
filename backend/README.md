# Snippet Vault Backend

NestJS + MongoDB (Mongoose) + TypeScript backend for Mini Snippet Vault.

## Tech Stack

- NestJS
- MongoDB + Mongoose
- class-validator / class-transformer
- Swagger (OpenAPI)
- Logging: [`nestjs-pino`](https://www.npmjs.com/package/nestjs-pino) + [`pino-http`](https://github.com/pinojs/pino-http); `pino-pretty` in development for readable console output

## Setup

```bash
npm install
cp .env.example .env
```

Fill `.env` values:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/snippet-vault
CORS_ORIGIN=http://localhost:3000
```

## Run

```bash
# dev
npm run start:dev

# production build
npm run build
npm run start:prod
```

## Logging

- `npm run start:dev` sets `NODE_ENV=development`: HTTP and app logs are pretty-printed (`pino-pretty`).
- Production / `NODE_ENV=production`: structured JSON logs from Pino (ideal for log collectors).
- Exceptions are logged through the global HTTP exception filter (`warn` for 4xx responses, `error` for 5xx and unhandled errors). API error response shape does not change (`statusCode`, `message`, `path`, `timestamp`).

## Search semantics (`GET /snippets?q=...`)

The `q` parameter uses MongoDB full-text search (`$text`) across both `title` and `content`.
The schema defines a text index for this:

- `SnippetSchema.index({ title: 'text', content: 'text' })`

When `q` is provided, results are sorted by relevance (`textScore`) and then by `createdAt` (descending).
Tag filtering is applied independently via `tag` (`{ tags: tag }`) and is supported by:

- `SnippetSchema.index({ tags: 1 })`

## API

Base URL: `http://localhost:3001`

- `POST /snippets`
- `GET /snippets?page=1&limit=10&q=index&tag=mongodb`
- `GET /snippets/:id`
- `PATCH /snippets/:id`
- `DELETE /snippets/:id`

Swagger UI:

- `GET /api-docs`

Health check:

- `GET /`

## Example requests

Create:

```bash
curl -X POST http://localhost:3001/snippets \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Find process by port",
    "content": "lsof -i :3000",
    "tags": ["terminal", "debug"],
    "type": "command"
  }'
```

List with search/filter:

```bash
curl "http://localhost:3001/snippets?page=1&limit=10&q=port&tag=debug"
```
