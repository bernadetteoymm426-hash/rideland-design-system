<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  hometown: {
    type: Object,
    required: true
  },
  territoryStatus: {
    type: String,
    default: 'defending',
    validator: (v) => ['defending', 'attacked', 'unclaimed'].includes(v)
  }
})

const emit = defineEmits(['complete', 'skip'])

const phase = ref('logo')
const isAnimating = ref(true)
const showEmotionText = ref(false)
const showActionButton = ref(false)

const statusConfig = computed(() => {
  const configs = {
    defending: {
      icon: '🏠',
      title: `「你的家乡正在被守护」`,
      subtitle: `${props.hometown.teamName || '骑行者联盟'} 已坚守 ${props.hometown.days || 12} 天`,
      extra: `今日贡献 ${(props.hometown.todayKm || 3284).toLocaleString()} 公里`,
      buttonText: '🚴 骑一圈，为家乡加油',
      buttonClass: 'btn-defend'
    },
    attacked: {
      icon: '⚔️',
      title: `「你的家乡正在遭受进攻！」`,
      subtitle: `${props.hometown.enemyName || '魔骑行'} 攻势还剩 ${formatCountdown(props.hometown.remainTime)}`,
      extra: `城防值 ${props.hometown.defense || 800} / ${props.hometown.maxDefense || 1200}`,
      progress: ((props.hometown.defense || 800) / (props.hometown.maxDefense || 1200)) * 100,
      buttonText: '⚡ 立即骑行，保卫家乡！',
      buttonClass: 'btn-attack'
    },
    unclaimed: {
      icon: '🗺️',
      title: `「你的家乡，等待征服」`,
      subtitle: '这里还没有主人',
      extra: '成为第一个征服者，创造历史',
      buttonText: '🏆 开始征服',
      buttonClass: 'btn-conquer'
    }
  }
  return configs[props.territoryStatus]
})

function formatCountdown(seconds) {
  if (!seconds) return '2 天 14:32'
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  return `${days} 天 ${hours}:${String(mins).padStart(2, '0')}`
}

function startSequence() {
  setTimeout(() => { phase.value = 'map-skeleton' }, 500)
  setTimeout(() => { phase.value = 'map-loaded' }, 800)
  setTimeout(() => { phase.value = 'camera-zoom' }, 1000)
  setTimeout(() => { phase.value = 'hometown-highlight' }, 2400)
  setTimeout(() => { showEmotionText.value = true }, 3000)
  setTimeout(() => { showActionButton.value = true }, 3500)
  setTimeout(() => { isAnimating.value = false }, 4000)
}

function handleAction() {
  emit('complete')
}

function handleSkip() {
  emit('skip')
}

onMounted(() => {
  startSequence()
})
</script>

<template>
  <div class="first-time-experience" :class="phase">
    <div class="fte-logo" v-if="phase === 'logo'">
      <div class="logo-content">
        <h1 class="logo-title">骑迹大陆</h1>
        <span class="logo-subtitle">RIDELAND</span>
      </div>
    </div>

    <div class="fte-map-skeleton" v-if="phase === 'map-skeleton'">
      <div class="skeleton-china"></div>
    </div>

    <div class="fte-map-loaded" v-if="['map-loaded', 'camera-zoom', 'hometown-highlight'].includes(phase)">
      <div class="map-container" :class="{ 'camera-zoomed': phase === 'camera-zoom' || phase === 'hometown-highlight' }">
        <div class="map-base"></div>
        <div class="hometown-marker" :class="{ highlighted: phase === 'hometown-highlight' }">
          <div class="marker-pulse"></div>
          <div class="marker-core">
            <span>{{ statusConfig.icon }}</span>
          </div>
        </div>
      </div>
    </div>

    <Transition name="emotion-text">
      <div class="fte-emotion-layer" v-if="showEmotionText">
        <div class="emotion-content" :class="territoryStatus">
          <h2 class="emotion-title">{{ statusConfig.title }}</h2>
          <p class="emotion-subtitle">{{ statusConfig.subtitle }}</p>
          <p class="emotion-extra" v-if="statusConfig.extra">{{ statusConfig.extra }}</p>
          
          <div class="defense-progress" v-if="territoryStatus === 'attacked' && statusConfig.progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: statusConfig.progress + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="action-button">
      <div class="fte-action-layer" v-if="showActionButton">
        <button 
          class="action-btn" 
          :class="statusConfig.buttonClass"
          @click="handleAction"
        >
          {{ statusConfig.buttonText }}
        </button>
        
        <button class="skip-btn" @click="handleSkip" v-if="!isAnimating">
          跳过引导
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.first-time-experience {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: #070E1B;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.fte-logo {
  animation: logo-fade-in 0.5s ease-out forwards;
}

.logo-content {
  text-align: center;
}

