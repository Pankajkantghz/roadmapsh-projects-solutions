# Personal Blog API 🚀

A **production-ready RESTful Blog API** built with **Node.js, Express.js, MongoDB, and JWT Authentication**.

This project includes secure authentication, article management, comments, bookmarks, analytics, admin moderation tools, file uploads, and Swagger API documentation.

Designed with **clean architecture, scalability, security, and maintainability** in mind.

---

# ✨ Features

## 🔐 Authentication & Authorization

- JWT Authentication (Access + Refresh Tokens)
- Secure Login / Logout
- Protected Routes
- Role-Based Access Control (`user`, `admin`)
- Verified User Access
- Forgot Password with OTP
- Reset Password Flow
- Refresh Token System
- Account Lock Protection (Brute-force Prevention)

---

## 📝 Articles

- Create Article
- Update Article
- Delete Article
- Draft / Published Status
- Article Visibility Management
- Slug-Based URLs
- Search Articles
- Pagination
- Category Filtering
- Tag Filtering
- Sorting
- Trending Articles
- Recommended Articles
- Article Analytics

---

## ❤️ Engagement

### Likes & Dislikes

- Like Articles
- Dislike Articles
- Toggle Reactions
- Reaction Analytics

### Bookmarks

- Bookmark Articles
- Remove Bookmarks
- Get User Bookmarks
- Published-only Bookmark Filtering

### Comments

- Add Comment
- Reply to Comment
- Update Comment
- Delete Comment
- Nested Comments

---

## 👨‍💼 Admin Dashboard

### User Management

- Get All Users
- Search Users
- Filter Verified Users
- Filter Locked Users
- Lock / Unlock Users
- Update User Role
- Suspend / Ban Users
- Delete Users

### Article Moderation

- Get All Articles
- Update Article Status
- Hide Articles
- Block Articles
- Moderate Content
- Delete Articles

### Dashboard Metrics

- Total Users
- Total Articles
- New Users Today
- Articles Published Today
- Locked Accounts
- Total Views
- Trending Articles
- Latest Users
- Latest Articles

---

## 📤 File Uploads

- Cloudinary Image Upload
- Multipart Form Data Support
- JWT Protected Upload Route

---

## 🛡️ Security Features

- JWT Authentication
- Password Hashing (`bcrypt`)
- Rate Limiting
- Helmet Security Headers
- Request Compression
- Zod Validation
- Protected Routes
- Centralized Error Handling
- Secure Cookies
- Account Locking

---

# 🛠️ Tech Stack

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

## Authentication & Security

- JWT
- bcrypt
- Helmet
- Express Rate Limit
- Cookie Parser
- Compression

## Validation

- Zod

## File Upload

- Multer
- Cloudinary
- Streamifier

## API Documentation

- Swagger UI
- Swagger JSDoc

---

# 📂 Project Structure

```txt
backend/
│── config/
│   ├── db.js
│   ├── env.js
│   ├── swagger.js
│   └── cloudinary.js
│
│── controllers/
│
│── middleware/
│
│── models/
│
│── routes/
│
│── services/
│
│── utils/
│
│── validators/
│
│── server.js
```

---

# ⚙️ Installation

## 1. Clone Repository

```bash
git clone <your-repository-url>
```

```bash
cd backend
```

---

## 2. Install Dependencies

```bash
npm install
```

---

# 🔐 Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173

EMAIL_USER=your_email
EMAIL_PASS=your_email_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

# ▶️ Run Project

## Development Mode

```bash
npm run dev
```

## Production Mode

```bash
npm start
```

Server runs at:

```bash
http://localhost:5000
```

---

# 📘 API Documentation

Swagger Documentation available at:

```bash
http://localhost:5000/api-docs
```

---

# 🔑 Authentication

Protected routes require:

```http
Authorization: Bearer <access_token>
```

---

# 📌 Main API Routes

## Authentication

```http
POST   /api/v1/auth/signup
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh-token
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/verify-otp
POST   /api/v1/auth/reset-password
POST   /api/v1/auth/resend-unlock-otp
GET    /api/v1/auth/profile
PATCH  /api/v1/auth/profile
```

---

## Articles

```http
POST   /api/v1/articles
GET    /api/v1/articles
GET    /api/v1/articles/:slug
PATCH  /api/v1/articles/:id
DELETE /api/v1/articles/:id

GET    /api/v1/articles/me
GET    /api/v1/articles/trending
GET    /api/v1/articles/bookmarks
GET    /api/v1/articles/:slug/analytics
GET    /api/v1/articles/:id/recommended

POST   /api/v1/articles/:id/like
POST   /api/v1/articles/:id/dislike
POST   /api/v1/articles/:id/bookmark
PATCH  /api/v1/articles/:id/status
```

---

## Comments

```http
POST   /api/v1/articles/:id/comments
GET    /api/v1/articles/:id/comments
POST   /api/v1/comments/:id/reply
PATCH  /api/v1/comments/:id
DELETE /api/v1/comments/:id
```

---

## Upload

```http
POST   /api/v1/upload/image
```

---

## Admin

```http
GET    /api/v1/admin/dashboard

GET    /api/v1/admin/users
PATCH  /api/v1/admin/users/:id/lock
PATCH  /api/v1/admin/users/:id/role
PATCH  /api/v1/admin/users/:id/status
DELETE /api/v1/admin/users/:id

GET    /api/v1/admin/articles
PATCH  /api/v1/admin/articles/:id/status
DELETE /api/v1/admin/articles/:id
```

---

# 🧪 Testing

You can test APIs using:

- Swagger UI
- Postman

---

# 🚀 Future Improvements

- React Frontend
- Rich Text Editor
- User Avatars
- Notifications
- Reading History
- Redis Caching
- Docker Support
- CI/CD Pipeline

---

# 👨‍💻 Author

**Pankaj Yadav**

A portfolio-grade backend project built to showcase:

- REST API Design
- Backend Architecture
- Authentication & Authorization
- Security Best Practices
- MongoDB Database Design
- Scalable Folder Structure
- Production-Level Backend Development

