package handlers

import (
	"net/http"

	"github.com/LucasPaulo001/Campus-Connect/internal/models"
	config "github.com/LucasPaulo001/Campus-Connect/internal/repository"
	"github.com/gin-gonic/gin"
)

func CreateGroup(c *gin.Context) {
	teacherId := c.GetUint("userId")

	if teacherId == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Id não encontrado"})
		return
	}

	// Dados temporários
	var body struct {
		Name			string		`json:"name"`
		Description 	string		`json:"description"`
		Members 		[]uint		`json:"members"`
	}

	// Serealizando dados
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Criando grupo
	group := models.Group{
		Name: 			body.Name,
		Description: 	body.Description,
		TeacherID: 		teacherId,
	}

	if err := config.DB.Create(&group).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao criar grupo."})
		return
	}

	// Salvando estudantes no grupo
	var members []models.Member

	for _, studentId := range body.Members {
		var count int64
		config.DB.Model(&models.Student{}).Where("id = ?", studentId).Count(&count)
		if count == 0 {
			continue
		}
		members = append(members, models.Member{
			StudentID: studentId,
			GroupID: group.ID,
		})
	}

	if len(members) > 0 {
		if err := config.DB.Create(&members).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao adicionar estudante ao grupo."})
			return
		}
	}

	if err := config.DB.Preload("Members").Preload("Teacher").First(&group, group.ID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao carregar dados do grupo."})
		return
	}


	c.JSON(http.StatusCreated, gin.H{
		"message": "Grupo criado com sucesso.",
		"group": group,
		"members": members,
	})

}