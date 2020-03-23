package config

import (
	"os"

	"github.com/gin-gonic/gin"
)

var (
	Database = "postgres"
	Host     = "localhost"
	Port     = 5432
	User     = "egg"
	Name     = "egg"
	Password = "place your config here"
	SSLMode  = "disable"
)

func init() {
	if gin.Mode() == gin.ReleaseMode {
		Host = "pg"
	}
	Password = os.Getenv("EGG_PASSWORD")
}
