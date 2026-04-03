# 🚀 快速启动指南

## 1. 安装依赖

```bash
cd "/Users/mark/Documents/AI/Project/Project 001/riding-conquest-h5"
npm install
```

## 2. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:5173` 查看效果

## 3. 构建生产版本

```bash
npm run build
```

## 4. 预览生产构建

```bash
npm run preview
```

---

## 📁 新增文件结构

```
riding-conquest-h5/
├── src/
│   ├── assets/
│   │   └── design-system.md          # 国风设计规范
│   ├── components/
│   │   └── guofeng/
│   │       ├── GuofengCard.vue       # 国风卡片
│   │       └── GuofengButton.vue     # 国风按钮
│   ├── views/
│   │   ├── HomeView.vue              # 首页（已改造）
│   │   └── MapView.vue               # 地图页（已改造）
│   └── App.vue                       # 全局样式（已更新）
├── public/
│   └── assets/
│       └── patterns/
│           ├── cloud-pattern.svg     # 云纹背景
│           ├── corner-decoration.svg # 四角装饰
│           └── cloud-divider.svg     # 云纹分隔线
├── index.html                        # 添加了国文字体
├── uno.config.ts                     # UnoCSS 国风配置
└── GUOFENG-UI-GUIDE.md              # 完整使用指南
```

---

## 🎨 核心改动

### 色彩方案
- **底色**: #0D1B2A（黛蓝）→ #1B263B（藏青）渐变
- **强调色**: #D4AF37（鎏金）
- **状态色**: #C41E3A（朱红）、#2E8B57（青绿）
- **文字色**: #F5F5DC（米白）、#2C2C2C（墨黑）

### 字体
- **标题**: Ma Shan Zheng（马善政毛笔字体）
- **正文**: Noto Serif SC（思源宋体）

### 组件
- 所有卡片添加金色边框和四角装饰
- 按钮使用金色渐变
- 底部导航添加云纹装饰

---

## ⚠️ 注意事项

1. **网络依赖**: 字体从 Google Fonts 加载，需要网络连接
2. **Vant 版本**: 确保使用 Vant 4.x
3. **Node 版本**: 需要 Node.js 20.19+ 或 22.12+

---

## 📞 问题排查

如果遇到样式问题：
1. 清除浏览器缓存
2. 删除 `node_modules` 重新安装
3. 检查控制台是否有报错

如需帮助，查看 `GUOFENG-UI-GUIDE.md` 获取详细文档。
