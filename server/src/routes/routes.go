package routes

import (
	"github.com/LucasPaulo001/Campus-Connect/src/controllers"
	"github.com/LucasPaulo001/Campus-Connect/src/middlewares"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine){
	r.POST("/register", controllers.Register)
	r.POST("/login", controllers.Login)

	auth := r.Group("/api")
	auth.Use(middlewares.Auth())
	auth.GET("/profile", controllers.Profile)
}