package main

import (
	"log"
	"os"

	"github.com/Huzaifa-314/klydos/user-service/internal/config"
	"github.com/Huzaifa-314/klydos/user-service/internal/database"
	"github.com/Huzaifa-314/klydos/user-service/internal/handlers"
	"github.com/Huzaifa-314/klydos/user-service/internal/middleware"
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

	// Initialize handlers
	userHandler := handlers.NewUserHandler(db)

	// Create auth middleware with db connection
	authMiddleware := middleware.RequireAuthWithDB(db)

	// Setup router
	router := gin.Default()

	// Routes
	api := router.Group("/users")
	{
		api.POST("/register", userHandler.Register)
		api.POST("/login", userHandler.Login)
		api.POST("/logout", authMiddleware, userHandler.Logout)
		api.GET("/me", authMiddleware, userHandler.GetMe)
		api.GET("/:id", userHandler.GetUser)
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("User Service starting on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
