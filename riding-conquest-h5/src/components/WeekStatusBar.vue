<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['phase-click'])

const currentTime = ref(new Date())
const showTooltip = ref(false)
const previousPhase = ref(null)

const phases = {
  battle: {
    id: 'battle',
    icon: '⚔️',
    name: '对战期',
    color: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: 'rgba(59, 130, 246, 0.4)',
    shadowColor: 'rgba(59, 130, 246, 0.2)',
    description: '全力进攻，扩张领土！每周对战期进行领土争夺。',
    labelTemplate: '距离结算还有'
  },
  settlement: {
    id: 'settlement',
    icon: '🔒',
    name: '结算期',
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: 'rgba(245, 158, 11, 0.4)',
    shadowColor: 'rgba(245, 158, 11, 0.2)',
    description: '战果锁定中，系统正在计算本周领土变化。',
    labelTemplate: '战果锁定中'
  },
  report: {
    id: 'report',
    icon: '📊',
    name: '战报发布',
    color: '#FBBF24',
    bgColor: 'rgba(251, 191, 36, 0.15)',
    borderColor: 'rgba(251, 191, 36, 0.4)',
    shadowColor: 'rgba(251, 191, 36, 0.2)',
    description: '本周战报已发布，点击查看详细战况！',
    labelTemplate: '点击查看本周战况',
    clickable: true
  },
  declare: {
    id: 'declare',
    icon: '📜',
    name: '宣战期',
    color: '#8B5CF6',
    bgColor: 'rgba(139, 92, 246, 0.15)',
    borderColor: 'rgba(139, 92, 246, 0.4)',
    shadowColor: 'rgba(139, 92, 246, 0.2)',
    description: '会长正在制定下周作战计划，选择进攻目标。',
    labelTemplate: '会长正在制定作战计划'
  }
}

function getCurrentPhase() {
  const now = currentTime.value
  const day = now.getDay()
  const hour = now.getHours()
  
  if (day === 0) {
    if (hour < 12) return 'battle'
    if (hour < 18) return 'settlement'
    if (hour < 20) return 'report'
    return 'declare'
  }
  
  if (day === 1 && hour < 12) return 'declare'
  
  return 'battle'
}

function getPhaseEndTime() {
  const now = currentTime.value
  const day = now.getDay()
  const hour = now.getHours()
  const phase = getCurrentPhase()
  
  const endDate = new Date(now)
  
  if (phase === 'battle') {
    if (day === 0 && hour < 12) {
      endDate.setHours(12, 0, 0, 0)
    } else {
      const daysUntilSunday = (7 - day) % 7
      endDate.setDate(endDate.getDate() + daysUntilSunday)
      endDate.setHours(12, 0, 0, 0)
    }
  } else if (phase === 'settlement') {
    endDate.setHours(18, 0, 0, 0)
  } else if (phase === 'report') {
    endDate.setHours(20, 0, 0, 0)
  } else if (phase === 'declare') {
    if (day === 0) {
      endDate.setDate(endDate.getDate() + 1)
    }
    endDate.setHours(12, 0, 0, 0)
  }
  
  return endDate
}

