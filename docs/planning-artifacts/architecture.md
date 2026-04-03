---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - 'docs/planning-artifacts/prd.md'
  - 'docs/brainstorming/brainstorming-session-2026-03-06-1200.md'
  - 'docs/User Profile.md'
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-03-07'
project_name: 'Project 001'
user_name: 'Mark'
date: '2026-03-07'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## 项目上下文分析（Project Context Analysis）

### 需求概览

**功能需求（51项 FR）：**

| 领域 | FR数量 | 架构影响 |
|---|---|---|
| 地图与领土 | FR1-FR5 (5项) | ECharts三级下钻渲染引擎，GeoJSON数据管理，CDN分发策略 |
| 战队管理 | FR6-FR14a (10项) | 用户-战队关系模型，成员变动状态机，冷却期规则引擎 |
| 骑行贡献 | FR15-FR18 (4项) | 外部数据同步管道，异常检测服务，实时进度计算 |
| 宣战与攻防 | FR19-FR24b (8项) | 攻防计算引擎，并发冲突解决，领土状态管理 |
| 会长作战指挥 | FR25-FR28 (4项) | 推荐算法，兜底自动化，决策窗口期管理 |
| 周战报 | FR29-FR31 (3项) | 报告生成引擎，推送通道集成 |
| 首次体验 | FR32-FR34 (3项) | 地理定位，引导流程状态机 |
| 系统周期 | FR35-FR37c (6项) | 定时任务调度，结算事务引擎，运营工具集 |
| 推送通知 | FR38-FR40 (3项) | 推送通道对接，消息队列 |
| 数据可见性 | FR41-FR44 (4项) | API权限分层，排行榜聚合查询 |

全部51项FR中，50项标记为[Alpha]，1项（FR40接近胜利推送）标记为[Beta]。

**非功能需求（24项 NFR）：**

| 类别 | 关键架构驱动力 |
|---|---|
| 性能 (NFR1-6) | 首屏P90<1秒、地图≥30fps、API P95<500ms、500+并发 |
| 安全 (NFR7-11) | 宿主App认证复用、骑行数据来源校验、异常检测、HTTPS |
| 可扩展性 (NFR12-15) | Alpha 50队→Beta 200队→GA 15万MAU，水平扩容不重写 |
| 可靠性 (NFR16-20) | 99%可用性、结算零失败/可回滚/幂等、每日备份 |
| 集成 (NFR21-24) | 宿主App接口<200ms、骑行同步<30秒、推送到达≥90%、降级处理 |

**规模与复杂度：**
- 主领域：H5 Web App + Golang Backend Service（游戏化体育社交）
- 复杂度级别：**高** — 实时攻防计算、2800+区域地图、战队治理、骑行数据对接、数值平衡
- 预估架构组件数：12-15个

### 技术约束与依赖

| 约束项 | 详情 |
|---|---|
| **宿主App嵌入** | H5运行于顽鹿运动App WebView内，非独立应用 |
| **JSBridge依赖** | 4个核心接口：用户认证、骑行数据获取、推送注册、分享调用 |
| **前端技术栈锁定** | Vue 3 + Vite + TypeScript + ECharts（顽鹿团队现有栈） |
| **后端技术栈锁定** | Golang + MySQL/PostgreSQL + Redis |
| **数据来源唯一** | 骑行数据只接受顽鹿运动App官方数据，不接受外部导入 |
| **开发资源** | Mark（产品+全栈）+ AI辅助，不依赖顽鹿研发团队 |

### 跨领域关注点

| 关注点 | 影响范围 | 说明 |
|---|---|---|
| **周循环状态机** | 攻防、结算、战报、宣战 | 全系统统一时序，状态切换驱动多个子系统联动 |
| **数据一致性** | 骑行贡献、领土归属、攻防进度 | 零数据丢失，最终一致性延迟<5分钟 |
| **降级策略** | JSBridge、推送、骑行数据同步 | 任一外部依赖不可用时，核心功能仍需运转 |
| **异常数据治理** | 骑行贡献、结算、排行榜 | 贯穿数据采集→计算→展示全链路 |
| **缓存一致性** | 地图状态、攻防进度、排行榜 | Redis缓存与DB数据源的同步策略 |
| **运营可控性** | 结算、异常处理、数据修正 | Alpha阶段通过脚本实现，需预留操作接口 |
| **可扩展性预留** | 全部模块 | Alpha→Beta不重写，水平扩容即可 |

### 架构洞察（Advanced Elicitation 成果）

#### 1. 架构决策记录（ADR）

通过5轮架构辩论达成共识：

| # | 决策 | 共识结论 |
|---|---|---|
| ADR-1 | 服务架构模式 | **模块化单体（Modular Monolith）**，6个领域模块，结算模块具有独立事务边界。非微服务——Alpha阶段一人开发，模块间通过接口隔离，Beta可按需拆分 |
| ADR-2 | 周循环驱动机制 | **Cron + 状态机守卫**，DB为权威数据源，Redis缓存当前状态。状态机确保周循环各阶段有序推进，双写策略（DB先写→Redis同步） |
| ADR-3 | 骑行数据同步策略 | **轮询 + 增量拉取**，本地队列缓冲。骑行结束后主动拉取→入本地队列→异步处理。预留Push接口供Beta阶段升级 |
| ADR-4 | 地图数据与业务数据分离 | **GeoJSON CDN分省懒加载（静态）+ API获取业务状态（动态）**，Redis缓存业务数据，前端合并渲染。静态数据gzip压缩上CDN，业务数据走API+缓存 |
| ADR-5 | 数据库选型 | **待定（OPEN）**— MySQL vs PostgreSQL，待Mark确认偏好。两者均可满足需求，PostgreSQL在GIS和JSON支持上略优 |

#### 2. 预失败分析（Pre-mortem）

5个高概率失败场景及预防措施：

| 失败场景 | 核心预防策略 |
|---|---|
| **地图性能灾难**（低端机卡死） | 低端设备准入检测、多精度GeoJSON（全国简化/省级中等/县区详细）、渲染预算控制（超时降级） |
| **结算数据不一致**（里程重复/丢失） | 快照机制（结算前锁定数据快照）、数据锁定窗口、结算预演（dry-run验证后再正式执行） |
| **骑行数据同步黑洞**（数据丢失用户无感知） | 前端同步状态可视化、端到端SLA监控、补偿队列（数据服务恢复后自动补录） |
| **独立运维疲劳**（一人扛不住） | 告警分级（P0自动恢复/P1通知/P2日报）、90%自动化目标、完整运维脚本集 |
| **空地图综合征**（活跃区域太少） | 视觉迷雾策略（未探索区域用迷雾覆盖）、多因素推荐（引导战队分散攻击）、全局活跃度聚合展示 |

#### 3. 故障模式分析（FMA）

7个核心组件的故障矩阵：

