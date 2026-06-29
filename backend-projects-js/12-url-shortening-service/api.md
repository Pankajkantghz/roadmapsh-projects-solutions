
---

## 🌐 URL Shortener: RESTful API Design Specification

Our service needs to handle two primary responsibilities: **Resource Management** (creating, listing, deleting short links) and **Core Redirection** (the high-performance path that forwards users to their destination).

### 1. Create a Shortened URL

* **Endpoint:** `POST /api/v1/urls`
* **Description:** Accepts a long URL, runs it through business logic, generates a unique token, and stores the mapping.
* **Request Body (`application/json`):**
```json
{
  "originalUrl": "https://roadmap.sh/backend/projects/url-shortening-service"
}

```


* **Success Response (`201 Created`):**
```json
{
  "status": "success",
  "data": {
    "id": "url_8f9a2b1c",
    "originalUrl": "https://roadmap.sh/backend/projects/url-shortening-service",
    "shortCode": "bX7w2k",
    "shortUrl": "http://localhost:5000/bX7w2k",
    "clicks": 0,
    "createdAt": "2026-06-25T10:15:30.000Z"
  }
}

```



### 2. The Core Redirect (The High-Speed Route)

* **Endpoint:** `GET /:shortCode`
* **Description:** The public-facing link. It looks up the code, increments the analytic counter, and issues a hard browser redirect.
* **Success Response (`302 Found`):**
* *Headers:* `Location: https://roadmap.sh/backend/projects/url-shortening-service`
* *Note:* We use HTTP `302 Found` (Temporary Redirect) rather than `301 Moved Permanently` because we want every single click to hit our server so we can accurately track metrics and analytics.



### 3. Fetch URL Analytics

* **Endpoint:** `GET /api/v1/urls/:shortCode/analytics`
* **Description:** Retrieves performance data for a specific link.
* **Success Response (`200 OK`):**
```json
{
  "status": "success",
  "data": {
    "shortCode": "bX7w2k",
    "clicks": 142,
    "lastAccessed": "2026-06-25T15:30:00.000Z"
  }
}

```



### 4. Delete / Expire a Link

* **Endpoint:** `DELETE /api/v1/urls/:shortCode`
* **Description:** Deactivates and purges a shortened code mapping from the system.
* **Success Response (`204 No Content`):** (No response body returned)

---

