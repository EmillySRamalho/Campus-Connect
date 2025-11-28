package main

import (
	"log"
	"os"
	"time"

	seed "github.com/LucasPaulo001/Campus-Connect/cmd/seeds"
	"github.com/LucasPaulo001/Campus-Connect/internal/api/routes"
	"github.com/LucasPaulo001/Campus-Connect/internal/models"
	config "github.com/LucasPaulo001/Campus-Connect/internal/repository"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main(){
	if err := godotenv.Load(); err == nil {
		log.Println("Arquivo .env carregado com sucesso.")
	} else {
		log.Println("Rodando sem .env (Render usa variáveis de ambiente).")
	}


	config.ConnectDatabase()
	config.DB.AutoMigrate(
		&models.User{}, 
		&models.Post{}, 
		&models.Saved_Posts{},
		&models.Tags{}, 
		&models.Comment{},
		&models.Resp_Comment{},
		&models.LikePost{},
		&models.LikeComment{},
		&models.Group{},
		&models.Member{},
		&models.Teacher{},
		&models.Student{},
		&models.PasswordReset{},
		&models.PostTag{},
	)

	if os.Getenv("RUN_SEED") == "true" {
        seed.Run()
    }

	router := gin.Default()

	corsConfig(router)

	routes.SetupRoutes(router)

	PORT := os.Getenv("PORT")
	if PORT == "" {
		PORT = "3000"
	}
	router.Run(":"+PORT)
}

func corsConfig(router *gin.Engine) {
	router.Use(cors.New(cors.Config{
		AllowOrigins: 	[]string{
			"http://localhost:5173",     // Vite
        	"http://localhost:3000",     // Next.js local
			"https://campus-connect-chi-kohl.vercel.app", // Vercel
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
    	AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
    	ExposeHeaders:    []string{"Content-Length"},
    	AllowCredentials: true,
    	MaxAge:           12 * time.Hour,
	}))
}
