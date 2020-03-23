package models

import (
	"github.com/jinzhu/gorm"
)

type Log struct {
	gorm.Model
	No     string
	Actor  string
	Action string
}

func AddLog(no string, actor string, action string) {
	Db().Create(&Log{
		No:     no,
		Actor:  actor,
		Action: action,
	})
}
