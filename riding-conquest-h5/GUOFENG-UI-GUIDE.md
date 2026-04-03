# 🎨 国风 UI 改造完成指南

## ✅ 已完成的工作

### 1. 设计系统
- 📄 `src/assets/design-system.md` - 完整的国风设计规范文档
  - 色彩体系（黛蓝、鎏金、朱红、青绿、米白）
  - 字体规范（思源宋体、马善政毛笔字体）
  - 组件规范（卡片、按钮、列表）
  - 装饰元素（云纹、回纹、海浪纹）

### 2. UnoCSS 配置更新
- 📄 `uno.config.ts` - 国风主题配置
  - 主题色板（primary, gold, red, green, beige, purple, ink）
  - 快捷方式（guofeng-card, guofeng-btn-primary, text-title-xl 等）
  - 自定义规则（金色渐变、深蓝渐变、祥云渐变）

### 3. 国风组件库
#### 核心组件
- 📄 `src/components/guofeng/GuofengCard.vue` - 国风卡片组件
  - 支持三种变体：default, scroll（卷轴）, medal（勋章）
  - 四角装饰、云纹分隔线
  - 可配置标题栏和渐变背景

- 📄 `src/components/guofeng/GuofengButton.vue` - 国风按钮组件
  - 三种变体：primary（金色）, secondary（描边）, danger（朱红）
  - 三种尺寸：small, medium, large
  - 支持 loading 状态和图标

#### 更新组件
- 📄 `src/components/BottomNav.vue` - 国风底部导航
  - 深蓝渐变背景 + 金色边框
  - 激活状态金色光晕效果
  - 云纹装饰顶部线条

### 4. 页面改造
#### 已完成
- 📄 `src/views/HomeView.vue` - 首页
  - 用户信息卡片（卷轴样式）
  - 功能入口 6 宫格
  - 公告栏
  - 快捷骑行入口

- 📄 `src/views/MapView.vue` - 地图页
  - 领土卡片网格
  - 阵营色区分（我方绿、敌方红、无主灰）
  - 金色边框装饰
  - 国风详情弹窗

### 5. 美术资源
#### SVG 装饰图案
- 📄 `public/assets/patterns/cloud-pattern.svg` - 云纹背景图案
- 📄 `public/assets/patterns/corner-decoration.svg` - 四角装饰
- 📄 `public/assets/patterns/cloud-divider.svg` - 云纹分隔线

#### 字体
- 已在 `index.html` 添加 Google Fonts 引用
  - Ma Shan Zheng（马善政毛笔字体）- 标题
  - Noto Serif SC（思源宋体）- 正文
  - Noto Sans SC（思源黑体）- 备用

---

## 🚀 如何使用

### 运行项目
```bash
cd "/Users/mark/Documents/AI/Project/Project 001/riding-conquest-h5"
npm install
npm run dev
```

### 使用国风组件

#### GuofengCard 卡片
```vue
<template>
  <!-- 默认样式 -->
  <GuofengCard title="标题" subtitle="SUBTITLE">
    内容区
  </GuofengCard>
  
  <!-- 卷轴样式（米白背景） -->
  <GuofengCard variant="scroll" title="公告">
    卷轴内容
  </GuofengCard>
  
  <!-- 勋章样式（金色背景） -->
  <GuofengCard variant="medal">
    特殊内容
  </GuofengCard>
</template>

<script setup>
import GuofengCard from '@/components/guofeng/GuofengCard.vue'
</script>
```

#### GuofengButton 按钮
```vue
<template>
  <!-- 主按钮（金色渐变） -->
  <GuofengButton variant="primary" size="large" icon="play-o">
    立即出发
  </GuofengButton>
  
  <!-- 次按钮（透明描边） -->
  <GuofengButton variant="secondary" size="medium">
    查看更多
  </GuofengButton>
  
  <!-- 危险按钮（朱红色） -->
  <GuofengButton variant="danger" size="small" :loading="true">
    发起宣战
  </GuofengButton>
</template>

<script setup>
import GuofengButton from '@/components/guofeng/GuofengButton.vue'
</script>
```

### 使用 UnoCSS 快捷方式

```vue
<template>
  <!-- 文字层级 -->
  <h1 class="text-title-xl">特大标题</h1>
  <h2 class="text-title-lg">大标题</h2>
  <h3 class="text-title-md">中标题</h3>
  <p class="text-body-lg">大正文</p>
  <p class="text-body">正文</p>
  <span class="text-body-sm">小字</span>
  
  <!-- 布局 -->
  <div class="flex-center">居中</div>
  <div class="flex-col-center">垂直居中</div>
  <div class="flex-between">两端对齐</div>
  
  <!-- 背景 -->
  <div class="bg-gold-gradient">金色渐变</div>
  <div class="bg-deep-gradient">深蓝渐变</div>
  <div class="bg-cloud-gradient">祥云渐变</div>
  
  <!-- 阴影 -->
  <div class="shadow-guofeng">国风阴影</div>
</template>
```

---

## 📋 下一步工作

### 待完成的页面
1. **RideView.vue** - 骑行页面
   - 路线选择卡片
   - 骑行数据面板
   - 开始骑行按钮

2. **TeamView.vue** - 战队页面
   - 战队信息卡片
   - 成员列表
   - 战队排行榜

3. **RankView.vue** - 排行榜页面
   - 榜单卡片
   - 排名列表
   - 我的排名

### 待生成的美术资源
建议使用 AI 图像生成工具创建：
1. **背景图** - 深蓝渐变 + 山水剪影 + 祥云
2. **图标包** - 金色描边风格的功能图标
3. **中国地图** - 国风配色，省份边界金色描边
4. **装饰元素** - 卷轴、印章、旗帜等

### 优化建议
1. **动效增强** - 添加页面切换动画、按钮点击反馈
2. **音效** - 添加点击音效、占领音效等
3. **性能优化** - 图片懒加载、组件按需引入

---

## 🎯 设计风格总结

| 元素 | 风格特征 |
|------|----------|
| **色彩** | 黛蓝底色 + 鎏金强调 + 朱红/青绿状态 |
| **边框** | 2px 金色边框，四角装饰 |
| **背景** | 深蓝渐变，低饱和度，不抢 UI 风头 |
| **文字** | 宋体/楷体，金色标题，米白正文 |
| **装饰** | 云纹、回纹、海浪纹、卷轴元素 |
| **动效** | 300ms 过渡，金色光晕反馈 |

---

## 📞 需要帮助？

如需继续完善 UI 或生成更多美术资源，随时告诉我！

**项目位置**: `/Users/mark/Documents/AI/Project/Project 001/riding-conquest-h5/`
