package models

import "time"

type LikePost struct{
	ID			uint		`gorm:"primaryKey"`
	UserId		uint		`json:"user_id"`
	PostId  	uint		`json:"post_id"`
	User		User		`json:"user"`
	Post		Post		`json:"post"`
	CreatedAt	time.Time   `json:"created_at"`
}

type LikeComment struct{
	ID				uint 	  `gorm:"primaryKey"`
	UserID			uint	  `json:"user_id"`
	CommentID		uint	  `json:"comment_id"`
	User			User	  `json:"user"`
	Comment			Comment	  `json:"comment"`
	CreatedAt 		time.Time `json:"created_at"`
}