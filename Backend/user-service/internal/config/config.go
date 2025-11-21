package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DatabaseURL string
	Port        string
}

func LoadEnv() error {
	return godotenv.Load()
}

func GetDatabaseURL() string {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		// Default connection string for local development
		dbURL = "postgres://postgres:postgres@localhost:5432/users?sslmode=disable"
	}
	return dbURL
}

func GetPort() string {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	return port
}
