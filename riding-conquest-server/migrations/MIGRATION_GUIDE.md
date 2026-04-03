# 数据库迁移使用指南

## 前置条件

1. 安装 PostgreSQL 14+ 和 PostGIS 3+
2. 安装 golang-migrate CLI 工具

## 安装 golang-migrate

### macOS
```bash
brew install golang-migrate
```

### Linux
```bash
curl -L https://github.com/golang-migrate/migrate/releases/download/v4.16.2/migrate.linux-amd64.tar.gz | tar xvz
sudo mv migrate /usr/bin/migrate
chmod +x /usr/bin/migrate
```

### 从源码安装
```bash
go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest
```

## 配置数据库

### 创建数据库
```bash
psql -U postgres
CREATE DATABASE riding_conquest;
\c riding_conquest
CREATE EXTENSION IF NOT EXISTS postgis;
\q
```

### 设置环境变量
```bash
export DATABASE_URL="postgres://user:password@localhost:5432/riding_conquest?sslmode=disable"
```

## 执行迁移

### 执行所有 up 迁移
```bash
migrate -path migrations -database "$DATABASE_URL" up
```

### 执行单个 up 迁移
```bash
migrate -path migrations -database "$DATABASE_URL" up 1
```

### 回滚最后一个 migration
```bash
migrate -path migrations -database "$DATABASE_URL" down
```

### 回滚所有 migration
```bash
migrate -path migrations -database "$DATABASE_URL" down -all
```

### 回滚指定数量 migration
```bash
migrate -path migrations -database "$DATABASE_URL" down 3
```

### 查看迁移状态
```bash
migrate -path migrations -database "$DATABASE_URL" version
```

### 强制设置版本（用于修复）
```bash
migrate -path migrations -database "$DATABASE_URL" force 5
```

## 使用 Makefile

```bash
# 执行所有迁移
make migrate-up

# 回滚最后一个迁移
make migrate-down

# 创建新迁移
make migration-create name=create_new_table

# 查看当前版本
make migrate-version
```

## 迁移文件命名规范

- 文件名格式：`{version}_{description}.up.sql` 和 `{version}_{description}.down.sql`
- 版本号：从 001 开始递增
- 描述：使用下划线分隔的小写字母

## 常见问题

### 1. 迁移失败
检查 DATABASE_URL 是否正确，数据库是否可访问。

### 2. PostGIS 扩展未启用
确保执行了 `CREATE EXTENSION IF NOT EXISTS postgis;`

### 3. 外键约束失败
确保迁移顺序正确，父表在子表之前创建。

### 4. 索引创建失败
检查表是否已存在，使用 `IF NOT EXISTS` 语法。

## 最佳实践

1. **每个迁移文件只做一件事** - 创建一个表或添加一组相关索引
2. **始终编写 down 迁移** - 确保可以回滚
3. **迁移是不可变的** - 已执行的迁移不要修改，创建新迁移来变更
4. **测试迁移** - 在本地测试 up 和 down 后再部署
5. **版本控制** - 迁移文件纳入 Git 管理

## 表结构概览

| 版本 | 表名 | 说明 |
|------|------|------|
| 001 | users | 用户表 |
| 002 | teams | 战队表 |
| 003 | team_members | 战队成员表 |
| 004 | ride_records | 骑行记录表 |
| 005 | contributions | 贡献值表 |
| 006 | territories | 领土表（PostGIS） |
| 007 | wars | 战斗表 |
| 008 | war_actions | 战斗行动表 |
| 009 | indexes | 额外索引 |
