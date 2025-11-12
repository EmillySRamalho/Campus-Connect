package models

import "time"


type Post struct{
	ID			uint		`gorm:"primaryKey"`
	UserID		uint		`json:"user_id"`
	Title		string		`json:"title"`
	User		User
	Content		string		`json:"content"`
	Likes 		[]LikePost	`gorm:"foreignKey:PostID"`
	Comments	[]Comment	`gorm:"foreignKey:PostID"`
	Tags		[]Tags		`gorm:"many2many:post_tags"`
	CreatedAt	time.Time
}