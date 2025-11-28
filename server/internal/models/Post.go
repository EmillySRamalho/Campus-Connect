package models

import "time"


type Post struct{
	ID			uint			`gorm:"primaryKey"`
	UserID		uint			`json:"user_id"`
	Title		string			`json:"title"`
	User		User
	Content		string			`json:"content"`
	Likes 		[]LikePost		`gorm:"foreignKey:PostID;constraint:OnDelete:CASCADE;"`
	Comments	[]Comment		`gorm:"foreignKey:PostID;constraint:OnDelete:CASCADE;"`
	Saves 		[]Saved_Posts	`gorm:"foreignKey:PostID;constraint:OnDelete:CASCADE;"`
	Tags		[]Tags			`gorm:"many2many:post_tags"`
	CreatedAt	time.Time
}

type Saved_Posts struct {
	ID 			uint 		`gorm:"primaryKey json:id"`
	UserID 		uint 		`json:"user_id"`
	PostID		uint 		`json:"post_id"`
	User 		User		`gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE;"`
	Post 		Post 		`gorm:"foreignKey:PostID;constraint:OnDelete:CASCADE;"`
	CreatedAt 	time.Time 	`json:"created_at"`
}

type PostTag struct {
    PostID uint `gorm:"primaryKey"`
    TagID  uint `gorm:"primaryKey"`

    Post Post `gorm:"constraint:OnDelete:CASCADE;"`
    Tag  Tags `gorm:"constraint:OnDelete:CASCADE;"`
}
