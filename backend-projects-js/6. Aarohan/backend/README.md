# Aarohan API 🚀

![Aarohan full-stack system design](system-design.svg)

A **production-ready RESTful Blog Platform API** built with **Node.js, Express.js, MongoDB, and JWT Authentication**.

**Aarohan API** powers a modern blogging platform with secure authentication, article publishing, comments, bookmarks, analytics, admin moderation, file uploads, and API documentation.

Designed with **scalability, clean architecture, security, and maintainability** in mind.

---

## ✨ Features

### 🔐 Authentication & Authorization

* JWT Authentication (**Access + Refresh Tokens**)
* Secure Login / Logout
* Role-Based Access Control (**User / Admin**)
* Protected Routes
* Forgot Password with OTP Verification
* Password Reset Flow
* Refresh Token Rotation
* Brute-force Protection & Account Locking

---

### 📝 Article Management

* Create, Update & Delete Articles
* Draft & Published Status
* Slug-Based URLs
* Search & Pagination
* Category & Tag Filtering
* Sorting & Visibility Controls
* Trending & Recommended Articles
* Article Analytics

---

### ❤️ User Engagement

#### Reactions

* Like / Dislike Articles
* Toggle Reactions
* Engagement Analytics

#### Bookmarks

* Save & Remove Bookmarks
* Fetch User Bookmarks
* Published-only Bookmark Support

#### Comments

* Add, Edit & Delete Comments
* Nested Replies
* Comment Threads

---

### 👨‍💼 Admin Dashboard

#### User Management

* View & Search Users
* Lock / Unlock Accounts
* Update User Roles
* Suspend / Ban Users
* Delete Users

#### Content Moderation

* Moderate Articles
* Hide / Block Content
* Update Article Status
* Remove Articles

#### Dashboard Analytics

* User Metrics
* Article Metrics
* Trending Articles
* Latest Activity
* Platform Insights

---

### 📤 File Uploads

* Cloudinary Image Uploads
* Multipart Form Data Support
* JWT-Protected Upload Routes

---

### 🛡️ Security Features

* JWT Authentication
* Password Hashing with `bcrypt`
* Rate Limiting
* Helmet Security Headers
* Secure Cookies
* Zod Validation
* Centralized Error Handling
* Request Compression
* Account Lock Protection

---

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### Authentication & Security

* JWT
* bcrypt
* Helmet
* Express Rate Limit
* Cookie Parser
* Compression

### Validation

* Zod

### File Uploads

* Multer
* Cloudinary
* Streamifier

### API Documentation

* Swagger UI
* Swagger JSDoc

---

## 📂 Project Structure

```txt
backend/
│── config/
│── controllers/
│── middleware/
│── models/
│── routes/
│── services/
│── utils/
│── validators/
│── server.js
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/your-username/aarohan-api.git
cd backend
```

### Install Dependencies

```bash
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/aarohan
ACCESS_TOKEN_SECRET=use-a-long-random-secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=use-a-different-long-random-secret
REFRESH_TOKEN_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://localhost:5173
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@example.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Use the checked-in `.env.example` as the full template. Copy it to `.env` before
starting the API. SMTP credentials are required for signup verification and
password recovery; Cloudinary credentials are optional until image uploads are
used.

---

## ▶️ Running the Project

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

Server runs at:

```bash
http://localhost:5000
```

### Frontend

In a second terminal, run:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The Vite app runs at `http://localhost:5173`. Set `CLIENT_URL` and
`ALLOWED_ORIGINS` in the backend environment to the frontend origin when using
a different host or port. See [the frontend README](../frontend/README.md) for
the main user flows.

---

## 📘 API Documentation

Swagger Docs:

```bash
http://localhost:5000/api-docs
```

---

## 🔑 Authentication

Protected routes require:

```http
Authorization: Bearer <access_token>
```

---

## 📌 Main API Routes

### Authentication

```http
POST   /api/v1/auth/signup
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh-token
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
GET    /api/v1/auth/profile
PATCH  /api/v1/auth/profile
```

### Articles

```http
POST   /api/v1/articles
GET    /api/v1/articles
GET    /api/v1/articles/:slug
PATCH  /api/v1/articles/:id
DELETE /api/v1/articles/:id
GET    /api/v1/articles/trending
GET    /api/v1/articles/bookmarks
POST   /api/v1/articles/:id/like
POST   /api/v1/articles/:id/bookmark
```

### Comments

```http
POST   /api/v1/articles/:id/comments
GET    /api/v1/articles/:id/comments
POST   /api/v1/comments/:id/reply
PATCH  /api/v1/comments/:id
DELETE /api/v1/comments/:id
```

### Uploads

```http
POST /api/v1/upload/image
```

### Admin

```http
GET    /api/v1/admin/dashboard
GET    /api/v1/admin/users
PATCH  /api/v1/admin/users/:id/role
DELETE /api/v1/admin/users/:id
```

---

## 🧪 Testing

You can test APIs using:

* **Swagger UI**
* **Postman**

---

## 🚀 Future Improvements

* Rich Text Editor
* User Avatars
* Notifications
* Reading History
* Redis Caching
* Docker Support
* CI/CD Pipeline

---

## 👨‍💻 Author

**Pankaj Yadav**
