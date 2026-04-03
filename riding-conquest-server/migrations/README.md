# Database Migrations

数据库迁移文件目录。

## 使用方法

```bash
# 创建新迁移
migrate create -ext sql -dir migrations -seq create_users_table

# 执行迁移
migrate -path migrations -database "mysql://user:pass@tcp(host:port)/dbname" up

# 回滚迁移
migrate -path migrations -database "mysql://user:pass@tcp(host:port)/dbname" down
```

## 迁移文件列表

- 001_create_users_table.sql
- 002_create_teams_table.sql
- 003_create_team_members_table.sql
- 004_create_ride_records_table.sql
- 005_create_contributions_table.sql
- 006_create_territories_table.sql
- 007_create_wars_table.sql
- 008_create_war_actions_table.sql
- 009_create_indexes.sql
