# 🚀 骑行征服 H5 - Alpha 开发总计划

**文档版本**: v1.0  
**创建时间**: 2026-04-01 09:30  
**创建人**: 万钳 🔧  
**基于文档**: PRD v1.0 + Architecture.md + Design System v1.0 + GAP Analysis

> **重要说明**: 本文档为 Alpha 阶段（50 战队内测）的完整开发计划，涵盖从当前状态到上线的所有工作任务。新会话中可直接参考本文档继续执行。

---

## 📋 执行摘要

### 项目目标

**Alpha 阶段目标**: 50 个战队内测上线，验证"骑行→领土变化"核心闭环

**上线时间**: 2026-04-21（原计划 04-10，根据实际进度调整）

**核心功能**: PRD 定义的 9 项 MVP 功能 + 44 项 FR 需求

### 当前状态总览

| 维度 | 完成度 | 说明 | 差距 |
|------|--------|------|------|
| **前端框架** | ✅ 100% | Vue 3 + TypeScript + Vite + ECharts | 无 |
| **视觉设计** | ✅ 100% | 科技地理深色主题 | 无 |
| **地图功能** | 🟡 60% | 县区级渲染完成 | 缺领土着色/详情弹窗/家乡定位 |
| **核心页面** | 🟡 70% | 5 个主页面 + 测试页 | 缺周循环状态条/攻城浮层 |
| **后端框架** | 🟡 30% | Go + Gin 已搭建 | 缺接口实现/数据库/缓存 |
| **数据对接** | ❌ 0% | 骑行数据/战队数据 | 完全缺失 |
| **Alpha 就绪** | ❌ 30% | 距 50 战队内测 | 大量工作待完成 |

### 关键发现

1. **设计风格已变更** - 从 PRD 的"白金帝王风"改为"科技地理风"（2026-03-20）
2. **架构决策已明确** - 模块化单体 + PostgreSQL + Redis + JSBridge 认证（2026-03-07）
3. **地图功能有差距** - PRD 要求 2800 县区 + 三级下钻 + 领土着色，当前仅完成基础渲染
4. **后端几乎为零** - PRD 要求 44 个功能需求，后端实现几乎为 0
5. **时间紧迫** - 有效开发时间约 20 天（04-01 ~ 04-21）

---

## 🎯 完整工作清单（WBS）

### 阶段划分

```
当前：2026-04-01
Week 1 (04-01~04-07):  地图完善 + 前端核心功能 + 环境确认
Week 2 (04-08~04-14):  后端开发 + 数据库设计 + 核心接口
Week 3 (04-15~04-21):  前后端联调 + 测试优化 + Alpha 上线
```

---

### Week 1: 地图完善 + 前端核心 + 环境确认（04-01 ~ 04-07）

#### 优先级 P0 - 本周必须完成

| # | 任务 ID | 任务名称 | 预计工时 | 依赖 | 交付物 | 状态 |
|---|--------|---------|---------|------|--------|------|
| 1.1 | FE-MAP-01 | **地图领土着色** | 4h | 无 | ✅ 完成 | ✅ |
| 1.2 | FE-MAP-02 | **区域详情弹窗** | 6h | 1.1 | ✅ 完成（测试按钮可触发） | ✅ |
| 1.3 | FE-MAP-03 | **家乡自动定位** | 4h | 无 | ✅ 完成（Mock 数据 + 弹窗选择） | ✅ |
| 1.4 | FE-MAP-04 | **周循环状态条** | 4h | 无 | ✅ 完成（阶段显示 + 倒计时 + 进度条） | ✅ |
| 1.5 | FE-MAP-05 | **攻城进度浮层** | 6h | 1.2 | 骑行后显示贡献百分比 | ⏳ |
| 1.6 | FE-TEAM-01 | **战队创建/加入** | 8h | 无 | 完整流程（Mock 数据） | ⏳ |
| 1.7 | FE-TEAM-02 | **大本营选择** | 4h | 1.6 | 首次设置战队区域 | ⏳ |
| 1.8 | FE-UI-01 | **等宽数字字体** | 2h | 无 | 倒计时/数据展示 | ⏳ |
| 1.9 | ENV-01 | **确认 PostgreSQL 环境** | 1h | 无 | ✅ v18.3 已启动 | ✅ |
| 1.10 | ENV-02 | **确认 Redis 环境** | 1h | 无 | ✅ v8.6.2 已启动 | ✅ |
| 1.11 | ENV-03 | **确认 Node.js 环境** | 0.5h | 无 | ✅ v20.19.0 可用 | ✅ |
| 1.12 | ENV-04 | **确认 Go 环境** | 1h | 无 | ✅ v1.26.1 可用 | ✅ |

