package database

import (
	"database/sql"
	"fmt"

	"github.com/careforall/pledge-service/internal/config"
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
		createPledgesTable,
		createOutboxTable,
	}

	for _, migration := range migrations {
		if _, err := db.Exec(migration); err != nil {
			return fmt.Errorf("failed to run migration: %w", err)
		}
	}

	return nil
}

const createPledgesTable = `
CREATE TYPE pledge_status AS ENUM ('AUTHORIZED', 'CAPTURED', 'COMPLETED', 'FAILED');

CREATE TABLE IF NOT EXISTS pledges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL,
    user_id UUID,
    amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
    status pledge_status NOT NULL DEFAULT 'AUTHORIZED',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pledges_campaign_id ON pledges(campaign_id);
CREATE INDEX IF NOT EXISTS idx_pledges_user_id ON pledges(user_id);
CREATE INDEX IF NOT EXISTS idx_pledges_status ON pledges(status);
CREATE INDEX IF NOT EXISTS idx_pledges_created_at ON pledges(created_at);
`

const createOutboxTable = `
CREATE TABLE IF NOT EXISTS outbox (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aggregate VARCHAR(255) NOT NULL,
    event_type VARCHAR(255) NOT NULL,
    payload TEXT NOT NULL,
    sent_flag BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_outbox_sent_flag ON outbox(sent_flag);
CREATE INDEX IF NOT EXISTS idx_outbox_created_at ON outbox(created_at);
`
