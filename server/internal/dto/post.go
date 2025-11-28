package dto

import (
	"time"

	"github.com/LucasPaulo001/Campus-Connect/internal/models"
)

type PostResponse struct {
	ID         uint             `json:"id"`
    Title      string           `json:"title"`
    Content    string           `json:"content"`
    User       UserInfo         `json:"user"`
    LikesCount int64            `json:"likes_count"`
    LikedByMe  bool             `json:"liked_by_me"`
    Tags       []models.Tags    `json:"tags"`
    CreatedAt  time.Time        `json:"created_at"`
}

type CommentResponse struct {
    ID          uint        `json:"id"`
    PostId      uint        `json:"post_id"`
    Content     string      `json:"content"`
    User        UserInfo    `json:"user"`
    LikesCount  int64       `json:"likes_count"`
    LikedByMe   bool        `json:"liked_by_me"`
    CreatedAt   time.Time   `json:"created_at"`
}

type AnswerResponse struct {
    ID          uint        `json:"id"`
    UserID      uint        `json:"user_id"`
    CommentID   uint        `json:"comment_id"`
    User        UserInfo    `json:"user"`
    Content     string      `json:"content"`
}
