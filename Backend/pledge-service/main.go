package main

import (
	"log"
	"os"

	"github.com/careforall/pledge-service/internal/config"
	"github.com/careforall/pledge-service/internal/database"
	"github.com/careforall/pledge-service/internal/handlers"
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

	// Initialize HTTP clients for inter-service communication
	campaignServiceClient := config.NewCampaignServiceClient()
	userServiceClient := config.NewUserServiceClient()

	// Initialize handlers
	pledgeHandler := handlers.NewPledgeHandler(db, campaignServiceClient, userServiceClient)

	// Setup router
	router := gin.Default()

	// Routes
	api := router.Group("/campaigns")
	{
		api.POST("/:id/pledge", pledgeHandler.CreatePledge)
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8082"
	}

	log.Printf("Pledge Service starting on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
