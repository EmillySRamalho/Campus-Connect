package handlers

import (
	"net/http"
	"strconv"

	"github.com/LucasPaulo001/Campus-Connect/internal/models"
	config "github.com/LucasPaulo001/Campus-Connect/internal/repository"
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
		UserID: 	userId,
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
		Title		string  	`json:"title"`
		Content 	string		`json:"content"`
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
		c.JSON(http.StatusForbidden, gin.H{"error": "Permissão de edição negada."})
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

// Excluir postagem
func DeletePost(c *gin.Context) {
	postIdStr := c.Param("id")

	var postId uint

	if id, err := strconv.ParseUint(postIdStr, 10, 32); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Id inválido."})
		return
	} else {
		postId = uint(id)
	}

	if err := config.DB.Where("post_id = ?", postId).Delete(&models.Comment{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao deletar comentários."})
		return
	}

	if err := config.DB.Exec("DELETE FROM post_tags WHERE post_id = ?", postId).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao deletar tags associadas."})
		return
	}

	result := config.DB.Delete(&models.Post{}, postId)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao deletar postagem."})
		return
	}

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Postagem não encontrada."})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Postagem deletada com sucesso."})

}

// Listagem de postagens do usuário
func GetPostsUser(c *gin.Context) {
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

//Listagem de postagem do feed
func GetPosts(c *gin.Context) {

	var posts []models.Post

	if err := config.DB.Preload("User").Find(&posts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao listar postagens"})
		return
	}

	c.JSON(http.StatusOK, posts)

}