**Week 1 交付物**:
- [ ] 地图完整功能（着色 + 详情 + 家乡）
- [ ] 周循环状态条
- [ ] 战队管理（Mock）
- [ ] 攻城进度可视化
- [ ] 开发环境就绪（PostgreSQL/Redis/Go）

---

### Week 2: 后端开发 + 数据库设计（04-08 ~ 04-14）

#### 优先级 P0 - 核心闭环

| # | 任务 ID | 任务名称 | 预计工时 | 依赖 | 交付物 | 状态 |
|---|--------|---------|---------|------|--------|------|
| 2.1 | BE-DB-01 | **数据库表设计** | 4h | 1.9 | 用户/战队/领土/骑行表结构 | ⏳ |
| 2.2 | BE-DB-02 | **数据库迁移脚本** | 4h | 2.1 | golang-migrate 脚本 | ⏳ |
| 2.3 | BE-AUTH-01 | **用户认证（JSBridge）** | 4h | 2.1 | Token 中继模式实现 | ⏳ |
| 2.4 | BE-TEAM-01 | **战队 CRUD 接口** | 8h | 2.3 | 创建/加入/退出接口 | ⏳ |
| 2.5 | BE-MAP-01 | **领土查询接口** | 4h | 2.1 | GET /api/territories | ⏳ |
| 2.6 | BE-RIDE-01 | **骑行数据提交** | 8h | 2.3 | POST /api/ride/submit | ⏳ |
| 2.7 | BE-WAR-01 | **攻防计算逻辑** | 12h | 2.6 | 里程→攻击力算法 | ⏳ |
| 2.8 | BE-CACHE-01 | **Redis 缓存层** | 6h | 2.1 | Write-Through 实现 | ⏳ |
| 2.9 | FE-STORE-01 | **创建 Pinia 6 Store** | 6h | 2.4 | map/team/war/user/cycle/notify | ⏳ |
| 2.10 | FE-COMP-01 | **创建 Composables 层** | 6h | 2.9 | useMap/useTeam/useWar | ⏳ |
| 2.11 | BE-API-01 | **统一错误中间件** | 3h | 2.4 | 错误码分段处理 | ⏳ |
| 2.12 | BE-API-02 | **前后端联调** | 8h | 2.4-2.8 | 完整骑行→攻防闭环 | ⏳ |

**Week 2 交付物**:
- [ ] 数据库表结构 + 迁移脚本
- [ ] 后端核心接口（战队/领土/骑行/攻防）
- [ ] Redis 缓存层
- [ ] Pinia Store + Composables
- [ ] 骑行→攻防转化闭环

---

### Week 3: 测试优化 + Alpha 上线（04-15 ~ 04-21）