| 组件 | P0故障（立即处理） | P1故障（4小时内） | P2故障（24小时内） |
|---|---|---|---|
| **地图渲染器** | CDN多源回退 | 内存监控+降级 | ID一致性校验 |
| **数据管道** | 幂等写入（唯一键去重） | 时间戳排序保证 | 两级异常检测 |
| **结算引擎** | 快照表+事务回滚 | 固定锁顺序防死锁 | 按省批处理+超时告警 |
| **状态机** | 心跳监控+自动触发 | 最大等待超时 | DB权威+定期对账 |
| **JSBridge** | 启动时可用性检查 | 版本协商机制 | 3秒超时+降级路径 |
| **推送通道** | 消息过期时间戳 | 游戏内通知中心降级 | — |
| **Redis** | 非权威缓存设计 | TTL抖动防雪崩 | 写DB→删Redis模式 |

#### 4. 跨职能作战室（War Room）

5个跨职能议题的设计决策：

| 议题 | 决策 |
|---|---|
| **首屏加载策略** | 三层渲染：Layer 0 内嵌骨架屏（<500ms）→ Layer 1 CDN简化地图（<1.5s）→ Layer 2 定位+下钻数据（<3s）。用户在500ms内看到界面，1.5s内看到全国概览 |
| **会长推荐算法** | Alpha阶段规则引擎（距离因子+城防因子），支持"本周不攻击/不防御"选项。Beta阶段引入更复杂的策略模型 |
| **数据可见性** | API权限分层中间件；Alpha阶段完全透明（所有战队数据可查），Beta阶段按需收紧 |
| **前端状态管理** | Pinia 5-6个Store按领域划分（地图、战队、攻防、用户、周期、通知）；按场景选择轮询频率；周期阶段驱动全局UI状态 |
| **独立开发取舍** | 4项"必须做"（模块化单体、完整错误处理、自动化测试核心路径、运维脚本集）+ 5项"可简化"（无运营后台、无API版本管理、简单限流、日志级监控、手动备份验证）。Alpha分两批交付 |

#### 5. 混沌猴场景（Chaos Monkey）

5个极端故障场景的韧性设计：

| 极端场景 | 韧性策略 |
|---|---|
| **结算时刻DB宕机** | 本地写入缓冲区；状态链驱动周期推进（非固定时钟），宕机恢复后从断点继续结算 |
| **Redis全量清空** | 每个缓存key必须有DB回退函数；热数据预热脚本；DB连接池≥50以承受缓存击穿 |
| **骑行数据突增10倍** | 全局统计异常监控；贡献值覆写支持；批量时间范围回滚能力 |
| **推送通道拥塞** | 推送与业务数据解耦；游戏内独立通知系统作为降级方案 |
| **API洪峰流量** | 计算密集型端点结果缓存；渐进式限流（429→临时封禁）；统一中间件处理 |

## 技术起步模板评估（Starter Template Evaluation）

### 主要技术领域

**双栈项目**：H5 Web App（前端）+ Golang Backend Service（后端），基于PRD技术栈锁定。

### 前端起步方案：create-vue v3.22.0

**选择理由：** Vue官方脚手架，与PRD锁定的Vue 3 + Vite + TypeScript技术栈完全匹配，社区维护活跃。

**初始化命令：**

```bash
npm create vue@latest riding-conquest-h5 -- --typescript --pinia --vitest --eslint --prettier --bare
```

**脚手架提供的技术决策：**

| 决策项 | 提供内容 | 版本 |
|---|---|---|
| 语言 | TypeScript（默认启用） | TS 5.x |
| 构建工具 | Vite | v6.x |
| 状态管理 | Pinia | v3.x |
| 单元测试 | Vitest | v3.x |
| 代码检查 | ESLint + Oxlint（v3.22.0自动包含） | — |
| 代码格式化 | Prettier | — |
| 项目结构 | `--bare` 最小模板（无示例代码） | — |

**需手动添加：**

| 技术 | 用途 | 说明 |
|---|---|---|
| **UnoCSS** | 原子化CSS方案 | Vite原生集成，替代Tailwind |
| **ECharts v6 + vue-echarts v8.0.1** | 地图渲染引擎 | 地图数据不内置，需自行引入GeoJSON |
| **GeoJSON数据** | 省/市/县区边界 | CDN分省懒加载，`registerMap()` 注册，Canvas渲染器优先（2800+县区性能更优） |
| **Playwright** | E2E测试 | 补充Vitest的单元测试覆盖 |
| **HTTP客户端** | API调用 | fetch封装或axios |

**ECharts地图集成要点：**
- ECharts v6起不再内置地图数据，需自行获取GeoJSON
- 推荐模式：CDN托管GeoJSON → 按需懒加载 → `echarts.registerMap(name, geoJSON)` → 地图Series渲染
- Canvas渲染器优先（2800+区域场景下性能优于SVG）
- 多精度策略：全国简化版（首屏）→ 省级中等精度 → 县区详细版

### 后端起步方案：go-blueprint + Gin v1.12.0

**框架选型对比：**

| 框架 | 版本 | Stars | 状态 | 适用性 |
|---|---|---|---|---|
| **Gin** ✅ | v1.12.0 (2026.02) | 88k+ | 生产稳定 | 最佳选择——生态完整、文档丰富、生产验证 |
| Echo ⚠️ | v5.0.4 | 30k+ | v5大版本迁移中 | 不推荐——API变动风险 |
| stdlib | Go 1.22+ | — | 官方 | 适合简单场景，本项目需要中间件生态 |

**选择理由：** Gin v1.12生产稳定、88k+ stars社区支持、中间件生态完整（认证、限流、CORS等）、与go-blueprint脚手架完美配合。

**初始化命令：**

```bash
go-blueprint create --name riding-conquest-server --framework gin --driver postgres --advanced --feature docker --git commit
```

**脚手架提供的技术决策：**

| 决策项 | 提供内容 |
|---|---|
| Web框架 | Gin v1.12 |
| 数据库驱动 | pgx（PostgreSQL） |
| 项目结构 | cmd/ + internal/ 标准布局 |
| 容器化 | Dockerfile + docker-compose |
| 数据库 | PostgreSQL（确认选择，GIS/JSON支持更优） |

**需手动添加：**

| 技术 | 用途 |
|---|---|
| **go-redis** | Redis客户端，缓存层 |
| **golang-migrate** | 数据库迁移管理 |
| **slog** | 结构化日志（Go标准库） |
| **testify** | 测试断言库 |
| **swag** | Swagger API文档自动生成 |

**模块化单体扩展计划：**

基于ADR-1决策，go-blueprint生成的 `internal/` 目录将扩展为6个领域模块：

```
internal/
├── server/         # go-blueprint生成：HTTP服务器、路由、中间件
├── database/       # go-blueprint生成：数据库连接管理
├── map/            # 地图与领土管理（FR1-FR5）
├── team/           # 战队管理（FR6-FR14a）
├── ride/           # 骑行贡献（FR15-FR18）
├── war/            # 宣战与攻防（FR19-FR28）
├── cycle/          # 系统周期与结算（FR35-FR37c）
└── notify/         # 推送通知（FR38-FR40）
```

### 云平台与部署

- **云平台**：阿里云（Aliyun）——沿用顽鹿运动现有基础设施
- **部署方式**：Docker容器化部署
- **CDN**：阿里云CDN——GeoJSON静态资源分发

## 核心架构决策（Core Architectural Decisions）

### 决策优先级分析

