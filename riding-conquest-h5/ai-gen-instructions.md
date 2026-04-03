# 🎨 AI 美术素材生成指南

## 问题说明
- 之前（3 月 11 日）生成的 4 个素材质量很好（200-400KB JPG）
- 现在尝试用 SVG 代码生成，效果太差
- 需要找到 11 号使用的生成方法

## 11 号生成的文件
```
bg-main.jpg     - 383KB
card-border.jpg - 253KB
divider.jpg     - 213KB
tab-bg.jpg      - 428KB
```

## 可能的生成方式

### 方案 1: Pollinations.ai（免费 API）
**网址：** https://pollinations.ai  
**特点：** 完全免费，无需登录，HTTP API

**使用方法：**
```bash
# 直接下载
curl "https://image.pollinations.ai/prompt/Chinese%20cloud%20decoration?width=1024&height=1024&nologo=true" -o cloud-corner.jpg
```

**测试命令：**
```bash
cd /Users/mark/Documents/AI/Project/Project\ 001/riding-conquest-h5
curl "https://image.pollinations.ai/prompt/Chinese%20traditional%20cloud%20corner%20decoration%20golden?width=512&height=512&nologo=true&seed=12345" -o public/assets/decorations/test-cloud-corner.jpg
```

### 方案 2: Perchance AI（免登录）
**网址：** https://perchance.org/ai-text-to-image  
**特点：** 免费，免登录，需要浏览器操作

### 方案 3: Craiyon（免登录）
**网址：** https://www.craiyon.com  
**特点：** 免费，免登录，质量一般

### 方案 4: 通义万相（需要登录）
**网址：** https://tongyi.aliyun.com/wanxiang  
**特点：** 免费额度，中国风好，需要阿里云账号

## 推荐提示词（英文）

### 祥云边角
```
Chinese traditional auspicious cloud corner decoration, golden xiangyun pattern, 
ornate UI frame corner element, layered cloud design with gradient gold colors, 
elegant and noble, cream white background, high quality digital art, 
color palette: #D4AF37 gold, #F5E6D3 cream --ar 1:1 --q 2 --style raw
```

### 回纹边框
```
Chinese traditional meander pattern border frame, hui wen geometric design, 
golden continuous border pattern, square frame with hollow center, 
classical Chinese ornament for UI, elegant and refined, 
high resolution digital art, cream background --ar 1:1 --q 2
```

### 祥云分割线
```
Chinese style horizontal divider line, golden cloud pattern in center, 
thin gradient lines extending to both sides, traditional xiangyun ornament, 
elegant separator for UI, cream white background, high quality digital art --ar 10:1 --q 2
```

### 中国结分割线
```
Chinese traditional knot divider, red Chinese knot with golden tassels, 
horizontal decorative separator, festive yet elegant, detailed craftsmanship, 
for UI section division, cream background, high quality digital art, 
colors: Chinese red and golden --ar 8:1 --q 2
```

## 执行步骤

### 快速测试（推荐先试）
```bash
cd /Users/mark/Documents/AI/Project/Project\ 001/riding-conquest-h5

# 测试 Pollinations API
curl "https://image.pollinations.ai/prompt/Chinese%20traditional%20cloud%20corner%20decoration%20golden%20xiangyun%20pattern?width=512&height=512&nologo=true&seed=42" \
  -o public/assets/decorations/test-pollinations.jpg

# 检查结果
ls -lh public/assets/decorations/test-pollinations.jpg
```

### 如果成功
批量生成 7 个素材，然后预览效果。

### 如果失败
尝试其他免费服务或手动操作在线工具。

## 质量要求
- 文件大小：200KB+（高质量）
- 分辨率：至少 512x512
- 格式：JPG 或 PNG
- 风格：中国风，白金帝王配色
- 细节：丰富的纹理和层次
