package repository

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"time"

	"github.com/Huzaifa-314/klydos/campaign-service/internal/models"
	"github.com/google/uuid"
)

type CampaignRepository struct {
	db *sql.DB
}

func NewCampaignRepository(db *sql.DB) *CampaignRepository {
	return &CampaignRepository{db: db}
}

func (r *CampaignRepository) CreateCampaign(campaign *models.Campaign) error {
	photosJSON, err := json.Marshal(campaign.Photos)
	if err != nil {
		return fmt.Errorf("failed to marshal photos: %w", err)
	}

	query := `
		INSERT INTO campaigns (id, title, description, target_amount, photos, status, start_date, end_date, created_by, created_at, updated_at, featured)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
	`
	_, err = r.db.Exec(query,
		campaign.ID,
		campaign.Title,
		campaign.Description,
		campaign.TargetAmount,
		photosJSON,
		campaign.Status,
		campaign.StartDate,
		campaign.EndDate,
		campaign.CreatedBy,
		campaign.CreatedAt,
		campaign.UpdatedAt,
		campaign.Featured,
	)
	if err != nil {
		return err
	}

	// Create initial campaign summary
	summaryQuery := `
		INSERT INTO campaign_summary (campaign_id, total_raised, total_donors, last_updated)
		VALUES ($1, 0, 0, CURRENT_TIMESTAMP)
	`
	_, err = r.db.Exec(summaryQuery, campaign.ID)
	return err
}

func (r *CampaignRepository) GetCampaignByID(id uuid.UUID) (*models.Campaign, error) {
	query := `
		SELECT id, title, description, target_amount, photos, status, start_date, end_date, created_by, created_at, updated_at, featured
		FROM campaigns
		WHERE id = $1
	`
	campaign := &models.Campaign{}
	var photosJSON []byte
	var createdBy sql.NullString

	err := r.db.QueryRow(query, id).Scan(
		&campaign.ID,
		&campaign.Title,
		&campaign.Description,
		&campaign.TargetAmount,
		&photosJSON,
		&campaign.Status,
		&campaign.StartDate,
		&campaign.EndDate,
		&createdBy,
		&campaign.CreatedAt,
		&campaign.UpdatedAt,
		&campaign.Featured,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	// Parse photos JSON
	if err := json.Unmarshal(photosJSON, &campaign.Photos); err != nil {
		campaign.Photos = []string{}
	}

	// Parse created_by
	if createdBy.Valid {
		userID, err := uuid.Parse(createdBy.String)
		if err == nil {
			campaign.CreatedBy = &userID
		}
	}

	return campaign, nil
}

func (r *CampaignRepository) ListCampaigns(status string, featured *bool, page, limit int) ([]*models.Campaign, int, error) {
	offset := (page - 1) * limit
	if limit <= 0 {
		limit = 10
	}
	if offset < 0 {
		offset = 0
	}

	whereClause := "WHERE 1=1"
	args := []interface{}{}
	argIndex := 1

	if status != "" {
		whereClause += fmt.Sprintf(" AND status = $%d", argIndex)
		args = append(args, status)
		argIndex++
	}

	if featured != nil {
		whereClause += fmt.Sprintf(" AND featured = $%d", argIndex)
		args = append(args, *featured)
		argIndex++
	}

	// Count total
	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM campaigns %s", whereClause)
	var total int
	err := r.db.QueryRow(countQuery, args...).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	// Get campaigns
	query := fmt.Sprintf(`
		SELECT id, title, description, target_amount, photos, status, start_date, end_date, created_by, created_at, updated_at, featured
		FROM campaigns
		%s
		ORDER BY created_at DESC
		LIMIT $%d OFFSET $%d
	`, whereClause, argIndex, argIndex+1)

	args = append(args, limit, offset)
	rows, err := r.db.Query(query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	campaigns := []*models.Campaign{}
	for rows.Next() {
		campaign := &models.Campaign{}
		var photosJSON []byte
		var createdBy sql.NullString

		err := rows.Scan(
			&campaign.ID,
			&campaign.Title,
			&campaign.Description,
			&campaign.TargetAmount,
			&photosJSON,
			&campaign.Status,
			&campaign.StartDate,
			&campaign.EndDate,
			&createdBy,
			&campaign.CreatedAt,
			&campaign.UpdatedAt,
			&campaign.Featured,
		)
		if err != nil {
			return nil, 0, err
		}

		// Parse photos JSON
		if err := json.Unmarshal(photosJSON, &campaign.Photos); err != nil {
			campaign.Photos = []string{}
		}

		// Parse created_by
		if createdBy.Valid {
			userID, err := uuid.Parse(createdBy.String)
			if err == nil {
				campaign.CreatedBy = &userID
			}
		}

		campaigns = append(campaigns, campaign)
	}

	return campaigns, total, nil
}

func (r *CampaignRepository) UpdateCampaign(id uuid.UUID, updates map[string]interface{}) error {
	if len(updates) == 0 {
		return nil
	}

	setParts := []string{}
	args := []interface{}{}
	argIndex := 1

	for field, value := range updates {
		setParts = append(setParts, fmt.Sprintf("%s = $%d", field, argIndex))
		args = append(args, value)
		argIndex++
	}

	// Always update updated_at
	setParts = append(setParts, fmt.Sprintf("updated_at = $%d", argIndex))
	args = append(args, time.Now())
	argIndex++

	setClause := ""
	for i, part := range setParts {
		if i > 0 {
			setClause += ", "
		}
		setClause += part
	}

	query := fmt.Sprintf("UPDATE campaigns SET %s WHERE id = $%d", setClause, argIndex)
	args = append(args, id)

	_, err := r.db.Exec(query, args...)
	return err
}

func (r *CampaignRepository) UpdateCampaignPhotos(id uuid.UUID, photos []string) error {
	photosJSON, err := json.Marshal(photos)
	if err != nil {
		return fmt.Errorf("failed to marshal photos: %w", err)
	}

	query := `UPDATE campaigns SET photos = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`
	_, err = r.db.Exec(query, photosJSON, id)
	return err
}

func (r *CampaignRepository) GetCampaignSummary(campaignID uuid.UUID) (*models.CampaignSummary, error) {
	query := `
		SELECT id, campaign_id, total_raised, total_donors, last_updated
		FROM campaign_summary
		WHERE campaign_id = $1
	`
	summary := &models.CampaignSummary{}
	err := r.db.QueryRow(query, campaignID).Scan(
		&summary.ID,
		&summary.CampaignID,
		&summary.TotalRaised,
		&summary.TotalDonors,
		&summary.LastUpdated,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return summary, nil
}
