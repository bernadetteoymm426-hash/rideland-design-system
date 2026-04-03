# 骑迹大陆 - UI&VI 设计规范与 Stitch 提示词

**项目名称**: 骑迹大陆 (RideLand)  
**文档版本**: v1.0  
**生成时间**: 2026-03-20  
**适用项目**: 骑迹大陆 H5 游戏化应用  
**使用工具**: Google Stitch - AI UI 生成

---

## 📖 使用指南

本文档包含完整的 UI&VI 规范与 Stitch 提示词，用于生成符合规范的 UI 设计图。

### 如何使用

1. **查看规范** - 了解色彩、布局、组件规范
2. **复制提示词** - 选择需要的场景提示词
3. **粘贴到 Stitch** - 在 Stitch 中生成 UI 设计图
4. **验证输出** - 检查是否符合规范要求

---

## 🎨 品牌识别系统

### 品牌名称

| 类型 | 名称 | 说明 |
|------|------|------|
| **中文名称** | 骑迹大陆 | "骑迹" = 骑行轨迹 + 创造奇迹 |
| **英文名称** | RideLand | Ride (骑行) + Land (大陆) |
| **品牌 Slogan** | 骑行即征服——每一公里都在改变全国领土版图 | 核心体验承诺 |

### 设计风格

- **主题**: 科技地理深色主题
- **关键词**: 战略指挥屏、卫星夜景图、沉浸式、游戏化
- **参考对象**: 《率土之滨》、《部落冲突》等横屏 SLG 游戏

---

## 🎨 色彩系统 (Color Palette)

### 主色调

| 颜色名称 | 色值 | 用途 | 示例 |
|---------|------|------|------|
| **深空黑** | `#070E1B` | 主背景色 | 地图底图、页面背景 |
| **科技蓝** | `#3B82F6` | 主色调、按钮、激活态 | 功能按钮、数据数字 |
| **翡翠绿** | `#10B981` | 积极数据、我方领土 | 里程数据、我方领土标记 |
| **胜利金** | `#F59E0B` | 成就、等级、荣誉 | 等级徽章、成就标识 |
| **热情红** | `#EF4444` | 重要提醒、敌方领土 | 敌方领土、警告提示 |

### 辅助色

| 颜色名称 | 色值 | 用途 |
|---------|------|------|
| **浅空灰** | `#F1F5F9` | 主文字色 |
| **中灰** | `#94A3B8` | 次要文字、标签 |
| **深灰** | `#64748B` | 辅助文字、时间戳 |
| **无主灰** | `#6B7280` | 无主领土标记 |

### 领土着色（半透明叠加）

| 状态 | 色值 | 用途 |
|------|------|------|
| **我方领土** | `rgba(34, 197, 94, 0.45)` | 绿色半透明 |
| **敌方领土** | `rgba(239, 68, 68, 0.35)` | 红色半透明 |
| **争夺中** | `rgba(245, 158, 11, 0.4)` | 橙色半透明 |
| **无主之地** | `rgba(107, 114, 128, 0.2)` | 灰色半透明 |

### 渐变规范

**科技蓝渐变**:
```css
background: linear-gradient(180deg, #60A5FA 0%, #3B82F6 100%);
```

**金色荣誉渐变**:
```css
background: linear-gradient(180deg, #FBBF24 0%, #F59E0B 100%);
```

**绿色积极渐变**:
```css
background: linear-gradient(180deg, #34D399 0%, #10B981 100%);
```

---

## 📐 布局系统 (Layout System)

### 横屏游戏化布局 (1920x1080)

```
┌──────────────────────────────────────────────┐
│  顶部信息条 (80px)                           │
│  Logo + 周循环状态条                          │
├──────────────────────────────────────────────┤
│                                              │
│          【中国地图 - 85% 屏幕】               │
│          高度约 900px                         │
│                                              │
├──────────────────────────────────────────────┤
│  底部功能栏 (100px)                          │
│  [战队] [作战] [战报] [排行]      👤 头像    │
└──────────────────────────────────────────────┘
```

### 尺寸分布

| 区域 | 高度 | 说明 |
|------|------|------|
| **顶部信息条** | 80px | Logo + 周循环状态 |
| **底部功能栏** | 100px | 4 个功能按钮 + 头像 |
| **地图区域** | ~900px | 85% 屏幕，地图主视觉 |

