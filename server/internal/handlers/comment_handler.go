package handlers

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/LucasPaulo001/Campus-Connect/internal/dto"
	"github.com/LucasPaulo001/Campus-Connect/internal/models"
	config "github.com/LucasPaulo001/Campus-Connect/internal/repository"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
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

	if comment.User.ID != userId {
		c.JSON(http.StatusForbidden, gin.H{"error": "Permissão de edição negada."})
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

	userId := c.GetUint("userId")

	var comments []models.Comment

	if err := config.DB.
		Preload("User").
		Where("post_id = ?", postIdInt).
		Order("created_at desc").
		Find(&comments).Error; err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar comentários."})
		return
	}

	var response []dto.CommentResponse

	for _, comment := range comments {
		var likesCount int64

		config.DB.Model(&models.Comment{}).
		Where("ID", comment.ID).
		Count(&likesCount)

		liked := false

		if userId != 0 {
			var l models.LikeComment
			err := config.DB.Where("ID = ? AND user_id = ?", comment.ID, userId). 
			First(&l).Error;

			liked = err == nil
		}

		response = append(response, dto.CommentResponse{
			ID:  		comment.ID,
			PostId:   	comment.PostID,
			Content: 	comment.Content,
			User: 		dto.UserInfo{
				ID:    comment.User.ID,
				Name:  comment.User.Name,
				Email: comment.User.Email,
				Role:  comment.User.Role,
			},
			LikesCount: likesCount,
			LikedByMe: 	liked,
			CreatedAt:  comment.CreatedAt,
		})
	}	

	c.JSON(http.StatusOK, response)
}

// Deletar comentário
func DeleteComment(c *gin.Context) {
	commentIdStr := c.Param("id");

	id, err := strconv.ParseUint(commentIdStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido."})
		return
	}
	commentId := uint(id)

	// Buscando comentário
	var comment models.Comment
	if err := config.DB.First(&comment, commentId).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Comentário não encontrado."})
		return
	}

	// Verificando se o comentário é do usuário
	userId := c.GetUint("userId")

	if comment.UserID != userId {
		c.JSON(http.StatusForbidden, gin.H{"error": "Você não tem permissão para deletar esse comentário."})
		return
	}

	if err := config.DB.Delete(&comment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Erro ao deletar comentário", 
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Comentário deletado com sucesso."})
}

// Responder Comentário
func CreateResp(c *gin.Context) {
	userId := c.GetUint("userId")
	
	commentIdStr := c.Param("id")

	commentId, err := strconv.ParseUint(commentIdStr, 10, 30)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Erro ao converter ID."})
		return
	}

	var body struct {
		Content		string 		`json:"content" binding:"required"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Verificar se o comentário existe
    var comment models.Comment
    if err := config.DB.First(&comment, "id = ?", commentId).Error; err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            c.JSON(http.StatusNotFound, gin.H{"error": "Comentário não encontrado."})
            return
        }
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar comentário."})
        return
    }

	// Criando comentário
	response := models.Resp_Comment{
		UserID: 	userId,
		CommentID: 	uint(commentId),
		Content: 	body.Content,
	}

	if err := config.DB.Create(&response).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao responder comentário."})
		return
	}


	c.JSON(http.StatusCreated, gin.H{
		"message": "Resposta criada com sucesso.",
	})
}

// Listando respostas
func GetResponses(c *gin.Context)  {
	commentIdStr := c.Param("id")

	commentId, err := strconv.ParseUint(commentIdStr, 10, 30)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var resp_comment []models.Resp_Comment

	err = config.DB.
		Preload("User").
        Where("comment_id = ?", commentId).
        Order("created_at DESC").
        Find(&resp_comment).Error

	if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao listar respostas."})
        return
    }

	var responses []dto.AnswerResponse
	for _, resp := range resp_comment {
		responses = append(responses, dto.AnswerResponse{
			ID: 		resp.ID,
			UserID: 	resp.UserID,
			CommentID: 	resp.CommentID,
			User:  		dto.UserInfo{
				ID:    resp.User.ID,
				Name:  resp.User.Name,
				Email: resp.User.Email,
				Role:  resp.User.Role,
			},
			Content: 	resp.Content,
		})
	}

    c.JSON(http.StatusOK, gin.H{
        "data": responses,
    })
}

// Deletar respostas
func DeleteRespComment(c *gin.Context) {
	respIdStr := c.Param("id")

	respId, err := strconv.ParseUint(respIdStr, 10, 30)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Buscando resposta
	var response models.Resp_Comment
	if err := config.DB.First(&response, respId).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Verificando se é do usuário
	userId := c.GetUint("userId")
	if response.UserID != userId {
		c.JSON(http.StatusForbidden, gin.H{"error": "Acesso negado"})
		return
	}

	// Deletando resposta
	if err := config.DB.Delete(&response).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao deletar resposta"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Resposta deletada com sucesso"})
}

// Editar resposta
func EditResponse(c *gin.Context) {
	respIdStr := c.Param("id")

	respId, err := strconv.ParseUint(respIdStr, 10, 30)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var body struct {
		Content  string `json:"content"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Erro ao ler dados"})
		return
	}

	if body.Content == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "O conteúdo não pode ser vazio"})
		return
	}

	var resp models.Resp_Comment
	if err := config.DB.First(&resp, respId).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Resposta não encontrada"})
		return
	}

	// Checar se o usuário é o dono
	userId := c.GetUint("userId")
	if resp.UserID != userId {
		c.JSON(http.StatusForbidden, gin.H{"error": "Você não pode editar esta resposta"})
		return
	}

	// Atualizar
	resp.Content = body.Content

	if err := config.DB.Save(&resp).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar resposta"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Resposta atualizada com sucesso", "data": resp})
}


