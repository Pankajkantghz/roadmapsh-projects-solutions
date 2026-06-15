# 🌤️ Weather API with Redis Caching

A high-performance Weather API backend built with Node.js, Express, and TypeScript. This application features smart in-memory caching utilizing native Redis to maximize speed, minimize network overhead, and protect third-party API rate limits using the **Cache-Aside pattern**.

## 🚀 Features

- **TypeScript Stack**: Modern, strictly typed environment utilizing `nodenext` module resolution.
- **Cache-Aside Architecture**: Automatically checks local or cloud Redis cache before hitting external APIs.
- **TTL (Time-To-Live) Expiration**: Cache keys automatically self-destruct after 12 hours to guarantee fresh weather updates.
- **Secure Configuration**: Complete environment isolation using `dotenv` to protect sensitive developer credentials.
- **Cloud Ready**: Configured for seamless deployment on platforms like Render.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (v18+)
- **Language**: TypeScript
- **Framework**: Express.js
- **HTTP Client**: Axios
- **Database/Cache**: Redis (Native/Cloud)
- **Environment Management**: Dotenv

---

## 📋 Caching Architecture Flow

Whenever an API request is initiated by a client, the backend operates as follows:

1. **Check Cache**: The app looks for the data in the local or cloud Redis instance using a formatted key (`weather:cityname`).
2. **Cache Hit**: If found, data is pulled instantly from memory (RAM) and returned under **5ms**.
3. **Cache Miss**: If not found, a secure HTTP request is fired to the **Visual Crossing Weather API**.
4. **Cache & Respond**: The fresh payload is stringified, saved to Redis with a **12-hour expiration flag (`EX`)**, and returned to the client.

---

## ⚙️ Getting Started (Local Development)

### 1. Prerequisites
Ensure you have the following installed on your local machine:
- Node.js (v18 or higher)
- Redis Server (Installed natively or running via Docker)

### 2. Installation
Clone this repository and install the project dependencies:

git clone <your-repository-url>
cd weather-api
npm install
3. Environment Variables Setup
Create a .env file in the root directory of your project:

Code snippet
PORT=3000
API_KEY=your_visual_crossing_api_key
REDIS_URL=redis://localhost:6379
4. Build and Run
Compile the TypeScript code into production JavaScript and launch the local server:

Bash
# Compile TypeScript to the /dist folder
npm run build

# Start the application
npm start
The application will boot up at http://localhost:3000.

🧪 API Endpoint & Testing
Get Weather by City
Returns the live or cached weather timeline details for a specified geographic location.

URL: /weather/:city

Method: GET

Success Response (200 OK): Returns the complete JSON weather payload from Visual Crossing.

Example Request (Postman or Browser):
Plaintext
http://localhost:3000/weather/london
Terminal Logs Preview:
Plaintext
// First Request
⚠️ LOCAL CACHE MISS: Fetching fresh data for [london] from Weather API. (Response time: ~600ms)

// Second Request (Refresh)
⚡ LOCAL CACHE HIT: Pulling [london] data from system RAM. (Response time: ~3ms)