.logo-title {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(180deg, #FFFFFF 0%, #94A3B8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 8px;
  letter-spacing: 8px;
}

.logo-subtitle {
  font-size: 14px;
  color: #64748B;
  letter-spacing: 4px;
  text-transform: uppercase;
}

.fte-map-skeleton {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.skeleton-china {
  width: 80%;
  height: 70%;
  background: linear-gradient(
    90deg,
    rgba(59, 130, 246, 0.1) 0%,
    rgba(59, 130, 246, 0.2) 50%,
    rgba(59, 130, 246, 0.1) 100%
  );
  background-size: 200% 100%;
  border-radius: 16px;
  animation: skeleton-glow 1.5s ease-in-out infinite;
}

.fte-map-loaded {
  position: absolute;
  inset: 0;
}

.map-container {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 1.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: 65% 40%;
}

.map-container.camera-zoomed {
  transform: scale(2.5);
}

.map-base {
  position: absolute;
  inset: 0;
  background-color: #0A1628;
  background-image: 
    radial-gradient(ellipse at 65% 40%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
    repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(59, 130, 246, 0.03) 2px, rgba(59, 130, 246, 0.03) 4px);
}

.hometown-marker {
  position: absolute;
  top: 38%;
  left: 63%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.hometown-marker.highlighted {
  animation: hometown-pulse 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
}

.marker-pulse {
  position: absolute;
  inset: -20px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, transparent 70%);
  animation: gold-glow 2s ease-in-out infinite;
}

.marker-core {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  box-shadow: 
    0 0 30px rgba(245, 158, 11, 0.6),
    0 0 60px rgba(245, 158, 11, 0.3);
  border: 3px solid rgba(245, 158, 11, 0.5);
  position: relative;
  z-index: 1;
}

.fte-emotion-layer {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 20;
}

.emotion-content {
  padding: 24px 40px;
  background: rgba(26, 39, 64, 0.9);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 16px;
  backdrop-filter: blur(12px);
}

.emotion-content.defending {
  border-left: 4px solid #22C55E;
}

.emotion-content.attacked {
  border-left: 4px solid #EF4444;
}

.emotion-content.unclaimed {
  border-left: 4px solid #F59E0B;
}

.emotion-title {
  font-size: 24px;
  font-weight: 700;
  color: #F1F5F9;
  margin: 0 0 12px;
  letter-spacing: 2px;
}

.emotion-subtitle {
  font-size: 16px;
  color: #94A3B8;
  margin: 0 0 8px;
}

.emotion-extra {
  font-size: 14px;
  color: #64748B;
  margin: 0;
}

.defense-progress {
  margin-top: 16px;
}

.progress-bar {
  height: 8px;
  background: rgba(239, 68, 68, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #EF4444, #F97316);
  border-radius: 4px;
  transition: width 0.5s ease-out;
}

.fte-action-layer {
  position: absolute;
  bottom: 25%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 20;
}

.action-btn {
  padding: 16px 48px;
  font-size: 18px;
  font-weight: 600;
  color: #FFFFFF;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 1px;
}

.action-btn.btn-defend {
  background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%);
  box-shadow: 0 4px 20px rgba(34, 197, 94, 0.4);
}

.action-btn.btn-defend:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 30px rgba(34, 197, 94, 0.5);
}

.action-btn.btn-attack {
  background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
  box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4);
  animation: btn-urgent-pulse 1s ease-in-out infinite;
}

.action-btn.btn-attack:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 30px rgba(239, 68, 68, 0.5);
}

.action-btn.btn-conquer {
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
  box-shadow: 0 4px 20px rgba(245, 158, 11, 0.4);
}

.action-btn.btn-conquer:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 30px rgba(245, 158, 11, 0.5);
}

.skip-btn {
  display: block;
  margin: 16px auto 0;
  background: transparent;
  border: none;
  color: #64748B;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 16px;
  transition: color 0.3s ease;
}

.skip-btn:hover {
  color: #94A3B8;
}

@keyframes logo-fade-in {
  0% {
    opacity: 0;
    transform: scale(0.9);
    filter: blur(10px);
  }
  100% {
    opacity: 1;
    transform: scale(1);
    filter: blur(0);
  }
}

@keyframes skeleton-glow {
  0%, 100% {
    opacity: 0.4;
    background-position: 0% 50%;
  }
  50% {
    opacity: 0.8;
    background-position: 100% 50%;
  }
}

@keyframes hometown-pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    filter: brightness(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    filter: brightness(1.3);
  }
  100% {
    transform: translate(-50%, -50%) scale(1.1);
    filter: brightness(1.2);
  }
}

@keyframes gold-glow {
  0%, 100% {
    box-shadow: 
      0 0 20px rgba(245, 158, 11, 0.6),
      0 0 40px rgba(245, 158, 11, 0.3);
  }
  50% {
    box-shadow: 
      0 0 30px rgba(245, 158, 11, 0.8),
      0 0 60px rgba(245, 158, 11, 0.5);
  }
}

@keyframes btn-urgent-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

.emotion-text-enter-active {
  animation: emotion-text-enter 0.5s ease-out forwards;
}

.emotion-text-leave-active {
  animation: emotion-text-leave 0.3s ease-in forwards;
}

@keyframes emotion-text-enter {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.action-button-enter-active {
  animation: action-btn-enter 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
}

.action-button-leave-active {
  animation: action-btn-leave 0.2s ease-in forwards;
}

@keyframes action-btn-enter {
  0% {
    opacity: 0;
    transform: translateX(-50%) scale(0.8) translateY(10px);
  }
  50% {
    transform: translateX(-50%) scale(1.05) translateY(-2px);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) scale(1) translateY(0);
  }
}
</style>