package models

import "time"


type Comment struct {
	ID			uint		   `gorm:"primaryKey"`
	UserID		uint	
	PostID		uint	
	User		User	
	Likes		[]LikeComment	`gorm:"foreignKey:CommentID"`
	Content 	string		    `json:"content"`
	CreatedAt	time.Time	    `json:"created_at"`
}