| # | 任务 ID | 任务名称 | 预计工时 | 依赖 | 交付物 | 状态 |
|---|--------|---------|---------|------|--------|------|
| 3.1 | TEST-01 | **功能测试** | 8h | Week 2 | 测试报告 + Bug 列表 | ⏳ |
| 3.2 | TEST-02 | **性能测试** | 4h | 3.1 | 帧率/加载时间报告 | ⏳ |
| 3.3 | TEST-03 | **兼容性测试** | 4h | 3.1 | iOS/Android 主流机型报告 | ⏳ |
| 3.4 | FIX-01 | **Bug 修复（P0/P1）** | 12h | 3.2 | 修复所有 P0/P1 bug | ⏳ |
| 3.5 | OPT-01 | **性能优化** | 6h | 3.4 | 代码分割/懒加载 | ⏳ |
| 3.6 | OPT-02 | **地图性能优化** | 4h | 3.2 | LOD + 渲染降级 | ⏳ |
| 3.7 | DEPLOY-01 | **生产环境部署** | 4h | 3.5 | Alpha 环境上线 | ⏳ |
| 3.8 | DEPLOY-02 | **GeoJSON 上 CDN** | 2h | 3.7 | 阿里云 CDN 配置 | ⏳ |
| 3.9 | DEPLOY-03 | **监控告警配置** | 4h | 3.7 | 异常告警通知 | ⏳ |
| 3.10 | LAUNCH-01 | **50 战队邀请** | 2h | 3.7 | 发送邀请码 | ⏳ |
| 3.11 | LAUNCH-02 | **运维脚本集** | 4h | 3.7 | 备份/恢复/日志查询 | ⏳ |

**Week 3 交付物**:
- [ ] 测试报告（功能/性能/兼容性）
- [ ] 所有 P0/P1 bug 修复
- [ ] Alpha 版本上线
- [ ] 50 个战队激活
- [ ] 监控告警就绪

---

## 📊 功能需求实现计划（44 项 FR）

### 地图与领土（FR1-FR5）

| FR | 需求 | 实现方案 | 任务 ID | 状态 |
|----|------|---------|--------|------|
| FR1 | 全国领土概览 | ECharts + GeoJSON + 领土着色 | FE-MAP-01 | 🟡 |
| FR2 | 三级下钻 | 全国→省→县区点击下钻 | CountyMap.vue | ✅ |
| FR3 | 区域详情 | 弹窗显示归属/城防/进度 | FE-MAP-02 | ⏳ |
| FR4 | 领土识别 | 绿/红/灰色半透明着色 | FE-MAP-01 | 🟡 |
| FR5 | 家乡定位 | IP 定位或手动选择 + 高亮 | FE-MAP-03 | ⏳ |

### 战队管理（FR6-FR14a）

| FR | 需求 | 实现方案 | 任务 ID | 状态 |
|----|------|---------|--------|------|
| FR6 | 创建战队 | 1 人创建/3 人激活 | FE-TEAM-01 | ⏳ |
| FR7 | 3 人激活 | 自动检测成员数 | BE-TEAM-01 | ⏳ |
| FR8 | 搜索加入 | 搜索 + 申请流程 | FE-TEAM-01 | ⏳ |
| FR9 | 会长审批 | 审批界面 | FE-TEAM-01 | ⏳ |
| FR10 | 大本营选择 | 首次设置区域 | FE-TEAM-02 | ⏳ |
| FR11 | 战队信息 | 成员/领土/战况展示 | FE-TEAM-01 | ⏳ |
| FR12 | 主动退出 | 退出按钮 + 确认 | FE-TEAM-01 | ⏳ |
| FR13 | 会长解散 | 解散功能 | FE-TEAM-01 | ⏳ |
| FR14 | 贡献归属 | 历史数据不变 | BE-TEAM-01 | ⏳ |
| FR14a | 转会冷却 | 72 小时冷却期 | BE-TEAM-01 | ⏳ |

### 骑行贡献（FR15-FR18）

| FR | 需求 | 实现方案 | 任务 ID | 状态 |
|----|------|---------|--------|------|
| FR15 | 获取骑行数据 | JSBridge 获取 | BE-RIDE-01 | ⏳ |
| FR15a | 基线校验 | 速度/时长/里程校验 | BE-RIDE-01 | ⏳ |
| FR16 | 里程→贡献 | 自动转化 | BE-RIDE-01 | ⏳ |
| FR17 | 即时反馈 | 骑行结束显示进度 | FE-MAP-05 | ⏳ |
| FR18 | 历史记录 | 贡献记录查询 | BE-RIDE-01 | ⏳ |

