package middleware

import (
	"net/http"

	"github.com/Huzaifa-314/klydos/campaign-service/internal/config"
	"github.com/gin-gonic/gin"
)

// RequireAdminAPIKey validates the X-API-Key header for admin endpoints
func RequireAdminAPIKey() gin.HandlerFunc {
	return func(c *gin.Context) {
		apiKey := c.GetHeader("X-API-Key")
		expectedKey := config.GetAdminAPIKey()

		// If no API key is configured, allow access (for development)
		if expectedKey == "" {
			c.Next()
			return
		}

		if apiKey == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "X-API-Key header required"})
			c.Abort()
			return
		}

		if apiKey != expectedKey {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid API key"})
			c.Abort()
			return
		}

		c.Next()
	}
}
