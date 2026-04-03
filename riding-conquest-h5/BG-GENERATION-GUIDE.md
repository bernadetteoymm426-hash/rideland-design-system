# 🖼️ 白金帝王风背景图 - AI 生成方案

## 📋 当前问题分析

之前的 CSS 渐变背景太简陋，缺少：
- ❌ 细腻的纸张/丝绸纹理
- ❌ 丰富的层次叠加
- ❌ 中国传统纹样细节
- ❌ 光影变化和立体感

## 🎯 解决方案：AI 生成真实背景图

使用 **Midjourney** 或 **通义万相** 生成高质量背景图，替代 CSS 渐变。

---

## 🔥 主背景图提示词（推荐）

### 方案 A: 玉脂白 + 祥云纹理

```prompt
Chinese traditional style mobile UI background, white jade texture with subtle gradient from cream beige #FFF8E7 to warm beige #F5E6D3, 
delicate traditional Chinese cloud patterns (xiangyun) subtly embedded in the background, 
fine rice paper texture overlay, soft golden light glow from top center, 
elegant and noble atmosphere, minimalist but rich in detail, 
high quality texture, mobile app background design, 
color palette: cream white, light gold, warm beige --ar 9:16 --q 2 --v 6.0
```

**中文提示词（通义万相）：**
```
中国传统风格手机 UI 背景，玉脂白渐变（米白#FFF8E7 到暖白#F5E6D3），
细腻的祥云纹样若隐若现融入背景，宣纸质感叠加，顶部中央柔和的金色光晕，
优雅高贵的氛围，极简但细节丰富，高质量纹理，
手机 APP 背景设计，配色：乳白、淡金、暖白 -- 比例 9:16
```

---

### 方案 B: 丝绸质感 + 回纹暗纹

```prompt
Luxurious Chinese silk background texture, cream white to light beige gradient, 
subtle traditional hui pattern (meander/geometric border pattern) as watermark throughout the background, 
soft fabric texture with gentle folds, warm golden ambient lighting from top, 
elegant and refined, premium feel, 
for mobile UI background, traditional Chinese aesthetic, 
colors: ivory white, pale gold, warm cream --ar 9:16 --q 2 --stylize 250
```

**中文提示词（通义万相）：**
```
奢华中国丝绸背景纹理，乳白到浅米色渐变，
传统回纹图案作为水印贯穿背景，柔软织物纹理带轻柔褶皱，
顶部温暖金色环境光，优雅精致，高级感，
手机 UI 背景，中国传统美学，
配色：象牙白、淡金、暖米色 -- 比例 9:16
```

---

### 方案 C: 宣纸质感 + 金粉洒金

```prompt
Traditional Chinese Xuan paper background, aged rice paper texture with natural fibers visible, 
subtle gradient from warm cream at top to light beige at bottom, 
delicate gold flecks scattered across the surface (sakin technique), 
soft diffused lighting, scholarly and elegant atmosphere, 
high resolution texture for mobile UI, 
traditional Chinese art aesthetic, minimalist zen style, 
colors: warm white, aged cream, subtle gold --ar 9:16 --q 2 --v 6.0
```

**中文提示词（通义万相）：**
```
中国传统宣纸背景，陈年宣纸质感可见天然纤维，
从顶部暖米色到底部浅米色的微妙渐变，
表面散布细腻金粉（洒金工艺），柔和漫射光，
文人雅士氛围，高分辨率手机 UI 纹理，
中国传统艺术美学，极简禅意风格，
配色：暖白、陈年米色、微金 -- 比例 9:16
```

---

### 方案 D: 多层叠加（最丰富）

```prompt
Multi-layered Chinese luxury background design:
- Base layer: white jade texture gradient (cream to beige)
- Middle layer: subtle cloud patterns (xiangyun) at 15% opacity
- Top layer: fine geometric hui pattern watermark at 10% opacity
- Lighting: soft golden glow from top center, subtle vignette
- Texture: delicate rice paper grain throughout

Overall effect: elegant, noble, rich in detail but not overwhelming,
perfect for premium mobile UI background,
traditional Chinese imperial aesthetic with modern minimalism,
color scheme: #FFF8E7, #F5E6D3, #D4AF37 (accent only) --ar 9:16 --q 2 --stylize 300
```

