package handlers

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

func BecomeTeacher(c *gin.Context) {
	userId := c.GetUint("userId")

	var body struct {
		Departament		string 		`json:"departament"`
		Formation		string		`json:"formation"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Buscar usuário
	var user models.User
	if err := config.DB.First(&user, userId).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuário não encontrado."})
		return
	}

	if user.Role == "professor" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "O usuário já é professor."})
		return
	}

	teacher := models.Teacher{
		UserID: userId,
		Departament: body.Departament,
		Formation: body.Formation,
	}

	// Criando perfil de professor
	if err := config.DB.Create(&teacher).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao criar perfil de professor."})
		return
	}

	// Atualizando role de usuário
	if err := config.DB.Model(&user).Update("role", "professor").Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar role de usuário."})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Perfil de professor criado com sucesso.",
		"teacherId": teacher.UserID,
	})
}

