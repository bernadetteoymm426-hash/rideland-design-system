<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface WarInfo {
  warId: number
  territory: {
    name: string
    code: string
  }
  attacker: {
    teamName: string
    totalDistance: number
    memberCount: number
    recentRiders: { nickname: string; distance: number }[]
  }
  defender: {
    teamName: string
    totalDistance: number
    memberCount: number
    defenseValue: number
  }
  myContribution: {
    todayDistance: number
    totalDistance: number
    rank: number
  }
  side: 'attacker' | 'defender'
  startedAt: string
  endsAt: string
}

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
  viewDetail: [warId: number]
}>()

const loading = ref(true)
const warInfo = ref<WarInfo | null>(null)

// Mock 数据
const mockWarInfo: WarInfo = {
  warId: 1001,
  territory: { name: '浙江省杭州市', code: '330100' },
  attacker: {
    teamName: '骑行者联盟',
    totalDistance: 2847.5,
    memberCount: 12,
    recentRiders: [
      { nickname: '骑友小王', distance: 42.3 },
      { nickname: '夜骑侠', distance: 38.7 },
      { nickname: '环湖骑士', distance: 35.1 },
    ]
  },
  defender: {
    teamName: '魔骑行',
    totalDistance: 2100.8,
    memberCount: 8,
    defenseValue: 1200
  },
  myContribution: {
    todayDistance: 15.6,
    totalDistance: 128.3,
    rank: 3
  },
  side: 'attacker',
  startedAt: '2026-03-31T00:00:00',
  endsAt: '2026-04-06T12:00:00'
}

// 计算攻防比例
const attackProgress = computed(() => {
  if (!warInfo.value) return 50
  const total = warInfo.value.attacker.totalDistance + warInfo.value.defender.totalDistance + warInfo.value.defender.defenseValue
  return Math.min(95, Math.max(5, (warInfo.value.attacker.totalDistance / total) * 100))
})

const defenseProgress = computed(() => {
  return 100 - attackProgress.value
})

// 倒计时
const timeRemaining = ref('')
let timerInterval: ReturnType<typeof setInterval> | null = null

