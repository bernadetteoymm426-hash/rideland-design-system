<script setup>
import { ref } from 'vue'

const activeTab = ref('records')

const rideRecords = ref([
  { id: 1, date: '03-10', distance: 28.5, duration: '1h 12m', calories: 856, avgSpeed: 23.8 },
  { id: 2, date: '03-09', distance: 32.0, duration: '1h 25m', calories: 920, avgSpeed: 22.6 },
  { id: 3, date: '03-08', distance: 25.0, duration: '58m', calories: 720, avgSpeed: 25.9 },
  { id: 4, date: '03-07', distance: 40.5, duration: '1h 48m', calories: 1180, avgSpeed: 22.5 },
])

const weeklyStats = ref({
  totalDistance: 126,
  totalTime: '5h 23m',
  totalCalories: 3676,
  avgSpeed: 23.5,
})
</script>

<template>
  <div class="ride-page">
    <!-- 背景层 - 白金帝王风 -->
    <div class="page-bg">
      <img src="/assets/images/bg-conquest-abstract.jpg" alt="" class="bg-image" />
      <div class="bg-darken"></div>
    </div>

    <!-- 内容层 -->
    <div class="page-content">
      <!-- 页面头部 -->
      <div class="page-header">
        <h1 class="page-title">骑行记录</h1>
        <p class="page-subtitle">每一次踩踏，都是征服的印记</p>
      </div>

      <!-- Tab 切换 -->
      <div class="tab-card">
        <button 
          :class="['tab-btn', { active: activeTab === 'records' }]"
          @click="activeTab = 'records'"
        >
          <van-icon name="chart-trending-o" size="18" />
          <span>骑行记录</span>
        </button>
        <button 
          :class="['tab-btn', { active: activeTab === 'stats' }]"
          @click="activeTab = 'stats'"
        >
          <van-icon name="data-analysis" size="18" />
          <span>数据统计</span>
        </button>
      </div>

      <!-- 骑行记录 -->
      <div v-if="activeTab === 'records'" class="records-list">
        <div class="section-title">
          <div class="title-left">
            <div class="w-1 h-4 bg-gold rounded-full"></div>
            <h3>最近骑行</h3>
          </div>
          <span class="title-count">{{ rideRecords.length }} 条记录</span>
        </div>

        <div v-for="ride in rideRecords" :key="ride.id" class="ride-card">
          <div class="ride-date">
            <div class="date-day">{{ ride.date.split('-')[1] }}</div>
            <div class="date-month">{{ ride.date.split('-')[0] }}月</div>
          </div>
          <div class="ride-info">
            <div class="ride-main">
              <div class="ride-distance">{{ ride.distance }}<span class="unit"> km</span></div>
              <div class="ride-duration">{{ ride.duration }}</div>
            </div>
            <div class="ride-stats">
              <div class="ride-stat">
                <div class="stat-val">{{ ride.calories }}</div>
                <div class="stat-label">卡路里</div>
              </div>
              <div class="ride-stat">
                <div class="stat-val">{{ ride.avgSpeed }}</div>
                <div class="stat-label">均速</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 数据统计 -->
      <div v-else class="stats-section">
        <div class="section-title">
          <div class="title-left">
            <div class="w-1 h-4 bg-gold rounded-full"></div>
            <h3>本周统计</h3>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-num">{{ weeklyStats.totalDistance }}</div>
            <div class="stat-label">总里程 km</div>
          </div>
          <div class="stat-card">
            <div class="stat-num">{{ weeklyStats.totalTime }}</div>
            <div class="stat-label">总时长</div>
          </div>
          <div class="stat-card">
            <div class="stat-num">{{ weeklyStats.totalCalories }}</div>
            <div class="stat-label">卡路里</div>
          </div>
          <div class="stat-card">
            <div class="stat-num">{{ weeklyStats.avgSpeed }}</div>
            <div class="stat-label">均速 km/h</div>
          </div>
        </div>

        <!-- 分割线 -->
        <div class="divider-gold"></div>

        <!-- 成就卡片 -->
        <div class="card achievement-card">
          <div class="card-header">
            <div class="header-left">
              <div class="w-1 h-4 bg-gold rounded-full"></div>
              <h3>成就徽章</h3>
            </div>
          </div>
          <div class="card-body">
            <div class="badge-grid">
              <div class="badge-item">
                <div class="badge-icon">
                  <van-icon name="medal" size="28" color="#3B82F6" />
                </div>
                <div class="badge-info">
                  <div class="badge-name">初出茅庐</div>
                  <div class="badge-desc">首次骑行完成</div>
                </div>
              </div>
              <div class="badge-item">
                <div class="badge-icon">
                  <van-icon name="star" size="28" color="#3B82F6" />
                </div>
                <div class="badge-info">
                  <div class="badge-name">坚持不懈</div>
                  <div class="badge-desc">连续骑行 7 天</div>
                </div>
              </div>
              <div class="badge-item">
                <div class="badge-icon">
                  <van-icon name="upgrade" size="28" color="#3B82F6" />
                </div>
                <div class="badge-info">
                  <div class="badge-name">突破自我</div>
                  <div class="badge-desc">单次骑行 50km</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ─── 页面结构 ─── */
.ride-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.page-bg {
  position: absolute;
  inset: 0;
}

.bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

.bg-darken {
  position: absolute;
  inset: 0;
  background: rgba(245, 230, 211, 0.85);
}

