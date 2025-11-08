package controllers

import (
	"net/http"
	"strconv"

	"github.com/LucasPaulo001/Campus-Connect/src/config"
	"github.com/LucasPaulo001/Campus-Connect/src/models"
	"github.com/gin-gonic/gin"
)

// Criação de Postagens
func CreatePost(c *gin.Context){
	// Pegar id do usuário
	userId := c.GetUint("userId")

	// Etrutura temporária de postagens do body
	var body struct{
		Title 		string 	 `json:"title"`
		Content		string	 `json:"content"`
		Tags 		[]string `json:"tags"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Salvando Tags da postagem
	var tags []models.Tags
	for _, t := range body.Tags {
		var tag models.Tags
		if err := config.DB.Where("name = ?", t).First(&tag).Error; err != nil {
			tag = models.Tags{Name: t}
			config.DB.Create(&tag)
		}

		tags = append(tags, tag)
	}

	// Salvar Postagem
	post := models.Post{
		UserId: 	userId,
		Title: 		body.Title,
		Content: 	body.Content,
		Tags: 		tags,		
	}

	if err := config.DB.Create(&post).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao criar postagem.", "details": err.Error()})
	}

	c.JSON(http.StatusOK, post)

}

// Editar Postagem
func EditPost(c *gin.Context) {
	postId := c.Param("id")
	userId := c.GetUint("userId")

	// Converção do ID
	postIdInt, err := strconv.Atoi(postId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao converter Id."})
		return
	}

	// Dados da requisição
	var body struct{
		Title		string  `json:"title"`
		Content 	string	`json:"content"`
		Tags		[]string	`json:"tags"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	// Busca da postagem pelo ID
	var post models.Post
	if err := config.DB.Preload("Tags").First(&post, postIdInt).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Postagem não encontrada."})
		return
	}

	if post.ID != userId {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}

	// Salvar tags
	var tags []models.Tags
	for _, t := range body.Tags {
		var tag models.Tags
		if err := config.DB.Where("name = ?", t).First(&tag).Error; err != nil {
			tag = models.Tags{Name: t}
			config.DB.Create(&tag)
		}

		tags = append(tags, tag)
	}

	if err := config.DB.Model(&post).Updates(models.Post{
		Title: body.Title,
		Content: body.Content,
	}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao editar postagem."})
		return
	}

	if err := config.DB.Model(&post).Association("Tags").Replace(tags); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar as Tags"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Postagem editada com sucesso.",
		"post": post,
	})

}

// Listagem de postagens do usuário
func GetPosts(c *gin.Context){
	userId := c.GetUint("userId")

	var posts []models.Post

	if err := config.DB.Preload("Tags").Preload("User").
		Where("user_id = ?", userId).
		Order("created_at desc").
		Find(&posts).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar posts"})
			return
		}
		
	c.JSON(http.StatusOK, posts)
}
