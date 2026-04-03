# 🚴 骑迹大陆 (RideLand)

> **骑行即征服——每一公里都在改变全国领土版图**

嵌入顽鹿运动 App 的 H5 骑行征服游戏，将用户真实骑行里程转化为全国领土争夺的驱动力。

---

## 📋 快速导航

### 🎯 核心文档
| 文档 | 说明 |
|------|------|
| [Alpha 开发总计划](./ALPHA-DEVELOPMENT-PLAN.md) | 完整工作计划（04-01 ~ 04-21） |
| [差距分析](./GAP-ANALYSIS-AND-PLAN.md) | PRD 实现差距分析 |
| [Alpha 准备计划](./PHASE-1-ALPHA-PREP-PLAN.md) | Alpha 上线准备计划 |
| [整理方案](./REORGANIZATION-PLAN.md) | 文件夹整理方案 |

### 💻 代码项目
| 项目 | 技术栈 | 说明 |
|------|--------|------|
| [riding-conquest-h5](./riding-conquest-h5/) | Vue 3 + ECharts | 前端 H5 项目 |
| [riding-conquest-server](./riding-conquest-server/) | Go + Gin | 后端服务 |

### 📚 项目文档
| 目录 | 内容 |
|------|------|
| [docs/planning-artifacts/](./docs/planning-artifacts/) | PRD/架构/UX 设计 |
| [docs/design-system/](./docs/design-system/) | 设计规范 |
| [docs/brainstorming/](./docs/brainstorming/) | 头脑风暴 |
| [docs/business-references/](./docs/business-references/) | 业务参考资料 |
| [docs/archive/](./docs/archive/) | 历史状态报告 |

### 🧪 实验文件
| 目录 | 内容 |
|------|------|
| [experiments/](./experiments/) | UI 原型/生成脚本/测试文件 |

---

## 🎯 当前状态

**阶段**: Alpha 开发（04-01 ~ 04-21）  
**目标**: 50 个战队内测上线  
**完成度**: 30%

### Week 1 (04-01~04-07): 地图完善 + 前端核心
- [ ] 地图领土着色
- [ ] 区域详情弹窗
- [ ] 家乡自动定位
- [ ] 周循环状态条
- [ ] 战队创建/加入（Mock）

### Week 2 (04-08~04-14): 后端开发 + 联调
- [ ] 数据库设计
- [ ] 核心接口实现
- [ ] 骑行→攻防闭环

### Week 3 (04-15~04-21): 测试上线
- [ ] 功能/性能测试
- [ ] Alpha 环境部署
- [ ] 50 战队激活

---

## 🚀 快速开始

### 前端开发
```bash
cd riding-conquest-h5
npm run dev
# 访问 http://localhost:5173/
# 测试页 http://localhost:5173/#/map-test
```

### 后端开发
```bash
cd riding-conquest-server
go run cmd/server/main.go
```

---

## 📞 项目信息

**负责人**: Mark（马高峰）  
**开发**: 万钳（AI 助手）  
**创建时间**: 2026-03-05  
**最后更新**: 2026-04-01

---

## 📁 文件夹说明

```
Project 001/
├── riding-conquest-h5/          # 前端项目
├── riding-conquest-server/      # 后端项目
├── docs/                        # 项目文档
│   ├── planning-artifacts/      # PRD/架构等
│   ├── business-references/     # 业务资料
│   └── archive/                 # 历史文档
├── experiments/                 # 实验文件
└── ALPHA-DEVELOPMENT-PLAN.md    # 开发总计划
```