**关键决策（阻塞实现）：**
- 数据建模方式（模块内聚）
- 认证方式（JSBridge Token → 后端验证 → 游戏Session）
- API设计风格（RESTful）
- 前端组件架构（三层分离）
- 部署架构（Alpha单机 → Beta拆分 → GA水平扩容）

**重要决策（塑造架构）：**
- 缓存策略（Write-Through + Cache-Aside）
- 错误处理标准（统一错误码分段）
- 路由策略（Hash模式）
- CI/CD流水线（GitHub Actions）
- 监控方案（日志级监控）

**延迟决策（Post-Alpha）：**
- WebSocket实时推送（Beta阶段评估）
- APM监控系统（Beta阶段引入）
- API版本管理（Beta阶段按需）
- 自动化部署到生产（Beta阶段开启）
- staging环境（Beta阶段搭建）

### 数据架构

#### 数据建模方式：模块内聚表设计

与ADR-1模块化单体架构一致，每个领域模块拥有自己的表，模块之间通过ID关联，不做跨模块复杂JOIN查询。表按模块前缀分组：

| 模块 | 表前缀 | 核心表示例 |
|---|---|---|
| map | `map_` | map_territories, map_ownership |
| team | `team_` | team_teams, team_members, team_applications |
| ride | `ride_` | ride_contributions, ride_sync_queue |
| war | `war_` | war_declarations, war_battles, war_progress |
| cycle | `cycle_` | cycle_weeks, cycle_settlements, cycle_snapshots |
| notify | `notify_` | notify_messages, notify_push_queue |

Alpha阶段同一个PostgreSQL实例，模块通过接口隔离访问。结算模块（cycle）具有独立事务边界（ADR-1）。

#### 数据库迁移策略：golang-migrate（文件迁移）

每次数据库结构变更编写SQL迁移文件，按顺序执行。可控、可审查、可回滚。

```
migrations/
├── 000001_create_map_tables.up.sql
├── 000001_create_map_tables.down.sql
├── 000002_create_team_tables.up.sql
├── 000002_create_team_tables.down.sql
└── ...
```

#### 缓存策略：Write-Through + Cache-Aside

基于ADR-2（DB权威 + Redis缓存）和FMA/Chaos Monkey洞察的细化方案：

| 维度 | 策略 |
|---|---|
| **写入模式** | Write-Through：写DB成功后更新/删除Redis |
| **读取模式** | Cache-Aside：先查Redis，未命中查DB并回填 |
| **TTL策略** | 地图状态5分钟、攻防进度30秒、排行榜1分钟 |
| **防雪崩** | TTL加随机抖动（±20%） |
| **Redis宕机** | 直接穿透到DB（非权威缓存设计） |
| **缓存击穿** | DB连接池≥50，承受缓存失效后的直接查询压力 |
| **热数据预热** | Redis重启后执行预热脚本，优先恢复地图状态和当前攻防数据 |

### 认证与安全

#### 认证方式：JSBridge Token中继

H5运行于顽鹿运动App WebView内，不需要独立的登录/注册系统。

**认证流程：**
1. H5启动 → JSBridge调用宿主App获取用户认证Token
2. 后端收到Token → 调用顽鹿App认证服务验证（或验签JWT）
3. 验证通过 → 签发游戏内短期Session Token
4. 后续API调用携带游戏Session Token
5. JSBridge不可用时 → 显示"请在顽鹿运动App内打开"提示

#### API鉴权模式：Gin中间件统一鉴权

所有API请求经过auth中间件校验Token，权限分三层：

| 角色 | 权限范围 |
|---|---|
| **普通成员** | 查看自己战队数据、公开数据、个人贡献 |
| **会长** | 战队管理操作、宣战/指挥决策、成员审批 |
| **系统** | 结算、周期推进（内部调用，非用户触发） |

Alpha阶段数据完全透明（所有战队数据可查），Beta按需收紧。

#### 数据安全措施

| 措施 | 实现方式 |
|---|---|
| **HTTPS强制** | Nginx配置SSL，所有HTTP重定向HTTPS（NFR11） |
| **骑行数据来源校验** | 服务端验证数据来源签名，只接受顽鹿App官方数据（NFR8） |
| **异常检测** | 贡献值超标自动标记，两级检测（实时+批次）（NFR9） |
| **SQL注入防护** | pgx参数化查询（默认安全） |
| **XSS防护** | Vue 3默认模板转义 + CSP头部 |

### API与通信模式

#### API设计风格：RESTful

单前端+单后端架构，REST + Gin是最成熟的组合。不引入GraphQL（复杂度过高）或gRPC（WebView不支持）。

**URL设计规范：**
- 资源命名：复数名词（`/teams`, `/wars`, `/territories`）
- 版本：Alpha阶段不做API版本管理（`/api/`前缀），Beta按需引入`/api/v1/`
- 模块归属清晰：`/api/teams/*`, `/api/wars/*`, `/api/map/*` 等

#### API文档：swag（Swagger自动生成）

Gin handler注释 → 自动生成OpenAPI 3.0文档 → Swagger UI可视化调试。为AI辅助开发提供清晰的接口契约。

#### 错误处理标准：统一错误响应 + 业务错误码分段

**统一错误响应结构：**

```json
{
  "code": 42001,
  "message": "战队人数已满",
  "detail": "当前成员数：30/30"
}
```

**业务错误码分段：**

| 码段 | 领域 |
|---|---|
| `400xx` | 通用参数错误 |
| `401xx` | 认证/权限错误 |
| `410xx` | 地图/领土相关 |
| `420xx` | 战队相关 |
| `430xx` | 攻防/宣战相关 |
| `440xx` | 骑行数据相关 |
| `450xx` | 周期/结算相关 |

Gin统一错误中间件捕获panic和未处理错误，返回标准格式。

#### 限流策略：Alpha简单限流

- 全局限流：100 req/s/user（Gin限流中间件）
- 计算密集型端点结果缓存（排行榜、结算查询）
- 渐进式处理：超限→429→重复超限→临时封禁

#### 前后端通信：HTTP轮询为主

- 攻防进度、地图状态通过HTTP轮询更新（30秒间隔）
- Alpha不引入WebSocket——轮询完全满足实时性要求
- Beta预留WebSocket接口供实时推送升级

### 前端架构

#### 组件架构：三层分离

```
src/
├── components/        # 通用UI组件
│   ├── common/        # 基础组件（按钮、卡片、弹窗等）
│   └── business/      # 业务组件（战队卡片、领土信息面板等）
├── views/             # 页面级组件（地图主页、战队页、攻防页等）
├── composables/       # 组合式函数（useMap、useTeam、useWar等）
├── stores/            # Pinia Store（map、team、war、user、cycle、notify）
├── api/               # API调用封装（按领域模块分文件）
├── types/             # TypeScript类型定义
├── utils/             # 工具函数
└── assets/            # 静态资源
```

- views（页面）→ components（组件）→ composables（逻辑）三层分离
- API层按领域组织：`api/map.ts`、`api/team.ts`、`api/war.ts` 等，与后端模块对应
- composables封装复杂交互逻辑（地图下钻、攻防动画），保持组件简洁

#### 路由策略：Vue Router Hash模式

WebView内运行，Hash模式避免服务器路由配置问题。

