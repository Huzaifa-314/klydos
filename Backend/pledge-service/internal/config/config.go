package config

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"
)

func LoadEnv() error {
	return godotenv.Load()
}

func GetDatabaseURL() string {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://postgres:postgres@localhost:5434/pledges?sslmode=disable"
	}
	return dbURL
}

func GetPort() string {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8082"
	}
	return port
}

func GetCampaignServiceURL() string {
	url := os.Getenv("CAMPAIGN_SERVICE_URL")
	if url == "" {
		url = "http://campaign-service:8081"
	}
	return url
}

func GetUserServiceURL() string {
	url := os.Getenv("USER_SERVICE_URL")
	if url == "" {
		url = "http://user-service:8080"
	}
	return url
}

// CampaignServiceClient handles HTTP communication with Campaign Service
type CampaignServiceClient struct {
	baseURL    string
	httpClient *http.Client
}

func NewCampaignServiceClient() *CampaignServiceClient {
	return &CampaignServiceClient{
		baseURL: GetCampaignServiceURL(),
		httpClient: &http.Client{
			Timeout: 5 * time.Second,
		},
	}
}

// ValidateCampaign checks if a campaign exists and is active
func (c *CampaignServiceClient) ValidateCampaign(campaignID string) (bool, string, error) {
	url := fmt.Sprintf("%s/campaigns/%s", c.baseURL, campaignID)

	resp, err := c.httpClient.Get(url)
	if err != nil {
		return false, "", fmt.Errorf("failed to call campaign service: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return false, "", nil
	}

	var campaign map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&campaign); err != nil {
		return false, "", fmt.Errorf("failed to decode campaign response: %w", err)
	}

	status, ok := campaign["status"].(string)
	if !ok {
		return false, "", fmt.Errorf("invalid campaign status format")
	}

	return true, status, nil
}

// GetCampaign retrieves campaign details
func (c *CampaignServiceClient) GetCampaign(campaignID string) (map[string]interface{}, error) {
	url := fmt.Sprintf("%s/campaigns/%s", c.baseURL, campaignID)

	resp, err := c.httpClient.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to call campaign service: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("campaign not found")
	}

	var campaign map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&campaign); err != nil {
		return nil, fmt.Errorf("failed to decode campaign response: %w", err)
	}

	return campaign, nil
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
