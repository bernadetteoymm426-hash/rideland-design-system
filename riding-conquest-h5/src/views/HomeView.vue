<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import HomeIcon from '@/components/icons/HomeIcon.vue'
import MapIcon from '@/components/icons/MapIcon.vue'
import RideIcon from '@/components/icons/RideIcon.vue'
import TeamIcon from '@/components/icons/TeamIcon.vue'
import RankIcon from '@/components/icons/RankIcon.vue'

const router = useRouter()

const userInfo = ref({
  nickname: '骑友 001',
  level: 5,
  rideCount: 12,
  mileage: 286.5,
  duration: '14h 5m',
  calories: 8520,
  teamRank: 1,
})

const features = ref([
  { name: '我的战队', icon: 'team', path: '/team' },
  { name: '查看地图', icon: 'map', path: '/map' },
  { name: '骑行记录', icon: 'ride', path: '/ride' },
  { name: '排行榜', icon: 'rank', path: '/rank' },
])

function navigateTo(path: string) {
  router.push(path)
}

function getIconComponent(iconName: string) {
  const iconMap: Record<string, any> = {
    home: HomeIcon,
    map: MapIcon,
    ride: RideIcon,
    team: TeamIcon,
    rank: RankIcon
  }
  return iconMap[iconName] || HomeIcon
}
</script>

