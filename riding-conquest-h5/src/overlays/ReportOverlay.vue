<script setup>
const emit = defineEmits(['close'])

const weeklyReport = {
  week: 12,
  rankChange: { from: 5, to: 3 },
  territories: ['浙江省', '福建省', '江西省'],
  contribution: {
    km: 234,
    percent: 8.2
  }
}

const personalStats = {
  attacks: 4,
  defenses: 2,
  medals: ['先锋勋章', '守护者勋章']
}

const teamGlory = {
  title: '本周最佳进攻战队',
  totalKm: 28450
}

function handleShare() {
  console.log('分享战报')
}
</script>

<template>
  <div class="report-overlay">
    <div class="overlay-header">
      <div class="header-left">
        <span class="header-icon">📊</span>
        <h2 class="overlay-title">本周战报</h2>
      </div>
      <button class="share-btn" @click="handleShare">
        <span>📤</span>
        <span>分享</span>
      </button>
    </div>
    
    <div class="overlay-body">
      <div class="week-header">
        <span class="week-badge">第 {{ weeklyReport.week }} 周</span>
        <span class="week-label">战况总结</span>
      </div>
      
      <div class="summary-cards">
        <div class="summary-card rank">
          <div class="card-icon">🏆</div>
          <div class="card-content">
            <span class="card-label">排名变化</span>
            <span class="card-value">
              #{{ weeklyReport.rankChange.from }} → #{{ weeklyReport.rankChange.to }}
            </span>
            <span class="card-change up">⬆️ 上升 2 名</span>
          </div>
        </div>
        
        <div class="summary-card territories">
          <div class="card-icon">🗺️</div>
          <div class="card-content">
            <span class="card-label">领土变化</span>
            <span class="card-value">+{{ weeklyReport.territories.length }} 个</span>
            <span class="card-detail">
              攻克{{ weeklyReport.territories.join('、') }}
            </span>
          </div>
        </div>
        
        <div class="summary-card contribution">
          <div class="card-icon">📊</div>
          <div class="card-content">
            <span class="card-label">个人贡献</span>
            <span class="card-value">{{ weeklyReport.contribution.km }} 公里</span>
            <span class="card-detail">战队贡献占比 {{ weeklyReport.contribution.percent }}%</span>
          </div>
        </div>
      </div>
      
      <div class="section">
        <h4 class="section-title">个人战果</h4>
        <div class="personal-stats">
          <div class="stat-row">
            <span class="stat-icon">⚔️</span>
            <span class="stat-text">参与进攻 {{ personalStats.attacks }} 次</span>
          </div>
          <div class="stat-row">
            <span class="stat-icon">🛡️</span>
            <span class="stat-text">防守贡献 {{ personalStats.defenses }} 次</span>
          </div>
          <div class="stat-row medals">
            <span class="stat-icon">🏅</span>
            <div class="medal-list">
              <span v-for="medal in personalStats.medals" :key="medal" class="medal">
                {{ medal }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="section">
        <h4 class="section-title">战队荣耀</h4>
        <div class="glory-card">
          <span class="glory-badge">🎖️</span>
          <span class="glory-title">「{{ teamGlory.title }}」</span>
          <span class="glory-detail">全员贡献 {{ teamGlory.totalKm.toLocaleString() }} 公里</span>
        </div>
      </div>
    </div>
    
    <div class="overlay-footer">
      <button class="footer-share-btn" @click="handleShare">
        <span>📤</span>
        <span>分享战报到朋友圈</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.report-overlay {
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

.share-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
  color: #3B82F6;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.share-btn:hover {
  background: rgba(59, 130, 246, 0.3);
}

.overlay-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.week-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.week-badge {
  padding: 6px 12px;
  background: linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%);
  border-radius: 6px;
  font-size: 14px;
  font-weight: 700;
  color: #070E1B;
}

.week-label {
  font-size: 16px;
  color: #94A3B8;
}

.summary-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(26, 39, 64, 0.6);
  border-radius: 12px;
  border-left: 3px solid;
}

.summary-card.rank {
  border-left-color: #FBBF24;
}

.summary-card.territories {
  border-left-color: #22C55E;
}

.summary-card.contribution {
  border-left-color: #3B82F6;
}

.card-icon {
  font-size: 28px;
}

.card-content {
  display: flex;
  flex-direction: column;
}

.card-label {
  font-size: 12px;
  color: #64748B;
}

.card-value {
  font-size: 18px;
  font-weight: 700;
  color: #F1F5F9;
}

.card-change {
  font-size: 12px;
}

.card-change.up {
  color: #22C55E;
}

.card-detail {
  font-size: 12px;
  color: #94A3B8;
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

.personal-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-row {
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

.stat-row.medals {
  flex-direction: column;
  align-items: flex-start;
}

.medal-list {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.medal {
  padding: 4px 12px;
  background: rgba(251, 191, 36, 0.15);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 4px;
  font-size: 12px;
  color: #FBBF24;
}

.glory-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 12px;
  text-align: center;
}

.glory-badge {
  font-size: 32px;
}

.glory-title {
  font-size: 16px;
  font-weight: 700;
  color: #FBBF24;
}

.glory-detail {
  font-size: 13px;
  color: #94A3B8;
}

.overlay-footer {
  padding: 16px 24px;
  border-top: 1px solid rgba(59, 130, 246, 0.2);
}

.footer-share-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  background: linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%);
  border: none;
  border-radius: 8px;
  color: #070E1B;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.footer-share-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(251, 191, 36, 0.4);
}
</style>
