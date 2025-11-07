package controllers

import (
	"net/http"
	"github.com/LucasPaulo001/Campus-Connect/src/config"
	"github.com/LucasPaulo001/Campus-Connect/src/models"
	"github.com/LucasPaulo001/Campus-Connect/src/utils"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// Registro
func Register(c *gin.Context) {

	var body struct {
		Name		string	 `json:"name"`
		NameUser	string	 `json:"name_user"`
		Email		string	 `json:"email"`
		Password	string	 `json:"password"`
	}

	if err := c.ShouldBindBodyWithJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verificando nome de usuário
	var existingUser models.User
	if err := config.DB.Where("name_user = ?", body.NameUser).First(&existingUser).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Nome de usuário já em uso."})
		return
	}

	// Verificando email
	if err := config.DB.Where("email = ?", body.Email).First(&existingUser).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email já cadastrado."})
		return
	}

	// Criptografando senha
	hash, _ := bcrypt.GenerateFromPassword([]byte(body.Password), 10)

	user := models.User{
		Name:		body.Name,
		NameUser:	body.NameUser,
		Email:		body.Email,
		Password:	string(hash),
	}

	if err := config.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao criar usuário."})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Usuário registrado com sucesso."})
}

// Login
func Login(c *gin.Context){
	var body struct {
		Email		string	`json:"email"`
		Password	string	`json:"password"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := config.DB.First(&user, "email = ?", body.Email).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuário não encontrado."})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Senha incorreta."})
		return
	}

	token, _ := utils.GenerateToken(user.ID)

	c.JSON(http.StatusOK, gin.H{"token": token})
}

// Pegar dados de usuário logado
func Profile(c *gin.Context){
	// Verificando ID de usuário
	userId, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Não foi possível obter usuário."})
		return
	}

	// Buscando usuário pelo id
	var user models.User
	if err := config.DB.First(&user, userId.(uint)).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuário não encontrado."})
		return
	}

	// Retornando dados do usuário logado
	c.JSON(http.StatusOK, gin.H{
		"id":			user.ID,
		"name":			user.Name,
		"name_user":	user.NameUser,
		"email":		user.Email,
	})
}