| 路由 | 页面 |
|---|---|
| `/` | 地图主页（核心页面） |
| `/team` | 战队管理 |
| `/war` | 攻防详情 |
| `/report` | 周战报 |
| `/onboarding` | 首次引导 |

路由守卫：未认证→引导页，未加入战队→首次体验流程。

#### 性能优化策略

| 策略 | 具体方案 |
|---|---|
| **首屏渲染** | Layer 0 骨架屏(<500ms) → Layer 1 CDN简化地图(<1.5s) → Layer 2 定位+详细数据(<3s) |
| **GeoJSON懒加载** | 全国简化版首包内嵌 → 省级按需CDN加载 → 县区下钻时加载 |
| **地图渲染** | Canvas渲染器（2800+区域）、渲染预算控制、低端机检测降级 |
| **代码分割** | 路由级懒加载（`() => import('./views/xxx.vue')`） |
| **资源优化** | 图片压缩、字体子集化、Gzip/Brotli压缩 |

#### 包体积优化

- **ECharts按需引入** — 只引入geo、bar等用到的组件，不全量引入
- **UnoCSS** — 原子CSS按需生成，零冗余
- **Vite代码分割** — 自动vendor分包 + 路由懒加载
- 目标：首包 < 200KB gzipped（不含GeoJSON）

### 基础设施与部署

#### CI/CD流水线：GitHub Actions

| 触发条件 | 动作 |
|---|---|
| `push to main` | 自动测试（Vitest + Go test）→ 构建Docker镜像 → 推送阿里云ACR |
| `push to dev` | 只跑测试，不部署 |
| 手动触发 | 部署到生产（Alpha阶段手动，Beta自动化） |

#### 环境配置管理：环境变量 + .env文件

| 环境 | 配置方式 | 说明 |
|---|---|---|
| `dev` | `.env.development` | 本地开发 |
| `staging` | Alpha阶段省略 | Beta阶段搭建 |
| `prod` | Docker环境变量注入 | 生产环境 |

敏感配置（数据库密码、API密钥）不进代码仓库，通过环境变量注入。

#### 监控与日志：Alpha日志级监控

| 维度 | 方案 |
|---|---|
| **后端日志** | slog结构化日志 → stdout → 阿里云日志服务（SLS）采集 |
| **前端埋点** | 关键操作埋点（首屏时间、地图渲染耗时、API错误率）→ 上报后端记录 |
| **告警** | 基于日志关键词（ERROR、PANIC）→ 阿里云告警 → 钉钉/邮件通知 |
| **告警分级** | P0自动恢复 / P1通知 / P2日报 |

Alpha阶段不引入APM（Prometheus/Grafana），日志+告警足够。

#### 扩容策略：渐进式扩容

| 阶段 | 架构 | 规模 |
|---|---|---|
| **Alpha** | 单机部署（Nginx + Go + PostgreSQL + Redis 同一ECS） | 50队 |
| **Beta** | 前端CDN + 后端ECS×2 + RDS + Redis独立实例 | 200队 |
| **GA** | 后端水平扩容 + 读写分离 + Redis集群 | 15万MAU |

关键原则：Alpha代码架构支持水平扩容（无状态后端、模块化单体），基础设施从简。

#### 备份策略

| 对象 | Alpha方案 | Beta升级 |
|---|---|---|
| **数据库** | pg_dump脚本 + cron每日备份 | 阿里云RDS自动备份 |
| **Redis** | RDB持久化（非权威缓存，丢失可从DB重建） | — |
| **代码** | Git仓库即备份 | — |
| **GeoJSON** | CDN + 本地备份副本 | — |

### 决策影响分析

**实现顺序（推荐）：**
1. 项目脚手架初始化（create-vue + go-blueprint）
2. 数据库表结构与迁移（golang-migrate）
3. 认证中间件（JSBridge Token → Session）
4. API骨架（RESTful路由 + 统一错误处理 + Swagger）
5. 前端骨架（路由 + Store + 首屏三层渲染）
6. 领域模块逐个实现（map → team → ride → war → cycle → notify）
7. CI/CD流水线
8. 监控与告警

**跨组件依赖：**
- 认证中间件 → 所有API端点依赖
- 周循环状态机（cycle）→ 攻防（war）、结算、战报均依赖
- 数据建模（模块内聚）→ 决定所有模块的数据访问模式
- 缓存策略 → 影响地图（map）、攻防（war）、排行榜的读取性能
- 错误码分段 → 前端统一错误处理依赖

## 实现模式与一致性规则（Implementation Patterns & Consistency Rules）

### 冲突点识别

共识别出**5大类、28个**潜在冲突点——即不同AI Agent可能做出不同选择的地方。以下规则确保所有Agent写出的代码彼此兼容。

### 命名规范

#### 数据库命名（PostgreSQL）

| 项目 | 规范 | 示例 |
|---|---|---|
| 表名 | 蛇形复数，带模块前缀 | `team_members`, `war_declarations` |
| 列名 | 蛇形命名 | `user_id`, `created_at`, `team_name` |
| 主键 | `id`（每张表） | `id BIGSERIAL PRIMARY KEY` |
| 外键 | `{关联表单数}_id` | `team_id`, `territory_id` |
| 索引 | `idx_{表名}_{列名}` | `idx_team_members_user_id` |
| 唯一约束 | `uniq_{表名}_{列名}` | `uniq_team_members_user_team` |
| 时间戳 | 每张表必备 | `created_at TIMESTAMPTZ`, `updated_at TIMESTAMPTZ` |

#### API命名（RESTful）

| 项目 | 规范 | 示例 |
|---|---|---|
| 端点路径 | 蛇形复数 | `/api/teams`, `/api/war-declarations` |
| URL参数 | 蛇形 | `/api/teams/:team_id/members` |
| 查询参数 | 蛇形 | `?page_size=20&sort_by=created_at` |
| JSON字段 | 蛇形（与Go struct tag对应） | `{"team_id": 1, "team_name": "骑士团"}` |

#### Go后端代码命名

| 项目 | 规范 | 示例 |
|---|---|---|
| 包名 | 小写单词 | `team`, `war`, `cycle` |
| 导出函数/类型 | 大驼峰 | `CreateTeam()`, `TeamMember` |
| 私有函数/变量 | 小驼峰 | `validateInput()`, `maxRetries` |
| 常量 | 大驼峰或全大写蛇形 | `MaxTeamSize`, `DEFAULT_TTL` |
| 文件名 | 蛇形 | `team_handler.go`, `war_service.go` |
| Struct JSON tag | 蛇形 | `` json:"team_id" `` |

#### Vue前端代码命名

| 项目 | 规范 | 示例 |
|---|---|---|
| 组件文件名 | 大驼峰.vue | `TeamCard.vue`, `MapRenderer.vue` |
| 组件使用 | 大驼峰标签 | `<TeamCard />`, `<MapRenderer />` |
| composable文件 | use开头，小驼峰 | `useTeam.ts`, `useMapDrill.ts` |
| Store文件 | 领域名.ts | `team.ts`, `war.ts` |
| API文件 | 领域名.ts | `api/team.ts`, `api/war.ts` |
| TypeScript类型 | 大驼峰 | `Team`, `WarDeclaration`, `Territory` |
| 变量/函数 | 小驼峰 | `teamList`, `fetchTeamData()` |
| CSS类名 | UnoCSS原子类 | 不手写类名，直接用UnoCSS |

