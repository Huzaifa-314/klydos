package repository

import (
	"database/sql"
	"time"

	"github.com/careforall/user-service/internal/models"
	"github.com/google/uuid"
)

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) CreateUser(user *models.User) error {
	query := `
		INSERT INTO users (id, name, email, password_hash, created_at)
		VALUES ($1, $2, $3, $4, $5)
	`
	_, err := r.db.Exec(query, user.ID, user.Name, user.Email, user.PasswordHash, user.CreatedAt)
	return err
}

func (r *UserRepository) GetUserByEmail(email string) (*models.User, error) {
	query := `
		SELECT id, name, email, password_hash, created_at
		FROM users
		WHERE email = $1
	`
	user := &models.User{}
	err := r.db.QueryRow(query, email).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.PasswordHash,
		&user.CreatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (r *UserRepository) GetUserByID(id uuid.UUID) (*models.User, error) {
	query := `
		SELECT id, name, email, password_hash, created_at
		FROM users
		WHERE id = $1
	`
	user := &models.User{}
	err := r.db.QueryRow(query, id).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.PasswordHash,
		&user.CreatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (r *UserRepository) CreateSession(session *models.Session) error {
	query := `
		INSERT INTO sessions (id, user_id, token, expires_at, created_at)
		VALUES ($1, $2, $3, $4, $5)
	`
	_, err := r.db.Exec(query, session.ID, session.UserID, session.Token, session.ExpiresAt, session.CreatedAt)
	return err
}

func (r *UserRepository) GetSessionByToken(token string) (*models.Session, error) {
	query := `
		SELECT id, user_id, token, expires_at, created_at
		FROM sessions
		WHERE token = $1 AND expires_at > $2
	`
	session := &models.Session{}
	err := r.db.QueryRow(query, token, time.Now()).Scan(
		&session.ID,
		&session.UserID,
		&session.Token,
		&session.ExpiresAt,
		&session.CreatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return session, nil
}

func (r *UserRepository) DeleteSession(token string) error {
	query := `DELETE FROM sessions WHERE token = $1`
	_, err := r.db.Exec(query, token)
	return err
}

func (r *UserRepository) CleanExpiredSessions() error {
	query := `DELETE FROM sessions WHERE expires_at < $1`
	_, err := r.db.Exec(query, time.Now())
	return err
}
