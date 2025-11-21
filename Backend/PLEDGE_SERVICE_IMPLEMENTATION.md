# Pledge Service Implementation

## Overview
The Pledge Service handles donation pledges for campaigns. It implements the Transactional Outbox pattern for reliable event publishing and communicates with both Campaign Service and User Service for validation.

## Architecture

### Database Schema

#### `pledges` Table
- `id` (UUID, Primary Key)
- `campaign_id` (UUID, NOT NULL) - References campaign
- `user_id` (UUID, NULLABLE) - References user (null for guest donations)
- `amount` (DECIMAL(15,2), NOT NULL, CHECK > 0)
- `status` (ENUM: AUTHORIZED, CAPTURED, COMPLETED, FAILED)
- `created_at` (TIMESTAMP)

**Indexes:**
- `idx_pledges_campaign_id` on `campaign_id`
- `idx_pledges_user_id` on `user_id`
- `idx_pledges_status` on `status`
- `idx_pledges_created_at` on `created_at`

#### `outbox` Table (Transactional Outbox Pattern)
- `id` (UUID, Primary Key)
- `aggregate` (VARCHAR(255)) - Aggregate type (e.g., "pledge")
- `event_type` (VARCHAR(255)) - Event type (e.g., "PledgeCreated")
- `payload` (TEXT) - JSON event payload
- `sent_flag` (BOOLEAN) - Whether event has been published
- `created_at` (TIMESTAMP)

**Indexes:**
- `idx_outbox_sent_flag` on `sent_flag`
- `idx_outbox_created_at` on `created_at`

## API Endpoints

### POST `/api/campaigns/{id}/pledge`
Create a new pledge for a campaign.

**Request Body:**
```json
{
  "amount": 50.00,
  "user_id": "optional-user-id"  // Optional - null for guest donations
}
```

**Response (201 Created):**
```json
{
  "id": "733079d4-a60a-4325-8ff0-c10c7c7de847",
  "campaign_id": "6dc806ee-97b6-423b-b844-66ee60b851fb",
  "user_id": "880b7a61-c397-44c6-b991-bdb627ed08be",
  "amount": 50.00,
  "status": "AUTHORIZED",
  "created_at": "2025-11-21T10:10:15.885776187Z"
}
```

**Validation Rules:**
- Amount must be > 0
- Minimum donation: $1
- Maximum donation: $100,000
- Campaign must exist and be `active`
- User ID (if provided) must exist in User Service

**Error Responses:**
- `400 Bad Request`: Invalid amount, campaign not active, user not found
- `404 Not Found`: Campaign not found
- `500 Internal Server Error`: Service communication failure

## Inter-Service Communication

### Campaign Service Client
- **ValidateCampaign(campaignID)**: Checks if campaign exists and returns status
- **GetCampaign(campaignID)**: Retrieves full campaign details

### User Service Client
- **ValidateUser(userID)**: Checks if user exists

## Transactional Outbox Pattern

When a pledge is created, the service:
1. Starts a database transaction
2. Inserts the pledge into `pledges` table
3. Inserts a `PledgeCreated` event into `outbox` table
4. Commits the transaction atomically

This ensures that:
- Events are only created if the pledge is successfully saved
- Events can be reliably published later by an outbox worker
- No events are lost if the service crashes before publishing

**Event Payload Example:**
```json
{
  "pledge_id": "733079d4-a60a-4325-8ff0-c10c7c7de847",
  "campaign_id": "6dc806ee-97b6-423b-b844-66ee60b851fb",
  "user_id": "880b7a61-c397-44c6-b991-bdb627ed08be",
  "amount": 50.00,
  "status": "AUTHORIZED",
  "created_at": "2025-11-21T10:10:15.885776187Z"
}
```

## Testing Results

### ✅ Successful Tests

1. **Create Pledge with User (Authenticated Donation)**
   - ✅ Pledge created with user_id
   - ✅ Status: AUTHORIZED
   - ✅ Event created in outbox

2. **Create Pledge without User (Guest Donation)**
   - ✅ Pledge created with null user_id
   - ✅ Status: AUTHORIZED
   - ✅ Event created in outbox

### ✅ Validation Tests (All Correctly Rejected)

3. **Invalid Amount (negative)**
   - ✅ Rejected with 400 Bad Request

4. **Amount too small (< $1)**
   - ✅ Rejected with 400 Bad Request

5. **Amount too large (> $100,000)**
   - ✅ Rejected with 400 Bad Request

6. **Invalid Campaign ID format**
   - ✅ Rejected with 400 Bad Request

7. **Pledge to Draft Campaign**
   - ✅ Rejected with 400 Bad Request (campaign must be active)

8. **Non-existent User ID**
   - ✅ Rejected with 400 Bad Request

## Database Verification

### Pledges Table
```
2 pledges created:
- 1 with user_id (authenticated donation)
- 1 without user_id (guest donation)
Both with status AUTHORIZED
```

### Outbox Table
```
2 events created:
- Both PledgeCreated events
- Both with sent_flag = false (awaiting outbox worker)
```

## Docker Configuration

### Service Configuration
- **Port**: 8082
- **Database**: `pledges_db` (PostgreSQL)
- **Dependencies**: 
  - `campaign-service` (for campaign validation)
  - `user-service` (for user validation)

### Environment Variables
```env
DATABASE_URL=postgres://postgres:postgres@pledges_db:5432/pledges?sslmode=disable
PORT=8082
CAMPAIGN_SERVICE_URL=http://campaign-service:8081
USER_SERVICE_URL=http://user-service:8080
GIN_MODE=release
```

## API Gateway Routing

The API Gateway routes `/api/campaigns/{id}/pledge` to the Pledge Service using a regex location that matches before the general `/api/campaigns` prefix location:

```nginx
location ~ ^/api/campaigns/(.+)/pledge$ {
    rewrite ^/api/campaigns/(.+)/pledge$ /campaigns/$1/pledge break;
    proxy_pass http://pledge-service;
    ...
}
```

## Next Steps

1. **Outbox Worker**: Implement a background worker to publish events from the `outbox` table to a message broker (RabbitMQ/NATS/Kafka)
2. **Event Consumers**: Implement consumers in Campaign Service to update campaign totals when `PledgeCaptured` events are received
3. **Payment Integration**: Integrate with Payment Service to capture authorized pledges
4. **Status Updates**: Implement handlers to update pledge status from AUTHORIZED → CAPTURED → COMPLETED

## Files Structure

```
pledge-service/
├── main.go                          # Service entry point
├── go.mod                           # Go dependencies
├── Dockerfile                       # Docker build configuration
├── .env.example                     # Environment variables template
└── internal/
    ├── config/
    │   └── config.go                # Configuration and HTTP clients
    ├── models/
    │   └── pledge.go                # Data models
    ├── database/
    │   └── database.go              # Database connection and migrations
    ├── repository/
    │   └── pledge_repository.go    # Data access layer
    └── handlers/
        └── pledge_handler.go       # HTTP handlers
```

