package models

type Tags struct{
	ID		uint	`gorm:"primaryKey"`
	Name	string	`gorm:"unique"`
}