<template>
  <div class="home-page">
    <!-- 内容层 -->
    <div class="page-content">
      <!-- 页面头部 -->
      <header class="page-header">
        <h1 class="page-title">骑迹大陆</h1>
        <p class="page-subtitle">RIDELAND TERRITORY</p>
      </header>

      <!-- 用户信息区 -->
      <div class="user-section">
        <div class="avatar-ring-wrapper">
          <div class="avatar-ring"></div>
          <div class="avatar-ring-outer"></div>
          <div class="avatar-circle">
            <span class="avatar-char">骑</span>
          </div>
        </div>
        <div class="user-info">
          <div class="user-name">{{ userInfo.nickname }}</div>
          <div class="user-level">
            <span class="level-badge">Lv.{{ userInfo.level }}</span>
          </div>
        </div>
      </div>

      <!-- 数据网格 -->
      <div class="data-grid">
        <div class="data-card">
          <div class="data-num">{{ userInfo.rideCount }}</div>
          <div class="data-label">总骑行次数</div>
        </div>
        <div class="data-card">
          <div class="data-num">{{ userInfo.mileage }}</div>
          <div class="data-label">总里程 km</div>
        </div>
        <div class="data-card">
          <div class="data-num">{{ userInfo.duration }}</div>
          <div class="data-label">总时长</div>
        </div>
        <div class="data-card">
          <div class="data-num">{{ userInfo.calories }}</div>
          <div class="data-label">总卡路里</div>
        </div>
      </div>

      <!-- 章节标题 -->
      <div class="section-title">
        <div class="title-line"></div>
        <h3>快捷入口</h3>
        <div class="title-line"></div>
      </div>

      <!-- 快捷入口 -->
      <div class="feature-row">
        <div 
          v-for="item in features" 
          :key="item.name" 
          class="feat-btn"
          @click="navigateTo(item.path)"
        >
          <div class="feat-icon-wrapper">
            <div class="feat-icon-bg">
              <component :is="getIconComponent(item.icon)" class="feat-icon" />
            </div>
          </div>
          <span class="feat-txt">{{ item.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ─── 响应式布局 ─── */

/* 横屏模式（手机旋转） */
@media (orientation: landscape) and (max-width: 768px) {
  .page-content {
    padding: 12px;
  }
  
  .page-header {
    padding: 16px 20px 12px;
  }
  
  .page-title {
    font-size: 24px;
    letter-spacing: 4px;
  }
  
  .user-section {
    padding: 12px 16px;
    margin-bottom: 12px;
  }
  
  .avatar-ring-wrapper {
    transform: scale(0.9);
  }
  
  .data-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    padding: 0 16px 12px;
  }
  
  .data-card {
    padding: 12px 8px;
  }
  
  .data-num {
    font-size: 20px;
  }
  
  .data-label {
    font-size: 10px;
  }
  
  .section-title {
    padding: 12px 20px 10px;
  }
  
  .feature-row {
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    padding: 0 12px;
  }
  
  .feat-btn {
    padding: 8px 4px;
  }
  
  .feat-icon-bg {
    width: 44px;
    height: 44px;
  }
}

/* 桌面端横屏布局 */
@media (min-width: 769px) {
  .home-page {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .page-content {
    padding: 24px 32px;
  }
  
  .page-header {
    padding: 40px 0 32px;
  }
  
  .page-title {
    font-size: 42px;
    letter-spacing: 12px;
  }
  
  .page-subtitle {
    font-size: 14px;
    letter-spacing: 8px;
  }
  
  .user-section {
    padding: 24px 32px;
    max-width: 600px;
    margin: 0 auto 32px;
  }
  
  .data-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    padding: 0 32px 32px;
    max-width: 1000px;
    margin: 0 auto;
  }
  
  .data-card {
    padding: 28px 20px;
  }
  
  .data-num {
    font-size: 36px;
  }
  
  .data-label {
    font-size: 13px;
  }
  
  .section-title {
    max-width: 1000px;
    margin: 0 auto;
    padding: 32px 32px 24px;
  }
  
  .title-line {
    max-width: 120px;
  }
  
  .section-title h3 {
    font-size: 18px;
    letter-spacing: 6px;
  }
  
  .feature-row {
    max-width: 800px;
    margin: 0 auto;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    padding: 0 32px;
  }
  
  .feat-btn {
    padding: 20px 12px;
  }
  
  .feat-icon-bg {
    width: 64px;
    height: 64px;
  }
  
  .feat-icon {
    width: 36px;
    height: 36px;
  }
}
.home-page {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: #070E1B;
  position: relative;
}

.home-page::before {
  content: '';
  position: absolute;
  top: -20%;
  right: -10%;
  width: 60%;
  height: 40%;
  background: radial-gradient(ellipse, rgba(59, 130, 246, 0.08) 0%, transparent 70%);
  filter: blur(60px);
  pointer-events: none;
  z-index: 0;
}

.home-page::after {
  content: '';
  position: absolute;
  bottom: -20%;
  left: -10%;
  width: 50%;
  height: 35%;
  background: radial-gradient(ellipse, rgba(245, 158, 11, 0.06) 0%, transparent 70%);
  filter: blur(60px);
  pointer-events: none;
  z-index: 0;
}

.page-content {
  position: relative;
  z-index: 10;
  height: 100%;
  overflow-y: auto;
  padding: 0 0 90px;
}

/* 内容层添加轻微光效 */
.page-content > * {
  position: relative;
  z-index: 1;
}

/* ─── 页面头部 ─── */
.page-header {
  text-align: center;
  padding: 32px 20px 24px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(180deg, #FFFFFF 0%, #94A3B8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: 6px;
  line-height: 1.2;
  text-shadow: 0 0 30px rgba(59, 130, 246, 0.3);
  position: relative;
}

.page-title::after {
  content: '';
  position: absolute;
  inset: -4px;
  background: radial-gradient(ellipse at 50% 0%, rgba(245, 158, 11, 0.1) 0%, transparent 50%);
  filter: blur(20px);
  z-index: -1;
}

.page-subtitle {
  font-size: 11px;
  color: #64748B;
  margin: 12px 0 0;
  letter-spacing: 4px;
  text-transform: uppercase;
  font-weight: 500;
}

/* ─── 用户信息区 ─── */
.user-section {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  margin-bottom: 24px;
}

.avatar-ring-wrapper {
  position: relative;
  flex-shrink: 0;
}

.avatar-ring {
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    rgba(59, 130, 246, 0.8) 0deg,
    rgba(59, 130, 246, 0.2) 120deg,
    rgba(59, 130, 246, 0.8) 240deg,
    rgba(59, 130, 246, 0.2) 360deg
  );
  animation: ring-rotate 3s linear infinite;
  filter: blur(2px);
}

.avatar-ring-outer {
  position: absolute;
  inset: -12px;
  border-radius: 50%;
  border: 2px solid rgba(59, 130, 246, 0.15);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.3),
              inset 0 0 20px rgba(59, 130, 246, 0.1);
  animation: ring-pulse 2s ease-in-out infinite;
}

@keyframes ring-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes ring-pulse {
  0%, 100% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3),
                inset 0 0 20px rgba(59, 130, 246, 0.1);
  }
  50% {
    box-shadow: 0 0 30px rgba(59, 130, 246, 0.5),
                inset 0 0 30px rgba(59, 130, 246, 0.2);
  }
}

.avatar-circle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 24px rgba(59, 130, 246, 0.5),
              inset 0 2px 8px rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(59, 130, 246, 0.4);
  position: relative;
  z-index: 1;
}

.avatar-char {
  font-size: 24px;
  font-weight: bold;
  color: #FFFFFF;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  color: #F1F5F9;
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.user-level {
  display: inline-flex;
}

.level-badge {
  padding: 4px 12px;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.2) 100%);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: #F59E0B;
  border: 1px solid rgba(245, 158, 11, 0.4);
  box-shadow: 0 0 12px rgba(245, 158, 11, 0.3),
              inset 0 1px 0 rgba(245, 158, 11, 0.1);
  text-shadow: 0 0 8px rgba(245, 158, 11, 0.4);
}

