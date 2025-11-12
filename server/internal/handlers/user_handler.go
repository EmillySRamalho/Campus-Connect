package controllers

import (
	"net/http"

	"github.com/LucasPaulo001/Campus-Connect/internal/models"
	config "github.com/LucasPaulo001/Campus-Connect/internal/repository"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// Editar dados do usuário
func EditUserData(c *gin.Context){
	// Recupera id de usuário logado
	userId := c.GetUint("userId")

	// Dados de edição
	var body struct {
		Name 		string		`json:"name"`
		NameUser	string		`json:"name_user"`
		Bio 		string		`josn:"bio"`	
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verificando nome de usuário
	var existingUserName models.User
	err := config.DB.Where("name_user = ?", body.NameUser).First(&existingUserName).Error

	if err == nil && existingUserName.ID == userId {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username já em uso"})
		return
	}

	if err != nil && err != gorm.ErrRecordNotFound {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := config.DB.Model(&models.User{}).
		Where("id = ?", userId).
		Updates(models.User{
			Name: body.Name,
			NameUser: body.NameUser,
			Bio: body.Bio,
		}).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao editar dados."})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Dados atualizados com sucesso."})
}

