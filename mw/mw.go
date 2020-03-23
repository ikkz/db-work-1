package mw

import (
	"strings"

	"github.com/cildhdi/egg/models"
	"github.com/cildhdi/egg/utils"
	"github.com/gin-gonic/gin"
)

type header struct {
	Username string `binding:"required"`
	Password string `binding:"required"`
}

func AuthMw() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		authInfo := header{}
		if err := ctx.ShouldBindHeader(&authInfo); err != nil {
			utils.Error(ctx, utils.AuthError, "缺少 auth header")
			return
		}

		user := models.S{}
		if authInfo.Username == "system" {
			if authInfo.Password != "zxcvbnm" {
				utils.Error(ctx, utils.AuthError, "管理员密码错误")
				return
			}
		} else {
			models.Db().Where("logn = ? and pswd = ?", authInfo.Username, authInfo.Password).First(&user)
			if len(user.Logn) == 0 {
				utils.Error(ctx, utils.AuthError, "该用户不存在或密码错误")
				return
			}
			if strings.Contains(ctx.Request.URL.Path, "create") || strings.Contains(ctx.Request.URL.Path, "update") {
				utils.Error(ctx, utils.AuthError, "您不具有该操作的权限")
				return
			}
		}
		ctx.Set("user", user)
		ctx.Next()
	}
}
