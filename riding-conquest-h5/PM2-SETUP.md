# PM2 进程管理配置

## ✅ 已完成配置

开发服务器已由 PM2 管理，**自动重启 + 持久运行**，不会再意外停止了！

### 当前状态
```bash
$ pm2 status
┌────┬────────────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id │ name                   │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├────┼────────────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼────────────────────┼────────────────────┤
│ 0  │ riding-conquest-dev    │ default     │ N/A     │ fork    │ 6217     │ 0s     │ 0    │ online    │ 0%       │ 1.0mb    │ mark     │ disabled │
└────┴────────────────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

---

## 🔧 常用命令

### 查看状态
```bash
# 查看所有 PM2 进程
pm2 status

# 查看详细信息
pm2 describe riding-conquest-dev

# 实时监控（推荐）
pm2 monit
```

### 日志管理
```bash
# 查看日志
pm2 logs riding-conquest-dev

# 实时查看日志
pm2 logs riding-conquest-dev --lines 100

# 清空日志
pm2 flush
```

### 重启/停止
```bash
# 重启开发服务器
pm2 restart riding-conquest-dev

# 停止
pm2 stop riding-conquest-dev

# 删除（停止并移除）
pm2 delete riding-conquest-dev
```

### 内存清理
```bash
# 重启进程以释放内存
pm2 restart all

# 设置内存限制（可选，超过自动重启）
pm2 restart riding-conquest-dev --max-memory-restart 500M
```

---

## 🚀 开机自启动（可选）

如果希望电脑重启后自动启动开发服务器：

```bash
# 1. 运行以下命令（需要输入密码）
sudo env PATH=$PATH:/Users/mark/Library/Application\ Support/easyclaw/ai/tool_cache/resources/tools/mac/node-24.13.0-arm64/bin /Users/mark/Library/Application\ Support/easyclaw/ai/tool_cache/resources/tools/mac/node-24.13.0-arm64/lib/node_modules/pm2/bin/pm2 startup launchd -u mark --hp /Users/mark

# 2. 保存当前进程列表
pm2 save
```

之后每次开机都会自动恢复所有 PM2 进程。

---

## 🎯 优势

| 问题 | 之前 | 现在 |
|------|------|------|
| 服务器意外停止 | ❌ 需要手动重启 | ✅ PM2 自动重启 |
| 不知道服务器状态 | ❌ 需要查端口 | ✅ `pm2 status` 一目了然 |
| 日志分散 | ❌ 终端输出 | ✅ 统一日志管理 |
| 内存泄漏 | ❌ 越跑越慢 | ✅ 可设置内存限制自动重启 |
| 开机启动 | ❌ 手动操作 | ✅ 可配置自启动 |

---

## 📝 访问地址

- **开发服务器**: http://localhost:5173/
- **设计预览**: http://localhost:5173/design-preview-navy-cards.html
- **Vue DevTools**: http://localhost:5173/__devtools__/
- **UnoCSS Inspector**: http://localhost:5173/__unocss/

---

## ⚠️ 注意事项

1. **不要同时运行多个 Vite 实例** - PM2 已经管理了一个，不要再手动 `npm run dev`
2. **修改配置后重启** - 如果修改了 `vite.config.js`，执行 `pm2 restart riding-conquest-dev`
3. **定期清理日志** - 日志文件会增长，定期 `pm2 flush` 或使用 `pm2 logs --rotate`

---

**配置时间**: 2026-03-17  
**配置人**: 万钳 🔧
