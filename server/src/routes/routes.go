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
	auth.PATCH("/profile", controllers.EditUserData)

	auth.POST("/posts", controllers.CreatePost)
	auth.GET("/posts", controllers.GetPosts)
	auth.PATCH("/post/:id", controllers.EditPost)
	auth.POST("/post/like", controllers.LikePost)
	auth.DELETE("/post/unlike", controllers.UnLikePost)
	
	auth.POST("/post/:id/comments", controllers.CreateComment)
	auth.PUT("/comment/:id", controllers.EditComment)
	auth.GET("/post/:id/comments", controllers.GetComments)
	auth.POST("/comment/like", controllers.LikeComments)
	auth.DELETE("/comment/unlike", controllers.UnlikeComment)
}