# CampusConnect - Campus Lost & Found Platform

## Project Title

**CampusConnect** - A Campus Lost & Found Platform for Students

A full-stack web application built for **IT2234 — Web Services and Technology** (ICA-03 final project) that helps students post, search, and manage lost and found items with image uploads, real-time filtering, and role-based access control.

---

## Problem Description

Students frequently post lost and found items in scattered chat groups, Discord servers, and messaging apps where:
- Messages get buried and are hard to search
- Important posts are easily missed
- Duplicate postings create confusion
- No centralized system exists to track claimed items
- It's difficult to filter items by category or search by keywords

This fragmented approach leads to lost items remaining unclaimed and found items never reaching their owners.

---

## Proposed Solution

**CampusConnect** provides a centralized, user-friendly web application where:
- Students can post lost or found items with photos and descriptions
- Advanced search and filtering capabilities help users find items quickly
- JWT authentication ensures secure access with role-based permissions
- Administrators can manage users and moderate listings
- Claim tracking records who claimed items and when
- Image uploads are validated for security and file size
- Pagination ensures efficient browsing through large item lists

---

## Features

✅ **Authentication & Authorization**
- JWT-based authentication with secure login and registration
- Role-based access control (Student and Admin roles)
- Protected endpoints with middleware validation
- User profile endpoint (`/api/auth/me`)

✅ **User Management (Admin)**
- Create, read, update, and delete users
- Change user roles (Student ↔ Admin)
- Search and filter users by username/email
- Pagination support for user lists

✅ **Lost & Found Board**
- Post items marked as "Lost" or "Found"
- Assign categories to items for better organization
- Rich text descriptions and image uploads
- Image validation (file type and size limits via Multer)

✅ **Search & Filtering**
- Full-text search across item titles and descriptions
- Filter by item type (Lost/Found) and category
- Pagination for efficient data loading
- Sorting and ordering capabilities

✅ **Claim Tracking**
- Mark items as claimed
- Record which user claimed the item and when
- Update claim status for item owners and admins

✅ **Data Validation**
- Zod schema validation on all write operations
- Input sanitization for security
- File type and size restrictions for uploads

✅ **RESTful API**
- Clean, scalable Express MVC architecture
- Consistent error handling and response formats
- Health check endpoint for monitoring

---

## Technologies Used

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken), bcryptjs for password hashing
- **File Uploads:** Multer with validation middleware
- **Validation:** Zod for schema validation
- **Architecture:** MVC pattern (Routes → Controllers → Models)

### Frontend
- **Framework:** React 19
- **Routing:** TanStack Router / TanStack Start
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **HTTP Client:** Axios (via custom API layer)
- **UI Components:** Shadcn/ui component library

### Additional Tools
- **Development:** Bun (package manager for frontend)
- **API Testing:** Postman collection included
- **Environment Management:** dotenv for configuration

---

## API Endpoints (with Examples)

**Base URL:** `http://localhost:5000`

### Authentication Endpoints

#### 1. Register a New User
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}

Response (201):
{
  "id": "user_id_123",
  "username": "john_doe",
  "email": "john@example.com",
  "role": "student"
}
```

#### 2. Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}

Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id_123",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

#### 3. Get Current User Profile
```
GET /api/auth/me
Authorization: Bearer <token>

Response (200):
{
  "id": "user_id_123",
  "username": "john_doe",
  "email": "john@example.com",
  "role": "student",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### User Management Endpoints (Admin Only)

#### 1. Get All Users (with Pagination & Search)
```
GET /api/users?page=1&limit=10&q=john
Authorization: Bearer <admin_token>

Response (200):
{
  "users": [
    {
      "id": "user_id_123",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "student",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

#### 2. Change User Role
```
PATCH /api/users/:id/role
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "role": "admin"
}

Response (200):
{
  "id": "user_id_123",
  "username": "john_doe",
  "email": "john@example.com",
  "role": "admin"
}
```

#### 3. Delete User
```
DELETE /api/users/:id
Authorization: Bearer <admin_token>

Response (200):
{
  "message": "User deleted successfully"
}
```

### Lost & Found Items Endpoints

#### 1. Get All Items (with Filters & Pagination)
```
GET /api/items?type=lost&category=electronics&q=phone&page=1&limit=10

