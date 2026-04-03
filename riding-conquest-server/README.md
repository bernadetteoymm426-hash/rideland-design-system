# Riding Conquest Server

骑行征服 - 后端服务

## 技术栈

- **语言**: Go 1.21+
- **Web 框架**: Gin
- **数据库**: MySQL/PostgreSQL
- **数据库迁移**: golang-migrate
- **缓存**: Redis

## 项目结构

```
riding-conquest-server/
├── cmd/
│   └── server/          # 应用入口
├── internal/            # 内部包（6 个域模块）
│   ├── map/            # 地图与领土
│   ├── team/           # 战队管理
│   ├── ride/           # 骑行贡献
│   ├── war/            # 宣战攻防
│   ├── cycle/          # 周期管理
│   ├── notify/         # 通知推送
│   ├── errors/         # 统一错误码
│   └── middleware/     # 中间件
├── pkg/                # 公共包
│   ├── database/       # 数据库连接
│   └── utils/          # 工具函数
├── migrations/         # 数据库迁移文件
└── go.mod
```

## 快速开始

### 安装依赖

```bash
go mod download
```

### 配置环境变量

```bash
export DB_HOST=localhost
export DB_PORT=3306
export DB_USER=root
export DB_PASSWORD=your_password
export DB_NAME=riding_conquest
export PORT=8080
```

### 运行服务器

```bash
go run cmd/server/main.go
```

### 构建生产版本

```bash
go build -o bin/server cmd/server/main.go
```

## API 设计

### 版本管理

所有 API 端点使用前缀 `/api/v1/`

### 统一错误响应

```json
{
  "code": 1001,
  "message": "Invalid request",
  "detail": "Field 'name' is required"
}
```

### 错误码分段

- `1xxx` - 通用错误
- `2xxx` - 用户/认证
- `3xxx` - 战队
- `4xxx` - 骑行/贡献
- `5xxx` - 攻防/战斗
- `6xxx` - 地图/领土
- `7xxx` - 周期/结算
- `8xxx` - 通知/推送

## 开发规范

### 模块划分

每个域模块（map/team/ride/war/cycle/notify）应包含：

- `handler.go` - HTTP 处理器
- `service.go` - 业务逻辑
- `repository.go` - 数据访问
- `model.go` - 数据模型

### 数据库表命名

遵循 `{module}_{entity}` 规范：

- `users` - 用户表
- `teams` - 战队表
- `team_members` - 战队成员表
- `ride_records` - 骑行记录表
- `contributions` - 贡献值表
- `territories` - 领土表
- `wars` - 战斗表
- `war_actions` - 战斗行动表

## License

MIT
