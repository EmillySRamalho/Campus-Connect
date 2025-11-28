package seed

import (
	"log"
	"math/rand"
	"time"

	"github.com/LucasPaulo001/Campus-Connect/internal/models"
	config "github.com/LucasPaulo001/Campus-Connect/internal/repository"
)

func Run() {
	db := config.DB

	rand.Seed(time.Now().UnixNano())

	// USERS
	users := []models.User{
		{Name: "João Paulo", Email: "joao@email.com", Password: "123", Role: "professor", NameUser: "joaop"},
		{Name: "Maria Silva", Email: "maria@email.com", Password: "123", Role: "professor", NameUser: "maria"},
		{Name: "Carlos Lima", Email: "carlos@email.com", Password: "123", Role: "aluno", NameUser: "carlosl"},
		{Name: "Ana Souza", Email: "ana@email.com", Password: "123", Role: "aluno", NameUser: "anas"},
		{Name: "Pedro Santos", Email: "pedro@email.com", Password: "123", Role: "aluno", NameUser: "pedros"},
		{Name: "Admin", Email: "admin@email.com", Password: "123", Role: "admin", NameUser: "admin"},
	}

	for i := range users {
		db.FirstOrCreate(&users[i], models.User{Email: users[i].Email})
	}

	// busca IDs reais criados
	var userList []models.User
	db.Find(&userList)

	getUserID := func(email string) uint {
		for _, u := range userList {
			if u.Email == email {
				return u.ID
			}
		}
		return 0
	}


	// STUDENTS
	students := []models.Student{
		{UserID: getUserID("carlos@email.com"), Course: "Informática", Matricula: "2021001"},
		{UserID: getUserID("ana@email.com"), Course: "Redes", Matricula: "2021002"},
		{UserID: getUserID("pedro@email.com"), Course: "ADS", Matricula: "2021003"},
	}

	for i := range students {
		db.FirstOrCreate(&students[i], models.Student{UserID: students[i].UserID})
	}


	// TEACHERS
	teachers := []models.Teacher{
		{UserID: getUserID("joao@email.com"), Departament: "Informática", Formation: "Doutor em Ciência da Computação"},
		{UserID: getUserID("maria@email.com"), Departament: "Redes", Formation: "Mestra em Sistemas de Comunicação"},
	}

	for i := range teachers {
		db.FirstOrCreate(&teachers[i], models.Teacher{UserID: teachers[i].UserID})
	}

	// TAGS
	tags := []models.Tags{
		{Name: "Avisos"},
		{Name: "Eventos"},
		{Name: "Oportunidades"},
		{Name: "Comunicados"},
	}

	for i := range tags {
		db.FirstOrCreate(&tags[i], models.Tags{Name: tags[i].Name})
	}


	// POSTS
	postSamples := []string{
		"A aula de hoje será substituída por atividades assíncronas.",
		"Reunião do grupo de estudos às 16h.",
		"Semana da tecnologia começa na próxima segunda!",
		"Bolsas de iniciação científica abertas!",
		"Ao final da aula será liberado material complementar.",
		"Evento importante no auditório do bloco A.",
		"Vagas abertas para monitoria.",
		"Novas regras de utilização dos laboratórios.",
		"Entrega do trabalho prorrogada até sexta.",
		"Participe da feira de cursos!",
	}

	var posts []models.Post

	for i := 0; i < 10; i++ {
		p := models.Post{
			UserID:    users[rand.Intn(len(users))].ID,
			Title:     "Post automático #" + time.Now().Format("150405") + "-" + string(rune(i+48)),
			Content:   postSamples[rand.Intn(len(postSamples))],
			CreatedAt: time.Now().Add(time.Duration(-i) * time.Hour),
		}

		db.FirstOrCreate(&p, models.Post{Title: p.Title})

		posts = append(posts, p)
	}


	// LIKES EM POSTS
	allUserIDs := []uint{}
	for _, u := range users {
		allUserIDs = append(allUserIDs, u.ID)
	}

	for _, p := range posts {
		for i := 0; i < rand.Intn(5); i++ {
			like := models.LikePost{
				UserId: allUserIDs[rand.Intn(len(allUserIDs))],
				PostId: p.ID,
			}
			db.FirstOrCreate(&like, models.LikePost{UserId: like.UserId, PostId: like.PostId})
		}
	}


	// COMMENTS
	commentsSamples := []string{
		"Ótima notícia!",
		"Valeu pelo aviso!",
		"Muito bom saber.",
		"Obrigado por compartilhar!",
		"Interessante!",
	}

	for _, p := range posts {
		for i := 0; i < rand.Intn(3); i++ {
			c := models.Comment{
				UserID:    allUserIDs[rand.Intn(len(allUserIDs))],
				PostID:    p.ID,
				Content:   commentsSamples[rand.Intn(len(commentsSamples))],
				CreatedAt: time.Now(),
			}

			db.Create(&c)
		}
	}

	// GROUPS (Turmas)
	groups := []models.Group{
		{Name: "Turma de Informática", Description: "Turma 2025.1", TeacherID: teachers[0].UserID},
		{Name: "Turma de Redes", Description: "Turma 2025.1", TeacherID: teachers[1].UserID},
	}

	for i := range groups {
		db.FirstOrCreate(&groups[i], models.Group{Name: groups[i].Name})
	}

	// members
	for _, g := range groups {
		for _, s := range students {
			member := models.Member{
				StudentID: s.UserID,
				GroupID:   g.ID,
			}
			db.FirstOrCreate(&member, models.Member{StudentID: s.UserID, GroupID: g.ID})
		}
	}

	log.Println("✔️ SEED COMPLETO CARREGADO COM SUCESSO!")
}
