package main

import (
	"log"
	"os"
	"github.com/LucasPaulo001/Campus-Connect/src/config"
	"github.com/LucasPaulo001/Campus-Connect/src/models"
	"github.com/LucasPaulo001/Campus-Connect/src/routes"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main(){
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Erro ao carregar arquivo .env")
	}

	config.ConnectDatabase()
	config.DB.AutoMigrate(
		&models.User{}, 
		&models.Post{}, 
		&models.Tags{}, 
		&models.Comment{},
		&models.LikePost{},
		&models.LikeComment{},
	)

	router := gin.Default()
	routes.SetupRoutes(router)

	PORT := os.Getenv("PORT")
	router.Run(":"+PORT)
}