package main

import (
	"log"
	"os"

	"github.com/Huzaifa-314/klydos/campaign-service/internal/config"
	"github.com/Huzaifa-314/klydos/campaign-service/internal/database"
	"github.com/Huzaifa-314/klydos/campaign-service/internal/handlers"
	"github.com/Huzaifa-314/klydos/campaign-service/internal/middleware"
	"github.com/gin-gonic/gin"
)

func main() {
	// Load environment variables
	if err := config.LoadEnv(); err != nil {
		log.Printf("Warning: .env file not found, using environment variables: %v", err)
	}

	// Initialize database
	db, err := database.NewConnection()
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Run migrations
	if err := database.RunMigrations(db); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	// Initialize HTTP client for User Service
	userServiceClient := config.NewUserServiceClient()

	// Initialize handlers
	campaignHandler := handlers.NewCampaignHandler(db, userServiceClient)

	// Create middleware
	adminMiddleware := middleware.RequireAdminAPIKey()

	// Setup router
	router := gin.Default()

	// Public routes
	api := router.Group("/campaigns")
	{
		api.GET("", campaignHandler.ListCampaigns)
		api.GET("/:id", campaignHandler.GetCampaign)
	}

	// Admin routes (require API key)
	admin := router.Group("/campaigns")
	admin.Use(adminMiddleware)
	{
		admin.POST("", campaignHandler.CreateCampaign)
		admin.PUT("/:id", campaignHandler.UpdateCampaign)
		admin.PATCH("/:id/status", campaignHandler.UpdateCampaignStatus)
		admin.POST("/:id/photos", campaignHandler.UploadPhotos)
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	log.Printf("Campaign Service starting on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
