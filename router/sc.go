package router

import (
	"fmt"

	"github.com/cildhdi/egg/models"
	"github.com/cildhdi/egg/utils"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

type courseParam struct {
	CNo string `binding:"required"`
}

func SelectCourse(ctx *gin.Context) {
	param := courseParam{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		utils.Error(ctx, utils.ParamError, "参数错误")
		return
	}

	user := ctx.MustGet("user").(models.S)
	sc := models.SC{}

	models.Db().Where("s_no=? and c_no=?", user.No, param.CNo).First(&sc)
	if len(sc.CNo)+len(sc.SNo) != 0 {
		utils.Error(ctx, utils.ParamError, "已选择该课程")
		return
	}

	course := models.C{}
	models.Db().Where("no=?", param.CNo).First(&course)
	if len(course.No) == 0 {
		utils.Error(ctx, utils.ParamError, "该课程不存在")
		return
	}

	sc.CNo = param.CNo
	sc.SNo = user.No
	sc.Grade = 0

	if err := models.Db().Create(&sc).Error; err != nil {
		utils.Error(ctx, utils.ParamError, fmt.Sprint("选课失败：", err.Error()))
		return
	}
	models.AddLog(user.No, user.No+" - "+user.Name, "选课："+course.No+" - "+course.Name)
	utils.Success(ctx, &sc)
}

func BackCourse(ctx *gin.Context) {
	param := courseParam{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		utils.Error(ctx, utils.ParamError, "参数错误")
		return
	}

	course := models.C{}
	models.Db().Where("no=?", param.CNo).First(&course)
	if len(course.No) == 0 {
		utils.Error(ctx, utils.ParamError, "该课程不存在")
		return
	}

	user := ctx.MustGet("user").(models.S)
	sc := models.SC{}

	models.Db().Where("s_no=? and c_no=?", user.No, param.CNo).First(&sc)
	if len(sc.CNo)+len(sc.SNo) == 0 {
		utils.Error(ctx, utils.ParamError, "未选择该课程")
		return
	}

	if sc.Grade != 0 {
		utils.Error(ctx, utils.ParamError, "该课程已经登分")
		return
	}

	if err := models.Db().Where("s_no=? and c_no=?", user.No, param.CNo).Delete(&models.SC{}).Error; err != nil {
		utils.Error(ctx, utils.DatabaseError, "退课失败 "+err.Error())
		return
	}

	models.AddLog(user.No, user.No+" - "+user.Name, "退课："+course.No+" - "+course.Name)
	utils.Success(ctx, nil)
}

func GetScs(ctx *gin.Context) {
	param := courseParam{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		utils.Error(ctx, utils.ParamError, "参数错误")
		return
	}

	scs := []models.SC{}
	models.Db().Where("c_no=?", param.CNo).Find(&scs)
	utils.Success(ctx, &scs)
}

type updateGradeParam struct {
	CNo   string `binding:"required"`
	SNo   string `binding:"required"`
	Grade uint   `binding:"required,max=100,min=1"`
}

func UpdateGrade(ctx *gin.Context) {
	param := updateGradeParam{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		utils.Error(ctx, utils.ParamError, "参数错误 "+err.Error())
		return
	}

	sc := models.SC{}
	models.Db().Where("c_no = ? and s_no = ?", param.CNo, param.SNo).First(&sc)
	if len(sc.CNo)+len(sc.SNo) == 0 {
		utils.Error(ctx, utils.ParamError, "未选择该课")
		return
	}
	sc.Grade = param.Grade

	if err := models.Db().Save(&sc).Error; err != nil {
		utils.Error(ctx, utils.DatabaseError, "更新失败")
		return
	}
	utils.Success(ctx, nil)
}

func GradeDis(ctx *gin.Context) {
	var results = make([]struct {
		No    string
		Name  string
		Grade float64
	}, 0)
	models.Db().Raw(`select cs.no, cs.name, avg(grade) grade 
			from cs,scs where cs.no=scs.c_no group by cs.no
	`).Scan(&results)
	utils.Success(ctx, &results)
}

func GradeReport(ctx *gin.Context) {
	user := ctx.MustGet("user").(models.S)

	var results = make([]struct {
		No     string
		Name   string
		Grade  float64
		Credit uint
		Tname  string
	}, 0)

	models.Db().Raw(`select cs.no,cs.name,scs.grade,cs.credit,cs.tname 
	from scs, s, cs where scs.s_no=s.no and scs.c_no=cs.no and grade > 0 and s.no=?
	`, user.No).Scan(&results)
	utils.Success(ctx, &results)
}
