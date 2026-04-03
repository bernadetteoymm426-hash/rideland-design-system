# Stitch 设计系统 vs UX 规范对比分析报告

**分析日期**: 2026-03-23  
**分析对象**: Stitch 项目「骑迹大陆 - 首页地图疆域」  
**对比基准**: `docs/planning-artifacts/ux-design-specification.md` v2.0

---

## 📊 总体评估

| 维度 | 符合度 | 评分 | 说明 |
|------|--------|------|------|
| **色彩系统** | ⚠️ 部分符合 | 7/10 | 基础色正确，但部分色值偏离 |
| **布局结构** | ✅ 高度符合 | 9/10 | 横屏布局、顶部条 + 底部栏完全一致 |
| **字体系统** | ❌ 不符合 | 3/10 | 使用了西文字体，未使用系统字体 |
| **领土着色** | ✅ 高度符合 | 9/10 | 半透明着色和颜色选择正确 |
| **视觉风格** | ✅ 高度符合 | 9/10 | 科技地理深色系、毛玻璃效果到位 |
| **组件规范** | ⚠️ 部分符合 | 6/10 | 按钮功能与规范不一致 |
| **整体评分** | ⚠️ | **7.2/10** | 视觉风格优秀，但技术实现有偏差 |

---

## ✅ 符合 UX 规范的部分

### 1. 布局结构（9/10）⭐

**Stitch 实现**:
```html
<!-- 顶部信息条 (80px) -->
<header class="fixed top-0 left-0 w-full z-50 ... h-20">
  <!-- Logo + 周循环状态条 -->
</header>

<!-- 地图区域 (85% 屏幕) -->
<main class="relative z-10 pt-24 pb-32 ...">
  <!-- 中国地图 + 领土着色 -->
</main>

<!-- 底部功能栏 (100px) -->
<nav class="fixed bottom-0 left-0 w-full z-50 ... h-[100px]">
  <!-- 4 个功能按钮：战队/作战/战报/排行 -->
</nav>
```

**对比 UX 规范**:
```
顶部信息条：80px ✅
地图区域：85% 屏幕 ✅
底部功能栏：100px ✅
功能按钮：4 个（战队/作战/战报/排行）✅
```

**结论**: 布局结构完全符合 UX 规范 v2.0 的横屏游戏化布局要求。

---

### 2. 领土着色（9/10）⭐

**Stitch 实现**:
```css
/* 我方领土 - 绿色 */
.bg-secondary/45 → #4edea3/45% ≈ rgba(78, 222, 163, 0.45)

/* 敌方领土 - 红色 */
.bg-error/35 → #ffb4ab/35% ≈ rgba(255, 180, 171, 0.35)

/* 争夺中 - 橙色 */
.bg-tertiary/40 → #ffb95f/40% ≈ rgba(255, 185, 95, 0.4)

/* 无主之地 - 灰色 */
.bg-outline/20 → #8c909f/20% ≈ rgba(140, 144, 159, 0.2)
```

**UX 规范要求**:
```css
territory-own: rgba(34, 197, 94, 0.45)   /* 翡翠绿 */
territory-enemy: rgba(239, 68, 68, 0.35) /* 热情红 */
territory-contested: rgba(245, 158, 11, 0.4) /* 胜利金 */
territory-neutral: rgba(107, 114, 128, 0.2) /* 无主灰 */
```

**对比分析**:
| 领土类型 | UX 规范色值 | Stitch 实现色值 | 偏差 |
|---------|------------|----------------|------|
| 我方 | `rgba(34, 197, 94, 0.45)` | `rgba(78, 222, 163, 0.45)` | ⚠️ 绿色偏蓝 |
| 敌方 | `rgba(239, 68, 68, 0.35)` | `rgba(255, 180, 171, 0.35)` | ⚠️ 红色偏粉 |
| 争夺中 | `rgba(245, 158, 11, 0.4)` | `rgba(255, 185, 95, 0.4)` | ✅ 接近 |
| 无主 | `rgba(107, 114, 128, 0.2)` | `rgba(140, 144, 159, 0.2)` | ⚠️ 灰色偏亮 |

**结论**: 着色逻辑和透明度正确，但具体色值有偏差。需要调整为 UX 规范定义的色值。

---

### 3. 视觉风格（9/10）⭐

**Stitch 实现的视觉效果**:
- ✅ 深空黑背景 (`#0c1321` ≈ `#070E1B`)
- ✅ 毛玻璃效果 (`backdrop-blur-xl`, `backdrop-blur-md`)
- ✅ 蓝色光效 (`shadow-[0_0_15px_rgba(173,198,255,0.1)]`)
- ✅ 脉冲动画 (`animate-ping`, `animate-pulse`)
- ✅ 网格叠加层 (扫描线效果)
- ✅ 家乡金色高亮 (`bg-tertiary` + 脉冲)

