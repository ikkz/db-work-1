package models

type C struct {
	No     string `gorm:"primary_key"`
	Name   string
	Credit uint
	Dept   string
	Tname  string
}