### 响应式断点

| 设备类型 | 宽度范围 | 布局调整 |
|---------|---------|---------|
| **桌面横屏** | ≥1920px | 完整布局 |
| **平板横屏** | 1024-1920px | 等比缩放 |
| **手机横屏** | 769-1024px | 功能栏简化 |
| **手机竖屏** | ≤768px | 竖屏适配（待设计） |

---

## 🔘 组件系统 (Component System)

### 功能按钮（底部栏）

**标准尺寸**:
- 宽度：100px
- 高度：80px
- 图标：32×32px
- 文字：13px

**视觉样式**:
```css
背景：rgba(26, 39, 64, 0.6)
边框：1px solid rgba(59, 130, 246, 0.3)
圆角：12px
图标颜色：#3B82F6
```

**5 种交互状态**:
1. **默认**: 深蓝背景 + 蓝色边框
2. **悬停**: 上浮 2px + 光效增强
3. **点击**: 下沉反馈 + 粒子效果
4. **禁用**: 灰色 + 无光效
5. **激活**: 更强蓝色光效 + 脉冲

### 浮层组件 (Overlay)

**标准尺寸**:
- 宽度：800px (max), 90% (响应式)
- 高度：80vh (max)
- 圆角：16px
- 背景：`rgba(26, 39, 64, 0.95)`
- 边框：`1px solid rgba(59, 130, 246, 0.3)`
- 阴影：`0 16px 48px rgba(0, 0, 0, 0.5)`

**浮层结构**:
```
┌─────────────────────────────────┐
│ [× 关闭]                        │ ← 头部 (60px)
├─────────────────────────────────┤
│                                 │
│  [可滚动内容区]                 │
│  padding: 32px                  │
│                                 │
└─────────────────────────────────┘
```

### 周循环状态条

**尺寸**:
- 高度：48px
- 圆角：12px
- 背景：`rgba(26, 39, 64, 0.6)`
- 边框：`1px solid rgba(59, 130, 246, 0.3)`

**四阶段颜色**:
| 阶段 | 颜色 | 色值 |
|------|------|------|
| **对战期** | 科技蓝 | `#3B82F6` |
| **结算期** | 橙色 | `#F59E0B` |
| **战报发布** | 金色 | `#FBBF24` |
| **宣战窗口** | 紫色 | `#8B5CF6` |

---

## 🗺️ 地图系统 (Map System)

### ECharts 配置规范

```js
{
  geo: {
    map: 'china',
    roam: true,
    zoom: 1.2,
    center: [104.0, 36.0],
    itemStyle: {
      areaColor: '#0A1628',
      borderColor: '#3B82F6',
      borderWidth: 1,
      shadowColor: 'rgba(59, 130, 246, 0.5)',
      shadowBlur: 10
    }
  }
}
```

### 领土标记点

**标记点样式**:
- 尺寸：16px (直径)
- 边框：3px 白色
- 脉冲：2px 半透明边框
- 标签：12px 白色文字 + 黑色阴影

**颜色规范**:
| 状态 | 颜色 | 色值 |
|------|------|------|
| **我方** | 绿色 | `#22C55E` |
| **敌方** | 红色 | `#EF4444` |
| **无主** | 灰色 | `#6B7280` |
| **家乡** | 金色 | `#F59E0B` (特殊脉冲) |

### 家乡高亮效果

**金色脉冲动画**:
```css
@keyframes hometown-pulse {
  0%, 100% {
    box-shadow: 0 0 20px rgba(245, 158, 11, 0.6);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 40px rgba(245, 158, 11, 1);
    transform: scale(1.3);
  }
}
```

---

## ✨ 动效系统 (Animation System)

### 缓动函数

```css
/* 标准缓动 */
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);

/* 弹性缓动 */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* 快速缓动 */
--ease-fast: cubic-bezier(0.4, 0, 0.6, 1);
```

### 持续时间

| 类型 | 持续时间 | 用途 |
|------|---------|------|
| **微交互** | 150ms | 按钮点击、小图标动画 |
| **状态过渡** | 300ms | 状态切换、颜色变化 |
| **页面切换** | 500ms | 浮层展开/关闭 |
| **大型动画** | 800ms | 镜头推进、家乡高亮 |

