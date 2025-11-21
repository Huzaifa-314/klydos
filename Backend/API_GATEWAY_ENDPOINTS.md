# API Gateway - Available Endpoints

This document lists all currently available API endpoints accessible through the API Gateway.

**Base URL**: `http://localhost/api`

**API Gateway**: Nginx-based gateway routing requests to microservices

---

## Table of Contents

- [Gateway Health Check](#gateway-health-check)
- [User Service Endpoints](#user-service-endpoints)
- [Future Endpoints](#future-endpoints)
- [Authentication](#authentication)
- [Error Responses](#error-responses)
- [Rate Limiting](#rate-limiting)

---

## Gateway Health Check

### GET /health

Check if the API Gateway is operational.

**URL**: `http://localhost/health`

**Method**: `GET`

**Authentication**: None required

**Response**:
```
200 OK
API Gateway is healthy
```

**Example**:
```bash
curl http://localhost/health
```

---

## User Service Endpoints

All user service endpoints are prefixed with `/api/users`

### 1. Register User

Create a new user account.

**URL**: `http://localhost/api/users/register`

**Method**: `POST`

**Authentication**: None required

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation Rules**:
- `name`: Required, minimum 2 characters
- `email`: Required, must be valid email format, must be unique
- `password`: Required, minimum 8 characters

**Response**:
```json
{
  "id": "a118eae0-56f0-4ebb-81b2-9a103ce0d6ef",
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2025-11-21T08:18:20.033245Z"
}
```

**Status Codes**:
- `201 Created` - User successfully created
- `400 Bad Request` - Invalid request body or validation failed
- `409 Conflict` - Email already registered

**Example**:
```bash
curl -X POST http://localhost/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

**PowerShell**:
```powershell
$body = @{
    name = "John Doe"
    email = "john@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost/api/users/register" -Method Post -Body $body -ContentType "application/json"
```

---

### 2. User Login

Authenticate user and receive session token.

**URL**: `http://localhost/api/users/login`

**Method**: `POST`

**Authentication**: None required

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "user": {
    "id": "a118eae0-56f0-4ebb-81b2-9a103ce0d6ef",
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2025-11-21T08:18:20.033245Z"
  },
  "token": "f3157ac671b5412b206cd0628272c9fb466c4975025f6a25258222b0f8922f1d"
}
```

**Status Codes**:
- `200 OK` - Login successful
- `400 Bad Request` - Invalid request body
- `401 Unauthorized` - Invalid email or password

**Token Details**:
- Token expires: 7 days from creation
- Token format: 64-character hexadecimal string
- Use in `Authorization: Bearer <token>` header

**Example**:
```bash
curl -X POST http://localhost/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**PowerShell**:
```powershell
$body = @{
    email = "john@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost/api/users/login" -Method Post -Body $body -ContentType "application/json"
```

---

### 3. Get Current User

Get authenticated user's profile information.

**URL**: `http://localhost/api/users/me`

**Method**: `GET`

**Authentication**: Required (Bearer token)

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "id": "a118eae0-56f0-4ebb-81b2-9a103ce0d6ef",
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2025-11-21T08:18:20.033245Z"
}
```

**Status Codes**:
- `200 OK` - User details retrieved
- `401 Unauthorized` - Invalid or expired token

**Example**:
```bash
curl -X GET http://localhost/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**PowerShell**:
```powershell
$headers = @{
    Authorization = "Bearer YOUR_TOKEN_HERE"
}

Invoke-RestMethod -Uri "http://localhost/api/users/me" -Method Get -Headers $headers
```

---

### 4. Get User by ID

Get user profile by user ID (public endpoint).

**URL**: `http://localhost/api/users/:id`

**Method**: `GET`

**Authentication**: None required

**Path Parameters**:
- `id` (UUID): User ID

**Response**:
```json
{
  "id": "a118eae0-56f0-4ebb-81b2-9a103ce0d6ef",
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2025-11-21T08:18:20.033245Z"
}
```

**Status Codes**:
- `200 OK` - User found
- `400 Bad Request` - Invalid UUID format
- `404 Not Found` - User not found

**Example**:
```bash
curl -X GET http://localhost/api/users/a118eae0-56f0-4ebb-81b2-9a103ce0d6ef
```

**PowerShell**:
```powershell
$userId = "a118eae0-56f0-4ebb-81b2-9a103ce0d6ef"
Invoke-RestMethod -Uri "http://localhost/api/users/$userId" -Method Get
```

---

### 5. User Logout

Invalidate current session token.

**URL**: `http://localhost/api/users/logout`

**Method**: `POST`

**Authentication**: Required (Bearer token)

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "message": "Logged out successfully"
}
```

**Status Codes**:
- `200 OK` - Logout successful
- `401 Unauthorized` - Invalid or missing token

**Example**:
```bash
curl -X POST http://localhost/api/users/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**PowerShell**:
```powershell
$headers = @{
    Authorization = "Bearer YOUR_TOKEN_HERE"
}

Invoke-RestMethod -Uri "http://localhost/api/users/logout" -Method Post -Headers $headers
```

---

## Future Endpoints

The following endpoints are configured in the API Gateway but will be available once the corresponding services are implemented:

### Campaign Service (Future)

- `GET /api/campaigns` - List all campaigns
- `GET /api/campaigns/:id` - Get campaign details
- `POST /api/campaigns` - Create campaign (admin only)
- `PUT /api/campaigns/:id` - Update campaign (admin only)
- `PATCH /api/campaigns/:id/status` - Update campaign status (admin only)
- `POST /api/campaigns/:id/photos` - Upload campaign photos (admin only)

### Pledge Service (Future)

- `POST /api/campaigns/:id/pledge` - Create donation pledge

### Payment Service (Future)

- `POST /api/payments/charge` - Process payment (internal)
- `POST /api/payments/webhook` - Stripe webhook handler

### Admin Endpoints (Future)

- `GET /api/admin/campaigns` - List campaigns (admin)
- `POST /api/admin/campaigns` - Create campaign (admin)
- `GET /api/admin/metrics` - System metrics (admin)

---

## Authentication

### Session-Based Authentication

The API uses session-based authentication with bearer tokens:

1. **Login** to receive a session token
2. **Include token** in `Authorization` header for protected endpoints
3. **Token expires** after 7 days
4. **Logout** to invalidate token immediately

### Protected Endpoints

These endpoints require authentication:
- `GET /api/users/me`
- `POST /api/users/logout`

### Public Endpoints

These endpoints do not require authentication:
- `GET /health`
- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/users/:id`

### Guest Users

Some features support guest (anonymous) users. For these features, `user_id` will be `null` in the database, and no authentication token is required.

---

## Error Responses

All error responses follow a consistent format:

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid or expired token"
}
```
or
```json
{
  "error": "Invalid email or password"
}
```

### 404 Not Found
```json
{
  "error": "User not found"
}
```

### 409 Conflict
```json
{
  "error": "Email already registered"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error message"
}
```

---

## CORS (Cross-Origin Resource Sharing)

The API Gateway includes CORS headers for all responses:

- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Authorization, Content-Type, X-API-Key`

**Note**: For production, restrict `Access-Control-Allow-Origin` to specific domains.

---

## Rate Limiting

Currently, no rate limiting is configured. This will be added in production deployment.

---

## Request/Response Format

### Request Headers

All requests should include:
```
Content-Type: application/json
```

Protected requests should include:
```
Authorization: Bearer <token>
```

### Response Format

All successful responses return JSON with appropriate status codes.

### Content-Type

- Request: `application/json`
- Response: `application/json`

---

## Testing

### Quick Test Script

```powershell
# 1. Health Check
Invoke-RestMethod -Uri "http://localhost/health"

# 2. Register User
$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

$user = Invoke-RestMethod -Uri "http://localhost/api/users/register" -Method Post -Body $body -ContentType "application/json"

# 3. Login
$loginBody = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

$login = Invoke-RestMethod -Uri "http://localhost/api/users/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $login.token

# 4. Get Current User
$headers = @{Authorization = "Bearer $token"}
Invoke-RestMethod -Uri "http://localhost/api/users/me" -Method Get -Headers $headers

# 5. Logout
Invoke-RestMethod -Uri "http://localhost/api/users/logout" -Method Post -Headers $headers
```

---

## Gateway Configuration

The API Gateway routes requests as follows:

| Client Path | Gateway Rewrites To | Forwarded To |
|-------------|---------------------|--------------|
| `/api/users/*` | `/users/*` | `user-service:8080` |
| `/health` | - | Gateway (no forwarding) |
| `/api/campaigns/*` | `/campaigns/*` | `campaign-service:8081` (future) |
| `/api/payments/*` | `/payments/*` | `payment-service:8083` (future) |

---

## Service Communication

**External Access** (Client → Gateway):
- Base URL: `http://localhost/api/*`

**Internal Access** (Service → Service):
- Via Docker network: `http://user-service:8080/*`
- Services communicate internally using service names

**Database Access**:
- User Service → `users_db:5432`
- Services connect via Docker network

---

## Last Updated

**Date**: November 21, 2025

**Version**: 1.0.0

**Available Services**:
- ✅ User Service
- ⏳ Campaign Service (Coming soon)
- ⏳ Pledge Service (Coming soon)
- ⏳ Payment Service (Coming soon)

---

## Support

For issues or questions:
1. Check service logs: `docker-compose logs user-service`
2. Check gateway logs: `docker-compose logs api-gateway`
3. Verify database: `docker exec users_db psql -U postgres -d users`

