FROM golang:1.13.5

WORKDIR /usr/src/app
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
EXPOSE 80
CMD [ "go", "run", "main.go" ]