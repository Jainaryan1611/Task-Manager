# TaskFlow — Full-Stack Task Manager

A complete Task Management System built with **Node.js + TypeScript** (backend) and **Next.js 14 + TypeScript** (frontend).

---

## 📁 Project Structure

```
task-manager/
├── task-manager-backend/     ← Node.js + Express + Prisma API
└── task-manager-frontend/    ← Next.js 14 App Router UI
```

---

## 🚀 Backend Setup (Node.js API)

### 1. Install dependencies

```bash
cd task-manager-backend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env — the defaults work for local dev with SQLite
```

### 3. Set up database

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Start development server

```bash
npm run dev
# API running at http://localhost:4000
```

---

## 🎨 Frontend Setup (Next.js)

### 1. Install dependencies

```bash
cd task-manager-frontend
npm install
```

### 2. Configure environment

```bash
# .env.local is already created with:
# NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 3. Start development server

```bash
npm run dev
# App running at http://localhost:3000
```

---

## 🔐 API Reference

### Auth Endpoints

| Method | Endpoint         | Body                                  | Auth     | Description            |
|--------|------------------|---------------------------------------|----------|------------------------|
| POST   | /auth/register   | email, username, password             | No       | Register new user      |
| POST   | /auth/login      | email, password                       | No       | Login, get tokens      |
| POST   | /auth/refresh    | refreshToken                          | No       | Rotate tokens          |
| POST   | /auth/logout     | refreshToken                          | No       | Revoke refresh token   |
| GET    | /auth/me         | —                                     | Bearer   | Get current user       |

### Task Endpoints

| Method | Endpoint            | Description                                |
|--------|---------------------|--------------------------------------------|
| GET    | /tasks              | List tasks (paginated, filtered, searched) |
| POST   | /tasks              | Create a task                              |
| GET    | /tasks/:id          | Get single task                            |
| PATCH  | /tasks/:id          | Update task fields                         |
| DELETE | /tasks/:id          | Delete task                                |
| PATCH  | /tasks/:id/toggle   | Cycle status: PENDING→IN_PROGRESS→COMPLETED|

#### GET /tasks query parameters

| Param    | Type                          | Example              |
|----------|-------------------------------|----------------------|
| page     | number                        | ?page=2              |
| limit    | number (max 50)               | ?limit=10            |
| status   | PENDING/IN_PROGRESS/COMPLETED | ?status=PENDING      |
| priority | LOW/MEDIUM/HIGH               | ?priority=HIGH       |
| search   | string                        | ?search=fix+bug      |
| sortBy   | createdAt/title/dueDate       | ?sortBy=dueDate      |
| order    | asc/desc                      | ?order=asc           |

---

## 🏗 Architecture Decisions

### Backend

- **Express** — lightweight, flexible HTTP server
- **Prisma** — type-safe ORM with auto-generated client
- **SQLite** — zero-config for development (swap to PostgreSQL in prod by changing DATABASE_URL)
- **JWT dual-token strategy**:
  - Access token (15 min) — sent in Authorization header
  - Refresh token (7 days) — stored in DB, rotated on each use
- **bcrypt** (cost factor 12) — password hashing
- **express-validator** — input validation with clear error messages
- **Refresh token rotation** — old token is deleted and a new one issued on every refresh call, preventing replay attacks

### Frontend

- **Next.js 14 App Router** — file-based routing with layouts
- **AuthContext** — React context wrapping auth state, persisted via localStorage
- **Axios interceptors** — automatically attach access token to every request; silently refresh and retry on 401
- **Debounced search** — 400ms debounce prevents excessive API calls while typing
- **Optimistic toggle** — status updates immediately in UI without a full refetch
- **Catppuccin Mocha** design theme — dark, accessible, consistent

### Security Notes

- Passwords never returned in API responses (Prisma `select` excludes them)
- Tasks are always scoped to `userId` — users cannot access other users' tasks
- Refresh tokens stored in DB allow true revocation (logout invalidates the token)
- Input validation on both frontend (HTML5) and backend (express-validator)

---

## 📦 Production Checklist

- [ ] Change `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` to long random strings
- [ ] Switch SQLite to PostgreSQL: change `provider = "postgresql"` and update `DATABASE_URL`
- [ ] Set `NODE_ENV=production`
- [ ] Set `FRONTEND_URL` to your actual domain
- [ ] Run `npm run build` for both projects
- [ ] Add HTTPS (reverse proxy with nginx or use a PaaS like Railway/Render)

---

## 🧩 Tech Stack Summary

| Layer       | Technology                    |
|-------------|-------------------------------|
| Backend     | Node.js, Express, TypeScript  |
| ORM         | Prisma                        |
| Database    | SQLite (dev) / PostgreSQL     |
| Auth        | JWT (access + refresh tokens) |
| Frontend    | Next.js 14, React 18          |
| Styling     | Tailwind CSS                  |
| HTTP Client | Axios (with interceptors)     |
| Toast       | react-hot-toast               |
| Icons       | lucide-react                  |