### 宣战与攻防（FR19-FR24b）

| FR | 需求 | 实现方案 | 任务 ID | 状态 |
|----|------|---------|--------|------|
| FR19 | 会长宣战 | 选择目标区域 | BE-WAR-01 | ⏳ |
| FR20 | 公开展示 | 所有宣战列表 | BE-WAR-01 | ⏳ |
| FR21 | 里程累计 | 攻守双方实时累计 | BE-WAR-01 | ⏳ |
| FR22 | 实时进度 | 查看攻防进度 | FE-MAP-05 | ⏳ |
| FR23 | 自动结算 | 周日 12:00 结算 | BE-CYCLE-01 | ⏳ |
| FR24 | 归属变更 | 地图立即反映 | FE-MAP-01 | 🟡 |
| FR24a | 城防衰减 | 每周自动衰减 | BE-WAR-01 | ⏳ |
| FR24b | 排他占领 | 一区域一战队的 | BE-WAR-01 | ⏳ |

### 会长指挥（FR25-FR28）

| FR | 需求 | 实现方案 | 任务 ID | 状态 |
|----|------|---------|--------|------|
| FR25 | 智能推荐 | 距离 + 城防推荐 | BE-COMMAND-01 | ⏳ |
| FR26 | 一键确认 | 推荐确认按钮 | FE-COMMAND-01 | ⏳ |
| FR27 | 手动修改 | 自定义目标 | FE-COMMAND-01 | ⏳ |
| FR28 | 自动兜底 | 不操作自动执行 | BE-COMMAND-01 | ⏳ |

### 周战报（FR29-FR31）

| FR | 需求 | 实现方案 | 任务 ID | 状态 |
|----|------|---------|--------|------|
| FR29 | 周日生成 | 定时任务生成 | BE-REPORT-01 | ⏳ |
| FR30 | 战报展示 | 领土变化/结果/排名 | FE-REPORT-01 | ⏳ |
| FR31 | 个人排名 | 战队内贡献排名 | FE-REPORT-01 | ⏳ |

### 首次体验（FR32-FR34）

| FR | 需求 | 实现方案 | 任务 ID | 状态 |
|----|------|---------|--------|------|
| FR32 | 家乡定位 | 自动定位展示 | FE-MAP-03 | ⏳ |
| FR33 | 引导流程 | ≥3 步骤引导 | FE-ONBOARD-01 | ⏳ |
| FR34 | 创建/加入 | 引导中选择 | FE-TEAM-01 | ⏳ |

### 系统周期（FR35-FR37c）

| FR | 需求 | 实现方案 | 任务 ID | 状态 |
|----|------|---------|--------|------|
| FR35 | 周循环 | 固定周期运行 | BE-CYCLE-01 | ⏳ |
| FR36 | 自动操作 | 阶段切换自动化 | BE-CYCLE-01 | ⏳ |
| FR37 | 运营查询 | 活跃/里程/异常查询 | BE-ADMIN-01 | ⏳ |
| FR37a | 数据导出 | 导出功能 | BE-ADMIN-01 | ⏳ |
| FR37b | 操作日志 | 记录所有操作 | BE-ADMIN-01 | ⏳ |
| FR37c | 自动告警 | 异常触发告警 | DEPLOY-03 | ⏳ |

### 推送通知（FR38-FR40）

| FR | 需求 | 实现方案 | 任务 ID | 状态 |
|----|------|---------|--------|------|
| FR38 | 被宣战推送 | 推送通知 | BE-NOTIFY-01 | ⏳ |
| FR39 | 战报推送 | 周日推送 | BE-NOTIFY-01 | ⏳ |
| FR40 | 接近胜利推送 | Beta 阶段 | - | ⏸️ |

### 数据可见性（FR41-FR44）

