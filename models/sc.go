package models

type SC struct {
	CNo   string `gorm:"primary_key"`
	SNo   string `gorm:"primary_key"`
	Grade uint
}
