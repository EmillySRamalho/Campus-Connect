package models

type Member struct {
	ID 			uint 		`gorm:"primaryKey"`
	StudentID	uint 		`json:"student_id"`
	Student		Student		`gorm:"foreignKey:StudentID"`
	GroupID		uint 		`json:"group_id"`
	Group		Group		`gorm:"foreignKey:GroupID"`
}


type Group struct {
	ID				uint		`gorm:"primaryKey"`
	Name			string 		`json:"nome"`
	Description		string		`json:"description"`
	TeacherID		uint 		`json:"teacher_id"`
	Teacher			Teacher		`gorm:"foreignKey:TeacherID"`
	Members			[]Member	`gorm:"foreignKey:GroupID;constraint:OnDelete:CASCADE"`
}