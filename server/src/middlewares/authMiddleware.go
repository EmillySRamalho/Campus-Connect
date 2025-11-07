package middlewares

import (
	"net/http"
	"os"
	"strings"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)


func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := strings.TrimSpace(strings.TrimPrefix(c.GetHeader("Authorization"), "Bearer"))
		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token não encontrado."})
			c.Abort()
			return
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("JWT_SECRET")), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token inválido.", "detail": err.Error()})
			c.Abort()
			return
		}

		claims := token.Claims.(jwt.MapClaims)
		userId := uint(claims["id"].(float64))

		c.Set("userId", userId)


		c.Next()
	}
}