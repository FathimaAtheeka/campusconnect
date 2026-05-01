# CampusConnect 🎓

> A student life hub solving three real campus problems: **Lost & Found**, **Study Groups**, and **Peer Tutoring**.

Built for **IT2234 — Web Services and Technology** as the ICA-03 final project.

---

## 📌 Problem Description

University students rely on fragmented, unstructured WhatsApp groups to:
- Report lost items or post things they've found.
- Find peers to study with for specific modules.
- Connect with tutors (or offer tutoring) for modules they're weak/strong in.

This information gets buried in chat history, is never searchable, and excludes students who aren't in the right groups.

## 💡 Proposed Solution

**CampusConnect** is a centralised, searchable web platform where students log in once and can:
- Post and search **lost & found** items with photos and locations.
- Create or join **study groups** for any module with a capacity limit.
- Post **tutoring offers** or **tutoring requests** by module code.
- Admin users can moderate posts and manage user accounts.

---

## ✨ Features

- 🔐 **JWT authentication** (register / login / `/me`)
- 👥 **Role-based access control** (student / admin)
- 📦 **Full CRUD** on 4 collections: Users, Items, StudyGroups, TutorOffers
- 🖼️ **Image uploads** for lost & found items (Multer, 2MB limit, jpg/png/webp)
- 🔎 **Search, filter, and pagination** on every list endpoint
- ✅ **Zod validation** on all write operations
- 🛡️ **Centralised error handling** with proper HTTP status codes
- 🗂️ **Clean MVC structure** (routes → controllers → models)

---

## 🛠️ Technologies Used

| Layer | Tech |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JSON Web Tokens (jsonwebtoken) + bcryptjs |
| Validation | Zod |
| File Upload | Multer |
| Logging | Morgan |
| Testing | Postman |
| Version Control | Git + GitHub |
| **Optional Frontend** | React.js + Vite + Tailwind CSS |

---

## 📡 API Endpoints

Base URL: `http://localhost:5000`

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET  | `/api/auth/me` | ✅ | Current user info |

### Users (admin-only)
| Method | Endpoint | Description |
|---|---|---|
| GET    | `/api/users?page=1&limit=10&q=` | List users |
| PATCH  | `/api/users/:id/role` | Change role |
| DELETE | `/api/users/:id` | Delete user |

### Lost & Found Items
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET    | `/api/items?type=lost&category=&q=&page=1&limit=10` | — | List items |
| GET    | `/api/items/:id` | — | Get one item |
| POST   | `/api/items` (multipart) | ✅ | Create item with image |
| PUT    | `/api/items/:id` | ✅ owner/admin | Update item |
| PATCH  | `/api/items/:id/claim` | ✅ | Mark as claimed |
| DELETE | `/api/items/:id` | ✅ owner/admin | Delete item |

### Study Groups
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET    | `/api/groups?module=IT2234&q=&page=1` | — | List groups |
| GET    | `/api/groups/:id` | — | Get group |
| POST   | `/api/groups` | ✅ | Create group |
| PUT    | `/api/groups/:id` | ✅ owner/admin | Update |
| POST   | `/api/groups/:id/join` | ✅ | Join group |
| POST   | `/api/groups/:id/leave` | ✅ | Leave group |
| DELETE | `/api/groups/:id` | ✅ owner/admin | Delete |

### Tutoring
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET    | `/api/tutors?module=&type=offer&page=1` | — | List offers/requests |
| GET    | `/api/tutors/:id` | — | Get one |
| POST   | `/api/tutors` | ✅ | Create offer/request |
| PUT    | `/api/tutors/:id` | ✅ owner/admin | Update |
| DELETE | `/api/tutors/:id` | ✅ owner/admin | Delete |

### Example Requests

**Register**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Nimal","email":"nimal@uni.lk","password":"secret123"}'
```

**Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nimal@uni.lk","password":"secret123"}'
```

**Create lost item (with image)**
```bash
curl -X POST http://localhost:5000/api/items \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -F "title=Black backpack" \
  -F "description=Lost near the library on Monday" \
  -F "type=lost" \
  -F "category=bag" \
  -F "location=Main Library" \
  -F "image=@/path/to/photo.jpg"
```

**Create study group**
```bash
curl -X POST http://localhost:5000/api/groups \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"moduleCode":"IT2234","title":"Express.js exam prep","schedule":"Sat 4pm","capacity":8}'
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js **v18+**
- MongoDB running locally **or** a free MongoDB Atlas cluster
- (Optional) Postman for testing

### 1. Clone & install
```bash
git clone https://github.com/<your-username>/campusconnect.git
cd campusconnect/backend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/campusconnect
JWT_SECRET=any_long_random_string_here
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

### 3. Run the server
```bash
npm run dev    # development with auto-reload
# or
npm start      # production
```

Server starts at **http://localhost:5000**.

### 4. Test with Postman
Import `postman/CampusConnect.postman_collection.json` into Postman. The collection auto-saves your JWT token after login so all protected endpoints work immediately.

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/db.js              # MongoDB connection
│   ├── models/                   # Mongoose schemas
│   │   ├── User.js
│   │   ├── Item.js
│   │   ├── StudyGroup.js
│   │   └── TutorOffer.js
│   ├── routes/                   # Route definitions
│   ├── controllers/              # Request handlers
│   ├── middleware/               # auth, role, upload, error
│   ├── utils/                    # validators, pagination
│   └── app.js                    # Express app setup
├── uploads/                      # Uploaded images (gitignored)
├── .env.example
├── server.js                     # Entry point
└── package.json
```

---

## 🧑‍💻 How to Make the First Admin

After registering normally, open MongoDB shell or Compass and run:
```js
db.users.updateOne({ email: "you@uni.lk" }, { $set: { role: "admin" } })
```
Now login again to get a token with admin privileges.

---

## 📝 License

MIT — Built for educational purposes.
