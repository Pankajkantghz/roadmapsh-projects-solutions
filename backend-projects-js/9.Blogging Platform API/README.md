# Blogging Platform API

A simple and scalable RESTful API for managing blog posts, built with **Node.js**, **Express**, **TypeScript**, **Zod**, and **MySQL** using **Docker**.

This project follows a clean layered architecture to keep the codebase organized, maintainable, and easy to scale.

---

## 🏗️ Architecture

The API follows a structured request flow:

```text
Client / Postman
        │
        ▼
     app.ts
 (Application Entry)
        │
        ▼
      Routes
 (API Endpoints)
        │
        ▼
    Middleware
 (Request Validation)
        │
        ▼
   Controllers
 (Request Handling)
        │
        ▼
     Services
 (Business Logic)
        │
        ▼
   Repositories
 (Database Queries)
        │
        ▼
       MySQL
```

---

## 📁 Project Structure

```text
blogging-platform-api/
│── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── repositories/
│   ├── routes/
│   ├── schemas/
│   ├── services/
│   ├── types/
│   ├── validators/
│   └── app.ts
│
│── .env
│── .gitignore
│── docker-compose.yml
│── package.json
│── tsconfig.json
│── README.md
```

---

## ✨ Features

* Full **CRUD operations** for blog posts
* **Search functionality** using query parameters
* **Zod validation** for request payloads
* **Type-safe development** with TypeScript
* **Dockerized MySQL database**
* Clean and maintainable **layered architecture**

---

## ⚙️ Installation

Make sure you have the following installed:

* **Node.js (v18+)**
* **Docker**

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=blogging_platform
```

### 3. Start the Database

Run the MySQL container:

```bash
docker compose up -d
```

### 4. Create Database Table

Access the MySQL container:

```bash
docker exec -it blogging_db mysql -u root -p
```

Run:

```sql
USE blogging_platform;

CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(255) NOT NULL,
    tags JSON NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 🚀 Running the Project

Start the development server:

```bash
npm run dev
```

Server runs on:

```text
http://localhost:3000
```

---

## 📌 API Endpoints

### Create Post

**POST** `/posts`

Request Body:

```json
{
  "title": "Mastering TypeScript",
  "content": "Deep dive into layered software systems design.",
  "category": "Technology",
  "tags": ["ts", "backend"]
}
```

Response: `201 Created`

---

### Get All Posts

**GET** `/posts`

Search posts:

```http
GET /posts?term=backend
```

Response: `200 OK`

---

### Get Single Post

**GET** `/posts/:id`

Response:

* `200 OK`
* `404 Not Found`

---

### Update Post

**PUT** `/posts/:id`

Request Body:

```json
{
  "title": "Updated Title",
  "content": "Updated content",
  "category": "Technology",
  "tags": ["typescript", "nodejs"]
}
```

Response:

* `200 OK`
* `404 Not Found`

---

### Delete Post

**DELETE** `/posts/:id`

Response:

* `204 No Content`
* `404 Not Found`

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* TypeScript
* Zod
* MySQL
* Docker

---

## 📄 License

This project is licensed under the **MIT License**.
