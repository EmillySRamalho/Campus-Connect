package models

import "time"


type Comment struct {
	ID			uint		   `gorm:"primaryKey"`
	UserID		uint	
	PostID		uint	
	User		User			`gorm:"constraint:OnDelete:CASCADE;"`
	Resp      	[]Resp_Comment  `gorm:"constraint:OnDelete:CASCADE;"`
	Likes		[]LikeComment	`gorm:"foreignKey:CommentID;constraint:OnDelete:CASCADE;"`
	Content 	string		    `json:"content"`
	CreatedAt	time.Time	    `json:"created_at"`
}

type Resp_Comment struct {
	ID 			uint 		`gorm:"primaryKey json:id"`
	UserID  	uint 		`json:"user_id"`
	CommentID   uint 		`json:"comment_id" gorm:"constraint:OnDelete:CASCADE;"`
	User 		User		
	Content 	string 		`json:"content"`
	CreatedAt 	time.Time 	`json:"created_at"`
}

