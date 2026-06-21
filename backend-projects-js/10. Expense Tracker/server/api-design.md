# Expense Tracker API

## Base URL

```http
/api/v1
```

---

# Authentication APIs

## Register User

### Endpoint

```http
POST /auth/signup
```

### Request Body

```json
{
  "name": "Pankaj Yadav",
  "email": "pankaj@gmail.com",
  "password": "Password@123"
}
```

### Password Requirements

* Minimum 8 characters
* At least 1 uppercase letter
* At least 1 lowercase letter
* At least 1 number
* At least 1 special character

### Response

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "Pankaj Yadav",
      "email": "pankaj@gmail.com"
    },
    "token": "jwt_token"
  }
}
```

---

## Login User

### Endpoint

```http
POST /auth/login
```

### Request Body

```json
{
  "email": "pankaj@gmail.com",
  "password": "Password@123"
}
```

### Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "Pankaj Yadav",
      "email": "pankaj@gmail.com"
    },
    "token": "jwt_token"
  }
}
```

---

## Logout User

### Endpoint

```http
POST /auth/logout
```

### Headers

```http
Authorization: Bearer <token>
```

### Response

```json
{
  "success": true,
  "message": "Logout successful",
  "data": null
}
```

---

# Expense APIs

All endpoints below require:

```http
Authorization: Bearer <token>
```

---

## Create Expense

### Endpoint

```http
POST /expenses
```

### Request Body

```json
{
  "title": "Weekly Grocery",
  "amount": 1200,
  "category": "Groceries",
  "description": "Vegetables and Fruits",
  "expenseDate": "2026-06-21"
}
```

### Response

```json
{
  "success": true,
  "message": "Expense created successfully",
  "data": {
    "id": 1,
    "title": "Weekly Grocery",
    "amount": 1200,
    "category": "Groceries",
    "description": "Vegetables and Fruits",
    "expenseDate": "2026-06-21",
    "createdAt": "2026-06-21T10:00:00Z",
    "updatedAt": "2026-06-21T10:00:00Z"
  }
}
```

---

## Get All Expenses

### Endpoint

```http
GET /expenses?page=1&limit=10
```

### Response

```json
{
  "success": true,
  "message": "Expenses fetched successfully",
  "data": {
    "count": 25,
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalPages": 3
    },
    "expenses": [
      {
        "id": 1,
        "title": "Weekly Grocery",
        "amount": 1200,
        "category": "Groceries",
        "expenseDate": "2026-06-21"
      }
    ]
  }
}
```

---

## Get Expense By ID

### Endpoint

```http
GET /expenses/:id
```

### Response

```json
{
  "success": true,
  "message": "Expense fetched successfully",
  "data": {
    "id": 1,
    "title": "Weekly Grocery",
    "amount": 1200,
    "category": "Groceries",
    "description": "Vegetables and Fruits",
    "expenseDate": "2026-06-21",
    "createdAt": "2026-06-21T10:00:00Z",
    "updatedAt": "2026-06-21T10:00:00Z"
  }
}
```

---

## Update Expense

### Endpoint

```http
PUT /expenses/:id
```

### Request Body

```json
{
  "amount": 1500,
  "description": "Updated grocery expense"
}
```

### Response

```json
{
  "success": true,
  "message": "Expense updated successfully",
  "data": {
    "id": 1,
    "title": "Weekly Grocery",
    "amount": 1500,
    "category": "Groceries",
    "description": "Updated grocery expense",
    "expenseDate": "2026-06-21"
  }
}
```

---

## Delete Expense

### Endpoint

```http
DELETE /expenses/:id
```

### Response

```json
{
  "success": true,
  "message": "Expense deleted successfully",
  "data": null
}
```

---

# Expense Filters

## Past Week

```http
GET /expenses?filter=week
```

---

## Past Month

```http
GET /expenses?filter=month
```

---

## Last 3 Months

```http
GET /expenses?filter=3months
```

---

## Custom Date Range

```http
GET /expenses?startDate=2026-01-01&endDate=2026-06-30
```

---

## Filter By Category

```http
GET /expenses?category=Groceries
```

---

## Combined Filters

```http
GET /expenses?filter=month&category=Groceries&page=1&limit=10
```

---

# Expense Categories

```text
Groceries
Leisure
Electronics
Utilities
Clothing
Health
Others
```

---

# Error Responses

## Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "errors": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

---

## Invalid Credentials

```json
{
  "success": false,
  "message": "Invalid email or password",
  "data": null
}
```

---

## Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized",
  "data": null
}
```

---

## Expense Not Found

```json
{
  "success": false,
  "message": "Expense not found",
  "data": null
}
```

---

## Forbidden

```json
{
  "success": false,
  "message": "You are not authorized to access this expense",
  "data": null
}
```
---
# Extra - feature
# Sorting Expenses

## Sort By Expense Date (Newest First)

```http
GET /expenses?sortBy=expenseDate&order=desc
```

---

## Sort By Expense Date (Oldest First)

```http
GET /expenses?sortBy=expenseDate&order=asc
```

---

## Sort By Amount (Low to High)

```http
GET /expenses?sortBy=amount&order=asc
```

---

## Sort By Amount (High to Low)

```http
GET /expenses?sortBy=amount&order=desc
```

---

## Combined Example

```http
GET /expenses?filter=month&category=Groceries&sortBy=amount&order=desc&page=1&limit=10
```

### Response

```json
{
  "success": true,
  "message": "Expenses fetched successfully",
  "data": {
    "count": 25,
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalPages": 3,
      "hasNextPage": true,
      "hasPreviousPage": false
    },
    "expenses": [
      {
        "id": 1,
        "title": "Weekly Grocery",
        "amount": 1500,
        "category": "Groceries",
        "expenseDate": "2026-06-21"
      }
    ]
  }
}
```
