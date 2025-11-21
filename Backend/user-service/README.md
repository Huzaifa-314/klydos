# User Service

Microservice for managing user accounts, authentication, and sessions for the CareForAll platform.

## Features

- User registration
- User login with session-based authentication
- User logout
- Get current user profile
- Get user by ID
- Session management (7-day expiration)

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `name` (VARCHAR(255))
- `email` (VARCHAR(255), UNIQUE)
- `password_hash` (VARCHAR(255))
- `created_at` (TIMESTAMP)

### Sessions Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to users)
- `token` (VARCHAR(64), UNIQUE)
- `expires_at` (TIMESTAMP)
- `created_at` (TIMESTAMP)

## API Endpoints

### POST /users/register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** 201 Created
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### POST /users/login
Login and receive a session token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** 200 OK
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "token": "session_token_here"
}
```

### POST /users/logout
Logout and invalidate session token.

**Headers:** `Authorization: Bearer <token>`

**Response:** 200 OK
```json
{
  "message": "Logged out successfully"
}
```

### GET /users/me
Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response:** 200 OK
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### GET /users/:id
Get user by ID (public endpoint).

**Response:** 200 OK
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2024-01-01T00:00:00Z"
}
```

## Setup

1. **Start the database:**
   ```bash
   cd Backend
   docker-compose up -d users_db
   ```

2. **Install dependencies:**
   ```bash
   cd user-service
   go mod download
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your database configuration
   ```

4. **Run migrations:**
   Migrations run automatically on service startup.

5. **Run the service:**
   ```bash
   go run main.go
   ```

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string (default: postgres://postgres:postgres@localhost:5432/users?sslmode=disable)
- `PORT` - Server port (default: 8080)
- `GIN_MODE` - Gin framework mode: debug or release (default: debug)

## Testing

```bash
go test ./...
```

## Docker

Build and run with Docker:

```bash
docker build -t user-service .
docker run -p 8080:8080 --env-file .env user-service
```

