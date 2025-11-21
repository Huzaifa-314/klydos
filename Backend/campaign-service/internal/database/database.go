package database

import (
	"database/sql"
	"fmt"

	"github.com/Huzaifa-314/klydos/campaign-service/internal/config"
	_ "github.com/lib/pq"
)

func NewConnection() (*sql.DB, error) {
	dbURL := config.GetDatabaseURL()
	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		return nil, fmt.Errorf("failed to open database connection: %w", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	return db, nil
}

func RunMigrations(db *sql.DB) error {
	migrations := []string{
		createCampaignsTable,
		createCampaignSummaryTable,
	}

	for _, migration := range migrations {
		if _, err := db.Exec(migration); err != nil {
			return fmt.Errorf("failed to run migration: %w", err)
		}
	}

	return nil
}

const createCampaignsTable = `
CREATE TYPE campaign_status AS ENUM ('draft', 'active', 'completed');

CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    target_amount DECIMAL(15, 2) NOT NULL CHECK (target_amount > 0),
    photos JSONB DEFAULT '[]'::jsonb,
    status campaign_status NOT NULL DEFAULT 'draft',
    start_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP NOT NULL,
    created_by UUID,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    featured BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT valid_dates CHECK (end_date > start_date)
);

CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_by ON campaigns(created_by);
CREATE INDEX IF NOT EXISTS idx_campaigns_featured ON campaigns(featured);
CREATE INDEX IF NOT EXISTS idx_campaigns_end_date ON campaigns(end_date);
`

const createCampaignSummaryTable = `
CREATE TABLE IF NOT EXISTS campaign_summary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL UNIQUE REFERENCES campaigns(id) ON DELETE CASCADE,
    total_raised DECIMAL(15, 2) NOT NULL DEFAULT 0 CHECK (total_raised >= 0),
    total_donors INTEGER NOT NULL DEFAULT 0 CHECK (total_donors >= 0),
    last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_campaign_summary_campaign_id ON campaign_summary(campaign_id);
`
