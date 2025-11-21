package config

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	DatabaseURL    string
	Port           string
	UserServiceURL string
	AdminAPIKey    string
}

func LoadEnv() error {
	return godotenv.Load()
}

func GetDatabaseURL() string {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://postgres:postgres@localhost:5433/campaigns?sslmode=disable"
	}
	return dbURL
}

func GetPort() string {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}
	return port
}

func GetUserServiceURL() string {
	url := os.Getenv("USER_SERVICE_URL")
	if url == "" {
		url = "http://user-service:8080"
	}
	return url
}

func GetAdminAPIKey() string {
	return os.Getenv("ADMIN_API_KEY")
}

// UserServiceClient handles HTTP communication with User Service
type UserServiceClient struct {
	baseURL    string
	httpClient *http.Client
}

func NewUserServiceClient() *UserServiceClient {
	return &UserServiceClient{
		baseURL: GetUserServiceURL(),
		httpClient: &http.Client{
			Timeout: 5 * time.Second,
		},
	}
}

// ValidateUser checks if a user exists in User Service
func (c *UserServiceClient) ValidateUser(userID string) (bool, error) {
	url := fmt.Sprintf("%s/users/%s", c.baseURL, userID)

	resp, err := c.httpClient.Get(url)
	if err != nil {
		return false, fmt.Errorf("failed to call user service: %w", err)
	}
	defer resp.Body.Close()

	return resp.StatusCode == http.StatusOK, nil
}

// GetUser retrieves user details from User Service
func (c *UserServiceClient) GetUser(userID string) (map[string]interface{}, error) {
	url := fmt.Sprintf("%s/users/%s", c.baseURL, userID)

	resp, err := c.httpClient.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to call user service: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("user not found")
	}

	var user map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&user); err != nil {
		return nil, fmt.Errorf("failed to decode user response: %w", err)
	}

	return user, nil
}
