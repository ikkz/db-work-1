package router

import (
	"fmt"

	"github.com/cildhdi/egg/models"
	"github.com/cildhdi/egg/utils"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

func CreateCourse(ctx *gin.Context) {
	param := models.C{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		utils.Error(ctx, utils.ParamError, "参数错误")
		return
	}

	if len(param.No) == 0 {
		utils.Error(ctx, utils.ParamError, "课程号不能为空")
		return
	}

	if err := models.Db().Create(&param).Error; err != nil {
		utils.Error(ctx, utils.DatabaseError, "课程号已经存在")
		return
	}

	models.AddLog("system", "系统管理员", "新建课程："+param.No+" - "+param.Name)
	utils.Success(ctx, &param)
}

func UpdateCourse(ctx *gin.Context) {
	param := models.C{}
	if err := ctx.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		utils.Error(ctx, utils.ParamError, "参数错误")
		return
	}

	if len(param.No) == 0 {
		utils.Error(ctx, utils.ParamError, "课程号不能为空")
		return
	}

	if err := models.Db().Model(&param).Updates(&param).Error; err != nil {
		utils.Error(ctx, utils.DatabaseError, fmt.Sprint("更新失败，", err.Error()))
		return
	}
	models.AddLog("system", "系统管理员", "修改课程信息："+param.No+" - "+param.Name)
	utils.Success(ctx, &param)
}

func Courses(ctx *gin.Context) {
	cs := []models.C{}
	models.Db().Find(&cs)
	utils.Success(ctx, &cs)
}

func CoursesInfo(ctx *gin.Context) {
	user := ctx.MustGet("user").(models.S)

	scs := []models.SC{}
	models.Db().Where("s_no=?", user.No).Find(&scs)

	courses := []models.C{}
	models.Db().Find(&courses)

	result := struct {
		Selected   []models.C
		Selectable []models.C
		Unback     []models.C
	}{
		Selected:   []models.C{},
		Selectable: []models.C{},
		Unback:     []models.C{},
	}

	for _, course := range courses {
		found := false
		for _, sc := range scs {
			if sc.CNo == course.No {
				if sc.Grade == 0 {
					result.Selected = append(result.Selected, course)
				} else {
					result.Unback = append(result.Unback, course)
				}
				found = true
				break
			}
		}
		if !found {
			result.Selectable = append(result.Selectable, course)
		}
	}

	utils.Success(ctx, &result)
}