### 结构规范

#### 测试文件位置

| 端 | 规范 | 示例 |
|---|---|---|
| Go后端 | 与源文件同目录，`_test.go`后缀 | `team_handler_test.go` |
| Vue前端 | `src/__tests__/` 按领域组织 | `__tests__/team/TeamCard.test.ts` |
| E2E测试 | 项目根目录 `e2e/` | `e2e/map-drill.spec.ts` |

#### 配置文件位置

| 文件 | 位置 |
|---|---|
| 环境变量 | 项目根目录 `.env.development`, `.env.production` |
| Docker | 项目根目录 `docker-compose.yml`, `Dockerfile` |
| Go入口 | `cmd/api/main.go` |
| Go服务配置 | `internal/server/server.go` |
| Vue构建 | `vite.config.ts`, `uno.config.ts`, `tsconfig.json` |

### 数据格式规范

#### API成功响应

```json
{
  "code": 0,
  "data": { ... },
  "message": "success"
}
```

#### API列表响应（分页）

```json
{
  "code": 0,
  "data": {
    "items": [ ... ],
    "total": 100,
    "page": 1,
    "page_size": 20
  },
  "message": "success"
}
```

#### API错误响应

```json
{
  "code": 42001,
  "data": null,
  "message": "战队人数已满",
  "detail": "当前成员数：30/30"
}
```

#### 通用数据规则

| 规则 | 标准 |
|---|---|
| 时间格式 | ISO 8601（`"2026-03-07T10:30:00+08:00"`） |
| 空值 | JSON中用 `null`，不省略字段 |
| 布尔值 | `true`/`false` |
| 数值 | 整数（避免浮点精度），里程用米为单位 |

### 通信规范

#### Pinia Store模式

```typescript
// stores/team.ts — 标准Store模板
export const useTeamStore = defineStore('team', () => {
  // State
  const myTeam = ref<Team | null>(null)
  const loading = ref(false)
  
  // Getters
  const isCaptain = computed(() => myTeam.value?.captain_id === useUserStore().userId)
  
  // Actions
  async function fetchMyTeam() { ... }
  
  return { myTeam, loading, isCaptain, fetchMyTeam }
})
```

- 命名：`useXxxStore`（`useTeamStore`, `useWarStore`）
- 使用 Setup Store 语法（composition API风格）
- 每个Store维护自己的 `loading` 状态

#### 加载状态规范

| 层级 | 管理方式 |
|---|---|
| 页面级加载 | `views/` 组件管理 |
| 组件级加载 | composable返回 `{ data, loading, error }` |
| 首屏 | 骨架屏 |
| 其他页面 | loading指示器 |

#### Go模块间通信

- 模块间调用通过**接口（interface）**，不直接引用实现
- 示例：`war` 模块需要骑行数据 → 通过 `ride.Service` 接口调用
- 依赖注入在 `cmd/api/main.go` 中组装

### 流程规范

#### Go错误处理模式

```go
// ✅ 正确：显式错误处理，包装上下文
result, err := teamService.CreateTeam(ctx, input)
if err != nil {
    return fmt.Errorf("create team: %w", err)
}

// ❌ 禁止：忽略错误
result, _ := teamService.CreateTeam(ctx, input)
```

#### Vue错误处理模式

```typescript
// composable统一错误处理模板
async function fetchData() {
  loading.value = true
  error.value = null
  try {
    data.value = await api.getData()
  } catch (e) {
    error.value = parseApiError(e) // 统一错误解析
  } finally {
    loading.value = false
  }
}
```

#### 日志规范（Go slog）

```go
// ✅ 结构化日志，带上下文
slog.Info("team created", "team_id", team.ID, "captain_id", team.CaptainID)
slog.Error("settlement failed", "week_id", weekID, "error", err)

// ❌ 禁止：fmt.Println 或非结构化日志
```

### AI Agent强制规则

**所有AI Agent必须遵守：**

1. ✅ 使用上述命名规范，不得自创命名风格
2. ✅ 所有API端点遵循统一响应格式（code + data + message）
3. ✅ Go代码必须显式处理所有错误，禁止 `_` 忽略error
4. ✅ TypeScript严格模式，禁止 `any` 类型
5. ✅ 数据库变更必须通过 golang-migrate 迁移文件
6. ✅ 模块间通过接口调用，不直接引用内部实现
7. ✅ 每个新功能必须有对应的测试文件
8. ✅ 使用slog结构化日志，禁止fmt.Println

**反模式（禁止）：**

- ❌ 跨模块直接SQL JOIN查询
- ❌ 在组件中直接调用API（应通过Store或composable）
- ❌ 硬编码配置值（应走环境变量）
- ❌ 忽略Go错误返回值
- ❌ 使用 `as any` 或 `@ts-ignore` 绕过类型检查
- ❌ 手动修改数据库结构（不通过迁移文件）

## 项目结构与架构边界（Project Structure & Boundaries）

### 完整项目目录结构

本项目为双仓库架构：前端H5项目 + 后端Go服务。

#### 前端项目 `riding-conquest-h5/`

