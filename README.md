# Mini Snippet Vault (Monorepo)

Repository with two apps:

- `backend/` — NestJS + MongoDB (Mongoose) + TypeScript
- `frontend/` — Next.js (App Router) + TypeScript + Tailwind

## Project structure

```text
snippetVault/
  backend/
  frontend/
  README.md
```

## Git hooks (Husky)

From the repo root, run `npm install` once — the `prepare` script registers Husky. On `git commit`, the **`pre-commit`** hook runs **`cd backend && npm run lint`**. If the command exits with a non-zero status, Git does not record the commit.

## 1) Local run

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run start:dev
```

Backend runs on `http://localhost:3001`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Frontend runs on `http://localhost:3000`.

## 2) Environment variables

### Backend (`backend/.env.example`)

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/snippet-vault
CORS_ORIGIN=http://localhost:3000
```

### Frontend (`frontend/.env.example`)

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

## 3) How to verify API

Swagger UI:

- `http://localhost:3001/api-docs`

Quick cURL examples:

```bash
# Create snippet
curl -X POST http://localhost:3001/snippets \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Find process by port",
    "content": "lsof -i :3000",
    "tags": ["terminal","debug"],
    "type": "command"
  }'

# Get snippets list with pagination/search/filter
curl "http://localhost:3001/snippets?page=1&limit=10&q=port&tag=debug"

# Get by id
curl http://localhost:3001/snippets/<id>

# Update
curl -X PATCH http://localhost:3001/snippets/<id> \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated title"}'

# Delete
curl -X DELETE http://localhost:3001/snippets/<id>
```

## 4) Build and run in production

### Backend

```bash
cd backend
npm run build
npm run start:prod
```

### Frontend

```bash
cd frontend
npm run build
npm run start
```

## 5) Deployment links

- Frontend: [snippet-vault-eta.vercel.app](https://snippet-vault-eta.vercel.app)
- Backend API: [snippetvault-6dil.onrender.com](https://snippetvault-6dil.onrender.com/)
- Backend Swagger: [snippetvault-6dil.onrender.com/api-docs](https://snippetvault-6dil.onrender.com/api-docs)

## 6) Future Improvements (To-Do)

- Improve search relevance and accuracy
  for better user interaction.
- Add basic e2e tests.
- Refine and improve UI/UX.