/* ─── 数据网格 ─── */
.data-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 0 20px 24px;
}

.data-card {
  background: linear-gradient(135deg, 
    rgba(26, 39, 64, 0.7) 0%, 
    rgba(30, 58, 95, 0.6) 100%
  );
  border: 1px solid rgba(59, 130, 246, 0.25);
  border-radius: 16px;
  padding: 20px 16px;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(12px);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(59, 130, 246, 0.1);
}

.data-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(59, 130, 246, 0.4) 20%,
    rgba(59, 130, 246, 0.6) 50%,
    rgba(59, 130, 246, 0.4) 80%,
    transparent 100%
  );
}

.data-card:hover {
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 6px 24px rgba(59, 130, 246, 0.25),
              inset 0 1px 0 rgba(59, 130, 246, 0.2);
  transform: translateY(-3px);
}

.data-card:active {
  transform: translateY(-1px);
}

.data-card:nth-child(1) .data-num {
  background: linear-gradient(180deg, #60A5FA 0%, #3B82F6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.data-card:nth-child(2) .data-num {
  background: linear-gradient(180deg, #34D399 0%, #10B981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.data-card:nth-child(3) .data-num {
  background: linear-gradient(180deg, #FBBF24 0%, #F59E0B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.data-card:nth-child(4) .data-num {
  background: linear-gradient(180deg, #F87171 0%, #EF4444 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.data-num {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 6px;
  font-variant-numeric: tabular-nums;
  letter-spacing: 1px;
  text-shadow: 0 0 20px rgba(59, 130, 246, 0.1);
}

.data-label {
  font-size: 11px;
  color: #64748B;
  letter-spacing: 0.5px;
  font-weight: 500;
}

/* ─── 章节标题 ─── */
.section-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px 20px 20px;
}

.title-line {
  flex: 1;
  max-width: 80px;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(59, 130, 246, 0.3) 30%,
    rgba(59, 130, 246, 0.6) 50%,
    rgba(59, 130, 246, 0.3) 70%,
    transparent 100%
  );
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.3);
}

.section-title h3 {
  font-size: 14px;
  font-weight: 600;
  color: #F1F5F9;
  margin: 0;
  letter-spacing: 3px;
  text-transform: uppercase;
  text-shadow: 0 0 12px rgba(59, 130, 246, 0.3);
}

/* ─── 快捷入口 ─── */
.feature-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 0 16px;
}

.feat-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 16px 8px;
  background: transparent;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.feat-btn:hover {
  background: rgba(59, 130, 246, 0.08);
  transform: translateY(-4px);
}

.feat-btn:active {
  transform: translateY(-2px);
  scale: 0.98;
}

.feat-icon-wrapper {
  position: relative;
}

.feat-icon-bg {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle, 
    rgba(59, 130, 246, 0.15) 0%, 
    rgba(59, 130, 246, 0.05) 60%,
    transparent 100%
  );
  border-radius: 50%;
  border: 2px solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.15),
              inset 0 1px 0 rgba(59, 130, 246, 0.1);
  transition: all 0.3s ease;
}

.feat-btn:hover .feat-icon-bg {
  border-color: rgba(59, 130, 246, 0.4);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.25),
              inset 0 1px 0 rgba(59, 130, 246, 0.15);
  background: radial-gradient(circle, 
    rgba(59, 130, 246, 0.2) 0%, 
    rgba(59, 130, 246, 0.1) 50%,
    transparent 100%
  );
}

.feat-btn:hover .feat-icon {
  stroke: #93C5FD;
  stroke-width: 2.3;
  filter: drop-shadow(0 3px 10px rgba(147, 197, 253, 0.7));
}

/* 悬停时添加背景光效 */
.feat-btn:hover {
  background: linear-gradient(180deg, 
    rgba(59, 130, 246, 0.12) 0%, 
    transparent 100%
  );
}

.feat-icon {
  width: 28px;
  height: 28px;
  stroke: #3B82F6;
  stroke-width: 2;
  fill: none;
  filter: drop-shadow(0 2px 6px rgba(59, 130, 246, 0.4));
}

.feat-btn:hover .feat-icon {
  stroke: #60A5FA;
  stroke-width: 2.2;
  filter: drop-shadow(0 2px 8px rgba(96, 165, 250, 0.6));
}

.feat-txt {
  font-size: 11px;
  color: #64748B;
  font-weight: 500;
  text-align: center;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.feat-btn:hover .feat-txt {
  color: #94A3B8;
}
</style>