| FR | 需求 | 实现方案 | 任务 ID | 状态 |
|----|------|---------|--------|------|
| FR41 | 公开信息 | 战队信息可查 | BE-API-01 | ⏳ |
| FR42 | 贡献数据 | 成员贡献可查 | BE-API-01 | ⏳ |
| FR43 | 排行榜 | 总里程/人均排名 | BE-RANK-01 | ⏳ |
| FR44 | 分组查看 | 按规模分组 | BE-RANK-01 | ⏳ |

---

## 🏗️ 架构实现计划

### 后端模块结构（Go + Gin）

```
riding-conquest-server/
├── cmd/
│   └── server/
│       └── main.go          # 入口文件
├── internal/
│   ├── server/              # HTTP 服务器
│   │   ├── router.go        # 路由定义
│   │   ├── middleware/      # 中间件（认证/限流/错误处理）
│   │   └── handler/         # Handler 函数
│   ├── database/            # 数据库连接
│   │   ├── postgres.go      # PostgreSQL 连接
│   │   └── redis.go         # Redis 连接
│   ├── map/                 # 地图与领土模块
│   │   ├── handler.go
│   │   ├── service.go
│   │   └── repository.go
│   ├── team/                # 战队管理模块
│   │   ├── handler.go
│   │   ├── service.go
│   │   └── repository.go
│   ├── ride/                # 骑行贡献模块
│   │   ├── handler.go
│   │   ├── service.go
│   │   └── repository.go
│   ├── war/                 # 宣战与攻防模块
│   │   ├── handler.go
│   │   ├── service.go
│   │   └── repository.go
│   ├── cycle/               # 系统周期模块
│   │   ├── handler.go
│   │   ├── service.go
│   │   └── scheduler.go     # 定时任务
│   └── notify/              # 推送通知模块
│       ├── handler.go
│       ├── service.go
│       └── push.go
├── migrations/              # 数据库迁移
│   ├── 000001_create_map_tables.up.sql
│   └── ...
├── configs/                 # 配置文件
├── scripts/                 # 运维脚本
└── go.mod
```

### 前端目录结构（Vue 3 + Pinia）

```
riding-conquest-h5/
├── src/
│   ├── components/
│   │   ├── common/          # 通用 UI 组件
│   │   └── business/        # 业务组件
│   ├── views/               # 页面级组件
│   │   ├── HomeView.vue
│   │   ├── MapView.vue
│   │   ├── TeamView.vue
│   │   ├── RideView.vue
│   │   ├── RankView.vue
│   │   └── ProfileView.vue
│   ├── composables/         # 组合式函数（新增）
│   │   ├── useMap.ts
│   │   ├── useTeam.ts
│   │   ├── useWar.ts
│   │   ├── useUser.ts
│   │   ├── useCycle.ts
│   │   └── useNotify.ts
│   ├── stores/              # Pinia Store（新增）
│   │   ├── map.ts
│   │   ├── team.ts
│   │   ├── war.ts
│   │   ├── user.ts
│   │   ├── cycle.ts
│   │   └── notify.ts
│   ├── api/                 # API 调用封装
│   │   ├── map.ts
│   │   ├── team.ts
│   │   ├── war.ts
│   │   └── ride.ts
│   ├── types/               # TypeScript 类型
│   ├── utils/               # 工具函数
│   ├── styles/              # 全局样式
│   ├── router/              # 路由配置
│   ├── App.vue
│   └── main.ts
├── public/
│   └── china.json           # GeoJSON 数据
└── package.json
```

### 数据库表结构（PostgreSQL）

