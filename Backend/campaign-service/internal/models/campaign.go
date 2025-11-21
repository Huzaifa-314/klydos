package models

import (
	"time"

	"github.com/google/uuid"
)

type CampaignStatus string

const (
	CampaignStatusDraft     CampaignStatus = "draft"
	CampaignStatusActive    CampaignStatus = "active"
	CampaignStatusCompleted CampaignStatus = "completed"
)

type Campaign struct {
	ID           uuid.UUID      `json:"id"`
	Title        string         `json:"title"`
	Description  string         `json:"description"`
	TargetAmount float64        `json:"target_amount"`
	Photos       []string       `json:"photos"`
	Status       CampaignStatus `json:"status"`
	StartDate    time.Time      `json:"start_date"`
	EndDate      time.Time      `json:"end_date"`
	CreatedBy    *uuid.UUID     `json:"created_by"` // Nullable - can be admin or user
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	Featured     bool           `json:"featured"`
}

type CampaignSummary struct {
	ID          uuid.UUID `json:"id"`
	CampaignID  uuid.UUID `json:"campaign_id"`
	TotalRaised float64   `json:"total_raised"`
	TotalDonors int       `json:"total_donors"`
	LastUpdated time.Time `json:"last_updated"`
}

type CreateCampaignRequest struct {
	Title        string     `json:"title" binding:"required,min=3"`
	Description  string     `json:"description" binding:"required,min=10"`
	TargetAmount float64    `json:"target_amount" binding:"required,gt=0"`
	StartDate    *time.Time `json:"start_date"`
	EndDate      time.Time  `json:"end_date" binding:"required"`
	CreatedBy    *string    `json:"created_by"` // Optional user ID
	Featured     bool       `json:"featured"`
}

type UpdateCampaignRequest struct {
	Title        *string    `json:"title"`
	Description  *string    `json:"description"`
	TargetAmount *float64   `json:"target_amount"`
	EndDate      *time.Time `json:"end_date"`
	Featured     *bool      `json:"featured"`
}

type UpdateCampaignStatusRequest struct {
	Status CampaignStatus `json:"status" binding:"required,oneof=draft active completed"`
}

type CampaignResponse struct {
	ID           uuid.UUID      `json:"id"`
	Title        string         `json:"title"`
	Description  string         `json:"description"`
	TargetAmount float64        `json:"target_amount"`
	Photos       []string       `json:"photos"`
	Status       CampaignStatus `json:"status"`
	StartDate    time.Time      `json:"start_date"`
	EndDate      time.Time      `json:"end_date"`
	CreatedBy    *uuid.UUID     `json:"created_by"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	Featured     bool           `json:"featured"`
	TotalRaised  float64        `json:"total_raised"`
	TotalDonors  int            `json:"total_donors"`
}

type ListCampaignsQuery struct {
	Status   string `form:"status"`
	Featured *bool  `form:"featured"`
	Page     int    `form:"page"`
	Limit    int    `form:"limit"`
}
