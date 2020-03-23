package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// code
const (
	Ok = iota
	AuthError
	ParamError
	DatabaseError
	NoToken
	VoteRestrict
	NoReply
)

// Response 响应结构
type Response struct {
	Code int         `json:"code"`
	Msg  string      `json:"msg"`
	Data interface{} `json:"data"`
}

func response(ctx *gin.Context, code int, msg string, data interface{}) {
	if code == Ok {
		msg = "success"
	}
	ctx.AbortWithStatusJSON(http.StatusOK, Response{
		Code: code,
		Msg:  msg,
		Data: data,
	})
}

//Success 响应成功
func Success(ctx *gin.Context, data interface{}) {
	ctx.Set("success", true)
	response(ctx, Ok, "", data)
}

//Error 响应错误
func Error(ctx *gin.Context, code int, msg string) {
	response(ctx, code, msg, nil)
}
