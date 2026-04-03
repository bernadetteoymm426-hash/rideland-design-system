# 🎨 白金帝王风 · 征服疆域主题 - 美术应用指南

**更新时间：** 2026-03-16  
**主题：** 指点江山、攻城略地  
**风格：** 抽象疆域 + 权力美学

---

## 📦 美术素材清单

### 主背景（1 张）
| 文件 | 尺寸 | 用途 | 应用位置 |
|------|------|------|---------|
| `bg-conquest-abstract.jpg` | 1600×2848 | APP 主背景 | `App.vue` 全局 |

**设计元素：**
- 抽象疆域脉络（山川河流的感觉）
- 金色路线和标记点（征伐路径）
- 顶部金色光晕（权力中心）
- 底部云海层次
- **无文字、无具体地图、无玉玺**

---

### 装饰元素（4 张）

| 文件 | 尺寸 | 用途 | 应用位置 |
|------|------|------|---------|
| `corner-abstract-gold.jpg` | 2048×2048 | 边角装饰 | 卡片四角 |
| `divider-abstract-gold.jpg` | 5888×736 | 分割线 | 内容分隔 |
| `texture-card-subtle.jpg` | 2048×2048 | 卡片底纹 | 卡片内部叠加 |
| `badge-frame-gold.jpg` | 2048×2048 | 徽章边框 | 头像/等级 |

**设计原则：**
- 抽象几何纹样（不要具体青铜器/战旗）
- 金色线条（呼应主背景路线）
- 低对比度（透明度 30-50%）
- 色彩统一（玉脂白 + 鎏金）

---

## 🔧 CSS 应用位置

### 1. 主背景 - `src/App.vue`

```css
html, body, #app {
  background-image: url('/assets/images/bg-conquest-abstract.jpg');
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  background-color: #F5E6D3; /* 备用色 */
}
```

**已更新：** ✅ `App.vue` 第 18-25 行

---

### 2. 卡片样式 - `src/styles/guofeng-theme.css`

#### 卡片容器 + 边角装饰
```css
.card-guofeng {
  background: rgba(255, 255, 255, 0.9);
  background-image: url('/assets/images/texture-card-subtle.jpg');
  background-size: 400px;
  background-blend-mode: multiply;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(212, 175, 55, 0.4);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(212, 175, 55, 0.15);
}

/* 边角装饰 */
.card-guofeng::before,
.card-guofeng::after {
  width: 60px;
  height: 60px;
  background: url('/assets/images/corner-abstract-gold.jpg');
  opacity: 0.4;
}
```

**已更新：** ✅ `guofeng-theme.css` 第 36-66 行

#### 数据网格
```css
.data-grid-guofeng {
  background: rgba(255, 255, 255, 0.9);
  background-image: url('/assets/images/texture-card-subtle.jpg');
  background-size: 400px;
  background-blend-mode: multiply;
  /* ...边角装饰同上... */
}
```

**已更新：** ✅ `guofeng-theme.css` 第 68-98 行

---

### 3. 分割线 - `src/styles/guofeng-theme.css`

```css
.divider-gold {
  height: 2px;
  background: url('/assets/images/divider-abstract-gold.jpg') center center no-repeat;
  background-size: contain;
  opacity: 0.7;
  margin: 16px 0;
}
```

**已更新：** ✅ `guofeng-theme.css` 第 118-130 行

---

### 4. 徽章边框 - `src/styles/guofeng-theme.css`

```css
.avatar-badge-frame {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: url('/assets/images/badge-frame-gold.jpg');
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

**已更新：** ✅ `guofeng-theme.css` 第 182-197 行

---

## 📋 使用示例

### 卡片使用
```vue
<template>
  <div class="card-guofeng">
    <h3>卡片标题</h3>
    <p>卡片内容</p>
  </div>
</template>
```

### 分割线使用
```vue
<template>
  <div>
    <div>内容区块 1</div>
    <div class="divider-gold"></div>
    <div>内容区块 2</div>
  </div>
</template>
```

### 头像徽章使用
```vue
<template>
  <div class="avatar-badge-frame">
    <img src="/avatar.jpg" alt="头像" />
  </div>
</template>
```

---

## 🎨 设计对比

### 旧版本（已废弃）
- ❌ 夜晚月色风格 - 主题不符
- ❌ 修仙问道元素 - 缺少征战感
- ❌ 具体三国地图 - 与现代行政区划不符
- ❌ 玉玺、战旗堆砌 - 元素割裂

### 新版本（已应用）
- ✅ 抽象疆域概念 - 氛围感正确
- ✅ 金色路线标记 - 呼应征服主题
- ✅ 无具体地理特征 - 通用性强
- ✅ 元素融合统一 - 低对比度叠加

---

## 🚀 测试步骤

```bash
# 1. 进入项目目录
cd /Users/mark/Documents/AI/Project/Project\ 001/riding-conquest-h5

# 2. 启动开发服务器
npm run dev

# 3. 访问 http://localhost:5173
# 4. 检查以下页面：
#    - 登录页（新背景图）
#    - 首页（卡片边角装饰 + 底纹）
#    - 疆域页（分割线效果）
#    - 个人中心（头像徽章）
```

---

## 📊 视觉检查清单

### 主背景
- [ ] 背景图完整显示（无裁切问题）
- [ ] 金色光晕在顶部中央
- [ ] 疆域脉络若隐若现（不抢内容）
- [ ] 滚动时背景固定（`position: fixed` 可选）

### 卡片装饰
- [ ] 边角装饰可见但不突兀（透明度 0.4）
- [ ] 卡片底纹细腻（叠加模式正确）
- [ ] 边框金色柔和（rgba 透明度 0.4）
- [ ] 悬停效果正常

### 分割线
- [ ] 金色虚线 + 圆点清晰
- [ ] 透明度适中（0.7）
- [ ] 间距合理（margin 16px）

### 徽章边框
- [ ] 同心圆环清晰
- [ ] 头像居中显示
- [ ] 尺寸正确（80px 外框 / 60px 头像）

---

## 🎯 后续优化（可选）

### P1 补充素材
- [ ] 骑兵剪影（底部装饰）
- [ ] 城池标记（金色图钉样式）
- [ ] 战旗装饰（特殊页面/活动）

### P2 动效优化
- [ ] 卡片入场动画
- [ ] 数字滚动动画
- [ ] 页面切换动画

### P3 性能优化
- [ ] 图片懒加载
- [ ] 背景图压缩（如果文件太大）
- [ ] CSS 压缩

---

## 📁 文件位置汇总

```
riding-conquest-h5/
├── public/assets/images/
│   ├── bg-conquest-abstract.jpg      ✅ 主背景
│   ├── corner-abstract-gold.jpg      ✅ 边角装饰
│   ├── divider-abstract-gold.jpg     ✅ 分割线
│   ├── texture-card-subtle.jpg       ✅ 卡片底纹
│   └── badge-frame-gold.jpg          ✅ 徽章边框
├── src/
│   ├── App.vue                       ✅ 已更新背景
│   └── styles/
│       └── guofeng-theme.css         ✅ 已更新装饰
└── ART-GUIDE-CONQUEST.md             ✅ 本文件
```

---

**设计工具：** seedream-image-gen (Seedream 5.0 Lite)  
**生成时间：** 2026-03-16  
**主题契合度：** ✅ 指点江山、攻城略地
