package utils

import (
	"os"
	"time"
	"github.com/golang-jwt/jwt/v5"
)


func GenerateToken(userId uint, role string) (string, error) {
	claims := jwt.MapClaims{
		"id": userId,
		"role": role,
		"exp": time.Now().Add(time.Hour * 24).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}
