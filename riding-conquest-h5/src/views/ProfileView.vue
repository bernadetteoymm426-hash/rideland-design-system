<script setup>
import { ref } from 'vue'

const userInfo = ref({
  nickname: '骑友 001',
  phone: '138****8000',
  avatar: '',
  totalRides: 12,
  totalDistance: 286.5,
  totalTime: '14h 5m',
  totalCalories: 8520,
})

const menuItems = ref([
  { icon: 'user-o', name: '个人资料', path: '/profile/settings' },
  { icon: 'shield-o', name: '账号安全', path: '/profile/security' },
  { icon: 'bell-o', name: '消息通知', path: '/profile/notifications' },
  { icon: 'question-o', name: '帮助中心', path: '/profile/help' },
  { icon: 'info-o', name: '关于我们', path: '/profile/about' },
])
</script>

<template>
  <div class="profile-page">
    <!-- 背景层 -->
    <div class="page-bg">
      <img src="/assets/images/bg-main.jpg" alt="" class="bg-image" />
      <div class="bg-darken"></div>
    </div>

    <!-- 内容层 -->
    <div class="page-content">
      <!-- 用户信息卡片 -->
      <div class="card user-card">
        <div class="card-body">
          <div class="user-header">
            <div class="avatar-circle">
              <span class="avatar-char">骑</span>
            </div>
            <div class="user-info">
              <div class="user-name">{{ userInfo.nickname }}</div>
              <div class="user-phone">{{ userInfo.phone }}</div>
            </div>
            <button class="btn-edit">编辑</button>
          </div>

          <!-- 数据统计 -->
          <div class="stats-row">
            <div class="stat-item">
              <div class="stat-num">{{ userInfo.totalRides }}</div>
              <div class="stat-label">总骑行次</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-num">{{ userInfo.totalDistance }}</div>
              <div class="stat-label">总里程 km</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-num">{{ userInfo.totalTime }}</div>
              <div class="stat-label">总时长</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 菜单列表 -->
      <div class="section-title">设置</div>
      <div class="menu-list">
        <div
          v-for="item in menuItems"
          :key="item.name"
          class="menu-item"
        >
          <div class="menu-left">
            <van-icon :name="item.icon" size="22" color="#3B82F6" />
            <span class="menu-name">{{ item.name }}</span>
          </div>
          <van-icon name="arrow" size="16" color="rgba(212,175,55,0.5)" />
        </div>
      </div>

      <!-- 退出按钮 -->
      <div class="logout-section">
        <button class="btn-logout">退出登录</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  position: fixed;
  background: linear-gradient(180deg, #FFF8E7 0%, #F5E6D3 50%, #D4C5B0 100%);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

/* 背景层 */
.page-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}

.bg-darken {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(13, 27, 42, 0.35);
}

/* 内容层 */
.page-content {
  position: relative;
  z-index: 1;
  padding: 60px 40px 80px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}

/* 卡片通用 */
.card {
  width: calc(100% - 8px);
  margin: 0 4px 12px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid rgba(212, 175, 55, 0.5);
  box-shadow: 0 4px 20px rgba(212, 175, 55, 0.15);
}

.card-body {
  background: rgba(26, 39, 64, 0.6);
  backdrop-filter: blur(12px);
  padding: 18px;
}

/* 用户卡片 */
.user-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.avatar-circle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
  border: 2px solid rgba(212, 175, 55, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 0 18px rgba(212, 175, 55, 0.3);
}

.avatar-char {
  font-size: 26px;
  font-weight: 700;
  color: #FFF8E7;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 17px;
  font-weight: 600;
  color: #F1F5F9;
  margin-bottom: 3px;
  letter-spacing: 0.4px;
}

.user-phone {
  font-size: 12px;
  color: #94A3B8;
}

.btn-edit {
  background: rgba(212, 175, 55, 0.15);
  border: 1.5px solid rgba(212, 175, 55, 0.4);
  color: #94A3B8;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-edit:hover {
  background: rgba(212, 175, 55, 0.25);
  border-color: rgba(212, 175, 55, 0.6);
}

/* 数据统计 */
.stats-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-top: 14px;
  border-top: 1.5px solid rgba(212, 175, 55, 0.25);
}

.stat-item {
  text-align: center;
}

.stat-num {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif !important;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #94A3B8;
}

.stat-divider {
  width: 1.5px;
  height: 30px;
  background: linear-gradient(180deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.4) 50%, rgba(212, 175, 55, 0.2) 100%);
}

/* 菜单列表 */
.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #F1F5F9;
  margin: 8px 0 10px;
  padding-left: 10px;
  border-left: 3px solid #3B82F6;
  letter-spacing: 0.8px;
}

.menu-list {
  background: rgba(26, 39, 64, 0.6);
  backdrop-filter: blur(12px);
  border: 1.5px solid rgba(212, 175, 55, 0.35);
  border-radius: 12px;
  overflow: hidden;
  margin: 0 0 12px;
  width: 100%;
  box-shadow: 0 2px 10px rgba(212, 175, 55, 0.1);
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:active {
  background: rgba(212, 175, 55, 0.1);
}

.menu-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.menu-name {
  font-size: 14px;
  color: #F1F5F9;
  font-weight: 500;
}

/* 退出按钮 */
.logout-section {
  margin-top: 24px;
  padding: 0 8px;
}

.btn-logout {
  width: 100%;
  padding: 14px;
  background: rgba(239, 68, 68, 0.1);
  border: 1.5px solid rgba(239, 68, 68, 0.4);
  color: #dc2626;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.1);
}

.btn-logout:active {
  background: rgba(239, 68, 68, 0.2);
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.2);
}
</style>
