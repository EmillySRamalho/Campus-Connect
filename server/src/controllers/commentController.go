package controllers

import (
	"net/http"
	"strconv"

	"github.com/LucasPaulo001/Campus-Connect/src/config"
	"github.com/LucasPaulo001/Campus-Connect/src/models"
	"github.com/gin-gonic/gin"
)

// Criar um comentário em um post
func CreateComment(c *gin.Context){
	userId := c.GetUint("userId")
	postId := c.Param("id")

	postIdUint, err := strconv.Atoi(postId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Erro ao converter ID."})
	}

	var body struct {
		Content	 string	 `json:"content"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Conteúdo inválido."})
		return
	}

	var post models.Post
	if err := config.DB.First(&post, postIdUint).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Postagem não encontrada."})
		return
	}

	comment := models.Comment{
		UserID: userId,
		PostID: post.ID,
		Content: body.Content,
	}

	if err := config.DB.Create(&comment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao criar comentário."})
		return
	}

	if err := config.DB.Preload("User").First(&comment, comment.ID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar comentário."})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Comentário criado com sucesso.",
		"comment": comment,
	})
}

// Editar comentário
func EditComment(c *gin.Context) {
	commentId := c.Param("id")
	userId := c.GetUint("userId")

	commentIdInt, err := strconv.Atoi(commentId)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erroa o converter Id"})
		return
	}

	var body struct {
		Content  string	 `json:"content"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var comment models.Comment
	if err := config.DB.Preload("User").First(&comment, commentIdInt).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Comentário não encontrado."})
		return
	}

	if comment.ID != userId {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}

	if err := config.DB.Model(&comment).Updates(models.Comment{
		Content: body.Content,
	}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar comentário."})
		return
	}

	config.DB.Preload("User").First(&comment, commentIdInt)
	
	c.JSON(http.StatusOK, gin.H{
		"message": "Comentário atualizado com sucesso.",
		"comment": comment,
	})
}

// Listar comentários da publicação
func GetComments(c *gin.Context) {
	postId := c.Param("id")

	postIdInt, err := strconv.Atoi(postId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Erro ao converter Id."})
		return
	}

	var comments []models.Comment
	if err := config.DB.
		Preload("User").
		Where("post_id = ?", postIdInt).
		Order("created_at desc").
		Find(&comments).Error; err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar comentários."})
		return
	}

		
	c.JSON(http.StatusOK, comments)

}


