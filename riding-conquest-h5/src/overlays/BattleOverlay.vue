<script setup>
const emit = defineEmits(['close'])

const currentAttack = {
  target: '浙江省',
  enemy: '魔骑行',
  progress: 52,
  remaining: '1,234',
  deadline: '2 天 14:32'
}

const attackTargets = [
  { name: '江苏省', status: 'neutral', defense: 1000, stars: 3 },
  { name: '安徽省', status: 'enemy', defense: 800, stars: 2 },
  { name: '江西省', status: 'enemy', defense: 1200, stars: 4 }
]

function getStarsArray(stars) {
  return { filled: stars, empty: 5 - stars }
}

function handleContribute() {
  console.log('立即贡献里程')
}

function handleAttack(target) {
  console.log('进攻', target.name)
}
</script>

<template>
  <div class="battle-overlay">
    <div class="overlay-header">
      <div class="header-left">
        <span class="header-icon">⚔️</span>
        <h2 class="overlay-title">作战</h2>
      </div>
    </div>
    
    <div class="overlay-body">
      <div class="current-attack">
        <h4 class="section-title">正在进攻</h4>
        <div class="attack-card">
          <div class="attack-header">
            <span class="attack-icon">⚔️</span>
            <div class="attack-info">
              <span class="attack-target">{{ currentAttack.target }}</span>
              <span class="attack-enemy">{{ currentAttack.enemy }}</span>
            </div>
          </div>
          
          <div class="progress-section">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: currentAttack.progress + '%' }"></div>
            </div>
            <span class="progress-text">{{ currentAttack.progress }}%</span>
          </div>
          
          <div class="attack-stats">
            <span>还需 {{ currentAttack.remaining }} 公里攻克</span>
            <span>剩余 {{ currentAttack.deadline }}</span>
          </div>
          
          <button class="contribute-btn" @click="handleContribute">
            <span class="btn-icon">🚴</span>
            <span>立即贡献里程</span>
          </button>
        </div>
      </div>
      
      <div class="attack-targets">
        <h4 class="section-title">可进攻目标</h4>
        <div class="target-list">
          <div 
            v-for="target in attackTargets" 
            :key="target.name"
            class="target-item"
            :class="target.status"
          >
            <div class="target-info">
              <span class="target-name">{{ target.name }}</span>
              <div class="target-meta">
                <span :class="['status-badge', target.status]">
                  {{ target.status === 'enemy' ? '敌方' : '无主' }}
                </span>
                <span class="target-defense">城防 {{ target.defense }}</span>
              </div>
            </div>
            <div class="target-stars">
              <span 
                v-for="n in getStarsArray(target.stars).filled" 
                :key="'f-' + n"
                class="star filled"
              >★</span>
              <span 
                v-for="n in getStarsArray(target.stars).empty" 
                :key="'e-' + n"
                class="star empty"
              >☆</span>
            </div>
            <button class="attack-btn" @click="handleAttack(target)">
              进攻
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.battle-overlay {
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

.overlay-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #94A3B8;
  margin: 0 0 16px;
  letter-spacing: 1px;
}

.current-attack {
  margin-bottom: 32px;
}

.attack-card {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  padding: 20px;
}

.attack-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.attack-icon {
  font-size: 24px;
}

.attack-info {
  display: flex;
  flex-direction: column;
}

.attack-target {
  font-size: 18px;
  font-weight: 600;
  color: #F1F5F9;
}

.attack-enemy {
  font-size: 13px;
  color: #EF4444;
}

.progress-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.progress-bar {
  flex: 1;
  height: 10px;
  background: rgba(239, 68, 68, 0.2);
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #EF4444, #F97316);
  border-radius: 5px;
  transition: width 0.5s ease;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: shine 2s infinite;
}

@keyframes shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.progress-text {
  font-size: 16px;
  font-weight: 700;
  color: #EF4444;
  font-family: monospace;
}

.attack-stats {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #94A3B8;
  margin-bottom: 16px;
}

.contribute-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
  border: none;
  border-radius: 8px;
  color: #FFFFFF;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.contribute-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.4);
}

.btn-icon {
  font-size: 16px;
}

.target-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.target-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(26, 39, 64, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 10px;
  transition: all 0.2s ease;
}

.target-item:hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
}

.target-item.enemy {
  border-left: 3px solid #EF4444;
}

.target-item.neutral {
  border-left: 3px solid #6B7280;
}

.target-info {
  flex: 1;
}

.target-name {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: #F1F5F9;
  margin-bottom: 4px;
}

.target-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
}

.status-badge.enemy {
  background: rgba(239, 68, 68, 0.2);
  color: #EF4444;
}

.status-badge.neutral {
  background: rgba(107, 114, 128, 0.2);
  color: #94A3B8;
}

.target-defense {
  font-size: 12px;
  color: #64748B;
}

.target-stars {
  display: flex;
  gap: 2px;
}

.star {
  font-size: 14px;
}

.star.filled {
  color: #FBBF24;
}

.star.empty {
  color: #475569;
}

.attack-btn {
  padding: 8px 16px;
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.4);
  border-radius: 6px;
  color: #3B82F6;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.attack-btn:hover {
  background: rgba(59, 130, 246, 0.3);
}
</style>