package middlewares

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func AuthorizeRole(allowedRole ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole := c.GetString("userRole")

		for _, role := range allowedRole {
			if role == userRole {
				c.Next()
				return 
			}
		}

		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
			"error": "acesso negado",
		})
	}
}