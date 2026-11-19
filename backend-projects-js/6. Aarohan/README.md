# Aarohan — Personal Blog Platform

Aarohan is a full-stack publishing platform. Readers can discover and discuss articles, authors can write and manage posts, and administrators can moderate users and content.

![Aarohan system design](backend/system-design.svg)

## Features

- Account signup, sign-in, email verification, password recovery, and refreshable access tokens
- Public article feed with search, pagination, categories, tags, trending, and recommendations
- Article drafts, publishing, slugs, likes/dislikes, bookmarks, analytics, and comments with replies
- Author profile and article management
- Admin dashboards for platform metrics, user roles/status, and content moderation
- Optional Cloudinary image uploads
- Swagger API documentation

## Stack

- **Frontend:** React 19, React Router, Vite
- **API:** Node.js, Express 5, MongoDB, Mongoose
- **Authentication:** JWT access and refresh tokens, bcrypt, HTTP-only cookies
- **Validation and security:** Zod, Helmet, CORS, rate limiting
- **Integrations:** Nodemailer/SMTP, Cloudinary, Swagger UI

## Requirements

- Node.js 20 or newer
- MongoDB running locally or a MongoDB connection string
- npm

## Run locally

### 1. Start the API

```sh
cd backend
cp .env.example .env
npm install
npm run dev
```

The API listens on `http://localhost:5000` by default. Configure the database URI and independent JWT secrets in `backend/.env`. SMTP credentials are needed for email verification and password recovery. Cloudinary credentials are optional until image uploads are used.

Set `ADMIN_EMAIL` to the email address that should receive the admin role at registration. Do not commit `.env` or real credentials.

### 2. Start the frontend

In a second terminal:

```sh
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`. The frontend API URL is configured by `VITE_API_BASE_URL`. If you change the frontend host, update `CLIENT_URL` and `ALLOWED_ORIGINS` in the backend environment too.

## Build

```sh
# In backend/
npm start

# In frontend/
npm run build
npm run preview
```

## API documentation

Open Swagger UI at `http://localhost:5000/api-docs` after starting the API. The API base path is `/api/v1`.

| Area | Base path | Notes |
| --- | --- | --- |
| Authentication and profile | `/api/v1/auth` | Signup, login, verification, recovery, profile |
| Articles | `/api/v1/articles` | Feed, author posts, publishing, reactions, bookmarks |
| Comments | `/api/v1/articles/:id/comments` | Article discussion and replies |
| Uploads | `/api/v1/upload` | Cloudinary-backed image uploads |
| Administration | `/api/v1/admin` | Admin-only user and content moderation |

Protected endpoints use `Authorization: Bearer <access-token>`. Refresh tokens are stored in an HTTP-only cookie.

## Project structure

```text
Aarohan/
├── backend/   Express API, MongoDB models, routes, services, and validators
└── frontend/  React/Vite client
```

More API setup details are in [backend/README.md](backend/README.md); frontend flows are in [frontend/README.md](frontend/README.md).
