<script setup>
const emit = defineEmits(['close'])

const userInfo = {
  name: '骑行者小明',
  level: 12,
  title: '征服者',
  avatar: '骑'
}

const weeklyData = {
  km: 234,
  attacks: 4,
  defenses: 2
}

const achievements = [
  { name: '征服者勋章', count: 3, icon: '🏆' },
  { name: '先锋勋章', count: 5, icon: '⭐' },
  { name: '守护勋章', count: 2, icon: '🛡️' }
]

const settings = {
  hometown: '北京市',
  notification: true,
  darkMode: 'auto'
}

function handleMoreSettings() {
  console.log('更多设置')
}

function handleLogout() {
  console.log('退出登录')
  emit('close')
}
</script>

<template>
  <div class="profile-overlay">
    <div class="profile-header">
      <div class="avatar-section">
        <div class="avatar-circle">
          <span class="avatar-char">{{ userInfo.avatar }}</span>
        </div>
        <div class="user-info">
          <span class="user-name">{{ userInfo.name }}</span>
          <span class="user-level">Lv.{{ userInfo.level }} {{ userInfo.title }}</span>
        </div>
      </div>
    </div>
    
    <div class="overlay-body">
      <div class="section">
        <h4 class="section-title">本周数据</h4>
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-icon">🚴</span>
            <span class="stat-value">{{ weeklyData.km }}</span>
            <span class="stat-label">公里</span>
          </div>
          <div class="stat-card">
            <span class="stat-icon">⚔️</span>
            <span class="stat-value">{{ weeklyData.attacks }}</span>
            <span class="stat-label">次进攻</span>
          </div>
          <div class="stat-card">
            <span class="stat-icon">🛡️</span>
            <span class="stat-value">{{ weeklyData.defenses }}</span>
            <span class="stat-label">次防守</span>
          </div>
        </div>
      </div>
      
      <div class="section">
        <h4 class="section-title">累计成就</h4>
        <div class="achievement-list">
          <div v-for="item in achievements" :key="item.name" class="achievement-item">
            <span class="achievement-icon">{{ item.icon }}</span>
            <span class="achievement-name">{{ item.name }} × {{ item.count }}</span>
          </div>
        </div>
      </div>
      
      <div class="section">
        <h4 class="section-title">设置</h4>
        <div class="settings-list">
          <div class="setting-item">
            <span class="setting-icon">📍</span>
            <span class="setting-label">家乡设置</span>
            <span class="setting-value">{{ settings.hometown }}</span>
          </div>
          <div class="setting-item">
            <span class="setting-icon">🔔</span>
            <span class="setting-label">消息通知</span>
            <span class="setting-value">{{ settings.notification ? '开启' : '关闭' }}</span>
          </div>
          <div class="setting-item">
            <span class="setting-icon">🌙</span>
            <span class="setting-label">深色模式</span>
            <span class="setting-value">{{ settings.darkMode === 'auto' ? '自动' : settings.darkMode ? '开启' : '关闭' }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="overlay-footer">
      <button class="footer-btn settings" @click="handleMoreSettings">
        <span>⚙️</span>
        <span>更多设置</span>
      </button>
      <button class="footer-btn logout" @click="handleLogout">
        <span>🚪</span>
        <span>退出登录</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.profile-overlay {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.profile-header {
  padding: 24px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%);
  border-bottom: 1px solid rgba(59, 130, 246, 0.2);
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar-circle {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: bold;
  color: #FFFFFF;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
  border: 3px solid rgba(59, 130, 246, 0.4);
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 20px;
  font-weight: 700;
  color: #F1F5F9;
}

.user-level {
  font-size: 13px;
  color: #94A3B8;
  margin-top: 4px;
}

.overlay-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #94A3B8;
  margin: 0 0 12px;
  letter-spacing: 1px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
  background: rgba(26, 39, 64, 0.6);
  border-radius: 10px;
  border: 1px solid rgba(59, 130, 246, 0.1);
}

.stat-icon {
  font-size: 20px;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #F1F5F9;
}

.stat-label {
  font-size: 11px;
  color: #64748B;
  margin-top: 2px;
}

.achievement-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 8px;
}

.achievement-icon {
  font-size: 14px;
}

.achievement-name {
  font-size: 12px;
  color: #FBBF24;
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(26, 39, 64, 0.6);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.setting-item:hover {
  background: rgba(59, 130, 246, 0.1);
}

.setting-icon {
  font-size: 18px;
}

.setting-label {
  flex: 1;
  font-size: 14px;
  color: #F1F5F9;
}

.setting-value {
  font-size: 13px;
  color: #64748B;
}

.overlay-footer {
  display: flex;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid rgba(59, 130, 246, 0.2);
  background: rgba(7, 14, 27, 0.5);
}

.footer-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.footer-btn.settings {
  background: rgba(59, 130, 246, 0.2);
  color: #3B82F6;
}

.footer-btn.settings:hover {
  background: rgba(59, 130, 246, 0.3);
}

.footer-btn.logout {
  background: rgba(107, 114, 128, 0.2);
  color: #94A3B8;
}

.footer-btn.logout:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #EF4444;
}
</style>
