package models

import (
	"time"

	"github.com/google/uuid"
)

type PledgeStatus string

const (
	PledgeStatusAuthorized PledgeStatus = "AUTHORIZED"
	PledgeStatusCaptured   PledgeStatus = "CAPTURED"
	PledgeStatusCompleted  PledgeStatus = "COMPLETED"
	PledgeStatusFailed     PledgeStatus = "FAILED"
)

type Pledge struct {
	ID         uuid.UUID    `json:"id"`
	CampaignID uuid.UUID    `json:"campaign_id"`
	UserID     *uuid.UUID   `json:"user_id"` // Nullable - guest donations allowed
	Amount     float64      `json:"amount"`
	Status     PledgeStatus `json:"status"`
	CreatedAt  time.Time    `json:"created_at"`
}

type CreatePledgeRequest struct {
	Amount float64 `json:"amount" binding:"required,gt=0"`
	UserID *string `json:"user_id"` // Optional - for guest donations
}

type PledgeResponse struct {
	ID         uuid.UUID    `json:"id"`
	CampaignID uuid.UUID    `json:"campaign_id"`
	UserID     *uuid.UUID   `json:"user_id"`
	Amount     float64      `json:"amount"`
	Status     PledgeStatus `json:"status"`
	CreatedAt  time.Time    `json:"created_at"`
}

type OutboxEvent struct {
	ID        uuid.UUID
	Aggregate string
	EventType string
	Payload   string
	SentFlag  bool
	CreatedAt time.Time
}
