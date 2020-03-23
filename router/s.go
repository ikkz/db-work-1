package router

import (
	"fmt"

	"github.com/cildhdi/egg/models"
	"github.com/cildhdi/egg/utils"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

func CreateStudent(ctx *gin.Context) {
	param := models.S{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		utils.Error(ctx, utils.ParamError, "参数错误")
		return
	}

	if len(param.No) == 0 {
		utils.Error(ctx, utils.ParamError, "学号不能为空")
		return
	}

	if err := models.Db().Create(&param).Error; err != nil {
		utils.Error(ctx, utils.DatabaseError, "学号已经存在")
		return
	}
	models.AddLog("system", "系统管理员", "新建学生："+param.No+" - "+param.Name)
	utils.Success(ctx, &param)
}

func UpdateStudent(ctx *gin.Context) {
	param := models.S{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		utils.Error(ctx, utils.ParamError, "参数错误")
		return
	}

	if len(param.No) == 0 {
		utils.Error(ctx, utils.ParamError, "学号不能为空")
		return
	}

	if err := models.Db().Model(&param).Updates(&param).Error; err != nil {
		utils.Error(ctx, utils.DatabaseError, fmt.Sprint("更新失败，", err.Error()))
		return
	}
	models.AddLog("system", "系统管理员", "修改学生信息："+param.No+" - "+param.Name)
	utils.Success(ctx, &param)
}

func Students(ctx *gin.Context) {
	ss := []models.S{}
	models.Db().Find(&ss)
	utils.Success(ctx, &ss)
}

func UserInfo(ctx *gin.Context) {
	utils.Success(ctx, ctx.MustGet("user"))
}