**中文提示词（通义万相）：**
```
多层中国奢华背景设计：
- 底层：白玉质感渐变（米白到米色）
- 中层：祥云图案 15% 透明度
- 顶层：几何回纹水印 10% 透明度
- 光影：顶部中央柔和金色光晕，微妙暗角
- 纹理：贯穿整体的细腻宣纸颗粒

整体效果：优雅、高贵、细节丰富但不喧宾夺主，
完美适配高端手机 UI 背景，
中国传统皇家美学结合现代极简主义，
配色：#FFF8E7、#F5E6D3、#D4AF37（仅点缀）-- 比例 9:16
```

---

## 🛠️ 生成工具推荐

### 1. Midjourney（质量最佳）
```bash
# 在 Discord 中使用
/imagine prompt: [上面的英文提示词] --ar 9:16 --q 2 --v 6.0
```

**参数说明：**
- `--ar 9:16` - 竖屏比例（1080x1920）
- `--q 2` - 高质量渲染
- `--v 6.0` - V6 版本（细节更好）
- `--stylize 250` - 艺术化程度（0-1000）

### 2. 通义万相（中文友好）
- 网址：https://tongyi.aliyun.com/wanxiang
- 选择「文生图」
- 输入中文提示词
- 设置比例 9:16
- 选择「摄影」或「艺术」风格

### 3. Stable Diffusion（本地部署）
```
Prompt: [上面的英文提示词]
Negative prompt: dark, vibrant, red, modern, 3d, cartoon, anime, text, watermark
Steps: 30-40
CFG scale: 7
Sampler: DPM++ 2M Karras
```

---

## 📐 生成参数建议

### 分辨率
- **主背景：** 1080x1920（竖屏）或 2160x3840（2K）
- **可平铺纹理：** 1024x1024 或 2048x2048

### 格式
- **PNG** - 无损压缩，保留细节
- **JPG** - 质量 90% 以上（如果文件太大）

### 色彩
- **sRGB** 色彩空间
- 保持配色一致：#FFF8E7 → #F5E6D3 → #D4C5B0

---

## 🎨 后期处理建议

### 1. Photoshop / Figma 调整
- 降低饱和度 10-15%（避免抢内容风头）
- 添加 5-10% 白色叠加（提高亮度）
- 高斯模糊 1-2px（柔化纹理）

### 2. 叠加方式
```css
/* 在 App.vue 中 */
#app {
  background: linear-gradient(180deg, #FFF8E7 0%, #F5E6D3 100%);
  background-image: url('/assets/images/bg-main-new.jpg');
  background-size: cover;
  background-position: center;
  background-blend-mode: overlay; /* 或 soft-light */
}
```

---

## 📝 执行步骤

1. **选择提示词** - 从方案 A/B/C/D 中选择一个最喜欢的
2. **AI 生成** - 使用 Midjourney 或通义万相生成 4-8 个变体
3. **挑选最佳** - 选择细节丰富但不抢眼的版本
4. **保存文件** - 命名为 `bg-main-new.jpg` 或 `bg-main-new.png`
5. **替换测试** - 放到 `public/assets/images/` 目录
6. **调整 CSS** - 在 `App.vue` 中应用新背景

---

## 💡 快速测试方法

生成后，在 `App.vue` 中临时测试：

```css
#app {
  background-image: url('/assets/images/bg-main-new.jpg');
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  /* 保留渐变作为备用 */
  background-color: #F5E6D3;
}
```

---

## 🎯 预期效果

新生成的背景图应该具备：
- ✅ 细腻的纸张/丝绸纹理（近看有细节）
- ✅ 若隐若现的传统纹样（祥云/回纹）
- ✅ 柔和的渐变过渡（顶部亮、底部暗）
- ✅ 温暖的金色光晕（从顶部或中央散发）
- ✅ 整体优雅不抢眼（衬托内容，不是主角）
