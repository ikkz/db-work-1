package main

import (
	statusApi "github.com/appleboy/gin-status-api"
	"github.com/cildhdi/egg/mw"
	"github.com/cildhdi/egg/router"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	corsConfig := cors.DefaultConfig()
	corsConfig.AddAllowHeaders("Username", "Password")
	corsConfig.AllowAllOrigins = true
	r.Use(cors.New(corsConfig))

	api := r.Group("/api")
	api.Use(mw.AuthMw())
	api.GET("/status", statusApi.StatusHandler)
	api.POST("/create-student", router.CreateStudent)
	api.POST("/update-student", router.UpdateStudent)
	api.GET("/students", router.Students)

	api.POST("/create-course", router.CreateCourse)
	api.POST("/update-course", router.UpdateCourse)
	api.GET("/courses", router.Courses)
	api.POST("/logs", router.GetLogs)
	api.POST("/scs", router.GetScs)
	api.POST("/update-grade", router.UpdateGrade)
	api.GET("/dis", router.GradeDis)
	api.GET("/report", router.GradeReport)

	api.GET("/user-info", router.UserInfo)
	api.GET("/course-detail", router.CoursesInfo)
	api.POST("/select-course", router.SelectCourse)
	api.POST("/back-course", router.BackCourse)

	r.Run()
}