.page-content {
  position: relative;
  z-index: 10;
  height: 100%;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 80px;
}

/* ─── 页面头部 ─── */
.page-header {
  text-align: center;
  margin-bottom: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #F1F5F9;
  margin: 0 0 6px;
  letter-spacing: 2px;
}

.page-subtitle {
  font-size: 13px;
  color: #94A3B8;
  margin: 0;
  font-style: italic;
  letter-spacing: 1px;
}

/* ─── Tab 卡片 ─── */
.tab-card {
  background: rgba(26, 39, 64, 0.6);
  background-image: url('/assets/images/texture-card-subtle.jpg');
  background-size: 400px;
  background-blend-mode: multiply;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(212, 175, 55, 0.4);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(212, 175, 55, 0.15);
  display: flex;
  padding: 6px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
}

.tab-card::before,
.tab-card::after {
  content: '';
  position: absolute;
  width: 40px;
  height: 40px;
  background: url('/assets/images/corner-abstract-gold.jpg');
  background-size: cover;
  opacity: 0.3;
  pointer-events: none;
}

.tab-card::before {
  top: 0;
  left: 0;
}

.tab-card::after {
  bottom: 0;
  right: 0;
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  background: transparent;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #94A3B8;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-btn.active {
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
  color: #FFF8E7;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

/* ─── 章节标题 ─── */
.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 0 4px;
}

.title-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-left h3 {
  font-size: 16px;
  font-weight: 600;
  color: #F1F5F9;
  margin: 0;
}

.bg-gold {
  background: #3B82F6;
}

.rounded-full {
  border-radius: 9999px;
}

.w-1 {
  width: 4px;
}

.h-4 {
  height: 16px;
}

.title-count {
  font-size: 13px;
  color: #94A3B8;
}

/* ─── 骑行记录列表 ─── */
.records-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.ride-card {
  background: rgba(26, 39, 64, 0.6);
  background-image: url('/assets/images/texture-card-subtle.jpg');
  background-size: 400px;
  background-blend-mode: multiply;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  gap: 14px;
  align-items: center;
  transition: all 0.3s ease;
}

.ride-card:active {
  transform: scale(0.98);
}

.ride-date {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(201, 169, 97, 0.3) 100%);
  border: 2px solid rgba(212, 175, 55, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.date-day {
  font-size: 18px;
  font-weight: bold;
  color: #F1F5F9;
  line-height: 1;
}

.date-month {
  font-size: 10px;
  color: #94A3B8;
  margin-top: 2px;
}

.ride-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ride-main {
  flex: 1;
}

.ride-distance {
  font-size: 22px;
  font-weight: bold;
  background: linear-gradient(180deg, #3B82F6 0%, #2563EB 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4px;
}

.ride-distance .unit {
  font-size: 14px;
  -webkit-text-fill-color: #94A3B8;
}

.ride-duration {
  font-size: 13px;
  color: #94A3B8;
}

.ride-stats {
  display: flex;
  gap: 16px;
}

.ride-stat {
  text-align: center;
}

.stat-val {
  font-size: 16px;
  font-weight: 600;
  color: #F1F5F9;
  line-height: 1;
  margin-bottom: 2px;
}

.stat-label {
  font-size: 11px;
  color: #A09070;
}

/* ─── 统计网格 ─── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.stat-card {
  background: rgba(26, 39, 64, 0.6);
  background-image: url('/assets/images/texture-card-subtle.jpg');
  background-size: 400px;
  background-blend-mode: multiply;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 12px;
  padding: 20px 16px;
  text-align: center;
}

.stat-num {
  font-size: 24px;
  font-weight: bold;
  background: linear-gradient(180deg, #3B82F6 0%, #2563EB 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 6px;
}

.stat-label {
  font-size: 12px;
  color: #94A3B8;
}

/* ─── 分割线 ─── */
.divider-gold {
  height: 2px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(212, 175, 55, 0.3) 20%,
    rgba(212, 175, 55, 0.8) 50%,
    rgba(212, 175, 55, 0.3) 80%,
    transparent 100%
  );
  margin: 20px 0;
}

/* ─── 成就卡片 ─── */
.card {
  background: rgba(26, 39, 64, 0.6);
  background-image: url('/assets/images/texture-card-subtle.jpg');
  background-size: 400px;
  background-blend-mode: multiply;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(212, 175, 55, 0.4);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(212, 175, 55, 0.15);
  position: relative;
  overflow: hidden;
}

.card::before,
.card::after {
  content: '';
  position: absolute;
  width: 60px;
  height: 60px;
  background: url('/assets/images/corner-abstract-gold.jpg');
  background-size: cover;
  opacity: 0.4;
  pointer-events: none;
}

.card::before {
  top: 0;
  left: 0;
}

.card::after {
  bottom: 0;
  right: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-left h3 {
  font-size: 16px;
  font-weight: 600;
  color: #F1F5F9;
  margin: 0;
}

.card-body {
  padding: 16px;
}

.badge-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.badge-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(26, 39, 64, 0.6);
  border-radius: 8px;
  border: 1px solid rgba(212, 175, 55, 0.15);
}

.badge-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(201, 169, 97, 0.3) 100%);
  border: 2px solid rgba(212, 175, 55, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.badge-info {
  flex: 1;
}

.badge-name {
  font-size: 14px;
  font-weight: 600;
  color: #F1F5F9;
  margin-bottom: 2px;
}

.badge-desc {
  font-size: 12px;
  color: #94A3B8;
}
</style>
