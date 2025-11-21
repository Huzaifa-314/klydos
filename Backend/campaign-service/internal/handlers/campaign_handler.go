package handlers

import (
	"database/sql"
	"net/http"
	"time"

	"github.com/Huzaifa-314/klydos/campaign-service/internal/config"
	"github.com/Huzaifa-314/klydos/campaign-service/internal/models"
	"github.com/Huzaifa-314/klydos/campaign-service/internal/repository"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type CampaignHandler struct {
	campaignRepo      *repository.CampaignRepository
	userServiceClient *config.UserServiceClient
}

func NewCampaignHandler(db *sql.DB, userServiceClient *config.UserServiceClient) *CampaignHandler {
	return &CampaignHandler{
		campaignRepo:      repository.NewCampaignRepository(db),
		userServiceClient: userServiceClient,
	}
}

func (h *CampaignHandler) ListCampaigns(c *gin.Context) {
	var query models.ListCampaignsQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if query.Page <= 0 {
		query.Page = 1
	}
	if query.Limit <= 0 {
		query.Limit = 10
	}

	campaigns, total, err := h.campaignRepo.ListCampaigns(query.Status, query.Featured, query.Page, query.Limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve campaigns"})
		return
	}

	// Enrich with summary data
	responses := []models.CampaignResponse{}
	for _, campaign := range campaigns {
		summary, _ := h.campaignRepo.GetCampaignSummary(campaign.ID)
		response := h.campaignToResponse(campaign, summary)
		responses = append(responses, response)
	}

	c.JSON(http.StatusOK, gin.H{
		"campaigns": responses,
		"total":     total,
		"page":      query.Page,
		"limit":     query.Limit,
	})
}

func (h *CampaignHandler) GetCampaign(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid campaign ID format"})
		return
	}

	campaign, err := h.campaignRepo.GetCampaignByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve campaign"})
		return
	}
	if campaign == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Campaign not found"})
		return
	}

	summary, _ := h.campaignRepo.GetCampaignSummary(campaign.ID)
	response := h.campaignToResponse(campaign, summary)

	c.JSON(http.StatusOK, response)
}

func (h *CampaignHandler) CreateCampaign(c *gin.Context) {
	var req models.CreateCampaignRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate end_date is in the future
	if req.EndDate.Before(time.Now()) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "end_date must be in the future"})
		return
	}

	// Validate created_by user exists if provided
	var createdBy *uuid.UUID
	if req.CreatedBy != nil && *req.CreatedBy != "" {
		userID, err := uuid.Parse(*req.CreatedBy)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID format"})
			return
		}

		// Validate user exists in User Service
		exists, err := h.userServiceClient.ValidateUser(userID.String())
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to validate user"})
			return
		}
		if !exists {
			c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
			return
		}

		createdBy = &userID
	}

	startDate := time.Now()
	if req.StartDate != nil {
		startDate = *req.StartDate
	}

	campaign := &models.Campaign{
		ID:           uuid.New(),
		Title:        req.Title,
		Description:  req.Description,
		TargetAmount: req.TargetAmount,
		Photos:       []string{},
		Status:       models.CampaignStatusDraft,
		StartDate:    startDate,
		EndDate:      req.EndDate,
		CreatedBy:    createdBy,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
		Featured:     req.Featured,
	}

	if err := h.campaignRepo.CreateCampaign(campaign); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create campaign"})
		return
	}

	summary, _ := h.campaignRepo.GetCampaignSummary(campaign.ID)
	response := h.campaignToResponse(campaign, summary)

	c.JSON(http.StatusCreated, response)
}

func (h *CampaignHandler) UpdateCampaign(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid campaign ID format"})
		return
	}

	// Check campaign exists
	campaign, err := h.campaignRepo.GetCampaignByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve campaign"})
		return
	}
	if campaign == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Campaign not found"})
		return
	}

	var req models.UpdateCampaignRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updates := make(map[string]interface{})
	if req.Title != nil {
		if len(*req.Title) < 3 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "title must be at least 3 characters"})
			return
		}
		updates["title"] = *req.Title
	}
	if req.Description != nil {
		if len(*req.Description) < 10 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "description must be at least 10 characters"})
			return
		}
		updates["description"] = *req.Description
	}
	if req.TargetAmount != nil {
		if *req.TargetAmount <= 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "target_amount must be greater than 0"})
			return
		}
		updates["target_amount"] = *req.TargetAmount
	}
	if req.EndDate != nil {
		if req.EndDate.Before(campaign.StartDate) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "end_date must be after start_date"})
			return
		}
		updates["end_date"] = *req.EndDate
	}
	if req.Featured != nil {
		updates["featured"] = *req.Featured
	}

	if len(updates) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No fields to update"})
		return
	}

	if err := h.campaignRepo.UpdateCampaign(id, updates); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update campaign"})
		return
	}

	// Get updated campaign
	updatedCampaign, _ := h.campaignRepo.GetCampaignByID(id)
	summary, _ := h.campaignRepo.GetCampaignSummary(id)
	response := h.campaignToResponse(updatedCampaign, summary)

	c.JSON(http.StatusOK, response)
}

