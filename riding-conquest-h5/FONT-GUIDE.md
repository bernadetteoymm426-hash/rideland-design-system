# 国风字体使用指南

## 当前字体方案

### 中文正文字体
**思源宋体 (Noto Serif SC)** + **系统楷体 (STKaiti/KaiTi)**

**选择理由：**
- ✅ 识别度高：宋体结构清晰，小屏易读
- ✅ 传统韵味：有书法美感，符合国风主题
- ✅ 系统支持：macOS/iOS 自带楷体，Android 可回退到思源宋体
- ✅ 加载快速：使用系统字体，无网络延迟

### 数字/英文字体
**SF Pro Display** (Apple 系统字体)

**选择理由：**
- ✅ 清晰度最佳：专为 Retina 屏优化
- ✅ 数字等宽：数据对齐美观
- ✅ 现代感：与传统中文形成对比，层次分明

### 书法标题字体
**马善政 (Ma Shan Zheng)** - Google Fonts

**使用场景：**
- 页面大标题（如"骑行记录"、"排行榜"）
- 特殊装饰文字（如头像中的"骑"字）
- 排名展示（如"#3"）

**注意：** 仅用于大字，小字识别度低

---

## 字体层级

```
页面标题 (28px+) → Ma Shan Zheng (书法体)
数字数据 (22-42px) → SF Pro Display (无衬线)
中文正文 (12-18px) → Noto Serif SC + KaiTi (宋体/楷体)
辅助文字 (12-13px) → KaiTi (楷体)
```

---

## 备选字体方案

### 方案 A：更传统
- 正文：**方正宋刻本秀楷**（需授权）
- 标题：**汉仪篆书**（需授权）

### 方案 B：更现代
- 正文：**PingFang SC** (苹方)
- 标题：**Ma Shan Zheng** (保持)

### 方案 C：免费商用
- 正文：**思源宋体** + **思源黑体**
- 标题：**站酷高端黑** / **庞门正道标题体**

---

## 字体大小规范

### 数字字号（统一使用）
- `--num-sm`: 22px（统计卡片）
- `--num-base`: 28px（主要数据）
- `--num-lg`: 34px（重要数据）
- `--num-xl`: 42px（排名等超大数字）

### 中文字号
- `--text-xs`: 12px（辅助说明）
- `--text-sm`: 13px（次要文字）
- `--text-base`: 14px（正文）
- `--text-lg`: 15px（正文大）
- `--text-xl`: 16px（副标题）
- `--text-2xl`: 18px（标题）
- `--text-3xl`: 22px（大标题）

---

## 使用建议

1. **数字统一**：所有数据展示使用 `var(--num-*)` 变量
2. **避免混用**：同一层级保持字体一致
3. **对比度**：数字用无衬线，中文用宋体/楷体
4. **测试**：在真实设备上验证小字识别度

---

## 字体文件

- Ma Shan Zheng: [Google Fonts](https://fonts.google.com/specimen/Ma+Shan+Zheng)
- Noto Serif SC: [Google Fonts](https://fonts.google.com/noto/specimen/Noto+Serif+SC)
- 系统楷体：macOS/iOS 自带，无需下载
