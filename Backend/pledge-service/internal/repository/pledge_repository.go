package repository

import (
	"database/sql"
	"fmt"

	"github.com/careforall/pledge-service/internal/models"
	"github.com/google/uuid"
)

type PledgeRepository struct {
	db *sql.DB
}

func NewPledgeRepository(db *sql.DB) *PledgeRepository {
	return &PledgeRepository{db: db}
}

func (r *PledgeRepository) CreatePledge(pledge *models.Pledge) error {
	query := `
		INSERT INTO pledges (id, campaign_id, user_id, amount, status, created_at)
		VALUES ($1, $2, $3, $4, $5, $6)
	`
	_, err := r.db.Exec(query,
		pledge.ID,
		pledge.CampaignID,
		pledge.UserID,
		pledge.Amount,
		pledge.Status,
		pledge.CreatedAt,
	)
	return err
}

func (r *PledgeRepository) GetPledgeByID(id uuid.UUID) (*models.Pledge, error) {
	query := `
		SELECT id, campaign_id, user_id, amount, status, created_at
		FROM pledges
		WHERE id = $1
	`
	pledge := &models.Pledge{}
	var userID sql.NullString

	err := r.db.QueryRow(query, id).Scan(
		&pledge.ID,
		&pledge.CampaignID,
		&userID,
		&pledge.Amount,
		&pledge.Status,
		&pledge.CreatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	// Parse user_id
	if userID.Valid {
		uid, err := uuid.Parse(userID.String)
		if err == nil {
			pledge.UserID = &uid
		}
	}

	return pledge, nil
}

func (r *PledgeRepository) UpdatePledgeStatus(id uuid.UUID, status models.PledgeStatus) error {
	query := `UPDATE pledges SET status = $1 WHERE id = $2`
	_, err := r.db.Exec(query, status, id)
	return err
}

func (r *PledgeRepository) GetPledgesByCampaign(campaignID uuid.UUID) ([]*models.Pledge, error) {
	query := `
		SELECT id, campaign_id, user_id, amount, status, created_at
		FROM pledges
		WHERE campaign_id = $1
		ORDER BY created_at DESC
	`
	rows, err := r.db.Query(query, campaignID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	pledges := []*models.Pledge{}
	for rows.Next() {
		pledge := &models.Pledge{}
		var userID sql.NullString

		err := rows.Scan(
			&pledge.ID,
			&pledge.CampaignID,
			&userID,
			&pledge.Amount,
			&pledge.Status,
			&pledge.CreatedAt,
		)
		if err != nil {
			return nil, err
		}

		// Parse user_id
		if userID.Valid {
			uid, err := uuid.Parse(userID.String)
			if err == nil {
				pledge.UserID = &uid
			}
		}

		pledges = append(pledges, pledge)
	}

	return pledges, nil
}

// Outbox operations for Transactional Outbox pattern

func (r *PledgeRepository) CreateOutboxEvent(event *models.OutboxEvent) error {
	query := `
		INSERT INTO outbox (id, aggregate, event_type, payload, sent_flag, created_at)
		VALUES ($1, $2, $3, $4, $5, $6)
	`
	_, err := r.db.Exec(query,
		event.ID,
		event.Aggregate,
		event.EventType,
		event.Payload,
		event.SentFlag,
		event.CreatedAt,
	)
	return err
}

func (r *PledgeRepository) GetUnsentEvents() ([]*models.OutboxEvent, error) {
	query := `
		SELECT id, aggregate, event_type, payload, sent_flag, created_at
		FROM outbox
		WHERE sent_flag = false
		ORDER BY created_at ASC
		LIMIT 100
	`
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	events := []*models.OutboxEvent{}
	for rows.Next() {
		event := &models.OutboxEvent{}
		err := rows.Scan(
			&event.ID,
			&event.Aggregate,
			&event.EventType,
			&event.Payload,
			&event.SentFlag,
			&event.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		events = append(events, event)
	}

	return events, nil
}

func (r *PledgeRepository) MarkEventAsSent(eventID uuid.UUID) error {
	query := `UPDATE outbox SET sent_flag = true WHERE id = $1`
	_, err := r.db.Exec(query, eventID)
	return err
}

// Transaction helper for creating pledge and outbox event atomically
func (r *PledgeRepository) CreatePledgeWithEvent(pledge *models.Pledge, event *models.OutboxEvent) error {
	tx, err := r.db.Begin()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback()

	// Insert pledge
	pledgeQuery := `
		INSERT INTO pledges (id, campaign_id, user_id, amount, status, created_at)
		VALUES ($1, $2, $3, $4, $5, $6)
	`
	_, err = tx.Exec(pledgeQuery,
		pledge.ID,
		pledge.CampaignID,
		pledge.UserID,
		pledge.Amount,
		pledge.Status,
		pledge.CreatedAt,
	)
	if err != nil {
		return fmt.Errorf("failed to create pledge: %w", err)
	}

	// Insert outbox event
	outboxQuery := `
		INSERT INTO outbox (id, aggregate, event_type, payload, sent_flag, created_at)
		VALUES ($1, $2, $3, $4, $5, $6)
	`
	_, err = tx.Exec(outboxQuery,
		event.ID,
		event.Aggregate,
		event.EventType,
		event.Payload,
		event.SentFlag,
		event.CreatedAt,
	)
	if err != nil {
		return fmt.Errorf("failed to create outbox event: %w", err)
	}

	return tx.Commit()
}
