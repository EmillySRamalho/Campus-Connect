package models

import "time"

type User struct {
	ID		  uint		`gorm:"primaryKey" json:"id"`
	Name	  string	`json:"name"`
	Email	  string	`gorm:"unique" json:"email"`
	Password  string	`json:"-"`
	NameUser  string 	`gorm:"unique" json:"name_user"`
	Bio		  string	`json:"bio,omitempty"`
	Role  	  string 	`json:"role"`
	CreatedAt time.Time	`json:"created_at"`	
}