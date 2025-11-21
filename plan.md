```markdown
# System Design for CareForAll Next-Generation Fundraising Platform

Below is a comprehensive design and implementation plan for the CareForAll backend. It covers microservices architecture, data models, APIs, fault-tolerance patterns, observability, CI/CD pipelines, and deployment strategy on Google Compute Engine. We assume a 2-person team developing in Go with PostgreSQL databases.

## Architecture & Core Services (Checkpoint 1)

We adopt a microservices architecture with clear service boundaries and asynchronous communication to ensure fault tolerance and scalability. The core services and components are:

- **API Gateway / Load Balancer**: A single entry point (e.g. Nginx or Envoy) exposing REST endpoints on the custom domain. It routes requests to internal services and handles SSL/TLS.
- **User Service**: Manages donor accounts (registered or guest). Stores user profiles and donation history.
- **Campaign Service**: Manages fundraising campaigns. Holds campaign metadata and a `campaign_summary` read-model with the total raised.
- **Pledge Service**: Handles donation pledges (logical intent to give). Receives donation requests, writes pledges to its DB, and publishes events (e.g. `PledgeCreated`) via an Outbox.
- **Payment Service**: Interacts with the payment provider. Issues charges, receives webhooks, and tracks payment state. Must implement idempotency (store and dedupe by request or transaction ID) to avoid double charges.
- **Notification Service (Bonus)**: Sends emails/SMS for donation confirmations or admin alerts, subscribed to pledge/payment events.
- **Admin Panel**: A minimal service or UI that allows administrators to create/edit campaigns and view system health.
- **Real-time Chat (Bonus)**: A WebSocket-based support chat for donors (could be a simple Node/Go service).
- **Observability Stack**: Includes Prometheus (metrics), Grafana (dashboards), ELK (logs), and Jaeger (tracing) containers to monitor all services centrally.

Each microservice has its own PostgreSQL database to avoid coupling. Services communicate via asynchronous events (e.g., NATS, RabbitMQ, or Kafka) and synchronous HTTP for queries. This decouples services and allows retry logic.

### Example Event Flow
A new donation request → Pledge Service creates a Pledge (state=AUTHORIZED) and emits `PledgeCreated`. The Payment Service charges the card. On success it emits `PaymentCaptured`. The Pledge Service consumes this, updates the pledge state to CAPTURED (if in correct order), and emits `PledgeCaptured`. The Campaign Service consumes `PledgeCaptured` to update the campaign total. All handlers are idempotent to tolerate retries or duplicate messages.

### Fault-Tolerance Patterns
We use the **Transactional Outbox pattern** in each service that emits events: during the DB transaction we insert the event into an `outbox` table; a separate worker then reliably publishes them to the message broker. This ensures events are published only if the DB update commits. Consumers always handle events idempotently (tracking processed IDs) to avoid double-processing.

We enforce a state machine for pledge/payment: only allow valid transitions (e.g. AUTHORIZED→CAPTURED→COMPLETED) and ignore out-of-order or stale events. For instance, if a CAPTURE event arrives before AUTHORIZED, the consumer can either buffer it or reject it until AUTHORIZED arrives. This prevents backward state changes and ensures campaign totals never go negative.

To handle sudden traffic bursts (>1000 RPS), we scale services using Docker Compose’s `--scale` feature on Compute Engine VMs. We also use database indexing and a read-model (e.g., a `campaign_summary` table) so that campaign totals are updated incrementally, rather than recalculated on each request.

## Data Models and API Design

### User Service (`users` DB)
- Table `users` (id, name, email, password_hash, created_at)
- Table `sessions` (id, user_id, token UNIQUE, expires_at, created_at)
- API: `POST /users/register` (register), `POST /users/login` (login), `POST /users/logout` (logout), `GET /users/me` (get current user), `GET /users/{id}`
- Keeps donation history via foreign keys or events.

### Campaign Service (`campaigns` DB)
- Table `campaigns` (id, title, target_amount, created_at)
- Table `campaign_summary` (campaign_id, total_raised, last_updated)
- API: `GET /campaigns`, `POST /campaigns`
- Admin panel uses this to manage campaigns.
- Consumes `PledgeCaptured` events to update `total_raised`.

### Pledge Service (`pledges` DB)
- Table `pledges` (id, campaign_id, user_id (nullable), amount, status ENUM, created_at)
- Table `outbox` (id, aggregate, event_type, payload, sent_flag)
- API: `POST /campaigns/{cid}/pledge` to create a new pledge
- Publishes `PledgeCreated` and later `PledgeCaptured` events.

### Payment Service (`payments` DB)
- Table `payments` (id, pledge_id, user_id, status, provider_txn_id, amount, idempotency_key, created_at)
- Table `processed_webhooks` (webhook_id PRIMARY KEY) to dedupe webhooks
- API: `POST /payments/charge` (internal call by Pledge Service), `POST /payments/webhook` for provider callbacks
- Ensures idempotency using `idempotency_key` and deduplicating webhook events.

### Notification Service
- API: internal endpoints to send emails/SMS
- Listens for events like `PledgeCreated`, `PaymentCaptured` and sends confirmations.

### Admin Panel
- UI (React or simple HTML) under `/admin` path
- API: `GET/POST /admin/campaigns`, `GET /admin/metrics`
- All admin endpoints require `X-API-Key` header for authentication

All APIs are documented (OpenAPI/Swagger schemas) and use JSON over HTTP or events.

## Authentication & Authorization

### User Authentication (Registered Users)
- **Session-Based Authentication**: Simple token-based sessions
  - `POST /users/register` - Create account (email, password, name)
  - `POST /users/login` - Authenticate and receive session token
  - `POST /users/logout` - Invalidate session token
  - `GET /users/me` - Get current user profile (requires session token)
  - Passwords hashed with bcrypt
  - Session tokens: Random 32-byte hex strings stored in database
  - Token expiration: 7 days (configurable)
  - Tokens sent via `Authorization: Bearer <token>` header or cookie

### Guest Users
- **No Authentication Required**: Anonymous donations allowed
  - Users can make donations without registering
  - `user_id` is null in pledges table for guest donations
  - No session token needed

### Admin Authentication
- **API Key Authentication**: Simple and stateless
  - API key stored in environment variable (`ADMIN_API_KEY`)
  - All `/admin/*` endpoints require `X-API-Key` header
  - Middleware validates API key matches env var
  - No database lookups needed

### Implementation Details
- **User Service Schema**:
  - Table `users`: `id`, `name`, `email`, `password_hash`, `created_at`
  - Table `sessions`: `id`, `user_id`, `token` (UNIQUE), `expires_at`, `created_at`
  
- **Authentication Middleware**:
  - Validates session token from `Authorization` header
  - If valid token → extracts `user_id` from session
  - If no/invalid token → treats request as guest (user_id = null)
  - Admin routes check `X-API-Key` header separately

- **Security**:
  - Password hashing: bcrypt (cost factor 10)
  - Session tokens: Cryptographically random strings
  - Token expiration enforced
  - API key stored in environment variables
  - HTTPS recommended for production

## Implementation Strategy (Checkpoint 2)

- **Language & Frameworks:** Go, `net/http`, `database/sql`, Gin/Echo, `lib/pq`, `opentelemetry-go`
- **Inter-service Communication:** RabbitMQ/NATS for events; HTTP/REST for queries
- **Database:** PostgreSQL per service, containers
- **Idempotency:** `Idempotency-Key` header for Payment Service, deduplicate webhooks
- **Event Reliability:** Transactional Outbox, atomic DB + outbox insert, goroutine publishes events
- **Testing:** Unit tests (`go test`), integration tests with Docker Compose
- **Frontend:** Minimal HTML/React UI to simulate donor interactions and admin dashboard
- **Versioning:** Semantic versioning (v1.0.0), Docker image tags
- **Dockerization:** Dockerfile per service, Docker Compose defines all services + broker + monitoring stack

## Fault Tolerance & Correctness

- **Idempotent Consumer:** Prevents double-counting of events
- **State Control:** Forward-only state transitions
- **Resilience to Retries:** Prevents double-charge and double-count
- **Backpressure & Caching:** Use `campaign_summary` table to avoid DB overload

## Observability & Monitoring (Checkpoint 3)

- **Metrics:** Prometheus endpoints, Node Exporter, cAdvisor, Grafana dashboards
- **Logging:** Structured JSON logs, Filebeat/Logstash → Elasticsearch, Kibana for search
- **Distributed Tracing:** OpenTelemetry → Jaeger, trace end-to-end donation workflow
- **Alerts:** Prometheus/Grafana alerts for error spikes, latency, DB CPU

Monitoring stack runs in Docker Compose with Prometheus + Grafana + Jaeger + Filebeat + Elasticsearch + Kibana.

## CI/CD Pipeline (Checkpoint 4)

- **GitHub Actions:** Triggered on push/PR
- **Separate Service Pipelines:** Each service runs tests, lint, Docker build
- **Versioning:** Semantic versioning, tag Docker images
- **Efficient Builds:** Path filtering, caching, Docker layer caching
- **CD Step (Bonus):** SSH into GCE, `docker-compose pull && docker-compose up -d`

## Deployment & Scalability

- **Load Balancer:** Nginx or GCE external LB
- **Scaling:** `docker-compose up --scale pledge=5 --scale payment=5`
- **High Availability:** Optional multiple VMs behind LB
- **Database:** Managed Postgres or containerized Postgres
- **Monitoring on GCE:** Node Exporter/container metrics visible in Grafana

**Summary:** Event-driven, idempotent, outbox patterns, per-service DBs, observability, CI/CD, Dockerized deployment. Handles traffic spikes and failures without breaking correctness or availability.

**Sources:** Microservices patterns (Idempotent Consumer, Transactional Outbox), observability best practices (Prometheus/Grafana/Jaeger), GitHub Actions path filtering, and industry microservice design practices.
```