```
riding-conquest-h5/
├── .github/
│   └── workflows/
│       └── ci.yml                    # GitHub Actions: 测试 + 构建
├── e2e/
│   ├── map-drill.spec.ts            # 地图下钻E2E测试
│   ├── team-management.spec.ts      # 战队管理E2E测试
│   └── onboarding.spec.ts           # 首次引导E2E测试
├── public/
│   └── geojson/
│       └── china-simplified.json    # 全国简化版GeoJSON（首包内嵌）
├── src/
│   ├── api/                         # API调用封装（按领域）
│   │   ├── client.ts                # HTTP客户端基础封装（请求/响应拦截）
│   │   ├── map.ts                   # 地图/领土API
│   │   ├── team.ts                  # 战队API
│   │   ├── war.ts                   # 攻防API
│   │   ├── ride.ts                  # 骑行贡献API
│   │   ├── cycle.ts                 # 周期/结算API
│   │   └── notify.ts               # 通知API
│   ├── assets/                      # 静态资源
│   │   ├── images/                  # 图片资源
│   │   └── fonts/                   # 字体文件（子集化）
│   ├── bridge/                      # JSBridge封装
│   │   ├── index.ts                 # JSBridge统一入口
│   │   ├── auth.ts                  # 认证Token获取
│   │   ├── ride-data.ts             # 骑行数据获取
│   │   ├── push.ts                  # 推送注册
│   │   └── share.ts                 # 分享调用
│   ├── components/
│   │   ├── common/                  # 基础UI组件
│   │   │   ├── AppButton.vue
│   │   │   ├── AppCard.vue
│   │   │   ├── AppModal.vue
│   │   │   ├── AppLoading.vue
│   │   │   ├── AppSkeleton.vue      # 骨架屏组件
│   │   │   └── AppErrorBoundary.vue
│   │   └── business/                # 业务组件
│   │       ├── map/
│   │       │   ├── ChinaMap.vue     # 全国地图
│   │       │   ├── ProvinceMap.vue  # 省级地图
│   │       │   ├── CountyMap.vue    # 县区地图
│   │       │   ├── TerritoryInfo.vue # 领土信息面板
│   │       │   └── MapLegend.vue    # 地图图例
│   │       ├── team/
│   │       │   ├── TeamCard.vue     # 战队卡片
│   │       │   ├── MemberList.vue   # 成员列表
│   │       │   └── TeamBadge.vue    # 战队徽章
│   │       ├── war/
│   │       │   ├── WarStatus.vue    # 攻防状态
│   │       │   ├── BattleProgress.vue # 战斗进度条
│   │       │   └── CommandPanel.vue # 会长指挥面板
│   │       └── cycle/
│   │           ├── WeekTimer.vue    # 周阶段倒计时
│   │           └── WeekReport.vue   # 周战报卡片
│   ├── composables/                 # 组合式函数
│   │   ├── useMap.ts                # 地图渲染与下钻逻辑
│   │   ├── useMapData.ts            # GeoJSON懒加载管理
│   │   ├── useTeam.ts               # 战队操作逻辑
│   │   ├── useWar.ts                # 攻防交互逻辑
│   │   ├── useAuth.ts               # 认证流程（JSBridge → Session）
│   │   ├── usePolling.ts            # 通用轮询封装
│   │   └── useDeviceDetect.ts       # 设备检测（低端机降级）
│   ├── router/
│   │   └── index.ts                 # Vue Router配置（Hash模式）
│   ├── stores/                      # Pinia Stores
│   │   ├── map.ts                   # 地图/领土状态
│   │   ├── team.ts                  # 战队状态
│   │   ├── war.ts                   # 攻防状态
│   │   ├── user.ts                  # 用户认证状态
│   │   ├── cycle.ts                 # 周期阶段状态
│   │   └── notify.ts               # 通知状态
│   ├── types/                       # TypeScript类型
│   │   ├── api.ts                   # API响应通用类型
│   │   ├── map.ts                   # 地图/领土类型
│   │   ├── team.ts                  # 战队类型
│   │   ├── war.ts                   # 攻防类型
│   │   ├── ride.ts                  # 骑行数据类型
│   │   ├── cycle.ts                 # 周期类型
│   │   └── bridge.ts               # JSBridge接口类型
│   ├── utils/                       # 工具函数
│   │   ├── format.ts               # 数据格式化（数字、日期、里程）
│   │   ├── error.ts                # 错误解析（parseApiError）
│   │   └── storage.ts              # 本地存储封装
│   ├── views/                       # 页面组件
│   │   ├── MapView.vue             # 地图主页（/）
│   │   ├── TeamView.vue            # 战队管理（/team）
│   │   ├── WarView.vue             # 攻防详情（/war）
│   │   ├── ReportView.vue          # 周战报（/report）
│   │   └── OnboardingView.vue      # 首次引导（/onboarding）
│   ├── __tests__/                   # 单元测试
│   │   ├── components/
│   │   │   ├── map/
│   │   │   └── team/
│   │   ├── composables/
│   │   ├── stores/
│   │   └── utils/
│   ├── App.vue                      # 根组件
│   └── main.ts                      # 应用入口
├── .env.development                  # 开发环境变量
├── .env.production                   # 生产环境变量
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── uno.config.ts                     # UnoCSS配置
├── vite.config.ts                    # Vite配置
├── vitest.config.ts                  # Vitest配置
└── playwright.config.ts              # Playwright E2E配置
```

#### 后端项目 `riding-conquest-server/`

```
riding-conquest-server/
├── .github/
│   └── workflows/
│       └── ci.yml                    # GitHub Actions: 测试 + 构建 + 推送ACR
├── cmd/
│   └── api/
│       └── main.go                  # 应用入口（依赖注入组装）
├── internal/
│   ├── server/
│   │   ├── server.go                # HTTP服务器配置
│   │   └── routes.go                # 路由注册（汇总所有模块路由）
│   ├── middleware/                   # 全局中间件
│   │   ├── auth.go                  # 认证中间件（Token验证 → Session）
│   │   ├── error_handler.go         # 统一错误处理
│   │   ├── rate_limiter.go          # 限流中间件
│   │   ├── cors.go                  # CORS配置
│   │   └── logger.go               # 请求日志中间件
│   ├── common/                      # 跨模块共享
│   │   ├── response.go             # 统一API响应结构
│   │   ├── errors.go               # 业务错误码定义
│   │   ├── pagination.go           # 分页参数处理
│   │   └── validator.go            # 输入验证
│   ├── database/
│   │   └── database.go             # 数据库连接管理（pgx pool）
│   ├── cache/
│   │   ├── redis.go                # Redis连接管理
│   │   └── cache.go                # 缓存操作封装（Cache-Aside模式）
│   ├── map/                         # 地图与领土模块（FR1-FR5）
│   │   ├── handler.go              # HTTP handlers
│   │   ├── handler_test.go
│   │   ├── service.go              # 业务逻辑
│   │   ├── service_test.go
│   │   ├── repository.go           # 数据访问（SQL查询）
│   │   ├── repository_test.go
│   │   ├── model.go                # 数据模型（struct）
│   │   └── routes.go               # 模块路由注册
│   ├── team/                        # 战队管理模块（FR6-FR14a）
│   │   ├── handler.go
│   │   ├── handler_test.go
│   │   ├── service.go
│   │   ├── service_test.go
│   │   ├── repository.go
│   │   ├── repository_test.go
│   │   ├── model.go
│   │   └── routes.go
│   ├── ride/                        # 骑行贡献模块（FR15-FR18）
│   │   ├── handler.go
│   │   ├── handler_test.go
│   │   ├── service.go              # 含异常检测逻辑
│   │   ├── service_test.go
│   │   ├── sync.go                 # 骑行数据同步（轮询 + 本地队列）
│   │   ├── sync_test.go
│   │   ├── repository.go
│   │   ├── repository_test.go
│   │   ├── model.go
│   │   └── routes.go
│   ├── war/                         # 宣战与攻防模块（FR19-FR28）
│   │   ├── handler.go
│   │   ├── handler_test.go
│   │   ├── service.go              # 攻防计算引擎
│   │   ├── service_test.go
│   │   ├── recommend.go            # 会长推荐算法（规则引擎）
│   │   ├── recommend_test.go
│   │   ├── repository.go
│   │   ├── repository_test.go
│   │   ├── model.go
│   │   └── routes.go
│   ├── cycle/                       # 系统周期与结算模块（FR35-FR37c）
│   │   ├── handler.go
│   │   ├── handler_test.go
│   │   ├── service.go              # 状态机驱动周期推进
│   │   ├── service_test.go
│   │   ├── settlement.go           # 结算引擎（快照 + 事务）
│   │   ├── settlement_test.go
│   │   ├── scheduler.go            # Cron调度器
│   │   ├── scheduler_test.go
│   │   ├── repository.go
│   │   ├── repository_test.go
│   │   ├── model.go
│   │   └── routes.go
│   └── notify/                      # 推送通知模块（FR38-FR40）
│       ├── handler.go
│       ├── handler_test.go
│       ├── service.go              # 含游戏内通知降级
│       ├── service_test.go
│       ├── repository.go
│       ├── repository_test.go
│       ├── model.go
│       └── routes.go
├── migrations/                      # golang-migrate SQL迁移
│   ├── 000001_create_map_tables.up.sql
│   ├── 000001_create_map_tables.down.sql
│   ├── 000002_create_team_tables.up.sql
│   ├── 000002_create_team_tables.down.sql
│   ├── 000003_create_ride_tables.up.sql
│   ├── 000003_create_ride_tables.down.sql
│   ├── 000004_create_war_tables.up.sql
│   ├── 000004_create_war_tables.down.sql
│   ├── 000005_create_cycle_tables.up.sql
│   ├── 000005_create_cycle_tables.down.sql
│   ├── 000006_create_notify_tables.up.sql
│   └── 000006_create_notify_tables.down.sql
├── scripts/                         # 运维脚本
│   ├── backup.sh                   # 数据库备份脚本
│   ├── redis_warmup.go             # Redis热数据预热
│   └── seed.go                     # 测试数据填充
├── docs/
│   └── swagger/                    # Swagger自动生成输出
├── .env.development
├── .env.production
├── .gitignore
├── Dockerfile
├── docker-compose.yml               # 本地开发：Go + PostgreSQL + Redis
├── go.mod
├── go.sum
└── Makefile                         # 常用命令（build、test、migrate、swagger）
```

