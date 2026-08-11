#!/usr/bin/env bash

BASE_URL="http://localhost:5000"

echo "=== 1. Logging In ==="
LOGIN_RES=$(curl -s -X POST "$BASE_URL/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"darth_dev@example.com","password":"StrongPassword123!"}')

TOKEN=$(echo "$LOGIN_RES" | jq -r '.data.accessToken')
echo "Token Acquired: ${TOKEN:0:20}..."

echo -e "\n=== 2. Creating Password-Protected URL ==="
curl -s -X POST "$BASE_URL/api/v1/urls" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "originalUrl": "https://github.com/expressjs/express",
    "customAlias": "express-pass-check",
    "password": "secretpassword123"
  }' | jq .

echo -e "\n=== 3. Challenging Protected Link (Unauthenticated GET) ==="
curl -i -s "$BASE_URL/express-pass-check" | head -n 12

echo -e "\n=== 4. Unlocking Protected Link (POST Password Challenge) ==="
curl -i -s -X POST "$BASE_URL/api/v1/urls/express-pass-check/verify-password" \
  -H "Content-Type: application/json" \
  -d '{"password":"secretpassword123"}' | head -n 12
