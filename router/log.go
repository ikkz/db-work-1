package router

import (
	"github.com/cildhdi/egg/models"
	"github.com/cildhdi/egg/utils"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

type studentParam struct {
	SNo string
}

func GetLogs(ctx *gin.Context) {
	param := studentParam{}
	ctx.ShouldBindBodyWith(&param, binding.JSON)

	logs := []models.Log{}
	if len(param.SNo) == 0 {
		models.Db().Order("created_at desc").Find(&logs)
	} else {
		models.Db().Where("no=?", param.SNo).Order("created_at desc").Find(&logs)
	}
	utils.Success(ctx, &logs)
}
