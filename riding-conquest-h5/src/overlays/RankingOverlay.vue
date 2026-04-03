<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('team')

const teamRanking = [
  { rank: 1, name: '骑行者联盟', km: 28450, territories: 12, isMe: true },
  { rank: 2, name: '魔骑行', km: 24120, territories: 9 },
  { rank: 3, name: '追风者', km: 21890, territories: 8 },
  { rank: 4, name: '铁骑战队', km: 19450, territories: 7 },
  { rank: 5, name: '自由行', km: 17230, territories: 6 },
  { rank: 6, name: '风之子', km: 15890, territories: 5 },
  { rank: 7, name: '骑行天下', km: 14560, territories: 4 },
  { rank: 8, name: '单车侠', km: 13240, territories: 3 },
  { rank: 9, name: '速度与激情', km: 12100, territories: 2 },
  { rank: 10, name: '追光者', km: 10980, territories: 1 }
]

const personalRanking = [
  { rank: 1, name: '骑行者小王', km: 328, team: '骑行者联盟', isStar: true },
  { rank: 2, name: '风之子小李', km: 298, team: '追风者' },
  { rank: 3, name: '魔骑小张', km: 276, team: '魔骑行' },
  { rank: 4, name: '铁骑老王', km: 254, team: '铁骑战队' },
  { rank: 5, name: '自由骑士', km: 232, team: '自由行' },
  { rank: 6, name: '骑行者小李', km: 256, team: '骑行者联盟' },
  { rank: 7, name: '我', km: 234, team: '骑行者联盟', isMe: true },
  { rank: 8, name: '单车侠客', km: 198, team: '单车侠' },
  { rank: 9, name: '追光少年', km: 176, team: '追光者' },
  { rank: 10, name: '速度王者', km: 154, team: '速度与激情' }
]

const currentList = computed(() => {
  return activeTab.value === 'team' ? teamRanking : personalRanking
})

function switchTab(tab) {
  activeTab.value = tab
}
</script>

<template>
  <div class="ranking-overlay">
    <div class="overlay-header">
      <div class="header-left">
        <span class="header-icon">🏆</span>
        <h2 class="overlay-title">排行榜</h2>
      </div>
    </div>
    
    <div class="tab-nav">
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'team' }"
        @click="switchTab('team')"
      >
        <span class="tab-icon">🏆</span>
        <span>战队</span>
      </button>
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'personal' }"
        @click="switchTab('personal')"
      >
        <span class="tab-icon">👤</span>
        <span>个人</span>
      </button>
    </div>
    
    <div class="overlay-body">
      <div class="ranking-list">
        <div 
          v-for="item in currentList" 
          :key="item.rank"
          class="ranking-item"
          :class="{ 'is-me': item.isMe }"
        >
          <div class="rank-badge">
            <span v-if="item.rank === 1" class="medal gold">🥇</span>
            <span v-else-if="item.rank === 2" class="medal silver">🥈</span>
            <span v-else-if="item.rank === 3" class="medal bronze">🥉</span>
            <span v-else class="rank-number">{{ item.rank }}</span>
          </div>
          
          <div class="item-info">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-team" v-if="activeTab === 'personal'">{{ item.team }}</span>
            <div class="item-stats" v-if="activeTab === 'team'">
              <span class="stat">🏆 {{ item.territories }} 领土</span>
            </div>
          </div>
          
          <div class="item-km">
            <span class="km-value">{{ item.km.toLocaleString() }}</span>
            <span class="km-unit">km</span>
          </div>
          
          <div class="item-badge" v-if="item.isMe">
            <span class="me-badge">我</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ranking-overlay {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.overlay-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(59, 130, 246, 0.2);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 24px;
}

.overlay-title {
  font-size: 20px;
  font-weight: 700;
  color: #F1F5F9;
  margin: 0;
  letter-spacing: 1px;
}

.tab-nav {
  display: flex;
  padding: 16px 24px;
  gap: 12px;
  border-bottom: 1px solid rgba(59, 130, 246, 0.1);
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: rgba(26, 39, 64, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  color: #94A3B8;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn.active {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.4);
  color: #3B82F6;
}

.tab-icon {
  font-size: 16px;
}

.overlay-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px 24px;
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(26, 39, 64, 0.6);
  border-radius: 10px;
  transition: all 0.2s ease;
}

.ranking-item:hover {
  background: rgba(59, 130, 246, 0.1);
}

.ranking-item.is-me {
  background: rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.rank-badge {
  width: 32px;
  text-align: center;
}

.medal {
  font-size: 20px;
}

.rank-number {
  font-size: 16px;
  font-weight: 700;
  color: #64748B;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.item-name {
  font-size: 14px;
  font-weight: 600;
  color: #F1F5F9;
}

.item-team {
  font-size: 12px;
  color: #64748B;
}

.item-stats {
  margin-top: 4px;
}

.item-stats .stat {
  font-size: 11px;
  color: #FBBF24;
}

.item-km {
  text-align: right;
}

.km-value {
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: #3B82F6;
  font-family: monospace;
}

.km-unit {
  font-size: 11px;
  color: #64748B;
}

.me-badge {
  display: inline-flex;
  padding: 4px 10px;
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #FFFFFF;
}
</style>