Response (200):
{
  "items": [
    {
      "id": "item_id_456",
      "title": "iPhone 15 Pro Max",
      "description": "Silver color, found near library entrance",
      "type": "found",
      "category": "electronics",
      "image": "uploads/item_456.jpg",
      "postedBy": {
        "id": "user_id_123",
        "username": "john_doe"
      },
      "claimed": false,
      "claimedBy": null,
      "createdAt": "2024-01-20T14:22:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

#### 2. Get Single Item
```
GET /api/items/:id

Response (200):
{
  "id": "item_id_456",
  "title": "iPhone 15 Pro Max",
  "description": "Silver color, found near library entrance",
  "type": "found",
  "category": "electronics",
  "image": "uploads/item_456.jpg",
  "postedBy": {
    "id": "user_id_123",
    "username": "john_doe"
  },
  "claimed": false,
  "claimedBy": null,
  "createdAt": "2024-01-20T14:22:00Z"
}
```

#### 3. Create New Item (with Image Upload)
```
POST /api/items
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- title: "Lost Blue Backpack"
- description: "Lost near campus main building, contains laptop"
- type: "lost"
- category: "bags"
- image: <file>

Response (201):
{
  "id": "item_id_789",
  "title": "Lost Blue Backpack",
  "description": "Lost near campus main building, contains laptop",
  "type": "lost",
  "category": "bags",
  "image": "uploads/item_789.jpg",
  "postedBy": {
    "id": "user_id_123",
    "username": "john_doe"
  },
  "claimed": false,
  "claimedBy": null,
  "createdAt": "2024-01-20T15:45:00Z"
}
```

#### 4. Update Item
```
PUT /api/items/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Lost Blue Backpack (Updated)",
  "description": "Still missing, last seen at library",
  "category": "bags"
}

Response (200):
{
  "id": "item_id_789",
  "title": "Lost Blue Backpack (Updated)",
  "description": "Still missing, last seen at library",
  "type": "lost",
  "category": "bags",
  "image": "uploads/item_789.jpg",
  "postedBy": {
    "id": "user_id_123",
    "username": "john_doe"
  },
  "claimed": false,
  "claimedBy": null
}
```

#### 5. Mark Item as Claimed
```
PATCH /api/items/:id/claim
Authorization: Bearer <token>
Content-Type: application/json

Response (200):
{
  "id": "item_id_456",
  "title": "iPhone 15 Pro Max",
  "type": "found",
  "claimed": true,
  "claimedBy": {
    "id": "user_id_999",
    "username": "jane_smith"
  },
  "claimedAt": "2024-01-20T16:30:00Z"
}
```

#### 6. Delete Item
```
DELETE /api/items/:id
Authorization: Bearer <token>

Response (200):
{
  "message": "Item deleted successfully"
}
```

### Health Check

#### 1. Health Status
```
GET /api/health

Response (200):
{
  "status": "OK",
  "timestamp": "2024-01-20T16:35:00Z"
}
```

---

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or Bun package manager
- Git

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file** in the backend directory:
   ```bash
   cp .env.example .env
   ```
   Or create manually with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/campusconnect
   JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
   JWT_EXPIRES_IN=7d
   CLIENT_ORIGIN=http://localhost:5173
   ```

4. **Environment Variable Descriptions:**
   - `PORT`: Server port (default: 5000)
   - `MONGODB_URI`: MongoDB connection string
   - `JWT_SECRET`: Secret key for signing JWT tokens (use a strong random string)
   - `JWT_EXPIRES_IN`: Token expiration time
   - `CLIENT_ORIGIN`: Frontend URL for CORS configuration

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Environment Configuration** (if needed):
   - The frontend connects to the backend at `http://localhost:5000`
   - Modify `src/lib/api.ts` if using a different backend URL

---

## How to Run the Project

### Run Backend

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```
   
   Expected output:
   ```
   Server running on http://localhost:5000
   Connected to MongoDB
   ```

2. **Verify the server is running:**
   ```bash
   curl http://localhost:5000/api/health
   ```

### Run Frontend

1. **In a new terminal, start the frontend development server:**
   ```bash
   cd frontend
   npm run dev
   # or
   bun dev
   ```

   Expected output:
   ```
   VITE v5.x.x  ready in xxx ms

   ➜  Local:   http://localhost:5173/
   ```

2. **Open your browser:**
   - Navigate to `http://localhost:5173`

### Full Project Startup

**Quick start (from root directory):**

Terminal 1 - Backend:
```bash
cd backend && npm install && npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend && npm install && npm run dev
```

### Testing with Postman

1. **Import the Postman collection:**
   - Open Postman
   - Click "Import" and select `postman/CampusConnect.postman_collection.json`

2. **Test API endpoints:**
   - Register a new user
   - Login and copy the JWT token
   - Add token to Authorization header: `Bearer <token>`
   - Test other endpoints

### Building for Production

**Backend:**
```bash
cd backend
npm run build  # if build script exists
npm start      # runs the production server
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

---
