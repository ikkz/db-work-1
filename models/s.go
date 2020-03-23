package models

type S struct {
	No   string `gorm:"primary_key"`
	Name string
	Sex  string
	Age  uint
	Dept string
	Logn string
	Pswd string
}