### 关键动画

**脉冲动画**:
```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}
```

**上浮动画**:
```css
@keyframes float-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**缩放进入**:
```css
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

---

## 📝 情感化文案系统

### 家乡定位文案（3 种状态）

**状态 1 - 守护中（我方领土）**:
```
标题：你的家乡 [北京] 正在被守护
副标题：[骑行者联盟] 已坚守 12 天
行动按钮：骑一圈，为家乡加油
```

**状态 2 - 被进攻（敌方领土）**:
```
标题：你的家乡 [上海] 正在遭受进攻！
副标题：[魔骑行] 的攻势还剩 2 天 14:32
行动按钮：立即骑行，保卫家乡
```

**状态 3 - 无主之地**:
```
标题：你的家乡 [杭州] 还是无主之地
副标题：成为第一个征服者，创造历史
行动按钮：开始征服
```

### 贡献反馈文案

**1km**:
```
你的 1km 让战队攻城进度 +1%
每一公里都算数！
```

**10km**:
```
你的 10km 让战队攻城进度 +8%
离拿下浦东又近一步！
```

**50km**:
```
你的 50km 让战队攻城进度 +35%
个人贡献排名 TOP 10！
```

### 失败保护文案

**失去 1 个领土**:
```
虽然失去了浦东，但你的战队成功防守了 8 个领土
本周总骑行量增长了 40%！
```

**失去多个领土**:
```
本周形势严峻，但你的战队展现了顽强的防守精神
下周可以夺回来！
```

---

## 🎯 设计原则 (Design Principles)

### UX 优先级框架

| 优先级 | 原则 | 含义 |
|--------|------|------|
| **P0** | 反馈优先 | 任何动作都必须有即时视觉反馈 |
| **P1** | 情感先于逻辑 | 先触动用户情感，再解释规则 |
| **P2** | 一目了然 | 核心信息扫一眼就懂 |
| **P3** | 智能默认 | 系统替用户做决定，用户只需确认 |
| **P4** | 地图即灵魂 | 地图是核心视觉和交互载体 |

### 情感化设计铁律

1. **永远正面表达** - 任何数据都用正向框架
2. **每骑必响** - 任何骑行后都有专属反馈
3. **紧迫不焦虑** - 营造期待感，不制造 FOMO
4. **集体叙事优先** - 个人数据放在集体故事语境中
5. **失败也有收获** - 即使输也展示积极面

---

## 🎨 Stitch 提示词库

### 1. 横屏主界面

```
Design a landscape mobile game UI for "RideLand" - a cycling conquest game.

Style: Tech-geo dark theme, deep navy background (#070E1B), tech blue accents (#3B82F6).

Layout (1920x1080):
- Top bar (80px): Logo "骑迹大陆" on left, weekly status bar on right
- Main area (85% screen): Full China map with territory markers
- Bottom bar (100px): 4 game function buttons (战队/作战/战报/排行)
- Top-right: Player avatar with rotating gold ring

Visual effects:
- Blue glow effects and pulse animations
- Semi-transparent overlays with backdrop blur
- Territory markers with green/red/gray colors
- Gold pulse effect for hometown

Atmosphere: Strategic command center, satellite night view, immersive game experience.
```

---

### 2. 家乡定位浮层

```
Design an emotional onboarding overlay for first-time users.

Three variants:

1. Guarding state (green theme):
   Title: "你的家乡正在被守护"
   Subtitle: "骑行者联盟 已坚守 12 天"
   Button: "骑一圈，为家乡加油"

2. Under attack (red theme, urgent):
   Title: "你的家乡正在遭受进攻！"
   Subtitle: "魔骑行 的攻势还剩 2 天 14:32"
   Button: "立即骑行，保卫家乡"

3. Unclaimed (gold theme, opportunity):
   Title: "你的家乡还是无主之地"
   Subtitle: "成为第一个征服者，创造历史"
   Button: "开始征服"

Style: Dark semi-transparent background, emotional copywriting, prominent action button.
Animation: Fade in + scale up, gold pulse effect on hometown marker.
```

