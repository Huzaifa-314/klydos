package middleware

import (
	"database/sql"
	"net/http"
	"strings"

	"github.com/Huzaifa-314/klydos/user-service/internal/repository"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// RequireAuthWithDB validates the session token and attaches user info to context
// If token is invalid/missing, returns 401
// If token is valid, sets "user_id" and "token" in context
func RequireAuthWithDB(db *sql.DB) gin.HandlerFunc {
	userRepo := repository.NewUserRepository(db)

	return func(c *gin.Context) {
		// Get token from Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		// Extract Bearer token
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Authorization header format. Use: Bearer <token>"})
			c.Abort()
			return
		}

		token := parts[1]

		// Validate session
		session, err := userRepo.GetSessionByToken(token)
		if err != nil || session == nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		// Set user info in context
		c.Set("user_id", session.UserID)
		c.Set("token", token)
		c.Next()
	}
}

// RequireAuth validates the session token - requires db to be set in context
// This is an alternative approach if you want to pass db through context
func RequireAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get database from context
		db, exists := c.Get("db")
		if !exists {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection not found"})
			c.Abort()
			return
		}

		sqlDB, ok := db.(*sql.DB)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid database connection type"})
			c.Abort()
			return
		}

		// Use RequireAuthWithDB logic
		userRepo := repository.NewUserRepository(sqlDB)

		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Authorization header format. Use: Bearer <token>"})
			c.Abort()
			return
		}

		token := parts[1]

		session, err := userRepo.GetSessionByToken(token)
		if err != nil || session == nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		c.Set("user_id", session.UserID)
		c.Set("token", token)
		c.Next()
	}
}

// OptionalAuthWithDB validates token if present but doesn't require it
// Sets user_id if token is valid, otherwise continues as guest
// Used for endpoints that support both authenticated and guest access
func OptionalAuthWithDB(db *sql.DB) gin.HandlerFunc {
	userRepo := repository.NewUserRepository(db)

	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.Next()
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.Next()
			return
		}

		token := parts[1]
		session, err := userRepo.GetSessionByToken(token)
		if err == nil && session != nil {
			c.Set("user_id", session.UserID)
			c.Set("token", token)
		}

		c.Next()
	}
}

// Helper to get user ID from context
func GetUserID(c *gin.Context) (uuid.UUID, bool) {
	userID, exists := c.Get("user_id")
	if !exists {
		return uuid.Nil, false
	}

	userIDUUID, ok := userID.(uuid.UUID)
	return userIDUUID, ok
}
