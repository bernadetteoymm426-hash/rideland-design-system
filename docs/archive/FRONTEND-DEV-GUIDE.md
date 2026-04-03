# 前端开发指南

**更新时间**: 2026-03-08  
**状态**: ✅ Mock API 已配置，准备开发

---

## 📁 项目位置

```
/Users/mark/Documents/AI/Project/Project 001/riding-conquest-h5/
```

---

## 🔧 Mock API 配置

### 已创建的文件

1. **src/utils/mock-api.js** - Mock 数据服务
   - ✅ login() - 模拟登录
   - ✅ refreshToken() - 刷新 token
   - ✅ getCurrentUser() - 获取用户信息
   - ✅ getProfileStats() - 获取统计数据
   - ✅ getTerritories() - 获取领土列表

2. **src/utils/request.js** - 请求包装器
   - ✅ 支持 Mock 模式和真实 API 切换
   - ✅ USE_MOCK = true (默认启用 Mock)

---

## 🚀 启动前端开发服务器

### 方法 1: 使用已安装的 Node.js

```bash
# 激活 nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# 使用 Node.js 18
nvm use 18

# 启动开发服务器
cd riding-conquest-h5
npm run dev
```

### 方法 2: 直接使用完整路径

```bash
# 找到 npm 路径
which npm

# 或者使用之前验证过的路径
/Users/mark/.nvm/versions/node/v18.20.8/bin/npm run dev
```

---

## 📊 Mock 数据示例

### 登录响应
```json
{
  "token": "eyJhbGci...",
  "expires_in": 86400,
  "user_id": 1,
  "phone": "13800138000",
  "nickname": "骑友"
}
```

### 用户信息
```json
{
  "user_id": 1,
  "phone": "138****8000",
  "nickname": "骑友 001",
  "avatar": null
}
```

### 骑行统计
```json
{
  "totalRides": 12,
  "totalDistance": 286.5,
  "totalDuration": 845,
  "totalCalories": 8520,
  "rank": 3
}
```

---

## 🧪 测试 Mock API

### 测试登录流程

```javascript
import mockApi from '@/utils/mock-api'

// 测试登录
const result = await mockApi.login({
  phone: '13800138000',
  nickname: '测试用户',
  avatar: ''
})
console.log('登录成功:', result)
```

### 测试获取用户

```javascript
const user = await mockApi.getCurrentUser(mockToken)
console.log('用户信息:', user)
```

---

## 📝 开发工作流

### 1. 启用 Mock 模式

在 `src/utils/request.js` 中设置：

```javascript
const USE_MOCK = true  // 启用 Mock
// const USE_MOCK = false  // 使用真实 API
```

### 2. 开发功能

- 使用 Mock 数据开发 UI
- 测试用户交互流程
- 完善页面样式

### 3. 联调真实 API

- 修改 `USE_MOCK = false`
- 启动后端服务
- 测试真实接口

---

## 🎯 当前可用页面

1. **登录页** (`/login`)
   - ✅ Mock 登录
   - ✅ 表单验证
   - ✅ Token 存储

2. **个人主页** (`/`)
   - ✅ 用户信息展示
   - ✅ 骑行统计
   - ✅ 战队排名

3. **战队页** (`/team`)
   - ⏳ 待开发

4. **地图页** (`/map`)
   - ⏳ 待开发

---

## 🔍 调试技巧

### 查看网络请求

打开浏览器开发者工具 → Network 标签

- Mock 请求不会显示（因为是本地调用）
- 真实 API 请求会显示

### 查看 LocalStorage

```javascript
// 浏览器控制台
localStorage.getItem('riding_conquest_auth')
```

### 清除登录状态

```javascript
// 浏览器控制台
localStorage.removeItem('riding_conquest_auth')
location.reload()
```

---

## 📋 下一步开发任务

### 高优先级
1. ✅ Mock API 配置
2. ⏳ 测试登录流程
3. ⏳ 完善个人主页

### 中优先级
4. 战队页面开发
5. 地图页面开发
6. 骑行记录页面

### 低优先级
7. 排行榜页面
8. 战报页面
9. 设置页面

---

## 🎉 总结

- ✅ Mock API 已配置完成
- ✅ 支持无缝切换到真实 API
- ✅ 可以独立开发前端功能
- ⏳ 启动前端服务器即可开始开发

**下一步**: 启动前端服务器，测试登录流程！
