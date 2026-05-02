# CampusConnect

> Campus **lost & found**: post items with photos, search, and mark listings claimed.

Built for **IT2234 — Web Services and Technology** as the ICA-03 final project.

---

## Problem

Students often post lost and found items in scattered chat groups where messages are hard to search and easy to miss.

## Solution

**CampusConnect** is a small web app with JWT auth, admin user management, and a lost & found board with image uploads, filters, and pagination.

---

## Features

- JWT authentication (register / login / `/me`)
- Role-based access (student / admin)
- CRUD for **Users** and **Items** (lost & found)
- Image uploads for items (Multer, size/type limits)
- Text search, filters, and pagination on list endpoints
- Zod validation on writes
- Express MVC layout (routes → controllers → models)

---

## Tech

| Layer | Tech |
|---|---|
| API | Node.js, Express, MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Validation | Zod |
| Frontend | React, TanStack Router/Start, Vite, Tailwind |

---

## API (base: `http://localhost:5000`)

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/auth/me` | ✅ | Current user |

### Users (admin)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users?page=1&limit=10&q=` | List users |
| PATCH | `/api/users/:id/role` | Change role |
| DELETE | `/api/users/:id` | Delete user |

### Items (lost & found)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/items?type=&category=&q=&page=&limit=` | — | List |
| GET | `/api/items/:id` | — | Get one |
| POST | `/api/items` (multipart) | ✅ | Create |
| PUT | `/api/items/:id` | ✅ owner/admin | Update |
| PATCH | `/api/items/:id/claim` | ✅ | Mark claimed |
| DELETE | `/api/items/:id` | ✅ owner/admin | Delete |

### Health

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Simple OK payload |

---

## Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env   # if present; else create .env — see earlier notes
npm run dev
```

Example `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/campusconnect
JWT_SECRET=any_long_random_string_here
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Run API and web together (from `frontend`):

```bash
npm run dev:all
```

Import `postman/CampusConnect.postman_collection.json` for API tests.

---

## Repo layout

```
backend/          # Express API
frontend/         # Vite + TanStack Start app
postman/          # Postman collection
```

---

## First admin

After registering, in MongoDB:

```js
db.users.updateOne({ email: "you@uni.lk" }, { $set: { role: "admin" } })
```

Log in again for an admin JWT.

---

## License

MIT — educational use.