**UX 规范要求**:
```
- 深色系底图 ✅
- 半透明领土着色 ✅
- 脉冲光效攻防动画 ✅
- 数据美学 ✅
- 卫星夜景图 + 战略指挥屏 ✅
```

**结论**: 视觉风格高度符合「科技地理」深色系定位，沉浸感和游戏化体验出色。

---

### 4. 家乡高亮（10/10）⭐

**Stitch 实现**:
```html
<!-- Hometown Highlight: Beijing HQ -->
<div class="absolute top-[32%] left-[65%]">
  <div class="absolute w-12 h-12 bg-tertiary/30 rounded-full animate-ping"></div>
  <div class="absolute w-6 h-6 bg-tertiary rounded-full shadow-[0_0_20px_#ffb95f]"></div>
  <div class="absolute -top-10">
    <span class="text-[10px] text-tertiary uppercase">Hometown Base</span>
    <p class="text-sm font-bold">BEIJING HQ</p>
  </div>
</div>
```

**UX 规范要求**:
```
- 金色脉冲效果 ✅
- 家乡自动定位 ✅
- 情感化文案 ✅
```

**结论**: 完美实现 UX 规范要求的家乡金色脉冲高亮效果。

---

## ⚠️ 部分符合的部分

### 1. 色彩系统（7/10）

**Stitch 使用的颜色**:
```css
/* 主色调 */
--primary: #adc6ff;        /* UX 规范：#3B82F6 科技蓝 */
--secondary: #4edea3;      /* UX 规范：#10B981 翡翠绿 */
--tertiary: #ffb95f;       /* UX 规范：#F59E0B 胜利金 */
--error: #ffb4ab;          /* UX 规范：#EF4444 热情红 */

/* 背景色 */
--surface: #0c1321;        /* UX 规范：#070E1B 深空黑 */
--surface-container-lowest: #070e1b; /* ✅ 正确 */
```

**问题分析**:
1. **主色调偏差**: `#adc6ff`（浅蓝）vs `#3B82F6`（科技蓝）
   - Stitch 使用的是 Material Design 3 的初级色调
   - UX 规范要求更高饱和度的科技蓝

2. **辅助色偏差**: `#4edea3`（薄荷绿）vs `#10B981`（翡翠绿）
   - Stitch 的绿色偏蓝
   - UX 规范的翡翠绿更饱和

3. **错误色偏差**: `#ffb4ab`（粉色）vs `#EF4444`（热情红）
   - Stitch 的红色偏粉
   - UX 规范需要更正的红色

**结论**: Stitch 使用了 Material Design 3 的默认配色，需要覆盖为 UX 规范定义的颜色。

---

### 2. 组件规范（6/10）

**底部功能栏对比**:

| 按钮 | UX 规范 | Stitch 实现 | 状态 |
|------|---------|------------|------|
| 按钮 1 | 战队 | 战队 ✅ | 正确 |
| 按钮 2 | 作战 | 作战 ✅ | 正确 |
| 按钮 3 | 战报 | 战报 ✅ | 正确 |
| 按钮 4 | 排行 | 排行 ✅ | 正确 |
| 头像 | 右侧头像 | ❌ 缺失 | 需要补充 |

**额外组件**:
- ❌ Stitch 添加了「开始骑行」FAB 按钮（规范中不存在）
- ❌ Stitch 添加了「Global Feed」数据面板（规范中不存在）
- ❌ Stitch 添加了「Territory Control」左侧面板（规范中不存在）

**结论**: 核心导航按钮正确，但添加了过多额外组件，违反了 UX 规范的「地图即灵魂」P4 原则。

---

## ❌ 不符合 UX 规范的部分

### 1. 字体系统（3/10）❌

**Stitch 实现**:
```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
```

```css
font-family: {
  "headline": ["Space Grotesk"],    /* 西文字体 */
  "body": ["Manrope"],              /* 西文字体 */
  "label": ["Space Grotesk"]        /* 西文字体 */
}
```

**UX 规范要求**:
```css
font-family: -apple-system, BlinkMacSystemFont, "PingFang SC",
             "Helvetica Neue", "Microsoft YaHei", sans-serif;
```

**问题分析**:
1. **加载外部字体**: 违反「零额外加载」原则
2. **中文字体缺失**: Space Grotesk 和 Manrope 不支持中文
3. **包体积**: 外部字体增加首包体积，违反 `<200KB` 约束

**影响**: 
- 中文显示会回退到系统字体，导致西文 + 中文混排不协调
- 增加首屏加载时间
- 违反 UX 规范的技术约束

**结论**: 必须修改为系统字体栈。

---

### 2. 布局细节（6/10）

**Stitch 布局问题**:

```html
<!-- ❌ 左侧面板 - 侵占地图空间 -->
<div class="w-72 flex flex-col gap-4 pointer-events-auto">
  <!-- Territory Control 面板 -->
  <!-- Recent Mission 面板 -->
</div>

<!-- ❌ 右侧面板 - 遮挡地图 -->
<div class="flex flex-col items-end gap-6 pointer-events-auto">
  <!-- 开始骑行 FAB 按钮 -->
  <!-- Global Feed 面板 -->
</div>
```

