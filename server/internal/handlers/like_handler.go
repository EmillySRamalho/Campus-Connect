package controllers

import (
	"net/http"

	"github.com/LucasPaulo001/Campus-Connect/internal/models"
	config "github.com/LucasPaulo001/Campus-Connect/internal/repository"
	"github.com/gin-gonic/gin"
)

// Curtir postagens
func LikePost(c *gin.Context) {
	var input struct {
		UserID	uint  `json:"user_id"`
		PostID  uint  `json:"post_id"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var existing models.LikePost
	result := config.DB.Where("user_id = ? AND post_id = ?", input.UserID, input.PostID).
	First(&existing); 

	if result.RowsAffected > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Você já curtiu esse post"})
		return
	}

	like := models.LikePost{
		UserId: input.UserID,
		PostId: input.PostID,
	}
	config.DB.Create(&like)

	c.JSON(http.StatusCreated, gin.H{
		"message": "Post curtido com sucesso.",
	})
}

// Retirar curtidas
func UnLikePost(c *gin.Context){
	var input struct {
		UserID	 uint   `json:"user_id"`
		PostID   uint   `json:"post_id"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	config.DB.Where("user_id = ? AND post_id = ?", input.UserID, input.PostID).Delete(models.LikePost{})
	c.JSON(http.StatusOK, gin.H{"message": "Post descurtido com sucesso!"})
}

// Curtir comentários
func LikeComments(c *gin.Context){
	var input struct {
		UserID   	uint   `json:"user_id"`
		CommentID   uint   `json:"comment_id"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var existing models.LikeComment
	result := config.DB.Where("user_id = ? AND comment_id = ?", input.UserID, input.CommentID).
		First(&existing)

	if result.RowsAffected > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Você já curtiu esse comentário."})
		return
	}

	like := models.LikeComment{
		UserID: input.UserID,
		CommentID: input.CommentID,
	}

	config.DB.Create(&like)
	c.JSON(http.StatusCreated, gin.H{
		"message": "Comentário curtido com sucesso.",
	})
}

// Retirar curtida de comentários
func UnlikeComment(c *gin.Context){
	var input struct {
		UserID	    uint   `json:"user_id"`
		CommentID   uint   `json:"comment_id"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	config.DB.Where("user_id = ? AND comment_id = ?", input.UserID, input.CommentID).Delete(models.LikeComment{})
	c.JSON(http.StatusOK, gin.H{"message": "Comentário descurtido com sucesso!"})
}
