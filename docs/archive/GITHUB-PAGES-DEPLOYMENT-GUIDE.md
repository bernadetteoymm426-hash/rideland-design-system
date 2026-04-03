# 🚀 GitHub Pages 部署指南

## ✅ 已完成的工作

1. ✅ 设计系统文件已创建
   - `docs/design-system/index.html` - 设计系统可视化展示
   - `docs/design-system/DESIGN.md` - 完整设计系统文档
   - `docs/design-system/README.md` - 使用说明

2. ✅ Git 提交已完成
   - 提交信息：`docs: Add RideLand Design System v2.0 for Stitch integration`
   - 提交哈希：`359c00c`

---

## 📋 部署步骤（3 步完成）

### 步骤 1：创建 GitHub 仓库

1. 打开 GitHub 网站：https://github.com/new
2. 填写仓库信息：
   - **Repository name**: `rideland-design-system`
   - **Description**: 骑迹大陆设计系统 - RideLand Design System v2.0 (Tech-Geo Dark Theme for Stitch)
   - **Visibility**: 选择 `Public`（GitHub Pages 需要公开仓库）
   - 不要初始化 README、.gitignore 或 License
3. 点击 **"Create repository"**

### 步骤 2：推送代码到 GitHub

在终端中运行以下命令：

```bash
cd "/Users/mark/Documents/AI/Project/Project 001"

# 添加远程仓库（替换 YOUR-GITHUB-USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR-GITHUB-USERNAME/rideland-design-system.git

# 验证远程仓库
git remote -v

# 推送到 GitHub
git push -u origin main
```

如果遇到认证问题，使用：
```bash
# 使用个人访问令牌（推荐）
git remote set-url origin https://YOUR-GITHUB-TOKEN@github.com/YOUR-GITHUB-USERNAME/rideland-design-system.git
git push -u origin main
```

或者使用 SSH（如果配置了 SSH key）：
```bash
git remote set-url origin git@github.com:YOUR-GITHUB-USERNAME/rideland-design-system.git
git push -u origin main
```

### 步骤 3：启用 GitHub Pages

1. 进入仓库页面：https://github.com/YOUR-GITHUB-USERNAME/rideland-design-system
2. 点击 **"Settings"** 标签页
3. 在左侧菜单找到 **"Pages"**
4. 在 **"Build and deployment"** 部分：
   - **Source**: Deploy from a branch
   - **Branch**: 选择 `main`，文件夹选择 `/ (root)`
   
   **或者**（推荐的 docs 目录方式）：
   - **Source**: Deploy from a branch
   - **Branch**: 选择 `main`，文件夹选择 `/docs`（因为我们设计系统在 docs/design-system 目录）
   
5. 点击 **"Save"**

等待 1-2 分钟，GitHub 会部署你的网站。

---

## 🌐 获取设计系统 URL

部署完成后，你的设计系统 URL 将是：

### 如果使用 `/docs` 目录方式（推荐）：
```
https://YOUR-GITHUB-USERNAME.github.io/rideland-design-system/design-system/index.html
```

### 如果使用根目录方式：
```
https://YOUR-GITHUB-USERNAME.github.io/rideland-design-system/
```

---

## 🎨 在 Stitch 中导入设计系统

### 方法 1：通过 URL 导入

1. 打开 Stitch 项目：https://stitch.withgoogle.com/projects/5180537362465701192
2. 点击右上角的 **设置图标** 或 **"Design System"**
3. 选择 **"Import from URL"** 或 **"Use Reference"**
4. 粘贴你的设计系统 URL：
   ```
   https://YOUR-GITHUB-USERNAME.github.io/rideland-design-system/design-system/index.html
   ```
5. Stitch 会自动分析颜色、字体、组件等设计令牌

### 方法 2：生成新设计时使用

在 Stitch 的提示词框中输入：