func (h *CampaignHandler) UpdateCampaignStatus(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid campaign ID format"})
		return
	}

	// Check campaign exists
	campaign, err := h.campaignRepo.GetCampaignByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve campaign"})
		return
	}
	if campaign == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Campaign not found"})
		return
	}

	var req models.UpdateCampaignStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate status transition
	if !isValidStatusTransition(campaign.Status, req.Status) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status transition"})
		return
	}

	updates := map[string]interface{}{
		"status": string(req.Status),
	}

	if err := h.campaignRepo.UpdateCampaign(id, updates); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update campaign status"})
		return
	}

	// Get updated campaign
	updatedCampaign, _ := h.campaignRepo.GetCampaignByID(id)
	summary, _ := h.campaignRepo.GetCampaignSummary(id)
	response := h.campaignToResponse(updatedCampaign, summary)

	c.JSON(http.StatusOK, response)
}

func (h *CampaignHandler) UploadPhotos(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid campaign ID format"})
		return
	}

	// Check campaign exists
	campaign, err := h.campaignRepo.GetCampaignByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve campaign"})
		return
	}
	if campaign == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Campaign not found"})
		return
	}

	// For now, accept photo URLs as JSON array
	// In production, this would handle file uploads
	var photoURLs []string
	if err := c.ShouldBindJSON(&photoURLs); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid photo URLs format"})
		return
	}

	if len(photoURLs) > 10 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Maximum 10 photos allowed per campaign"})
		return
	}

	// Merge with existing photos (or replace - you can change this logic)
	newPhotos := append(campaign.Photos, photoURLs...)
	if len(newPhotos) > 10 {
		newPhotos = newPhotos[:10]
	}

	if err := h.campaignRepo.UpdateCampaignPhotos(id, newPhotos); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update photos"})
		return
	}

	// Get updated campaign
	updatedCampaign, _ := h.campaignRepo.GetCampaignByID(id)
	summary, _ := h.campaignRepo.GetCampaignSummary(id)
	response := h.campaignToResponse(updatedCampaign, summary)

	c.JSON(http.StatusOK, response)
}

// Helper functions

func (h *CampaignHandler) campaignToResponse(campaign *models.Campaign, summary *models.CampaignSummary) models.CampaignResponse {
	response := models.CampaignResponse{
		ID:           campaign.ID,
		Title:        campaign.Title,
		Description:  campaign.Description,
		TargetAmount: campaign.TargetAmount,
		Photos:       campaign.Photos,
		Status:       campaign.Status,
		StartDate:    campaign.StartDate,
		EndDate:      campaign.EndDate,
		CreatedBy:    campaign.CreatedBy,
		CreatedAt:    campaign.CreatedAt,
		UpdatedAt:    campaign.UpdatedAt,
		Featured:     campaign.Featured,
		TotalRaised:  0,
		TotalDonors:  0,
	}

	if summary != nil {
		response.TotalRaised = summary.TotalRaised
		response.TotalDonors = summary.TotalDonors
	}

	return response
}

func isValidStatusTransition(current, new models.CampaignStatus) bool {
	// Simple state machine: draft -> active -> completed
	transitions := map[models.CampaignStatus][]models.CampaignStatus{
		models.CampaignStatusDraft:     {models.CampaignStatusActive, models.CampaignStatusCompleted},
		models.CampaignStatusActive:    {models.CampaignStatusCompleted},
		models.CampaignStatusCompleted: {}, // No transitions from completed
	}

	allowed, exists := transitions[current]
	if !exists {
		return false
	}

	for _, status := range allowed {
		if status == new {
			return true
		}
	}

	return false
}
