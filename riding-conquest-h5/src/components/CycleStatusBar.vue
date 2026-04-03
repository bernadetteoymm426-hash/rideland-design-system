<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useCycle } from '@/composables/useCycle'

const { 
  currentPhase, 
  formattedTimeRemaining, 
  phaseProgress, 
  allPhases,
  startTimer,
  stopTimer,
  getPhaseColor 
} = useCycle()

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  stopTimer()
})
</script>

<template>
  <div class="cycle-status-bar">
    <!-- 当前阶段信息 -->
    <div class="current-phase">
      <div class="phase-icon">{{ currentPhase.icon }}</div>
      <div class="phase-info">
        <div class="phase-name">{{ currentPhase.name }}</div>
        <div class="phase-description">{{ currentPhase.description }}</div>
      </div>
      <div class="phase-timer">
        <div class="timer-value">{{ formattedTimeRemaining }}</div>
        <div class="timer-label">后结束</div>
      </div>
    </div>
    
    <!-- 阶段进度条 -->
    <div class="phase-progress">
      <div 
        class="progress-bar"
        :style="{ 
          width: `${phaseProgress * 100}%`,
          background: `linear-gradient(90deg, ${getPhaseColor()} 0%, ${getPhaseColor()} 100%)`
        }"
      >
        <div class="progress-glow"></div>
      </div>
    </div>
    
    <!-- 所有阶段指示器 -->
    <div class="phase-indicators">
      <div 
        v-for="(phase, index) in allPhases" 
        :key="phase.name"
        class="phase-indicator"
        :class="{ 
          active: phase.isActive,
          completed: phase.isCompleted,
          upcoming: phase.isUpcoming
        }"
      >
        <div class="indicator-dot">
          <span v-if="phase.isActive || phase.isCompleted" class="dot-icon">{{ phase.icon }}</span>
        </div>
        <div class="indicator-label">{{ phase.name }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cycle-status-bar {
  background: linear-gradient(135deg, rgba(10, 22, 40, 0.95) 0%, rgba(26, 39, 64, 0.9) 100%);
  border-bottom: 2px solid rgba(59, 130, 246, 0.3);
  padding: 12px 16px;
  backdrop-filter: blur(10px);
}

/* 当前阶段信息 */
.current-phase {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.phase-icon {
  font-size: 28px;
  flex-shrink: 0;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.phase-info {
  flex: 1;
}

.phase-name {
  font-size: 16px;
  font-weight: 700;
  color: #F1F5F9;
  margin-bottom: 2px;
}

.phase-description {
  font-size: 12px;
  color: #94A3B8;
}

.phase-timer {
  text-align: right;
  flex-shrink: 0;
}

.timer-value {
  font-size: 18px;
  font-weight: 700;
  color: #3B82F6;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.5px;
}

.timer-label {
  font-size: 11px;
  color: #64748B;
}

/* 进度条 */
.phase-progress {
  position: relative;
  height: 6px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-bar {
  height: 100%;
  position: relative;
  transition: width 0.5s ease;
  border-radius: 3px;
}

.progress-glow {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 20px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6));
  animation: glow 1.5s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* 阶段指示器 */
.phase-indicators {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.phase-indicator {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  position: relative;
}

.indicator-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.1);
  border: 2px solid rgba(59, 130, 246, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 16px;
}

.phase-indicator.active .indicator-dot {
  background: rgba(59, 130, 246, 0.2);
  border-color: #3B82F6;
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.4);
  animation: active-pulse 2s ease-in-out infinite;
}

@keyframes active-pulse {
  0%, 100% { box-shadow: 0 0 12px rgba(59, 130, 246, 0.4); }
  50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.6); }
}

.phase-indicator.completed .indicator-dot {
  background: rgba(34, 197, 94, 0.2);
  border-color: #22C55E;
}

.phase-indicator.upcoming .indicator-dot {
  opacity: 0.5;
}

.dot-icon {
  flex-shrink: 0;
}

.indicator-label {
  font-size: 11px;
  color: #64748B;
  font-weight: 500;
}

.phase-indicator.active .indicator-label {
  color: #3B82F6;
  font-weight: 700;
}

.phase-indicator.completed .indicator-label {
  color: #22C55E;
}

/* 响应式 */
@media (max-width: 375px) {
  .phase-icon {
    font-size: 24px;
  }
  
  .phase-name {
    font-size: 14px;
  }
  
  .phase-description {
    font-size: 11px;
  }
  
  .timer-value {
    font-size: 16px;
  }
  
  .indicator-dot {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }
  
  .indicator-label {
    font-size: 10px;
  }
}
</style>
