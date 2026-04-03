<script setup>
const emit = defineEmits(['close'])

const teamInfo = {
  name: '骑行者联盟',
  members: 128,
  territories: 12,
  totalKm: 28450,
  rank: 3
}

const weeklyStats = {
  conquered: 3,
  defenses: 5,
  contributionRank: 2
}

const members = [
  { rank: 1, name: '骑行者小王', km: 328, isStar: true },
  { rank: 2, name: '骑行者小李', km: 256, isStar: false },
  { rank: 3, name: '我', km: 234, isMe: true },
  { rank: 4, name: '骑行者小张', km: 198, isStar: false },
  { rank: 5, name: '骑行者小刘', km: 176, isStar: false }
]

function handleInvite() {
  console.log('邀请好友')
}

function handleLeave() {
  console.log('退出战队')
  emit('close')
}
</script>

<template>
  <div class="team-overlay">
    <div class="overlay-header">
      <div class="header-left">
        <span class="header-icon">🛡️</span>
        <h2 class="overlay-title">战队</h2>
      </div>
      <div class="team-rank">
        <span class="rank-icon">🏆</span>
        <span class="rank-value">#{{ teamInfo.rank }}</span>
      </div>
    </div>
    
    <div class="overlay-body">
      <div class="team-card">
        <div class="team-avatar">
          <span class="team-char">骑</span>
        </div>
        <div class="team-info">
          <h3 class="team-name">{{ teamInfo.name }}</h3>
          <div class="team-stats">
            <div class="stat">
              <span class="stat-value">{{ teamInfo.members }}</span>
              <span class="stat-label">成员</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ teamInfo.territories }}</span>
              <span class="stat-label">领土</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ teamInfo.totalKm.toLocaleString() }}</span>
              <span class="stat-label">公里</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="section">
        <h4 class="section-title">本周战绩</h4>
        <div class="weekly-stats">
          <div class="stat-item">
            <span class="stat-icon">⚔️</span>
            <span class="stat-text">攻克 {{ weeklyStats.conquered }} 领土</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">🛡️</span>
            <span class="stat-text">防守成功 {{ weeklyStats.defenses }} 次</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">📊</span>
            <span class="stat-text">贡献排名 #{{ weeklyStats.contributionRank }}</span>
          </div>
        </div>
      </div>
      
      <div class="section">
        <h4 class="section-title">成员列表</h4>
        <div class="member-list">
          <div 
            v-for="member in members" 
            :key="member.rank" 
            class="member-item"
            :class="{ 'is-me': member.isMe }"
          >
            <div class="member-rank">
              <span v-if="member.rank <= 3" class="rank-medal">
                {{ member.rank === 1 ? '🥇' : member.rank === 2 ? '🥈' : '🥉' }}
              </span>
              <span v-else class="rank-number">{{ member.rank }}</span>
            </div>
            <div class="member-info">
              <span class="member-name">{{ member.name }}</span>
              <span class="member-km">{{ member.km }} km</span>
            </div>
            <div class="member-badge">
              <span v-if="member.isStar" class="badge-star">🏆</span>
              <span v-if="member.isMe" class="badge-me">⭐</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="overlay-footer">
      <button class="footer-btn invite" @click="handleInvite">
        <span class="btn-icon">📤</span>
        <span>邀请好友</span>
      </button>
      <button class="footer-btn leave" @click="handleLeave">
        <span class="btn-icon">🚪</span>
        <span>退出战队</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.team-overlay {
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

.team-rank {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(251, 191, 36, 0.15);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 8px;
}

.rank-icon {
  font-size: 16px;
}

.rank-value {
  font-size: 14px;
  font-weight: 700;
  color: #FBBF24;
}

.overlay-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.team-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  margin-bottom: 24px;
}

.team-avatar {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: bold;
  color: #FFFFFF;
}

.team-info {
  flex: 1;
}

.team-name {
  font-size: 18px;
  font-weight: 600;
  color: #F1F5F9;
  margin: 0 0 8px;
}

.team-stats {
  display: flex;
  gap: 16px;
}

.team-stats .stat {
  text-align: center;
}

.team-stats .stat-value {
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: #3B82F6;
}

.team-stats .stat-label {
  font-size: 11px;
  color: #64748B;
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

.weekly-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(26, 39, 64, 0.6);
  border-radius: 8px;
}

.stat-icon {
  font-size: 18px;
}

.stat-text {
  font-size: 14px;
  color: #F1F5F9;
}

.member-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(26, 39, 64, 0.6);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.member-item:hover {
  background: rgba(59, 130, 246, 0.1);
}

.member-item.is-me {
  background: rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.member-rank {
  width: 32px;
  text-align: center;
}

.rank-medal {
  font-size: 18px;
}

.rank-number {
  font-size: 14px;
  font-weight: 600;
  color: #64748B;
}

.member-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.member-name {
  font-size: 14px;
  font-weight: 500;
  color: #F1F5F9;
}

.member-km {
  font-size: 12px;
  color: #64748B;
}

.member-badge {
  display: flex;
  gap: 4px;
}

.badge-star,
.badge-me {
  font-size: 14px;
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

.footer-btn.invite {
  background: rgba(59, 130, 246, 0.2);
  color: #3B82F6;
}

.footer-btn.invite:hover {
  background: rgba(59, 130, 246, 0.3);
}

.footer-btn.leave {
  background: rgba(107, 114, 128, 0.2);
  color: #94A3B8;
}

.footer-btn.leave:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #EF4444;
}

.btn-icon {
  font-size: 16px;
}
</style>