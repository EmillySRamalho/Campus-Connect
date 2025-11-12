package models

type Teacher struct {
	UserID  		uint 	`gorm:"primaryKey"`
	Departament		string  `json:"departament"`
	Formation 		string  `json:"formation"`
	User 			User 	`gorm:"foreignKey:UserID"`
}