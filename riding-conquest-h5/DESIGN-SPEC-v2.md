# 🎨 骑行征服 H5 · 美术设计规范

**版本：** v2.0 - 新中式轻奢风  
**更新时间：** 2026-03-16  
**设计师：** 万钳 🔧  
**主题：** 指点江山 · 攻城略地

---

## 📋 目录

1. [设计理念](#设计理念)
2. [配色方案](#配色方案)
3. [字体规范](#字体规范)
4. [卡片样式](#卡片样式)
5. [图标规范](#图标规范)
6. [布局规范](#布局规范)
7. [交互动效](#交互动效)
8. [使用示例](#使用示例)

---

## 设计理念

### 核心概念
**新中式轻奢风** - 融合中国传统文化元素与现代设计语言

### 设计原则
1. **层次分明** - 浅色背景 + 半透明深色卡片，营造空间层次
2. **精致点缀** - 金色用于强调重点，克制而不张扬
3. **文化韵味** - 宋体字体 + 中国风图标，体现文化底蕴
4. **现代体验** - 简洁布局 + 流畅交互，符合现代审美

### 视觉关键词
- 🏆 **高贵** - 金色点缀、精致细节
- 📜 **文化** - 中国风字体、传统元素
- 🎯 **清晰** - 层次分明、可读性强
- ✨ **轻奢** - 半透明材质、柔和光晕

---

## 配色方案

### 主色调

| 颜色名称 | 色值 | 用途 | 示例 |
|---------|------|------|------|
| **米白背景** | `#F5E6D3 → #FFF8E7` | 页面主背景（渐变） | 抽象疆域图底色 |
| **深蓝卡片** | `rgba(26, 35, 55, 0.75)` | 卡片背景（75% 透明度） | 用户卡片、数据格 |
| **鎏金点缀** | `#FFD700 → #D4AF37` | 数字、边框、图标激活态 | 渐变金色 |
| **古铜金** | `#C9A961` | 辅助金色、次要强调 | 渐变终点色 |

### 辅助色

| 颜色名称 | 色值 | 用途 |
|---------|------|------|
| **主文字** | `#2D2D2D` | 背景上的主要文字 |
| **卡片文字** | `#F1F5F9` | 深蓝卡片上的文字 |
| **次要文字** | `#94A3B8` | 说明性文字、标签 |
| **提示文字** | `#64748B` | 辅助信息、时间戳 |

### 功能色

| 颜色名称 | 色值 | 用途 |
|---------|------|------|
| **金色 - 激活** | `rgba(255, 215, 0, 0.2)` | 底部导航激活态背景 |
| **金色 - 边框** | `rgba(212, 175, 55, 0.3-0.5)` | 卡片边框（根据层级） |
| **排名 - 金牌** | `linear-gradient(135deg, #FFD700, #FFA500)` | 第一名徽章 |
| **排名 - 银牌** | `linear-gradient(135deg, #C0C0C0, #A8A8A8)` | 第二名徽章 |
| **排名 - 铜牌** | `linear-gradient(135deg, #CD7F32, #B87333)` | 第三名徽章 |

### 渐变规范

**金色渐变（标准）：**
```css
background: linear-gradient(180deg, #FFD700 0%, #D4AF37 50%, #C9A961 100%);
```

**卡片背景渐变：**
```css
background: linear-gradient(135deg, 
  rgba(26, 35, 55, 0.75) 0%, 
  rgba(30, 41, 59, 0.8) 100%
);
```

**标题文字渐变：**
```css
background: linear-gradient(180deg, #FFD700 0%, #D4AF37 50%, #C9A961 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

---

## 字体规范

### 字体家族

**优先顺序：**
```css
font-family: 'Noto Serif SC', 'Source Han Serif SC', 'STKaiti', 'Kaiti SC', 'Microsoft YaHei', serif;
```

| 字体名称 | 用途 | 优先级 |
|---------|------|--------|
| **Noto Serif SC** | 正文、标题 | 1️⃣ 首选 |
| **Source Han Serif SC** | 正文、标题 | 2️⃣ 备选 |
| **STKaiti / Kaiti SC** | 特殊场景（诗词等） | 3️⃣ 风格化 |
| **Microsoft YaHei** | 系统兜底 | 4️⃣ 备用 |

### 字号规范

| 场景 | 字号 | 字重 | 字间距 | 示例 |
|------|------|------|--------|------|
| **页面大标题** | 36px | 900 | 6px | "骑行征服" |
| **页面副标题** | 13px | 400 | 2px | "指点江山 · 攻城略地" |
| **卡片标题** | 17-18px | 600 | 1px | "快捷入口" |
| **用户名** | 18px | 700 | 0 | "骑友 001" |
| **数据数字** | 24-26px | 700 | 0 | "286.5" |
| **正文内容** | 14-16px | 400-500 | 0.5px | 常规文本 |
| **次要文字** | 12-13px | 400 | 1px | 标签、说明 |
| **提示文字** | 11px | 400 | 0.5px | 时间戳、单位 |

### 字体效果

**标题文字阴影：**
```css
text-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
```

**卡片内文字阴影：**
```css
text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
```

---

## 卡片样式

### 卡片层级

#### Level 1 - 主卡片（用户卡片）
```css
.user-card {
  margin: 20px;
  background: linear-gradient(135deg, 
    rgba(26, 35, 55, 0.75) 0%, 
    rgba(30, 41, 59, 0.8) 100%
  );
  border: 2px solid rgba(212, 175, 55, 0.4);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 40px rgba(212, 175, 55, 0.08);
}
```

#### Level 2 - 数据格子
```css
.data-cell {
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(212, 175, 55, 0.25);
  border-radius: 12px;
  padding: 16px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}
```

#### Level 3 - 快捷按钮
```css
.feat-btn {
  background: linear-gradient(135deg, 
    rgba(26, 35, 55, 0.7) 0%, 
    rgba(30, 41, 59, 0.75) 100%
  );
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 14px;
  padding: 16px 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}
```

### 卡片通用属性

| 属性 | 值 | 说明 |
|------|-----|------|
| **圆角** | 12-16px | 大卡片 16px，小卡片 12px |
| **边框** | 2px | 金色，透明度 0.25-0.5 |
| **内边距** | 16-20px | 根据内容调整 |
| **外边距** | 20px | 卡片之间统一间距 |
| **背景模糊** | `blur(10px)` | 毛玻璃效果 |
| **透明度** | 70-80% | 让背景透过来 |

### 卡片装饰

**边角装饰（可选）：**
```css
.card::before,
.card::after {
  content: '';
  position: absolute;
  width: 60px;
  height: 60px;
  background: radial-gradient(circle at 0 0, 
    rgba(212, 175, 55, 0.4) 0%, 
    transparent 60%
  );
  pointer-events: none;
}
```

**顶部装饰线：**
```css
.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 20%;
  right: 20%;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(212, 175, 55, 0.3) 20%,
    rgba(212, 175, 55, 0.8) 50%,
    rgba(212, 175, 55, 0.3) 80%,
    transparent
  );
}
```

---

## 图标规范

### 图标风格

**统一使用：圆形背景 + 金色线条图标**

### 尺寸规范

| 场景 | 图标容器 | 图标本身 | 线条粗细 |
|------|---------|---------|---------|
| **快捷入口** | 48px × 48px | 24px × 24px | 2px |
| **底部导航** | 36px × 36px | 20px × 20px | 2px |
| **功能图标** | 32px × 32px | 16px × 16px | 1.5px |

### 图标容器

```css
.icon-container {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, 
    rgba(212, 175, 55, 0.15) 0%, 
    rgba(201, 169, 97, 0.25) 100%
  );
  border: 2px solid rgba(212, 175, 55, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.2);
}
```

### 图标 SVG

**样式：**
```css
.icon-svg {
  width: 24px;
  height: 24px;
  stroke: #D4AF37;
  stroke-width: 2;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}
```

**激活态：**
```css
.icon-svg.active {
  stroke: #FFD700;
  stroke-width: 2.5;
}
```

### 标准图标集

| 名称 | 用途 | SVG 路径 |
|------|------|---------|
| **首页** | 底部导航 | `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>` |
| **疆域** | 底部导航 | `<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>` |
| **骑行** | 底部导航 | `<circle cx="5" cy="18" r="3"></circle><circle cx="19" cy="18" r="3"></circle><path d="M5 15V9a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v6"></path>` |
| **战队** | 底部导航 | `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle>` |
| **排行** | 底部导航 | `<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path>` |

---

## 布局规范

### 页面结构

```
┌─────────────────────────┐
│   页面头部 (Header)     │  padding: 24px 20px
├─────────────────────────┤
│   主卡片 (User Card)    │  margin: 20px
├─────────────────────────┤
│   分割线 (Divider)      │  margin: 20px 16px
├─────────────────────────┤
│   次卡片 (Rank Card)    │  margin: 0 20px 20px
├─────────────────────────┤
│   章节标题 (Section)    │  padding: 20px 20px 16px
├─────────────────────────┤
│   功能网格 (Grid)       │  gap: 16px, padding: 0 20px
├─────────────────────────┤
│   底部导航 (Tab Bar)    │  position: fixed, bottom: 0
└─────────────────────────┘
```

### 间距系统

| 类型 | 值 | 用途 |
|------|-----|------|
| **页面边距** | 20px | 卡片与屏幕边缘 |
| **卡片间距** | 20px | 卡片之间垂直间距 |
| **网格间距** | 16px | 快捷入口网格间距 |
| **内边距** | 16-20px | 卡片内部 padding |
| **元素间距** | 8-12px | 图标与文字间距 |

### 底部导航

```css
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: calc(60px + env(safe-area-inset-bottom));
  background: linear-gradient(180deg, 
    rgba(26, 35, 55, 0.85) 0%, 
    rgba(15, 23, 42, 0.85) 100%
  );
  border-top: 2px solid rgba(212, 175, 55, 0.4);
  backdrop-filter: blur(20px);
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-bottom: env(safe-area-inset-bottom);
}
```

---

## 交互动效

### 悬停效果

**卡片悬停：**
```css
.card:hover {
  border-color: rgba(212, 175, 55, 0.6);
  box-shadow: 
    0 6px 20px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(212, 175, 55, 0.15);
  transform: translateY(-2px);
}
```

### 点击效果

**按钮点击：**
```css
.btn:active {
  transform: scale(0.98);
}
```

**导航点击：**
```css
.nav-item:active {
  transform: scale(0.95);
}
```

### 过渡动画

**统一过渡：**
```css
transition: all 0.3s ease;
```

**特殊过渡：**
```css
/* 平滑位移 */
transition: transform 0.3s ease, box-shadow 0.3s ease;

/* 快速反馈 */
transition: transform 0.15s ease;
```

---

## 使用示例

### 1. 用户卡片
```html
<div class="user-card">
  <div class="user-info-row">
    <div class="avatar-circle">
      <span class="avatar-char">骑</span>
    </div>
    <div class="user-text">
      <div class="user-name">骑友 001</div>
      <div class="user-level">Lv.5</div>
    </div>
  </div>
  
  <div class="data-grid">
    <div class="data-cell">
      <div class="data-num">12</div>
      <div class="data-label">总骑行次数</div>
    </div>
    <!-- 更多数据格 -->
  </div>
</div>
```

### 2. 快捷入口
```html
<div class="section-title">
  <div class="title-left">
    <div class="title-decoration"></div>
    <h3>快捷入口</h3>
  </div>
</div>

<div class="feature-row">
  <div class="feat-btn">
    <div class="feat-icon-bg">
      <svg viewBox="0 0 24 24" stroke="#D4AF37" stroke-width="2">
        <!-- 图标路径 -->
      </svg>
    </div>
    <span class="feat-txt">我的战队</span>
  </div>
  <!-- 更多按钮 -->
</div>
```

### 3. 底部导航
```html
<div class="bottom-nav">
  <div class="nav-item active">
    <div class="nav-icon">
      <svg viewBox="0 0 24 24" stroke="#FFD700" stroke-width="2.5">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      </svg>
    </div>
    <span class="nav-label">首页</span>
  </div>
  <!-- 更多导航项 -->
</div>
```

### 4. 页面头部
```html
<div class="header">
  <h1>骑行征服</h1>
  <p>指点江山 · 攻城略地</p>
</div>
```

---

## 背景规范

### 主背景

**使用抽象疆域图：**
```css
background-color: #F5E6D3;
background-image: url('/assets/images/bg-conquest-abstract.jpg');
background-size: cover;
background-position: center top;
background-repeat: no-repeat;
background-attachment: fixed;
```

### 背景要求

- ✅ 保持抽象疆域图的细节和纹理
- ✅ 米白色调，不要太深
- ✅ 有金色光晕和路线元素
- ✅ 固定背景（滚动时不动）

---

## 检查清单

### 设计审查

- [ ] 卡片透明度是否在 70-80% 之间？
- [ ] 金色是否用于强调重点（不过度使用）？
- [ ] 字体是否使用思源宋体系列？
- [ ] 图标是否为圆形 + 金色线条风格？
- [ ] 卡片间距是否统一为 20px？
- [ ] 底部导航激活态是否柔和（不刺眼）？
- [ ] 文字在卡片上是否清晰可读？
- [ ] 背景图是否正确加载？

### 技术实现

- [ ] 使用 backdrop-filter 实现毛玻璃效果
- [ ] 金色渐变使用 3 色渐变（#FFD700 → #D4AF37 → #C9A961）
- [ ] 图标使用 SVG（非 emoji、非图片）
- [ ] 所有过渡动画使用 0.3s ease
- [ ] 响应式适配移动端

---

## 版本历史

| 版本 | 日期 | 更新内容 |
|------|------|---------|
| v1.0 | 2026-03-13 | 白金帝王风初版（米白 + 金） |
| v2.0 | 2026-03-16 | 新中式轻奢风（深蓝卡片 + 宋体 + 圆形图标） |

---

## 相关文件

- **预览文件：** `design-preview-navy-cards.html`
- **背景图：** `public/assets/images/bg-conquest-abstract.jpg`
- **图标集：** `public/assets/icons/`（待生成）
- **参考文档：** `ART-PROMPTS.md`、`ART-RESOURCES.md`

---

**📌 使用说明：**
1. 所有新页面必须遵循本规范
2. 已有页面逐步迁移到新规范
3. 如需调整规范，先更新本文档
4. 保持设计一致性，避免混用风格

**设计师签名：** 万钳 🔧  
**最后更新：** 2026-03-16 17:50