---

### 3. 战队浮层

```
Design a team info overlay panel (800px max-width, 80vh max-height).

Content:
- Header: Team name "骑行者联盟", badge, rank #3
- Stats: 128 members, 12 territories, 28,450km total
- Member list with avatar, name, contribution, role
- Action buttons: "邀请好友", "退出战队"

Style: Dark background rgba(26,39,64,0.95), blue borders, scrollable content.
Visual: Trophy icons, contribution bars, member avatars with status indicators.
```

---

### 4. 作战浮层

```
Design a battle command overlay for territory conquest.

Sections:
1. Current attack: Target "浙江省", progress bar 52%, countdown "2 天 14:32"
2. Available targets: List with territory name, owner, defense value, strategic rating (★)
3. Action button: "发起征服" (red, prominent)

Style: Military-tech aesthetic, red accents for enemies, progress bar with glow effect.
Layout: Two-column, left side attacking info, right side target list.
```

---

### 5. 战报浮层

```
Design a weekly battle report overlay with narrative style.

Content:
- Summary: Rank #5 → #3 ↑, Territories +3
- Personal stats: 234km, 4 attacks, 2 defenses
- Achievements: Medals with icons (🏅)
- Share button: "分享战报到朋友圈"

Style: Celebratory theme, gold accents for achievements, not just data table.
Visual: Trophy icons, progress indicators, medal displays, confetti effect.
```

---

### 6. 排行浮层

```
Design a leaderboard overlay with Tab switching.

Tabs: "战队榜" | "个人榜"

Content:
- Top 10 with rank badges (🥇🥈🥉 for top 3)
- User's ranking highlighted at #28
- Stats: Name, total mileage, territories

Style: Competitive theme, gold/silver/bronze for top 3, dark background.
Layout: Table format with rank column, name column, stats column.
```

---

### 7. 个人浮层

```
Design a personal profile overlay.

Sections:
1. Profile: Avatar with rotating ring, "Lv.12 征服者"
2. Weekly stats: 234km, 4 attacks, 2 defenses (grid layout)
3. Achievements: Medal collection display
4. Settings: Hometown, notifications, dark mode, logout

Style: Clean centered layout, personal avatar prominent, achievement badges visible.
```

---

## ✅ 验证清单

使用 Stitch 生成 UI 后，请验证以下要点：

### 色彩验证
- [ ] 背景色是否为深空黑 `#070E1B`
- [ ] 主色调是否为科技蓝 `#3B82F6`
- [ ] 绿色是否为翡翠绿 `#10B981`
- [ ] 金色是否为胜利金 `#F59E0B`
- [ ] 红色是否为热情红 `#EF4444`

### 布局验证
- [ ] 地图占比是否约 85%
- [ ] 顶部信息条高度是否 80px
- [ ] 底部功能栏高度是否 100px
- [ ] 浮层宽度是否 ≤800px
- [ ] 浮层圆角是否 16px

### 视觉验证
- [ ] 按钮是否有蓝色光效
- [ ] 浮层是否半透明毛玻璃效果
- [ ] 动画是否有脉冲效果
- [ ] 标记点是否有颜色区分
- [ ] 家乡是否有金色高亮

### 文案验证
- [ ] 家乡定位是否有情感冲击
- [ ] 行动按钮是否清晰明确
- [ ] 数字是否使用等宽字体
- [ ] 失败文案是否正面表达

---

## 📝 使用流程

### Step 1: 复制提示词

从本文档中选择需要的场景，复制对应的提示词。

### Step 2: 粘贴到 Stitch

打开 Google Stitch，将提示词粘贴到生成框。

### Step 3: 设置参数

- **尺寸**: 1920x1080（横屏）
- **风格**: 科技地理深色主题
- **数量**: 2-4 个变体

### Step 4: 生成并下载

点击生成，等待完成后下载 PNG/HTML。

### Step 5: 验证符合性

使用验证清单检查生成结果是否符合规范。

### Step 6: 迭代优化

如不符合，调整提示词重新生成。

---

**文档结束**

---

**维护者**: 骑迹大陆设计团队  
**最后更新**: 2026-03-20  
**下次更新**: 2026-03-27（Week 1 结束）