```sql
-- 用户表（复用顽鹿体系，本地只存关联）
CREATE TABLE users (
  user_id BIGINT PRIMARY KEY,          -- 顽鹿用户 ID
  nickname VARCHAR(50),
  avatar_url VARCHAR(255),
  hometown_code VARCHAR(6),            -- 家乡区域代码
  created_at TIMESTAMP DEFAULT NOW()
);

-- 战队表
CREATE TABLE team_teams (
  team_id BIGSERIAL PRIMARY KEY,
  team_name VARCHAR(50) NOT NULL,
  captain_id BIGINT NOT NULL REFERENCES users(user_id),
  headquarters_code VARCHAR(6),        -- 大本营区域代码
  member_count INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'inactive', -- inactive/active/disbanded
  created_at TIMESTAMP DEFAULT NOW()
);

-- 战队成员表
CREATE TABLE team_members (
  id BIGSERIAL PRIMARY KEY,
  team_id BIGINT NOT NULL REFERENCES team_teams(team_id),
  user_id BIGINT NOT NULL REFERENCES users(user_id),
  role VARCHAR(20) DEFAULT 'member',   -- captain/member
  joined_at TIMESTAMP DEFAULT NOW(),
  cooldown_until TIMESTAMP,            -- 冷却期结束时间
  UNIQUE(team_id, user_id)
);

-- 领土表
CREATE TABLE map_territories (
  territory_code VARCHAR(6) PRIMARY KEY,  -- 区域代码（6 位）
  territory_name VARCHAR(50),
  parent_code VARCHAR(2),                 -- 父级代码（省）
  level VARCHAR(20),                      -- county/city/province
  center_lon DECIMAL(10, 8),
  center_lat DECIMAL(10, 8)
);

-- 领土归属表
CREATE TABLE map_ownership (
  id BIGSERIAL PRIMARY KEY,
  territory_code VARCHAR(6) NOT NULL REFERENCES map_territories(territory_code),
  team_id BIGINT REFERENCES team_teams(team_id),  -- NULL=无主
  defense_value INT DEFAULT 100,         -- 城防值
  occupied_at TIMESTAMP,
  UNIQUE(territory_code)
);

-- 骑行贡献表
CREATE TABLE ride_contributions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(user_id),
  team_id BIGINT NOT NULL REFERENCES team_teams(team_id),
  ride_id VARCHAR(50),                   -- 骑行记录 ID（顽鹿）
  ride_distance DECIMAL(10, 2),          -- 骑行里程（km）
  ride_time TIMESTAMP,                   -- 骑行完成时间
  contribution_value DECIMAL(10, 2),     -- 贡献值
  status VARCHAR(20) DEFAULT 'pending',  -- pending/verified/rejected
  created_at TIMESTAMP DEFAULT NOW()
);

-- 宣战表
CREATE TABLE war_declarations (
  id BIGSERIAL PRIMARY KEY,
  attacker_team_id BIGINT NOT NULL REFERENCES team_teams(team_id),
  defender_team_id BIGINT REFERENCES team_teams(team_id),  -- NULL=无主之地
  territory_code VARCHAR(6) NOT NULL REFERENCES map_territories(territory_code),
  week_start DATE NOT NULL,              -- 对战周开始日期
  status VARCHAR(20) DEFAULT 'declared', -- declared/ongoing/settled
  declared_at TIMESTAMP DEFAULT NOW()
);

-- 攻防战斗表
CREATE TABLE war_battles (
  id BIGSERIAL PRIMARY KEY,
  war_id BIGINT NOT NULL REFERENCES war_declarations(id),
  team_id BIGINT NOT NULL REFERENCES team_teams(team_id),
  side VARCHAR(20) NOT NULL,             -- attacker/defender
  total_distance DECIMAL(10, 2),         -- 累计里程
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(war_id, team_id, side)
);

-- 周循环表
CREATE TABLE cycle_weeks (
  id BIGSERIAL PRIMARY KEY,
  week_start DATE NOT NULL UNIQUE,
  week_end DATE NOT NULL,
  phase VARCHAR(20) NOT NULL,            -- battle/settling/report/declaring
  settled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 结算记录表
CREATE TABLE cycle_settlements (
  id BIGSERIAL PRIMARY KEY,
  week_id BIGINT NOT NULL REFERENCES cycle_weeks(id),
  war_id BIGINT NOT NULL REFERENCES war_declarations(id),
  winner_team_id BIGINT REFERENCES team_teams(team_id),
  settlement_data JSONB,                 -- 结算详情
  settled_at TIMESTAMP DEFAULT NOW()
);
```

---

## 📈 里程碑与验收标准

### Milestone 1: 地图完善（04-07）

