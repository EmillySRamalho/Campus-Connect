package models

type Student struct {
	UserID  	uint	 `gorm:"primaryKey"`
	Course  	string 	 `json:"course"`
	Matricula	string 	 `json:"matricula"`
	User 		User 	 `gorm:"foreignKey:UserID"`
}
