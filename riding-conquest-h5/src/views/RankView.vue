<script setup>
import { ref } from 'vue'

const loading = ref(false)
const activeTab = ref('team')

const mockTeamRank = [
  { rank: 1, teamName: '极速骑行团', members: 45, totalDistance: 12580, avgDistance: 279.6 },
  { rank: 2, teamName: '破风者联盟', members: 38, totalDistance: 10240, avgDistance: 269.5 },
  { rank: 3, teamName: '骑行者联盟', members: 12, totalDistance: 2850, avgDistance: 237.5 },
  { rank: 4, teamName: '飞轮战队', members: 28, totalDistance: 5680, avgDistance: 202.9 },
  { rank: 5, teamName: '踏风者', members: 22, totalDistance: 4120, avgDistance: 187.3 },
]

const mockIndividualRank = [
  { rank: 1, nickname: '骑行大神', totalDistance: 1250, rides: 45 },
  { rank: 2, nickname: '破风手', totalDistance: 980, rides: 38 },
  { rank: 3, nickname: '飞轮侠', totalDistance: 850, rides: 32 },
  { rank: 4, nickname: '踏风者', totalDistance: 720, rides: 28 },
  { rank: 5, nickname: '骑友 001', totalDistance: 286.5, rides: 12, isMe: true },
]
</script>

<template>
  <div class="rank-page">
    <!-- 内容层 -->
    <div class="page-content">
      <!-- 页面头部 -->
      <div class="page-header">
        <h1 class="page-title">排行榜</h1>
        <p class="page-subtitle">Leaderboards</p>
      </div>

      <!-- Tab 切换 -->
      <div class="tab-card">
        <button 
          :class="['tab-btn', { active: activeTab === 'team' }]"
          @click="activeTab = 'team'"
        >
          <van-icon name="friends-o" size="18" />
          <span>战队榜</span>
        </button>
        <button 
          :class="['tab-btn', { active: activeTab === 'individual' }]"
          @click="activeTab = 'individual'"
        >
          <van-icon name="manager-o" size="18" />
          <span>个人榜</span>
        </button>
      </div>

      <!-- 战队榜 -->
      <div v-if="activeTab === 'team'" class="rank-list">
        <div class="section-title">
          <div class="title-left">
            <div class="title-bar"></div>
            <h3>战队排名</h3>
          </div>
          <span class="title-count">本周更新</span>
        </div>

        <div
          v-for="team in mockTeamRank"
          :key="team.rank"
          class="rank-card"
        >
          <div class="rank-num-wrapper">
            <div class="rank-num" :class="'rank-' + (team.rank <= 3 ? 'top' : 'normal')">{{ team.rank }}</div>
          </div>
          <div class="rank-info">
            <div class="team-name">{{ team.teamName }}</div>
            <div class="team-meta">
              <span>{{ team.members }}人</span>
              <span class="dot">·</span>
              <span>均骑 {{ team.avgDistance }}km</span>
            </div>
          </div>
          <div class="rank-distance">
            <div class="num">{{ team.totalDistance.toLocaleString() }}</div>
            <div class="label">总里程 km</div>
          </div>
        </div>
      </div>

      <!-- 个人榜 -->
      <div v-else class="rank-list">
        <div class="section-title">
          <div class="title-left">
            <div class="title-bar"></div>
            <h3>个人排名</h3>
          </div>
          <span class="title-count">本周更新</span>
        </div>

        <div
          v-for="rider in mockIndividualRank"
          :key="rider.rank"
          class="rank-card"
          :class="{ 'is-me': rider.isMe }"
        >
          <div class="rank-num-wrapper">
            <div class="rank-num" :class="rider.rank <= 3 ? 'top' : 'normal'">{{ rider.rank }}</div>
          </div>
          <div class="rank-info">
            <div class="rider-name">
              {{ rider.nickname }}
              <van-icon v-if="rider.isMe" name="user-o" size="14" />
            </div>
            <div class="rider-meta">
              <span>{{ rider.rides }}次骑行</span>
            </div>
          </div>
          <div class="rank-distance">
            <div class="num">{{ rider.totalDistance }}</div>
            <div class="label">总里程 km</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rank-page {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: #070E1B;
}

.page-content {
  position: relative;
  z-index: 10;
  height: 100%;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 80px;
}

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
  font-size: 12px;
  color: #94A3B8;
  margin: 0;
  text-transform: uppercase;
}

.tab-card {
  background: rgba(26, 39, 64, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 16px;
  display: flex;
  gap: 4px;
  backdrop-filter: blur(10px);
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: #94A3B8;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-btn.active {
  background: rgba(59, 130, 246, 0.15);
  color: #3B82F6;
}

.rank-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;
}

.title-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-bar {
  width: 4px;
  height: 16px;
  background: #3B82F6;
  border-radius: 2px;
}

.title-left h3 {
  font-size: 16px;
  font-weight: 600;
  color: #F1F5F9;
  margin: 0;
}

.title-count {
  font-size: 13px;
  color: #94A3B8;
}

.rank-card {
  background: rgba(26, 39, 64, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  backdrop-filter: blur(10px);
}

.rank-card.is-me {
  border-color: rgba(59, 130, 246, 0.4);
  background: rgba(59, 130, 246, 0.08);
}

.rank-num-wrapper {
  width: 40px;
  flex-shrink: 0;
}

.rank-num {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
}

.rank-num.top {
  background: linear-gradient(135deg, #F59E0B, #D97706);
  color: #FFFFFF;
  box-shadow: 0 0 12px rgba(245, 158, 11, 0.4);
}

.rank-num.normal {
  background: rgba(59, 130, 246, 0.15);
  color: #3B82F6;
  border: 2px solid rgba(59, 130, 246, 0.3);
}

.rank-info {
  flex: 1;
}

.team-name,
.rider-name {
  font-size: 15px;
  font-weight: 600;
  color: #F1F5F9;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.rider-name svg {
  stroke: #3B82F6;
}

.team-meta,
.rider-meta {
  font-size: 12px;
  color: #94A3B8;
}

.dot {
  margin: 0 6px;
}

.rank-distance {
  text-align: right;
}

.rank-distance .num {
  font-size: 18px;
  font-weight: 700;
  color: #3B82F6;
  font-variant-numeric: tabular-nums;
}

.rank-distance .label {
  font-size: 10px;
  color: #94A3B8;
  margin-top: 2px;
}
</style>
