# 💰 Expense Tracker API

A secure and scalable REST API for managing personal expenses with JWT authentication, expense categorization, filtering, sorting, and pagination.

Built using **Node.js**, **Express.js**, **PostgreSQL**, and **Docker**, following RESTful API design principles and production-ready backend practices.

---


## 🏗️ System Architecture

The following diagram illustrates the request flow through the application.

<p align="center">
  <img src="./assets/sytem-design-expense-tracker-api.png" alt="Expense Tracker System Design" width="1000"/>
</p>

---

## 🚀 Features

* User Authentication (JWT)
* Secure Password Validation
* Expense CRUD Operations
* Pagination Support
* Category-Based Filtering
* Date Range Filtering
* Weekly, Monthly & 3-Month Expense Filters
* Dynamic Sorting
* Protected Routes
* Centralized Error Handling
* PostgreSQL Relational Database
* Dockerized Database Environment

---

## 🛠 Tech Stack

| Technology | Purpose                   |
| ---------- | ------------------------- |
| Node.js    | Runtime Environment       |
| Express.js | Backend Framework         |
| PostgreSQL | Relational Database       |
| Docker     | Database Containerization |
| JWT        | Authentication            |
| bcrypt     | Password Hashing          |
| dotenv     | Environment Variables     |

---

## 📂 Project Structure

```text
src/
├── controllers/
├── services/
├── routes/
├── middlewares/
├── validators/
├── utils/
├── config/
└── app.js
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000

DATABASE_URL=postgresql://pankaj:yourpassword@localhost:5432/expense_tracker

JWT_SECRET=your_super_secure_jwt_secret
```

---

## 🐳 PostgreSQL Setup (Docker)

Run PostgreSQL using Docker:

```bash
docker run --name expense-postgres \
-e POSTGRES_USER=pankaj \
-e POSTGRES_PASSWORD=password \
-e POSTGRES_DB=expense_tracker \
-p 5432:5432 \
-d postgres
```

---

## 🗄 Database Schema

```sql
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    category VARCHAR(50) NOT NULL CHECK (
        category IN (
            'Groceries',
            'Leisure',
            'Electronics',
            'Utilities',
            'Clothing',
            'Health',
            'Others'
        )
    ),
    description TEXT,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## ▶️ Installation

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

---

## 🌐 API Base URL

```http
/api/v1
```

---

## 🔐 Authentication Endpoints

| Method | Endpoint       | Description   |
| ------ | -------------- | ------------- |
| POST   | `/auth/signup` | Register User |
| POST   | `/auth/login`  | Login User    |
| POST   | `/auth/logout` | Logout User   |

---

## 📊 Expense Endpoints

> All endpoints require:

```http
Authorization: Bearer <token>
```

| Method | Endpoint        | Description       |
| ------ | --------------- | ----------------- |
| POST   | `/expenses`     | Create Expense    |
| GET    | `/expenses`     | Get All Expenses  |
| GET    | `/expenses/:id` | Get Expense By ID |
| PUT    | `/expenses/:id` | Update Expense    |
| DELETE | `/expenses/:id` | Delete Expense    |

---

## 🔍 Filtering & Pagination

### Time Filters

```http
GET /expenses?filter=week
GET /expenses?filter=month
GET /expenses?filter=3months
```

### Category Filter

```http
GET /expenses?category=Groceries
```

### Date Range Filter

```http
GET /expenses?startDate=2026-01-01&endDate=2026-06-30
```

### Sorting

```http
GET /expenses?sortBy=amount&order=asc
GET /expenses?sortBy=expenseDate&order=desc
```

### Pagination

```http
GET /expenses?page=1&limit=10
```

---

## 📂 Allowed Categories

* Groceries
* Leisure
* Electronics
* Utilities
* Clothing
* Health
* Others

---

## ❌ Error Responses

### Validation Error

```json
{
  "success": false,
  "message": "Validation failed"
}
```

### Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### Expense Not Found

```json
{
  "success": false,
  "message": "Expense not found"
}
```

---

## 📌 API Highlights

* RESTful Architecture
* JWT Authentication
* Secure Password Hashing
* PostgreSQL Relationships
* Dynamic Query Filtering
* Server-Side Pagination
* Dockerized Development Environment
* Production-Ready Error Handling

---

## 👨‍💻 Author

**Pankaj Yadav**

Backend Developer | MERN Stack Developer | PostgreSQL

￼

￼
