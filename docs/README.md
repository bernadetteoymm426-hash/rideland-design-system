# 骑迹大陆设计系统托管指南

本目录包含骑迹大陆 Design System v2.0 的完整文件，可用于 Stitch 设计系统导入。

## 📁 文件清单

1. **DESIGN.md** - 完整设计系统文档（Markdown 格式）
2. **public/design-system.html** - 设计系统可视化展示页面
3. **骑迹大陆 -UI-VI 规范与 Stitch 提示词.md** - UI-VI 规范与提示词库

## 🌐 托管方式

### 方案 1：GitHub Pages（推荐）

1. 在 GitHub 创建仓库（例如：`rideland-design-system`）
2. 将 `riding-conquest-h5/public` 目录内容推送到仓库
3. 启用 GitHub Pages：
   - Settings → Pages
   - Source: Deploy from branch
   - Branch: main /root
4. 获取公开 URL：`https://your-username.github.io/rideland-design-system/design-system.html`

### 方案 2：Vercel / Netlify

1. 将 `riding-conquest-h5/public` 目录部署到 Vercel/Netlify
2. 获取公开 URL

### 方案 3：本地开发服务器（仅测试）

```bash
cd riding-conquest-h5/public
python3 -m http.server 8000
# 访问：http://localhost:8000/design-system.html
```

## 🎨 在 Stitch 中使用

### 方法 1：通过 URL 导入设计系统

1. 打开 Stitch 项目：https://stitch.withgoogle.com/projects/5180537362465701192
2. 点击设计系统设置
3. 选择"从 URL 导入"
4. 粘贴设计系统展示页面的公开 URL
5. Stitch 会自动分析颜色、字体、间距等设计令牌

### 方法 2：通过 DESIGN.md 导入

1. 复制 `DESIGN.md` 文件内容
2. 在 Stitch 中创建新的设计提示
3. 粘贴 DESIGN.md 内容作为设计系统规范
4. 使用以下提示词生成新设计：

```
基于骑迹大陆设计系统 v2.0，创建一个横屏首页（1920x1080），包含：

布局要求：
- 顶部信息条（80px）：Logo + 周循环状态条
- 地图区域（85% 屏幕）：中国地图 + 领土着色
- 底部功能栏（100px）：4 个功能按钮 + 用户头像

视觉风格：
- 深空黑背景：#070E1B
- 科技蓝主色调：#3B82F6
- 翡翠绿（我方领土）：#10B981
- 胜利金（家乡高亮）：#F59E0B
- 热情红（敌方领土）：#EF4444

特殊效果：
- 领土着色：半透明叠加（45% 透明度）
- 家乡高亮：金色脉冲动画
- 毛玻璃效果：backdrop-filter: blur(20px)
- 蓝色光效：box-shadow 脉冲

参考文件：
- DESIGN.md（设计系统规范）
- design-system.html（可视化展示）
```

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
- **地图区域**: 85% 屏幕（约 900px）
- **底部功能栏**: 100px

### 字体系统
```css
font-family: -apple-system, BlinkMacSystemFont, "PingFang SC",
             "Helvetica Neue", "Microsoft YaHei", sans-serif;
```

### 间距系统
基于 8px 网格：8px, 16px, 24px, 32px, 40px, 48px, 64px

## ✅ 验证清单

使用 Stitch 生成设计后，验证以下要点：

- [ ] 背景色是否为深空黑 `#070E1B`
- [ ] 主色调是否为科技蓝 `#3B82F6`
- [ ] 领土着色是否为半透明叠加
- [ ] 地图占比是否约 85% 屏幕
- [ ] 顶部信息条高度是否 80px
- [ ] 底部功能栏高度是否 100px
- [ ] 功能按钮是否为 4 个（战队/作战/战报/排行）
- [ ] 是否有用户头像（带金色光环）
- [ ] 字体是否为系统字体栈（非 Google Fonts）
- [ ] 是否有毛玻璃效果（backdrop-blur）

## 🔄 更新流程

1. 修改 `DESIGN.md` 或 `design-system.html`
2. 提交到 Git 仓库
3. GitHub Pages 自动更新
4. 在 Stitch 中重新导入设计系统 URL
5. 生成新的设计变体

## 📞 使用帮助

如有问题，请查看：
- `DESIGN.md` - 完整设计系统文档
- `design-system.html` - 可视化展示
- Stitch 项目：https://stitch.withgoogle.com/projects/5180537362465701192

---

**最后更新**: 2026-03-23  
**版本**: v2.0 - 横屏游戏化布局
