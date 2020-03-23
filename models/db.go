package models

import (
	"fmt"
	"time"

	"github.com/jinzhu/gorm"
	//postgres
	_ "github.com/jinzhu/gorm/dialects/postgres"

	"github.com/cildhdi/egg/config"
)

var db *gorm.DB

func connect() (err error) {
	db, err = gorm.Open(config.Database,
		fmt.Sprintf("host=%s port=%d user=%s dbname=%s password=%s sslmode=%s",
			config.Host, config.Port, config.User, config.Name, config.Password, config.SSLMode))
	return
}

func init() {
	err := connect()
	for err != nil {
		fmt.Println("connect to database failed:", err.Error(), ", wait for 10 seconds...")
		time.Sleep(10 * time.Second)
		err = connect()
	}
	fmt.Println("connected to database")

	//migrates
	db.AutoMigrate(&S{}, &C{}, &SC{}, &Log{})
}

//Db gorm.DB
func Db() *gorm.DB {
	return db
}