function updateTimer() {
  if (!warInfo.value) return
  const now = new Date().getTime()
  const end = new Date(warInfo.value.endsAt).getTime()
  const diff = end - now

  if (diff <= 0) {
    timeRemaining.value = '已结算'
    return
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  if (days > 0) {
    timeRemaining.value = `${days}天 ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  } else {
    timeRemaining.value = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }
}

// 胜负判断
const battleStatus = computed(() => {
  if (!warInfo.value) return 'unknown'
  const atkTotal = warInfo.value.attacker.totalDistance
  const defTotal = warInfo.value.defender.totalDistance + warInfo.value.defender.defenseValue
  if (atkTotal > defTotal) return 'attacking-lead'
  if (defTotal > atkTotal) return 'defending-lead'
  return 'tied'
})

const statusLabel = computed(() => {
  if (!warInfo.value) return ''
  const isAttacker = warInfo.value.side === 'attacker'
  switch (battleStatus.value) {
    case 'attacking-lead': return isAttacker ? '我方领先' : '对方领先'
    case 'defending-lead': return isAttacker ? '对方领先' : '我方领先'
    default: return '势均力敌'
  }
})

const statusColor = computed(() => {
  if (!warInfo.value) return '#94A3B8'
  const isAttacker = warInfo.value.side === 'attacker'
  switch (battleStatus.value) {
    case 'attacking-lead': return isAttacker ? '#22C55E' : '#EF4444'
    case 'defending-lead': return isAttacker ? '#EF4444' : '#22C55E'
    default: return '#F59E0B'
  }
})

onMounted(() => {
  // Mock 加载
  setTimeout(() => {
    warInfo.value = mockWarInfo
    loading.value = false
    updateTimer()
    timerInterval = setInterval(updateTimer, 1000)
  }, 600)
})

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="overlay">
      <div v-if="visible" class="war-overlay-backdrop" @click="emit('close')">
        <div class="war-overlay-panel" @click.stop>
          <!-- 关闭按钮 -->
          <button class="btn-close" @click="emit('close')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <!-- 加载状态 -->
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <span>加载战况...</span>
          </div>

          <!-- 战况内容 -->
          <template v-else-if="warInfo">
            <!-- 头部：目标领土 -->
            <div class="panel-header">
              <div class="target-territory">
                <span class="territory-icon">⚔️</span>
                <div class="territory-info">
                  <div class="territory-name">{{ warInfo.territory.name }}</div>
                  <div class="territory-label">攻城战进行中</div>
                </div>
              </div>
              <div class="battle-timer">
                <span class="timer-label">剩余时间</span>
                <span class="timer-value font-mono">{{ timeRemaining }}</span>
              </div>
            </div>

            <!-- 攻防进度条 -->
            <div class="battle-progress-section">
              <div class="progress-header">
                <div class="side-info attacker">
                  <span class="side-label">进攻</span>
                  <span class="team-name">{{ warInfo.attacker.teamName }}</span>
                </div>
                <div class="status-badge" :style="{ color: statusColor }">
                  {{ statusLabel }}
                </div>
                <div class="side-info defender">
                  <span class="team-name">{{ warInfo.defender.teamName }}</span>
                  <span class="side-label">防守</span>
                </div>
              </div>

              <!-- 双向进度条 -->
              <div class="battle-bar">
                <div
                  class="bar-attack"
                  :style="{ width: attackProgress + '%' }"
                >
                  <span class="bar-value font-mono">{{ warInfo.attacker.totalDistance.toFixed(1) }} km</span>
                </div>
                <div
                  class="bar-defense"
                  :style="{ width: defenseProgress + '%' }"
                >
                  <span class="bar-value font-mono">{{ (warInfo.defender.totalDistance + warInfo.defender.defenseValue).toFixed(1) }}</span>
                </div>
              </div>

              <div class="progress-footer">
                <span class="distance-label">累计里程 {{ warInfo.attacker.totalDistance.toFixed(1) }} km</span>
                <span class="distance-label">里程 {{ warInfo.defender.totalDistance.toFixed(1) }} + 城防 {{ warInfo.defender.defenseValue }}</span>
              </div>
            </div>

            <!-- 我的贡献 -->
            <div class="my-contribution">
              <div class="contrib-header">
                <span class="contrib-title">我的贡献</span>
                <span class="contrib-rank">队内第 <strong class="font-mono">{{ warInfo.myContribution.rank }}</strong> 名</span>
              </div>
              <div class="contrib-stats">
                <div class="contrib-item">
                  <span class="contrib-value font-mono">{{ warInfo.myContribution.todayDistance.toFixed(1) }}</span>
                  <span class="contrib-label">今日 (km)</span>
                </div>
                <div class="contrib-divider"></div>
                <div class="contrib-item">
                  <span class="contrib-value font-mono">{{ warInfo.myContribution.totalDistance.toFixed(1) }}</span>
                  <span class="contrib-label">累计 (km)</span>
                </div>
                <div class="contrib-divider"></div>
                <div class="contrib-item">
                  <span class="contrib-value font-mono">{{ warInfo.attacker.memberCount }}</span>
                  <span class="contrib-label">参战人数</span>
                </div>
              </div>
            </div>

            <!-- 最近骑行贡献 -->
            <div class="recent-riders">
              <div class="riders-title">最近骑行贡献</div>
              <div class="rider-list">
                <div v-for="(rider, idx) in warInfo.attacker.recentRiders" :key="idx" class="rider-item">
                  <div class="rider-rank">{{ idx + 1 }}</div>
                  <div class="rider-name">{{ rider.nickname }}</div>
                  <div class="rider-distance font-mono">+{{ rider.distance.toFixed(1) }} km</div>
                </div>
              </div>
            </div>

            <!-- 底部操作 -->
            <div class="panel-footer">
              <button class="btn-ride">
                <span>🚴 去骑行，为战队出力</span>
              </button>
            </div>
          </template>

          <!-- 无战事 -->
          <div v-else class="empty-state">
            <div class="empty-icon">🏳️</div>
            <div class="empty-text">当前没有进行中的攻城战</div>
            <div class="empty-hint">等待会长宣战或被其他战队宣战</div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.war-overlay-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(7, 14, 27, 0.85);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.war-overlay-panel {
  position: relative;
  background: rgba(26, 39, 64, 0.95);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(59, 130, 246, 0.15);
  max-width: 520px;
  width: 92%;
  max-height: 85vh;
  overflow-y: auto;
  padding: 24px;
}

.btn-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.3);
  border: none;
  border-radius: 8px;
  color: #94A3B8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #F1F5F9;
}

.btn-close svg {
  width: 18px;
  height: 18px;
}

/* 等宽数字 */
.font-mono {
  font-family: "SF Mono", "Monaco", "Inconsolata", "Fira Mono", monospace;
  font-variant-numeric: tabular-nums;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 60px 0;
  color: #94A3B8;
  font-size: 14px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(59, 130, 246, 0.2);
  border-top-color: #3B82F6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 头部 */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-right: 40px;
}

.target-territory {
  display: flex;
  align-items: center;
  gap: 12px;
}

.territory-icon {
  font-size: 28px;
}

.territory-name {
  font-size: 18px;
  font-weight: 700;
  color: #F1F5F9;
}

.territory-label {
  font-size: 12px;
  color: #F59E0B;
  margin-top: 2px;
}

.battle-timer {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.timer-label {
  font-size: 11px;
  color: #64748B;
}

.timer-value {
  font-size: 16px;
  font-weight: 700;
  color: #F59E0B;
}

/* 攻防进度 */
.battle-progress-section {
  background: rgba(10, 22, 40, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.15);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.side-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.side-info.attacker { align-items: flex-start; }
.side-info.defender { align-items: flex-end; }

.side-label {
  font-size: 11px;
  color: #64748B;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.side-info.attacker .team-name { color: #EF4444; }
.side-info.defender .team-name { color: #22C55E; }

.team-name {
  font-size: 13px;
  font-weight: 600;
  color: #F1F5F9;
}

.status-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
}

/* 双向进度条 */
.battle-bar {
  display: flex;
  height: 36px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 8px;
}

.bar-attack {
  background: linear-gradient(90deg, #EF4444, #DC2626);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 60px;
  position: relative;
}

.bar-attack::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
}

.bar-defense {
  background: linear-gradient(90deg, #16A34A, #22C55E);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 60px;
}

.bar-value {
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
}

.progress-footer {
  display: flex;
  justify-content: space-between;
}

.distance-label {
  font-size: 11px;
  color: #64748B;
}

/* 我的贡献 */
.my-contribution {
  background: rgba(59, 130, 246, 0.08);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

.contrib-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.contrib-title {
  font-size: 14px;
  font-weight: 600;
  color: #F1F5F9;
}

.contrib-rank {
  font-size: 12px;
  color: #94A3B8;
}

.contrib-rank strong {
  color: #F59E0B;
  font-size: 16px;
}

.contrib-stats {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.contrib-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.contrib-value {
  font-size: 24px;
  font-weight: 700;
  color: #3B82F6;
}

.contrib-label {
  font-size: 11px;
  color: #64748B;
}

.contrib-divider {
  width: 1px;
  height: 32px;
  background: rgba(59, 130, 246, 0.2);
}

/* 最近骑行 */
.recent-riders {
  margin-bottom: 16px;
}

.riders-title {
  font-size: 13px;
  font-weight: 600;
  color: #94A3B8;
  margin-bottom: 10px;
}

.rider-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rider-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: rgba(10, 22, 40, 0.4);
  border-radius: 8px;
}

.rider-rank {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.2);
  color: #3B82F6;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.rider-name {
  flex: 1;
  font-size: 13px;
  color: #F1F5F9;
}

.rider-distance {
  font-size: 13px;
  font-weight: 600;
  color: #22C55E;
}

/* 底部操作 */
.panel-footer {
  margin-top: 8px;
}

.btn-ride {
  width: 100%;
  padding: 14px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #3B82F6, #2563EB);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
}

.btn-ride:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.btn-ride:active {
  transform: translateY(0);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 48px 20px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  color: #94A3B8;
  margin-bottom: 8px;
}

.empty-hint {
  font-size: 13px;
  color: #64748B;
}

/* 过渡动画 */
.overlay-enter-active,
.overlay-leave-active {
  transition: all 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.overlay-enter-from .war-overlay-panel,
.overlay-leave-to .war-overlay-panel {
  transform: scale(0.95) translateY(20px);
  opacity: 0;
}
</style>
