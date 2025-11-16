package routes

import (
	"github.com/LucasPaulo001/Campus-Connect/internal/api/middlewares"
	"github.com/LucasPaulo001/Campus-Connect/internal/handlers"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine){
	r.POST("/register", handlers.Register)
	r.POST("/login", handlers.Login)

	auth := r.Group("/api")
	auth.Use(middlewares.Auth())

	auth.GET("/profile", handlers.Profile)
	auth.PATCH("/profile", handlers.EditUserData)
	r.POST("/forgout/pass", handlers.ForgotPassword)

	auth.POST("/posts", middlewares.AuthorizeRole("admin", "professor"), handlers.CreatePost)
	auth.GET("/posts", handlers.GetPostsUser)
	auth.GET("/feed", handlers.GetPosts)
	auth.PATCH("/post/:id", handlers.EditPost)
	auth.POST("/post/like", handlers.LikePost)
	auth.DELETE("/post/:id", handlers.DeletePost)
	auth.DELETE("/post/unlike", handlers.UnLikePost)
	
	auth.POST("/post/:id/comments", handlers.CreateComment)
	auth.PUT("/comment/:id", handlers.EditComment)
	auth.GET("/post/:id/comments", handlers.GetComments)
	auth.POST("/comment/like", handlers.LikeComments)
	auth.DELETE("/comment/unlike", handlers.UnlikeComment)

	auth.POST("/become/teacher", handlers.BecomeTeacher)
	auth.POST("/group/create", middlewares.AuthorizeRole("professor"), handlers.CreateGroup)
	auth.DELETE("/group/delete/:id", middlewares.AuthorizeRole("professor"), handlers.DeleteGroup)
	auth.PATCH("/group/edit/:id", middlewares.AuthorizeRole("professor"), handlers.EditGroup)
}