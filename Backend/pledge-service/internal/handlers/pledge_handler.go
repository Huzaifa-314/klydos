package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	"github.com/careforall/pledge-service/internal/config"
	"github.com/careforall/pledge-service/internal/models"
	"github.com/careforall/pledge-service/internal/repository"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type PledgeHandler struct {
	pledgeRepo            *repository.PledgeRepository
	campaignServiceClient *config.CampaignServiceClient
	userServiceClient     *config.UserServiceClient
}

func NewPledgeHandler(db *sql.DB, campaignClient *config.CampaignServiceClient, userClient *config.UserServiceClient) *PledgeHandler {
	return &PledgeHandler{
		pledgeRepo:            repository.NewPledgeRepository(db),
		campaignServiceClient: campaignClient,
		userServiceClient:     userClient,
	}
}

func (h *PledgeHandler) CreatePledge(c *gin.Context) {
	campaignIDStr := c.Param("id")
	campaignID, err := uuid.Parse(campaignIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid campaign ID format"})
		return
	}

	var req models.CreatePledgeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate amount
	if req.Amount <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "amount must be greater than 0"})
		return
	}

	// Minimum donation: $1
	if req.Amount < 1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "minimum donation amount is $1"})
		return
	}

	// Maximum donation: $100,000
	if req.Amount > 100000 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "maximum donation amount is $100,000"})
		return
	}

	// Validate campaign exists and is active
	exists, status, err := h.campaignServiceClient.ValidateCampaign(campaignID.String())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to validate campaign"})
		return
	}
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Campaign not found"})
		return
	}
	if status != "active" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Campaign must be active to receive donations"})
		return
	}

	// Validate user if provided
	var userID *uuid.UUID
	if req.UserID != nil && *req.UserID != "" {
		uid, err := uuid.Parse(*req.UserID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID format"})
			return
		}

		// Validate user exists
		exists, err := h.userServiceClient.ValidateUser(uid.String())
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to validate user"})
			return
		}
		if !exists {
			c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
			return
		}

		userID = &uid
	}

	// Create pledge
	pledge := &models.Pledge{
		ID:         uuid.New(),
		CampaignID: campaignID,
		UserID:     userID,
		Amount:     req.Amount,
		Status:     models.PledgeStatusAuthorized,
		CreatedAt:  time.Now(),
	}

	// Create outbox event for PledgeCreated
	eventPayload := map[string]interface{}{
		"pledge_id":   pledge.ID.String(),
		"campaign_id": pledge.CampaignID.String(),
		"user_id":     nil,
		"amount":      pledge.Amount,
		"status":      string(pledge.Status),
		"created_at":  pledge.CreatedAt.Format(time.RFC3339),
	}
	if pledge.UserID != nil {
		eventPayload["user_id"] = pledge.UserID.String()
	}

	payloadJSON, err := json.Marshal(eventPayload)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create event payload"})
		return
	}

	event := &models.OutboxEvent{
		ID:        uuid.New(),
		Aggregate: "pledge",
		EventType: "PledgeCreated",
		Payload:   string(payloadJSON),
		SentFlag:  false,
		CreatedAt: time.Now(),
	}

	// Create pledge and event atomically using transaction
	if err := h.pledgeRepo.CreatePledgeWithEvent(pledge, event); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create pledge"})
		return
	}

	response := models.PledgeResponse{
		ID:         pledge.ID,
		CampaignID: pledge.CampaignID,
		UserID:     pledge.UserID,
		Amount:     pledge.Amount,
		Status:     pledge.Status,
		CreatedAt:  pledge.CreatedAt,
	}

	c.JSON(http.StatusCreated, response)
}
