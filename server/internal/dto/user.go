package dto

type UserInfo struct {
	ID    uint   `json:"id"`
    Name  string `json:"name"`
    Email string `json:"email"`
    Bio   string `json:"bio"`
    Role  string `json:"role"`
}