**UX 规范要求**:
```
地图区域：85% 屏幕，无遮挡
顶部信息条：仅 Logo + 周循环状态条
底部功能栏：仅 4 个功能按钮 + 头像
```

**问题分析**:
1. **地图空间被侵占**: 左右面板占用过多空间，地图实际占比 < 70%
2. **信息过载**: 违反 P2 原则「一目了然」
3. **功能按钮过多**: 顶部添加了 4 个图标按钮（规范中不存在）

**结论**: 需要移除左右面板，让地图成为绝对主角。

---

## 📝 修改建议

### 高优先级（必须修改）

#### 1. 修正字体系统
```html
<!-- 删除 Google Fonts 链接 -->
- <link href="https://fonts.googleapis.com/..." rel="stylesheet"/>

<!-- 使用系统字体栈 -->
<style>
  :root {
    --font-sans: -apple-system, BlinkMacSystemFont, "PingFang SC",
                 "Helvetica Neue", "Microsoft YaHei", sans-serif;
  }
  body {
    font-family: var(--font-sans);
  }
</style>
```

#### 2. 修正色彩系统
```css
/* 覆盖 Material Design 颜色 */
:root {
  --primary: #3B82F6;        /* 科技蓝 */
  --secondary: #10B981;      /* 翡翠绿 */
  --tertiary: #F59E0B;       /* 胜利金 */
  --error: #EF4444;          /* 热情红 */
  --surface: #070E1B;        /* 深空黑 */
}
```

#### 3. 修正领土着色
```css
.territory-ally { 
  background-color: rgba(34, 197, 94, 0.45); /* 翡翠绿 */
}
.territory-enemy { 
  background-color: rgba(239, 68, 68, 0.35); /* 热情红 */
}
.territory-contested { 
  background-color: rgba(245, 158, 11, 0.4); /* 胜利金 */
}
.territory-neutral { 
  background-color: rgba(107, 114, 128, 0.2); /* 无主灰 */
}
```

#### 4. 移除多余组件
```html
<!-- ❌ 删除左侧面板 -->
- <div class="w-72 flex flex-col gap-4">...</div>

<!-- ❌ 删除右侧面板 -->
- <div class="flex flex-col items-end gap-6">...</div>

<!-- ❌ 删除顶部额外按钮 -->
- <button class="p-2">...</button> × 4

<!-- ✅ 保留底部导航 + 头像 -->
<nav class="fixed bottom-0 ...">
  <!-- 战队/作战/战报/排行 -->
  <div class="player-avatar">...</div> <!-- 添加头像 -->
</nav>
```

---

### 中优先级（建议修改）

#### 5. 优化顶部信息条
```html
<header class="fixed top-0 h-[80px] ...">
  <div class="logo-area">
    <h1>骑迹大陆</h1>
    <!-- 可选：添加 Slogan -->
  </div>
  <div class="weekly-status">
    <!-- 周循环状态条（48px 高） -->
  </div>
  <!-- ❌ 删除右侧图标按钮组 -->
</header>
```

#### 6. 简化地图装饰
```html
<!-- ✅ 保留：领土着色、家乡高亮、脉冲点 -->
<!-- ❌ 删除：网格扫描线、坐标显示等过度装饰 -->
```

---

## 🎯 总结

### Stitch 设计的优势
1. ✅ **视觉风格正确**: 科技地理深色系、毛玻璃效果、脉冲光效都非常符合 UX 规范
2. ✅ **布局结构正确**: 横屏布局、顶部条 + 底部栏的结构完全正确
3. ✅ **家乡高亮完美**: 金色脉冲效果超出预期
4. ✅ **领土着色逻辑正确**: 半透明叠加方式符合规范

### Stitch 设计的问题
1. ❌ **字体系统错误**: 使用西文字体，不支持中文，违反零加载原则
2. ❌ **色彩值偏差**: Material Design 3 默认色与 UX 规范定义不符
3. ❌ **组件过载**: 添加了过多额外面板和按钮，违反「地图即灵魂」原则
4. ❌ **细节不匹配**: 顶部按钮、FAB 按钮等不存在于规范中

### 总体评价
**Stitch 生成的设计在视觉风格和布局结构上高度符合 UX 规范 v2.0，但在技术实现细节（字体、色彩、组件精简度）上存在偏差。**

**建议**: 以 Stitch 设计为视觉基础，按照上述修改建议进行调整，即可得到完全符合 UX 规范的高质量设计。

---

**下一步行动**:
1. 修改字体为系统字体栈
2. 覆盖色彩系统为 UX 规范定义的值
3. 移除左右侧面板，让地图占比达到 85%
4. 简化顶部信息条，只保留 Logo + 周循环状态
5. 添加底部功能栏的头像区域

**报告完成** ✅
