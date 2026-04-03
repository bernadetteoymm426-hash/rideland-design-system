.PHONY: build run test clean migrate-up migrate-down

# 构建
build:
	go build -o bin/server cmd/server/main.go

# 运行
run:
	go run cmd/server/main.go

# 测试
test:
	go test -v ./...

# 清理
clean:
	rm -rf bin/
	go clean

# 执行数据库迁移（向上）
migrate-up:
	migrate -path migrations -database "$(DATABASE_URL)" up

# 执行数据库迁移（向下）
migrate-down:
	migrate -path migrations -database "$(DATABASE_URL)" down

# 创建新迁移
migration-create:
	migrate create -ext sql -dir migrations -seq $(name)

# 下载依赖
deps:
	go mod download

# 格式化代码
fmt:
	go fmt ./...

# 代码检查
lint:
	golangci-lint run
