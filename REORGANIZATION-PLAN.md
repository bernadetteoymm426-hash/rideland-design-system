# 📁 Project 001 文件夹整理方案

**整理时间**: 2026-04-01  
**整理人**: 万钳 🔧

---

## 🎯 整理目标

1. **根目录简洁** - 只保留核心文档和配置文件
2. **文档分类清晰** - 按类型和用途归档
3. **大文件隔离** - PDF/DOCX 业务文档单独存放
4. **便于导航** - 新增 README.md 导览

---

## 📋 目录结构

### 整理后的结构

```
Project 001/
├── 📄 核心文档（根目录保留）
│   ├── README.md                    # 项目总览（新建）
│   ├── ALPHA-DEVELOPMENT-PLAN.md    # Alpha 开发总计划
│   ├── GAP-ANALYSIS-AND-PLAN.md     # 差距分析
│   ├── PHASE-1-ALPHA-PREP-PLAN.md   # Alpha 准备计划
│   └── opencode.jsonc               # 配置文件
│
├── 💻 代码目录
│   ├── riding-conquest-h5/          # 前端项目
│   ├── riding-conquest-server/      # 后端项目
│   └── node_modules/                # 前端依赖
│
├── 📚 项目文档（docs/）
│   ├── README.md                    # 文档导览
│   ├── planning-artifacts/          # 规划文档（PRD/架构等）
│   ├── design-system/               # 设计规范
│   ├── brainstorming/               # 头脑风暴
│   ├── converted/                   # 转换的业务文档
│   └── designs/                     # 设计稿
│
├── 📦 业务参考资料（docs/business-references/）【新建】
│   ├── presentations/               # PPT 演示文稿
│   ├── reports/                     # 经营分析报告
│   ├── product-docs/                # 产品介绍文档
│   └── strategy/                    # 战略规划文档
│
├── 🧪 临时/实验文件（experiments/）【新建】
│   ├── game-map-ui.html
│   ├── game-map-ui.png
│   ├── generate-chinese-ui.js
│   └── generated-ui-images/
│
├── 🤖 AI 工具配置
│   ├── .claude/                     # Claude 配置
│   └── _bmad/                       # BMAD 工作流
│
└── 🔧 系统文件
    ├── .git/
    ├── .DS_Store
    └── ...
```

---

## 📝 执行步骤

### Step 1: 根目录文档归档

**移动到 docs/archive/**（历史状态报告）:
- BACKEND-FIXED.md
- DESIGN.md
- DEV-SERVER-STARTED.md
- E2E-TEST-REPORT.md
- FINAL-PAGES-COMPLETE.md
- FINAL-STATUS-REPORT.md
- FRONTEND-DEV-GUIDE.md
- GITHUB-PAGES-DEPLOYMENT-GUIDE.md
- IMPLEMENTATION-VALIDATION-REPORT.md
- INTEGRATION-TEST-SUCCESS.md
- MOCK-DATA-MANAGER.md
- MOCK-DATA-QUICKSTART.md
- NAVIGATION-UPDATED.md
- NEXT-STEPS-GUIDE.md
- PROGRESS-REPORT-2026-03-08.md
- PROGRESS-UPDATE-2026-03-08-1645.md
- PROJECT-NAME-CHANGE.md
- PUSH-TO-GITHUB-GUIDE.md
- QUICK-START-SUMMARY.md
- READY-TO-TEST.md
- Stitch-Design-Analysis-Report.md
- Stitch-Homepage-Generation-Prompt.md
- TEST-COMPLETION-REPORT.md
- VANT-UI-MIGRATION-COMPLETE.md

**根目录保留**:
- ALPHA-DEVELOPMENT-PLAN.md（当前执行计划）
- GAP-ANALYSIS-AND-PLAN.md（差距分析）
- PHASE-1-ALPHA-PREP-PLAN.md（Alpha 准备）
- opencode.jsonc（配置）

### Step 2: docs 目录整理

**移动业务文档到 docs/business-references/**:
- 所有 PDF 文件（经营分析报告/战略规划等）
- 所有 DOCX 文件（产品介绍/业务规划等）
- 所有 PPTX 文件

**docs 目录保留**:
- planning-artifacts/（PRD/架构等核心文档）
- design-system/（设计规范）
- brainstorming/（头脑风暴）
- converted/（已转换的业务文档）
- designs/（设计稿）
- README.md（新建文档导览）

### Step 3: 新建目录

```bash
# 创建归档目录
mkdir -p docs/archive
mkdir -p docs/business-references/presentations
mkdir -p docs/business-references/reports
mkdir -p docs/business-references/product-docs
mkdir -p docs/business-references/strategy
mkdir -p experiments
```

### Step 4: 新建 README.md

根目录 README.md 内容：
```markdown
# 🚴 骑迹大陆 (RideLand)

**骑行即征服——每一公里都在改变全国领土版图**

## 📋 快速导航

### 核心文档
- [Alpha 开发总计划](./ALPHA-DEVELOPMENT-PLAN.md) - 完整工作计划
- [差距分析](./GAP-ANALYSIS-AND-PLAN.md) - PRD 实现差距
- [Alpha 准备计划](./PHASE-1-ALPHA-PREP-PLAN.md) - 上线准备

### 代码
- [前端项目](./riding-conquest-h5/) - Vue 3 + ECharts
- [后端项目](./riding-conquest-server/) - Go + Gin

### 文档
- [项目文档](./docs/) - PRD/架构/设计
- [业务参考资料](./docs/business-references/) - 业务文档

## 🎯 当前状态

**阶段**: Alpha 开发（04-01 ~ 04-21）  
**目标**: 50 战队内测上线  
**完成度**: 30%

## 🚀 快速开始

```bash
# 前端
cd riding-conquest-h5
npm run dev

# 后端
cd riding-conquest-server
go run cmd/server/main.go
```
```

---

## ⏱️ 预计工时

- Step 1: 根目录归档 - 5 分钟
- Step 2: docs 整理 - 10 分钟
- Step 3: 新建目录 - 2 分钟
- Step 4: 创建 README - 5 分钟

**总计**: 约 22 分钟

---

## ⚠️ 注意事项

1. **不要删除任何文件** - 只移动，不删除
2. **保持 Git 历史** - 移动文件不影响 Git 追踪
3. **大文件谨慎移动** - PDF/DOCX 文件较大，移动时注意
4. **备份重要文档** - 移动前确认文档内容

---

**执行后效果**:
- 根目录从 50+ 个文件减少到 ~10 个
- 文档分类清晰，易于查找
- 业务大文件集中存放
- 新增导航 README
