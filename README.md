# TaskFlow — Task Management System

A full-stack Task Management System built as a software engineering assessment.

## Tech Stack

| Layer     | Technology                           |
|-----------|--------------------------------------|
| Backend   | Node.js, Express, TypeScript         |
| ORM       | Prisma + SQLite                      |
| Auth      | JWT (Access + Refresh token rotation)|
| Frontend  | Next.js 14 (App Router), TypeScript  |
| Styling   | Tailwind CSS                         |

## Features

- JWT authentication with access + refresh token rotation
- Password hashing with bcrypt (cost factor 12)
- Full task CRUD — create, read, update, delete
- Status toggle cycle: Pending → In Progress → Completed
- Pagination, filtering by status/priority, search by title
- Responsive UI — works on desktop and mobile
- Auth-guarded routes with automatic silent token refresh

## Running Locally

### Backend
\`\`\`bash
cd task-manager-backend
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run dev        # http://localhost:4000
\`\`\`

### Frontend
\`\`\`bash
cd task-manager-frontend
npm install
npm run dev        # http://localhost:3000
\`\`\`

## API Endpoints

| Method | Endpoint          | Auth   | Description                   |
|--------|-------------------|--------|-------------------------------|
| POST   | /auth/register    | No     | Register new user             |
| POST   | /auth/login       | No     | Login, receive tokens         |
| POST   | /auth/refresh     | No     | Rotate access/refresh tokens  |
| POST   | /auth/logout      | No     | Revoke refresh token          |
| GET    | /tasks            | Bearer | List tasks (paginated)        |
| POST   | /tasks            | Bearer | Create task                   |
| GET    | /tasks/:id        | Bearer | Get single task               |
| PATCH  | /tasks/:id        | Bearer | Update task                   |
| DELETE | /tasks/:id        | Bearer | Delete task                   |
| PATCH  | /tasks/:id/toggle | Bearer | Cycle task status             |
