# Todo API Engine (Backend)

A production-grade, secure, and fully containerized full-stack backend API built with Node.js, Express, TypeScript, and MongoDB. The system includes robust JWT authentication (with token rotation dynamics), paginated queries, secure regex-based search validation, and an automated integration test suite.

---

## 🚀 Features

- **TypeScript-First Architecture:** Strong typing across routers, middleware, and database models.
- **🔐 Secure Authentication Layer:**
  - Registration and Login endpoints with hashed password validation.
  - Dual-token system (Access + Refresh tokens) for secure session lifecycles.
- **📝 Todo Operational CRUD Engine:**
  - Secure endpoints protected by authentication middleware.
  - Multi-parameter processing supporting server-side **Pagination** (`page`, `limit`).
  - Optimized **Regex Keyword Search** filtering without performance overhead or engine crashes.
- **🧪 Automated Test Pipeline:** Integration testing using **Vitest** and **Supertest** executing inside an isolated sandbox database environment.
- **🐳 Dockerized Orchestration:** Multi-container configuration managing both the Express API and isolated MongoDB instances out-of-the-box.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js (v20+ Alpine Base)
- **Framework:** Express.js with TypeScript
- **Database Engine:** MongoDB via Mongoose ODM
- **Testing Suite:** Vitest, Supertest
- **Containerization:** Docker, Docker Compose

---

## ⚙️ Environment Variables

Create a `.env` file in the root of the server directory to configure your local runtime conditions:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/todo_prod_db
JWT_SECRET=your_super_secure_jwt_secret_key_here

```

_Note: When booting the ecosystem via Docker Compose, these configurations are managed natively by the container network layer variables defined within `docker-compose.yml`._

---

## 🏃 Getting Started (Local Development)

### Prerequisites

- Node.js (v20 or higher)
- MongoDB running locally on port `27017`

### Setup Instructions

1. Install development and core dependencies:

```bash
npm install

```

2. Run compilation and start the server in development watch mode:

```bash
npm run dev

```

The server will initialize on `http://localhost:3000`.

---

## 🐳 Running with Docker (Recommended)

To spin up the entire isolated cluster ecosystem (API App + Database Engine) with a single command without installing MongoDB on your host machine:

```bash
docker compose up --build

```

- To run the containers seamlessly in the background, append the detached flag:

```bash
docker compose up -d

```

- To shut down the container cluster and release allocated network resources:

```bash
docker compose down

```

---

## 🧪 Testing Pipeline

The backend utilizes **Vitest** for blistering fast execution speeds alongside **Supertest** to execute full E2E HTTP verification loops against a sandbox test environment database (`todo_ts_test_db`).

To execute the verification layer pipeline:

```bash
npm test

```

### Test Coverage Targets:

- **Authentication Layer:** Registration mechanics, duplicate validation checks, cryptographic password matching, token payloads.
- **Operational CRUD:** Route shielding guards, resource schema validation, server-side pagination boundaries, and regex string parameter queries.

---

## 📂 Project Architecture

```text
server/
├── src/
│   ├── app.ts            # Core Express app setup & database lifecycle hook
│   ├── models/           # Mongoose schemas (User, Todo, RefreshToken)
│   ├── controllers/      # Route orchestration and response execution handlers
│   ├── middleware/       # JWT extraction, rate limiting, error catch guards
│   └── routes/           # Decoupled API entry paths mapping
├── test/
│   ├── setup.ts          # Isolated database hook and sandbox collection wipers
│   └── api.test.ts       # Integration suite (7/7 Certified Blocks)
├── Dockerfile            # Container build blueprints
├── docker-compose.yml    # Multi-container multi-service microservice orchestration
└── vitest.config.ts      # Automated testing configurations

```