### 架构边界

#### API边界

| 模块 | 路由前缀 | 核心端点 |
|---|---|---|
| auth | `/api/auth` | Token交换（JSBridge Token → Session） |
| map | `/api/map` | 领土列表、领土详情、全国概览、下钻数据 |
| team | `/api/teams` | 创建/加入/退出战队、成员管理、战队详情 |
| ride | `/api/rides` | 贡献记录、同步状态、个人统计 |
| war | `/api/wars` | 宣战、攻防进度、会长指挥、推荐目标 |
| cycle | `/api/cycle` | 当前周期状态、结算结果、周战报 |
| notify | `/api/notifications` | 通知列表、标记已读 |

#### 模块间依赖边界

模块间通过接口（interface）调用，不直接引用内部实现：

```
war  → ride.Service（获取骑行贡献）
war  → team.Service（获取战队信息）
war  → map.Service（获取领土状态）
cycle → war.Service（结算攻防结果）
cycle → map.Service（更新领土归属）
cycle → notify.Service（发送结算通知）
notify → team.Service（获取成员列表用于推送）
```

依赖注入在 `cmd/api/main.go` 中统一组装。

#### 数据边界

每个模块只访问自己前缀的表，跨模块数据通过Service接口获取，不直接SQL JOIN。

| 模块 | 表前缀 | 核心表 |
|---|---|---|
| map | `map_` | `map_territories`, `map_ownership` |
| team | `team_` | `team_teams`, `team_members`, `team_applications` |
| ride | `ride_` | `ride_contributions`, `ride_sync_queue` |
| war | `war_` | `war_declarations`, `war_battles`, `war_progress` |
| cycle | `cycle_` | `cycle_weeks`, `cycle_settlements`, `cycle_snapshots` |
| notify | `notify_` | `notify_messages`, `notify_push_queue` |

### 需求到结构映射

| FR分类 | 后端模块 | 前端页面/组件 | Store |
|---|---|---|---|
| 地图与领土 FR1-FR5 | `internal/map/` | `MapView` + `ChinaMap/ProvinceMap/CountyMap` | `stores/map.ts` |
| 战队管理 FR6-FR14a | `internal/team/` | `TeamView` + `TeamCard/MemberList` | `stores/team.ts` |
| 骑行贡献 FR15-FR18 | `internal/ride/` | 嵌入MapView + TeamView | `stores/map.ts` |
| 宣战攻防 FR19-FR28 | `internal/war/` | `WarView` + `WarStatus/BattleProgress/CommandPanel` | `stores/war.ts` |
| 周战报 FR29-FR31 | `internal/cycle/` | `ReportView` + `WeekReport` | `stores/cycle.ts` |
| 首次体验 FR32-FR34 | `internal/team/` + `internal/map/` | `OnboardingView` | `stores/user.ts` |
| 系统周期 FR35-FR37c | `internal/cycle/` | `WeekTimer`（全局） | `stores/cycle.ts` |
| 推送通知 FR38-FR40 | `internal/notify/` | 游戏内通知中心 | `stores/notify.ts` |
| 数据可见性 FR41-FR44 | `internal/middleware/auth.go` | 各页面按权限展示 | — |

### 集成点

#### 内部通信

- 前端 → 后端：RESTful HTTP（`src/api/` → Gin handlers）
- Store → API：Pinia Actions调用API层
- 模块间：Go接口调用（依赖注入）

#### 外部集成

| 集成点 | 方向 | 位置 |
|---|---|---|
| **JSBridge（宿主App）** | 前端 → App | `src/bridge/` |
| **骑行数据API** | 后端 → 顽鹿服务 | `internal/ride/sync.go` |
| **推送通道** | 后端 → 推送服务 | `internal/notify/service.go` |
| **阿里云CDN** | 前端 → CDN | GeoJSON静态资源 |
| **阿里云SLS** | 后端 → 日志服务 | slog → stdout → SLS采集 |

#### 数据流

```
用户操作 → Vue组件 → Pinia Store → API层 → Gin Handler → Service → Repository → PostgreSQL
                                                                      ↕
                                                                   Redis Cache
```

## 架构验证结果（Architecture Validation Results）

### 一致性验证 ✅

**决策兼容性：**
全部26项核心架构决策互相兼容，无矛盾。前端技术栈（Vue 3 + Vite + TypeScript + Pinia + ECharts v6）版本兼容、生态匹配；后端技术栈（Gin v1.12 + pgx + go-redis + golang-migrate）为Go生态成熟组合。模块化单体架构与Alpha阶段一人开发模式匹配，Write-Through缓存策略与DB权威数据源设计一致，RESTful + HTTP轮询在Alpha阶段复杂度可控且Beta预留WebSocket升级路径。

**模式一致性：**
28个潜在冲突点全部有明确规则覆盖。蛇形命名贯穿DB→API→JSON→Go struct tag全链路；前端大驼峰组件 + 小驼峰变量 + Setup Store模板遵循Vue社区规范；8条AI Agent强制规则 + 6条反模式清晰可执行，无模糊地带。

**结构对齐：**
6个后端模块对应6个表前缀、7个路由前缀（含auth）；6个Pinia Store对应6个API文件，前后端模块一一映射；双仓库结构（H5 + Server）边界清晰无耦合；5个外部集成点（JSBridge、骑行数据API、推送通道、阿里云CDN、阿里云SLS）全部有对应代码位置。

### 需求覆盖验证 ✅

**功能需求覆盖（51项FR）：**

