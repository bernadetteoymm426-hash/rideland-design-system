-- 数据库迁移回滚脚本
-- 按相反顺序删除所有表

DROP TABLE IF EXISTS war_actions;
DROP TABLE IF EXISTS wars;
DROP TABLE IF EXISTS territories;
DROP TABLE IF EXISTS contributions;
DROP TABLE IF EXISTS ride_records;
DROP TABLE IF EXISTS team_members;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS users;

-- 删除 PostGIS 扩展（如果不再需要）
-- DROP EXTENSION IF EXISTS postgis;
