# 🚀 手动推送命令

## 原因
GitHub 需要身份认证，自动化推送被阻止。请按以下步骤操作。

---

## ✅ 方案 1：直接使用 Git 命令（推荐）

在终端中执行以下命令（已配置好所有参数）：

```bash
cd "/Users/mark/Documents/AI/Project/Project 001" && git push -u origin main
```

**执行后会提示输入：**
- Username: 输入你的 GitHub 用户名
- Password: 输入你的 **Personal Access Token**（不是 GitHub 密码！）

---

## 🔑 如何获取 Personal Access Token

如果没有 Token，请按以下步骤创建：

### 步骤 1：访问 Token 设置页面
打开：https://github.com/settings/tokens

### 步骤 2：生成新 Token
1. 点击 **"Generate new token"** → 选择 **"Generate new token (classic)"**
2. 填写信息：
   - **Note**: `RideLand Design System Deployment`
   - **Expiration**: 选择 `No expiration`（或 90 天）
3. 勾选权限：
   - ✅ **repo** (Full control of private repositories)
4. 点击 **"Generate token"** 页面底部

### 步骤 3：复制 Token
- 复制生成的 Token（以 `ghp_` 开头）
- ⚠️ **只显示一次！** 立即保存到安全地方

---

## ✅ 方案 2：使用 GitHub Desktop（最简单）

如果命令行太复杂，使用 GitHub Desktop：

### 步骤 1：下载 GitHub Desktop
访问：https://desktop.github.com/

### 步骤 2：添加现有仓库
1. 打开 GitHub Desktop
2. File → Add Local Repository
3. 选择文件夹：`/Users/mark/Documents/AI/Project/Project 001`
4. 如果提示 "repository not found on GitHub"，点击 "Publish this repository to GitHub"
5. 点击 "Publish repository"

### 步骤 3：推送代码
1. 在 GitHub Desktop 中看到更改
2. 输入 commit message（可选，已经 commit 过了）
3. 点击 "Push origin"

---

## ✅ 方案 3：使用 SSH（如果你配置了 SSH Key）

### 步骤 1：切换到 SSH URL
```bash
cd "/Users/mark/Documents/AI/Project/Project 001"
git remote set-url origin git@github.com:bernadetteoymm426-hash/rideland-design-system.git
git push -u origin main
```

### 步骤 2：如果没有 SSH Key
生成 SSH Key：
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# 按回车接受默认位置
# 输入 passphrase（可选）

# 复制公钥
cat ~/.ssh/id_ed25519.pub | pbcopy
```

### 步骤 3：添加到 GitHub
1. 访问：https://github.com/settings/keys
2. 点击 "New SSH key"
3. 粘贴公钥（刚才 pbcopy 的内容）
4. 点击 "Add SSH key"

### 步骤 4：再次推送
```bash
cd "/Users/mark/Documents/AI/Project/Project 001"
git push -u origin main
```

---

## 📋 推送成功后

推送成功后，访问你的仓库确认：
https://github.com/bernadetteoymm426-hash/rideland-design-system

你应该能看到：
- ✅ `docs/design-system/index.html`
- ✅ `docs/design-system/DESIGN.md`
- ✅ `docs/design-system/README.md`

---

## 🌐 启用 GitHub Pages

推送成功后，继续下一步：

1. 访问：https://github.com/bernadetteoymm426-hash/rideland-design-system/settings/pages
2. 现在 **Branch** 下拉框应该有 `main` 选项了
3. 选择：
   - **Branch**: `main`
   - **Folder**: `/docs`（重要！因为设计系统在 docs/design-system 目录）
4. 点击 **Save**

等待 1-2 分钟，GitHub Pages 就会部署完成！

你的设计系统 URL 将是：
```
https://bernadetteoymm426-hash.github.io/rideland-design-system/design-system/index.html
```

---

## 💡 快速验证

推送并部署完成后，在浏览器打开：
```
https://bernadetteoymm426-hash.github.io/rideland-design-system/design-system/index.html
```

你应该看到设计系统展示页面！🎨

---

## 🆘 遇到问题？

如果有任何错误信息，请复制完整的错误信息告诉我，我会帮你解决。

常见问题：
- ❌ "Permission denied" → 检查 Token 权限或 SSH Key
- ❌ "403 Forbidden" → Token 权限不足，重新生成并勾选 repo 权限
- ❌ "Authentication failed" → Token 错误或过期