| FR分类 | FR编号 | 后端支撑 | 前端支撑 | 状态 |
|---|---|---|---|---|
| 地图与领土 | FR1-FR5 | `internal/map/` | `MapView` + 地图组件群 + `useMap` + `useMapData` | ✅ |
| 战队管理 | FR6-FR14a | `internal/team/` | `TeamView` + `TeamCard/MemberList` | ✅ |
| 骑行贡献 | FR15-FR18 | `internal/ride/` + `sync.go` | 嵌入MapView/TeamView | ✅ |
| 宣战攻防 | FR19-FR24b | `internal/war/` | `WarView` + 攻防组件群 | ✅ |
| 会长指挥 | FR25-FR28 | `internal/war/recommend.go` | `CommandPanel` | ✅ |
| 周战报 | FR29-FR31 | `internal/cycle/` | `ReportView` + `WeekReport` | ✅ |
| 首次体验 | FR32-FR34 | `internal/team/` + `internal/map/` | `OnboardingView` + `useAuth` | ✅ |
| 系统周期 | FR35-FR37c | `internal/cycle/scheduler.go` + `settlement.go` | `WeekTimer`（全局） | ✅ |
| 推送通知 | FR38-FR39 [Alpha] | `internal/notify/` | 游戏内通知中心 | ✅ |
| 推送通知 | FR40 [Beta] | 预留在`internal/notify/` | — | ✅ Beta标记 |
| 数据可见性 | FR41-FR44 | `middleware/auth.go` + 各模块handler | 各页面按权限展示 | ✅ |

全部51项FR中，50项[Alpha]有完整架构支撑，1项[Beta]（FR40）已预留实现位置。

**非功能需求覆盖（24项NFR）：**

| NFR类别 | 关键项 | 架构支撑 |
|---|---|---|
| 性能 NFR1-6 | 首屏P90<1秒、地图≥30fps、下钻<500ms、API P95<500ms、骑行反馈<30秒、500+并发 | 三层渲染 + Canvas渲染器 + CDN懒加载 + Redis Cache-Aside + 轮询+本地队列 + Gin+连接池 ✅ |
| 安全 NFR7-11 | 认证复用、来源校验、异常检测、API限流、HTTPS | JSBridge Token中继 + 签名验证 + 两级检测 + Gin限流中间件 + Nginx SSL ✅ |
| 可扩展 NFR12-15 | Alpha 50队→Beta 200队→GA 15万MAU、不重写扩展 | 渐进式扩容 + 模块化单体 + 无状态后端 + 接口隔离 ✅ |
| 可靠性 NFR16-20 | 99%可用、结算零失败、每日备份、错误恢复、结算幂等 | 告警分级 + 快照+事务回滚 + pg_dump + 状态链断点续算 + 幂等写入 ✅ |
| 集成 NFR21-24 | JSBridge<200ms、同步<30秒、推送≥90%、降级处理 | bridge层+超时降级 + 轮询+增量拉取 + 推送+游戏内降级 + 补偿队列 ✅ |

### 实现就绪性验证 ✅

**决策完整性：**
所有技术选型含具体版本号（Vue 3、Gin v1.12、ECharts v6、vue-echarts v8.0.1、pgx、golang-migrate等）。28个冲突点有代码级模板和示例。8条强制规则 + 6条反模式，清晰可执行。

**结构完整性：**
前端70+文件/目录已定义，后端80+文件/目录已定义。每个模块的handler/service/repository/model/routes/test文件全部明确。双仓库结构边界清晰。

**模式完整性：**
Store模板（Pinia Setup Store语法）、错误处理模板（Go + Vue）、API响应格式（成功/列表/错误）、日志模板（slog结构化）、模块间通信模板（接口 + 依赖注入）全部有可复制的代码示例。

### 差距分析结果

**🟢 关键差距：无**

没有发现阻塞实现的缺失决策或未定义的架构组件。

**🟡 重要差距（不阻塞，实现时注意）：**

| 差距 | 说明 | 处理方式 |
|---|---|---|
| 限流数值差异 | PRD NFR10为"≤10次/秒/用户"，架构决策中写为"100 req/s/user" | 实现时以PRD为准（10 req/s/user），限流中间件架构已就位 |
| 管理员路由未显式列出 | FR37系列运营工具在Alpha阶段通过脚本实现，API边界表中无admin前缀 | 如需HTTP接口化，添加 `/api/admin` 路由组即可 |

**🔵 锦上添花（可选改进，不影响实现）：**

- WebSocket升级路径的具体接口预定义 — Beta阶段详细设计
- GeoJSON数据来源的具体URL和处理格式 — 实现阶段确定
- Docker compose本地开发的具体端口映射 — 实现阶段确定

### 验证问题处理

**NFR10限流数值不一致：** PRD标准为10 req/s/user，架构文档中的100 req/s/user为笔误。限流中间件架构已就位，实现时按PRD配置即可，无需修改架构设计。

**管理员操作接口：** PRD FR37系列运营工具明确为"Alpha阶段通过预置运营工具实现"，架构文档与此一致。后续如需API化，现有模块化结构支持无缝添加。

### 架构完整性清单

**✅ 需求分析**

- [x] 项目上下文深度分析（10个功能领域、5类NFR）
- [x] 规模与复杂度评估（高复杂度、12-15组件）
- [x] 技术约束识别（6项）
- [x] 跨领域关注点映射（7项）
- [x] 高级发现（5种方法、22项洞察）

**✅ 架构决策**

- [x] 26项核心决策全部文档化并含版本
- [x] 技术栈完整指定（前端 + 后端 + 基础设施）
- [x] 集成模式定义（JSBridge、REST、CDN、推送）
- [x] 性能策略全面覆盖（首屏三层、缓存、懒加载）

**✅ 实现模式**

- [x] 命名规范建立（4套：DB、API、Go、Vue）
- [x] 结构规范定义（测试、配置文件位置）
- [x] 通信规范制定（Store模板、加载状态、模块间通信）
- [x] 流程规范文档化（错误处理、日志）

**✅ 项目结构**

- [x] 完整目录结构定义（双仓库、150+文件）
- [x] 组件边界建立（模块接口隔离、数据前缀隔离）
- [x] 集成点映射（内部3种、外部5个）
- [x] 需求到结构映射完成（51项FR全部映射）

### 架构就绪评估

**总体状态：✅ 准备就绪，可进入实现**

**信心等级：高**

**核心优势：**
- 51项FR + 24项NFR全部有架构支撑，无遗漏
- 模块化单体架构与一人开发+AI辅助模式完美匹配
- 28个冲突点预解决，AI Agent可一致实现
- Alpha→Beta→GA渐进扩容路径清晰，无需重写
- 22项韧性洞察（ADR+预失败+FMA+战争室+混沌猴）深度融入架构设计

**未来增强方向：**
- Beta阶段：WebSocket实时推送、APM监控（Prometheus/Grafana）、staging环境、自动化部署到生产
- GA阶段：水平扩容、读写分离、Redis集群、API版本管理

### 实现交接

**AI Agent指导原则：**

- 严格按照架构文档中的所有决策执行，不得自行变更技术选型
- 使用已定义的实现模式和代码模板，保持所有组件一致性
- 尊重项目结构和模块边界，不跨模块直接访问数据
- 所有架构疑问参考本文档，文档未覆盖的决策需要人工确认

**首个实现步骤：**

1. 前端脚手架：`npm create vue@latest riding-conquest-h5 -- --typescript --pinia --vitest --eslint --prettier --bare`
2. 后端脚手架：`go-blueprint create --name riding-conquest-server --framework gin --driver postgres --advanced --feature docker --git commit`
3. 按照"决策影响分析"中的实现顺序推进：脚手架 → 数据库迁移 → 认证中间件 → API骨架 → 前端骨架 → 领域模块