**验收标准**:
- [ ] 地图可显示 2800 县区
- [ ] 点击县区显示详情弹窗（归属/城防/进度）
- [ ] 首次打开自动定位家乡
- [ ] 领土着色正确（绿/红/灰）
- [ ] 周循环状态条正常显示
- [ ] 战队创建/加入流程可用（Mock）

### Milestone 2: 核心闭环（04-14）

**验收标准**:
- [ ] 用户可以创建/加入战队
- [ ] 用户可以提交骑行里程
- [ ] 里程自动转化为攻防贡献
- [ ] 攻城进度实时更新
- [ ] 后端接口响应 <500ms
- [ ] Redis 缓存正常工作

### Milestone 3: Alpha 上线（04-21）

**验收标准**:
- [ ] 所有 P0 bug 修复
- [ ] 首屏加载 <1 秒
- [ ] 地图帧率 ≥30fps（低端机）
- [ ] 50 个战队激活
- [ ] 服务可用性 ≥99.5%
- [ ] 监控告警配置完成

---

## ⚠️ 风险与缓解

### 技术风险

| 风险 | 等级 | 影响 | 缓解方案 | 负责人 |
|------|------|------|---------|--------|
| **地图性能不达标** | 🔴 高 | 低端机卡顿 | LOD + 按需加载 + 渲染降级 | 万钳 |
| **后端开发延期** | 🔴 高 | 无法联调 | 优先核心接口，砍非必要功能 | 万钳 |
| **PostgreSQL 未安装** | 🟡 中 | 阻塞后端 | 立即检查，未安装则安装 | 万钳 |
| **JSBridge 对接失败** | 🟡 中 | 认证断裂 | 先用 Mock Token 验证流程 | 万钳 |
| **骑行数据对接失败** | 🟡 中 | 核心闭环断裂 | 先用 Mock 数据验证 | 万钳 |

### 进度风险

| 风险 | 缓解方案 | 触发条件 |
|------|---------|---------|
| **04-21 上线不可行** | 调整到 04-28，优先保证核心功能 | Week 2 结束时完成度<50% |
| **功能范围蔓延** | 严格按 PRD Alpha 范围，Beta 功能全部延后 | 发现新增需求 |
| **测试时间不足** | Week 3 预留 2 天 buffer | Bug 数量>20 |
| **一人开发瓶颈** | AI 辅助提效，聚焦 P0 功能 | 进度滞后>3 天 |

### 运维风险

| 风险 | 缓解方案 |
|------|---------|
| **生产环境故障** | 告警分级 + 自动化恢复脚本 |
| **数据丢失** | 每日备份 + 恢复演练 |
| **性能问题** | 监控 + 限流 + 降级预案 |

---

## 🎯 下一步行动（今天）

**立即执行（04-01）**:
1. ⏳ 检查 PostgreSQL 环境（ENV-01，1h）
2. ⏳ 检查 Redis 环境（ENV-02，1h）
3. ⏳ 检查 Go 环境（ENV-04，1h）
4. ⏳ 地图领土着色（FE-MAP-01，4h）
5. ⏳ 区域详情弹窗（FE-MAP-02，6h）

**明天执行（04-02）**:
6. ⏳ 家乡自动定位（FE-MAP-03，4h）
7. ⏳ 周循环状态条（FE-MAP-04，4h）
8. ⏳ 攻城进度浮层（FE-MAP-05，6h）

---

## 📞 联系信息

**项目负责人**: Mark（马高峰）  
**开发**: 万钳（AI 助手）  
**文档位置**: `/Users/marksmacmini/Documents/AI/Project/Project 001/ALPHA-DEVELOPMENT-PLAN.md`  
**下次更新**: 2026-04-01 19:00（每日同步进度）

---

## 📝 变更历史

| 版本 | 日期 | 变更内容 | 作者 |
|------|------|---------|------|
| v1.0 | 2026-04-01 | 初始版本，整合 PRD/架构/差距分析 | 万钳 |

---

**文档结束**
