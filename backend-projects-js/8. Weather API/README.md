
# 🌤️ Weather API with Redis Caching

A high-performance **Weather API backend** built using **Node.js, Express, TypeScript, and Redis**. This application uses a smart **Cache-Aside caching strategy** to improve response speed, reduce unnecessary API calls, and protect third-party API rate limits.

---

## 🚀 Features

- ⚡ **High Performance Caching** using Redis
- 🧠 **Cache-Aside Architecture**
- ⏳ **12-Hour TTL Expiration** for fresh weather updates
- 🔐 **Secure Environment Variables** using `dotenv`
- ☁️ **Cloud Deployment Ready** (Render Compatible)
- 🟦 **Strict Type Safety** with TypeScript
- 🌍 **Live Weather Data** from Visual Crossing Weather API

---

## 🛠️ Tech Stack

| Technology | Usage |
|------------|-------|
| Node.js | Runtime Environment |
| TypeScript | Programming Language |
| Express.js | Backend Framework |
| Axios | HTTP Client |
| Redis | In-memory Cache |
| Dotenv | Environment Variables |
| Render | Cloud Deployment |

---

## 📋 Caching Architecture Flow

Whenever a weather request is made, the backend follows the **Cache-Aside Pattern**:

### 1️⃣ Check Cache
The server first checks Redis for weather data using a formatted cache key:

```txt
weather:cityname
````

Example:

```txt
weather:london
```

### 2️⃣ Cache Hit ⚡

If data exists in Redis:

* Data is returned instantly from memory (RAM)
* Average response time: **~5ms**
* No external API request is made

### 3️⃣ Cache Miss ⚠️

If data does not exist:

* Backend sends a request to the **Visual Crossing Weather API**
* Fresh weather data is fetched

### 4️⃣ Cache & Respond 🔄

The newly fetched response is:

* Stringified
* Stored in Redis
* Saved with a **12-hour expiration (`EX`)**
* Returned to the client

---


## ⚙️ Getting Started (Local Development)

### 1. Prerequisites

Make sure the following are installed:

* **Node.js v18+**
* **Redis Server**

You can install Redis locally or run it via Docker.

---

### 2. Clone Repository

```bash
git clone <your-repository-url>
cd weather-api
```

---

### 3. Install Dependencies

```bash
npm install
```

---

### 4. Environment Variables Setup

Create a `.env` file in the root directory:

```env
PORT=3000
API_KEY=your_visual_crossing_api_key
REDIS_URL=redis://localhost:6379
```

### Environment Variable Explanation

| Variable    | Description             |
| ----------- | ----------------------- |
| `PORT`      | Server Port             |
| `API_KEY`   | Visual Crossing API Key |
| `REDIS_URL` | Redis Connection URL    |

---

### 5. Build the Project

Compile TypeScript into JavaScript:

```bash
npm run build
```

---

### 6. Start the Application

```bash
npm start
```

Server will run at:

```txt
http://localhost:3000
```

---

## 🧪 API Endpoint & Testing

### Get Weather by City

Returns **live or cached weather data** for a given city.

### Endpoint

```http
GET /weather/:city
```

### Example Request

```txt
http://localhost:3000/weather/london
```

### Example Using Browser

```txt
http://localhost:3000/weather/delhi
```

### Success Response (200 OK)

Returns complete weather JSON data from **Visual Crossing Weather API**.

Example:

```json
{
  "resolvedAddress": "London, England",
  "days": [
    {
      "datetime": "2026-06-15",
      "temp": 21.4,
      "humidity": 58
    }
  ]
}
```

---

## 🖥️ Terminal Logs Preview

### First Request (Cache Miss)

```bash
⚠️ LOCAL CACHE MISS:
Fetching fresh data for [london]
from Weather API.
(Response time: ~600ms)
```

### Second Request (Cache Hit)

```bash
⚡ LOCAL CACHE HIT:
Pulling [london] data
from Redis memory.
(Response time: ~3ms)
```

---

## ☁️ Cloud Deployment (Render)

This project is fully configured for deployment on **Render** using a **two-service architecture**.

### 1. Create Redis Instance

* Create a **Render Redis Service**
* Copy the generated **Internal Redis URL**

---

### 2. Deploy Web Service

Connect your GitHub repository to Render.

Add these environment variables:

```env
REDIS_URL=<your_render_redis_url>
API_KEY=<your_visual_crossing_api_key>
PORT=3000
```

---

### Deployment Commands

#### Build Command

```bash
npm install && npm run build
```

#### Start Command

```bash
npm start
```

---

## 📌 API Performance Comparison

| Scenario   | Response Time |
| ---------- | ------------- |
| Cache Miss | ~600ms        |
| Cache Hit  | ~3–5ms        |

Redis caching dramatically improves API performance and reduces unnecessary third-party API requests.

---

## 🔒 Security

This project follows secure backend practices:

* Environment variables hidden using `.env`
* API keys are never hardcoded
* Redis URL stored securely
* Production-ready architecture

---

## 🧠 How Cache-Aside Helps

Without caching:

```txt
Client → Backend → Weather API
```

Every request hits the external API.

With Redis caching:

```txt
Client
   ↓
Backend
   ↓
Redis Cache
   ↓ (if miss)
Weather API
```

This results in:

✅ Faster Responses
✅ Reduced API Cost
✅ Better Scalability
✅ Lower Server Load

---

## 📈 Future Improvements

* Add weather forecasting filters
* Rate limiting with Redis
* Docker support
* API documentation using Swagger
* Request logging & monitoring
* Unit and integration testing

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Added new feature"
```

4. Push to branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Pankaj Yadav**
Full Stack Developer | MERN Stack | Backend Enthusiast

GitHub: https://github.com/Pankajkantghz

```