function formatCountdown(endTime) {
  const diff = Math.max(0, Math.floor((endTime - currentTime.value) / 1000))
  
  if (diff <= 0) return '00:00:00'
  
  const days = Math.floor(diff / 86400)
  const hours = Math.floor((diff % 86400) / 3600)
  const minutes = Math.floor((diff % 3600) / 60)
  const seconds = diff % 60
  
  if (days > 0) {
    return `${days} 天 ${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }
  
  return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

const currentPhase = computed(() => getCurrentPhase())
const phaseConfig = computed(() => phases[currentPhase.value])
const countdown = computed(() => formatCountdown(getPhaseEndTime()))
const isClickable = computed(() => phaseConfig.value.clickable)

function handleBarClick() {
  if (isClickable.value) {
    emit('phase-click', currentPhase.value)
  }
}

function handleMouseEnter() {
  showTooltip.value = true
}

function handleMouseLeave() {
  showTooltip.value = false
}

let timer = null

onMounted(() => {
  timer = setInterval(() => {
    const newPhase = getCurrentPhase()
    if (previousPhase.value && previousPhase.value !== newPhase) {
      // Phase changed - could trigger animation
    }
    previousPhase.value = newPhase
    currentTime.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<template>
  <div class="week-status-bar-wrapper">
    <div 
      class="week-status-bar"
      :class="[`phase-${currentPhase}`, { clickable: isClickable }]"
      :style="{
        '--phase-color': phaseConfig.color,
        '--phase-bg': phaseConfig.bgColor,
        '--phase-border': phaseConfig.borderColor,
        '--phase-shadow': phaseConfig.shadowColor
      }"
      @click="handleBarClick"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <div class="phase-info">
        <span class="phase-icon">{{ phaseConfig.icon }}</span>
        <span class="phase-name">{{ phaseConfig.name }}</span>
      </div>
      
      <div class="phase-divider"></div>
      
      <div class="countdown-section">
        <span class="countdown-label">{{ phaseConfig.labelTemplate }}</span>
        <span class="countdown-time font-mono">{{ countdown }}</span>
      </div>
      
      <Transition name="tooltip">
        <div class="phase-tooltip" v-if="showTooltip">
          <div class="tooltip-header">
            <span class="tooltip-icon">{{ phaseConfig.icon }}</span>
            <span class="tooltip-title">{{ phaseConfig.name }}</span>
          </div>
          <p class="tooltip-description">{{ phaseConfig.description }}</p>
          <div class="tooltip-timeline">
            <div class="timeline-item" :class="{ active: currentPhase === 'battle' }">
              <span>⚔️ 对战期</span>
              <small>周一 - 周日 12:00</small>
            </div>
            <div class="timeline-item" :class="{ active: currentPhase === 'settlement' }">
              <span>🔒 结算期</span>
              <small>周日 12:00 - 18:00</small>
            </div>
            <div class="timeline-item" :class="{ active: currentPhase === 'report' }">
              <span>📊 战报</span>
              <small>周日 18:00 - 20:00</small>
            </div>
            <div class="timeline-item" :class="{ active: currentPhase === 'declare' }">
              <span>📜 宣战期</span>
              <small>周日 20:00 - 周一 12:00</small>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.week-status-bar-wrapper {
  position: relative;
}

.week-status-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 20px;
  background: var(--phase-bg);
  border: 1px solid var(--phase-border);
  border-radius: 12px;
  backdrop-filter: blur(8px);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  cursor: default;
}

.week-status-bar.clickable {
  cursor: pointer;
}

.week-status-bar.clickable:hover {
  transform: scale(1.02);
}

.week-status-bar::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 13px;
  padding: 1px;
  background: linear-gradient(135deg, var(--phase-border), transparent 50%);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask-composite: xor;
  pointer-events: none;
}

.phase-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.phase-icon {
  font-size: 18px;
  animation: icon-float 2s ease-in-out infinite;
}

@keyframes icon-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

.phase-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--phase-color);
  letter-spacing: 1px;
}

.phase-divider {
  width: 1px;
  height: 24px;
  background: var(--phase-border);
}

.countdown-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.countdown-label {
  font-size: 10px;
  color: #64748B;
  letter-spacing: 0.5px;
}

.countdown-time {
  font-size: 14px;
  font-weight: 700;
  color: var(--phase-color);
  font-family: "SF Mono", "Monaco", "Inconsolata", "Fira Mono", monospace;
  font-variant-numeric: tabular-nums;
  text-shadow: 0 0 10px var(--phase-shadow);
}

.phase-tooltip {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 280px;
  background: rgba(26, 39, 64, 0.95);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
  z-index: 100;
}

.phase-tooltip::before {
  content: '';
  position: absolute;
  top: -6px;
  right: 20px;
  width: 12px;
  height: 12px;
  background: rgba(26, 39, 64, 0.95);
  border-left: 1px solid rgba(59, 130, 246, 0.3);
  border-top: 1px solid rgba(59, 130, 246, 0.3);
  transform: rotate(45deg);
}

.tooltip-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.tooltip-icon {
  font-size: 20px;
}

.tooltip-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--phase-color);
}

.tooltip-description {
  font-size: 13px;
  color: #94A3B8;
  margin: 0 0 12px;
  line-height: 1.5;
}

.tooltip-timeline {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.timeline-item {
  padding: 8px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 8px;
  font-size: 12px;
  color: #94A3B8;
  transition: all 0.3s ease;
}

.timeline-item.active {
  background: var(--phase-bg);
  color: var(--phase-color);
  border: 1px solid var(--phase-border);
}

.timeline-item small {
  display: block;
  font-size: 10px;
  color: #64748B;
  margin-top: 2px;
}

.timeline-item.active small {
  color: #94A3B8;
}

.tooltip-enter-active {
  animation: tooltip-enter 0.3s ease-out forwards;
}

.tooltip-leave-active {
  animation: tooltip-leave 0.2s ease-in forwards;
}

@keyframes tooltip-enter {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes tooltip-leave {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}

.phase-battle {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
}

.phase-settlement {
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.2);
}

.phase-report {
  box-shadow: 0 0 20px rgba(251, 191, 36, 0.2);
  animation: report-glow 1.5s ease-in-out infinite;
}

.phase-declare {
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.2);
}

@keyframes report-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(251, 191, 36, 0.2);
  }
  50% {
    box-shadow: 0 0 30px rgba(251, 191, 36, 0.4);
  }
}
</style>