```
Based on RideLand Design System v2.0, create a landscape homepage (1920x1080):

Layout:
- Top bar (80px): Logo "骑迹大陆" + Weekly status bar
- Map area (85% screen): China map with territory overlays
- Bottom navigation (100px): 4 buttons + User avatar

Colors:
- Background: #070E1B (Deep Space Black)
- Primary: #3B82F6 (Tech Blue)
- Ally territory: rgba(34, 197, 94, 0.45)
- Enemy territory: rgba(239, 68, 68, 0.35)
- Hometown: #F59E0B (Victory Gold) with pulse animation

Visual effects:
- Backdrop blur (20px)
- Blue glow effects
- Semi-transparent overlays
- Gold pulse on hometown

Reference: https://YOUR-GITHUB-USERNAME.github.io/rideland-design-system/design-system/index.html
```

---

## ✅ 验证部署

### 检查清单

部署完成后，验证以下内容：

- [ ] GitHub Pages URL 可以访问
- [ ] 页面加载正常（无 404 错误）
- [ ] 色彩展示正确（深空黑背景、科技蓝按钮）
- [ ] 布局演示显示（顶部条 + 地图区域 + 底部栏）
- [ ] 领土着色动画正常（脉冲效果）
- [ ] 组件展示正确（按钮、标签、进度条等）

### 测试 URL 访问

在浏览器中打开：
```bash
# 替换为你的实际 URL
https://YOUR-GITHUB-USERNAME.github.io/rideland-design-system/design-system/index.html
```

你应该看到：
- 🎨 品牌色展示（深空黑、科技蓝、翡翠绿、胜利金、热情红）
- 🗺️ 领土着色演示（半透明叠加效果）
- 📐 横屏布局演示（80px 顶部条 + 900px 地图 + 100px 底部栏）
- 🧩 组件系统（按钮、标签、进度条、卡片）
- 📏 间距系统（8px 网格）

---

## 🔄 更新设计系统

如果需要更新设计系统：

```bash
# 1. 修改文件
vim docs/design-system/index.html
# 或
vim docs/design-system/DESIGN.md

# 2. 提交更改
cd "/Users/mark/Documents/AI/Project/Project 001"
git add docs/design-system/
git commit -m "docs: Update design system (describe your changes)"

# 3. 推送到 GitHub
git push origin main

# 4. 等待 1-2 分钟，GitHub Pages 会自动更新
```

---

## 🛠️ 故障排除

### 问题 1: GitHub Pages 显示 404

**原因**: GitHub Pages 还未部署完成

**解决方案**:
1. 等待 2-3 分钟
2. 检查 Actions 标签页：https://github.com/YOUR-GITHUB-USERNAME/rideland-design-system/actions
3. 确保没有 build 错误

### 问题 2: 样式不显示

**原因**: 文件路径问题

**解决方案**:
1. 检查 index.html 中的 CSS 路径
2. 确保使用相对路径
3. 清除浏览器缓存

### 问题 3: 无法推送代码

**原因**: 认证问题

**解决方案**:
1. 创建 GitHub Personal Access Token：
   - 访问：https://github.com/settings/tokens
   - 选择 "Generate new token (classic)"
   - 勾选 "repo" 权限
   - 复制 token
2. 使用 token 推送：
```bash
git remote set-url origin https://YOUR-TOKEN@github.com/YOUR-USERNAME/rideland-design-system.git
git push -u origin main
```

---

## 📊 设计系统关键信息

### 色彩系统
| 颜色 | 色值 | 用途 |
|------|------|------|
| 深空黑 | `#070E1B` | 主背景 |
| 科技蓝 | `#3B82F6` | 主色调 |
| 翡翠绿 | `#10B981` | 我方领土 |
| 胜利金 | `#F59E0B` | 家乡高亮 |
| 热情红 | `#EF4444` | 敌方领土 |

### 布局规范
- **屏幕尺寸**: 1920x1080 横屏
- **顶部信息条**: 80px
- **地图区域**: ~900px (85% 屏幕)
- **底部功能栏**: 100px

### 字体系统
```css
font-family: -apple-system, BlinkMacSystemFont, "PingFang SC",
             "Helvetica Neue", "Microsoft YaHei", sans-serif;
```

---

## 📞 需要帮助？

如有问题，请查看：
- GitHub Pages 文档：https://pages.github.com/
- Stitch 文档：https://stitch.withgoogle.com/docs
- 设计系统文档：`docs/design-system/DESIGN.md`

---

**最后更新**: 2026-03-23  
**版本**: v2.0 - 横屏游戏化布局
