package handlers

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/LucasPaulo001/Campus-Connect/internal/dto"
	"github.com/LucasPaulo001/Campus-Connect/internal/models"
	config "github.com/LucasPaulo001/Campus-Connect/internal/repository"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
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

	if post.UserID != userId {
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

	// Buscar postagem
	var post models.Post
	if err := config.DB.First(&post, postId).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Erro ao deletar comentários.", 
			"details": err.Error(),
		})
		return
	}

	// Verificar se é o dono da postagem
	userId := c.GetUint("userId")
	if post.UserID != userId {
		c.JSON(http.StatusNotFound, gin.H{"error": "Você não tem permissão para deletar essa postagem"})
		return
	}


	// Deletar o post
	if err := config.DB.Delete(&models.Post{}, postId).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Erro ao deletar postagem.",
			"details": err.Error(),
		})
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
		
	var response []dto.PostResponse

	for _, post := range posts {
		// contar likes
		var likesCount int64
		config.DB.
			Model(&models.LikePost{}).
			Where("post_id = ?", post.ID).
			Count(&likesCount)

		// verificar se o próprio usuário curtiu
		var liked bool
		var like models.LikePost
		err := config.DB.
			Where("post_id = ? AND user_id = ?", post.ID, userId).
			First(&like).Error

		liked = err == nil

		response = append(response, dto.PostResponse{
			ID:      post.ID,
			Title:   post.Title,
			Content: post.Content,
			User: dto.UserInfo{
				ID:    post.User.ID,
				Name:  post.User.Name,
				Email: post.User.Email,
				Role:  post.User.Role,
				Bio:   post.User.Bio,
			},
			LikesCount: likesCount,
			LikedByMe:  liked,
			Tags: post.Tags,
			CreatedAt:  post.CreatedAt,
		})
	}

	c.JSON(http.StatusOK, response)
}

//Listagem de postagem do feed
func GetPosts(c *gin.Context) {
	limit := 10

	if l := c.Query("limit"); l != "" {
		fmt.Sscan(l, &limit)
	}

	cursor := c.Query("cursor")

	var posts []models.Post

	query := config.DB.
		Preload("Tags").
		Preload("User").
		Order("created_at DESC").
		Limit(limit)

	// Cursor pagination
	if cursor != "" {
		if t, err := time.Parse(time.RFC3339, cursor);err != nil {
			query = query.Where("created_at < ?", t)
		}
	}

	if err := query.Find(&posts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao listar postagens."})
		return
	}

	userId := c.GetUint("userId")

	var response []dto.PostResponse

	for _, post := range posts {
		
		// Contar likes
		var likesCount int64

		config.DB.
			Model(&models.LikePost{}).
			Where("post_id = ?", post.ID).
			Count(&likesCount)

		// Verificando se o usuário curtiu
		liked := false

		if userId != 0 {
			var l models.LikePost
			err := config.DB.
				Where("post_id = ? AND user_id = ?", post.ID, userId).
				First(&l).Error

				liked = err == nil
		}

		response = append(response, dto.PostResponse{
			ID:      post.ID,
			Title:   post.Title,
			Content: post.Content,
			User: dto.UserInfo{
				ID:    post.User.ID,
				Name:  post.User.Name,
				Email: post.User.Email,
				Role:  post.User.Role,
			},
			LikesCount: likesCount,
			LikedByMe:  liked,
			Tags: post.Tags,
			CreatedAt:  post.CreatedAt,
		})
	}
	nextCursor := ""
	if len(posts) > 0 {
		nextCursor = posts[len(posts)-1].CreatedAt.Format(time.RFC3339)
	}

	c.JSON(http.StatusOK, gin.H{
		"data": 			response,
		"next_cursor": 		nextCursor,
		"has_more": 		len(posts) == limit,
	})

}

// Salvar postagens
func Saved_Post(c *gin.Context) {
	userId := c.GetUint("userId")

	postIdStr := c.Param("id")

	postId, err := strconv.ParseUint(postIdStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Erro ao converter Id de postagem."})
		return
	}

	// Buscando usuário
	var user models.User
	if err := config.DB.First(&user, userId).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuário não encontrado."})
		return
	}

	// Verificando se já salvou a postagem
	var exists models.Saved_Posts
	err = config.DB.
		Where("user_id = ? AND post_id = ?", userId, uint(postId)).
		First(&exists).Error

	if err == nil {
		config.DB.Delete(&exists)
		c.JSON(http.StatusOK, gin.H{"message": "Postagem removida dos salvos"})
		return
	}

	if !errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao verificar salvamentos."})
        return
	}

	newSaved := models.Saved_Posts{
		UserID:  	userId,
		PostID:  	uint(postId),
	}

	if err := config.DB.Create(&newSaved).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Postagem salva com sucesso."})
}

// Listar postagens salvas
func ListSavedPosts(c *gin.Context) {
	userId := c.GetUint("userId")

    var posts []models.Post
    if err := config.DB.
		Joins("JOIN saved_posts sp ON sp.post_id = posts.id").
		Where("sp.user_id = ?", userId).
		Preload("User").
		Preload("Tags").
		Order("sp.created_at DESC").
		Find(&posts).Error; err != nil {

        c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar posts salvos.", "details": err.Error()})
        return
    }

	var response []dto.PostResponse

	for _, post := range posts {
		// contar likes
		var likesCount int64
		config.DB.
			Model(&models.LikePost{}).
			Where("post_id = ?", post.ID).
			Count(&likesCount)

		// verificar se o próprio usuário curtiu
		var liked bool
		var like models.LikePost
		err := config.DB.
			Where("post_id = ? AND user_id = ?", post.ID, userId).
			First(&like).Error

		liked = err == nil

		response = append(response, dto.PostResponse{
			ID:      post.ID,
			Title:   post.Title,
			Content: post.Content,
			User: dto.UserInfo{
				ID:    post.User.ID,
				Name:  post.User.Name,
				Email: post.User.Email,
				Role:  post.User.Role,
				Bio:   post.User.Bio,
			},
			LikesCount: likesCount,
			LikedByMe:  liked,
			Tags: post.Tags,
			CreatedAt:  post.CreatedAt,
		})
	}

    c.JSON(http.StatusOK, gin.H{"posts": response})
}


