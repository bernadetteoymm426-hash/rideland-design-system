<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  badges: {
    type: Object,
    default: () => ({
      team: null,
      battle: 'breathing',
      report: 3,
      ranking: 'dot'
    })
  },
  activeButton: {
    type: String,
    default: null
  },
  disabledButtons: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['team-click', 'battle-click', 'report-click', 'ranking-click'])

const buttons = [
  { 
    id: 'team', 
    label: '战队', 
    icon: 'team',
    event: 'team-click'
  },
  { 
    id: 'battle', 
    label: '作战', 
    icon: 'battle',
    event: 'battle-click'
  },
  { 
    id: 'report', 
    label: '战报', 
    icon: 'report',
    event: 'report-click'
  },
  { 
    id: 'ranking', 
    label: '排行', 
    icon: 'ranking',
    event: 'ranking-click'
  }
]

const particles = ref([])
const clickedButton = ref(null)
let particleId = 0

function getButtonState(buttonId) {
  if (props.disabledButtons.includes(buttonId)) return 'disabled'
  if (props.activeButton === buttonId) return 'active'
  return 'default'
}

function getBadgeType(buttonId) {
  return props.badges?.[buttonId] || null
}

function createParticles(event, buttonId) {
  const rect = event.currentTarget.getBoundingClientRect()
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  
  const newParticles = []
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2
    const distance = 40 + Math.random() * 20
    newParticles.push({
      id: particleId++,
      x: centerX,
      y: centerY,
      tx: Math.cos(angle) * distance,
      ty: Math.sin(angle) * distance
    })
  }
  
  particles.value = [...particles.value, ...newParticles]
  
  setTimeout(() => {
    particles.value = particles.value.filter(p => !newParticles.find(np => np.id === p.id))
  }, 600)
}

function handleClick(event, button) {
  if (props.disabledButtons.includes(button.id)) return
  
  clickedButton.value = button.id
  createParticles(event, button.id)
  
  setTimeout(() => {
    clickedButton.value = null
    emit(button.event)
  }, 150)
}

function handleAnimationEnd(particleId) {
  particles.value = particles.value.filter(p => p.id !== particleId)
}
</script>

<template>
  <div class="game-bottom-bar">
    <div class="function-buttons">
      <button
        v-for="button in buttons"
        :key="button.id"
        class="game-button"
        :class="[`btn-${getButtonState(button.id)}`, { 'btn-clicking': clickedButton === button.id }]"
        @click="(e) => handleClick(e, button)"
        :disabled="disabledButtons.includes(button.id)"
      >
        <div class="button-icon">
          <svg v-if="button.icon === 'team'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <svg v-else-if="button.icon === 'battle'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14.5 17.5L3 6V3h3l11.5 11.5"/>
            <path d="M13 19l6-6"/>
            <path d="M16 16l4 4"/>
            <path d="M19 21l2-2"/>
          </svg>
          <svg v-else-if="button.icon === 'report'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          <svg v-else-if="button.icon === 'ranking'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="8" y1="6" x2="21" y2="6"/>
            <line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/>
            <line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
        </div>
        <span class="button-label">{{ button.label }}</span>
        
        <div class="badge-container">
          <span 
            v-if="getBadgeType(button.id) === 'dot'" 
            class="badge-dot"
          ></span>
          <span 
            v-else-if="getBadgeType(button.id) === 'breathing'" 
            class="badge-breathing"
          ></span>
          <span 
            v-else-if="typeof getBadgeType(button.id) === 'number'" 
            class="badge-number"
          >{{ getBadgeType(button.id) }}</span>
        </div>
        
        <div class="particle-container">
          <span
            v-for="particle in particles.filter(p => p.buttonId === button.id)"
            :key="particle.id"
            class="particle"
            :style="{
              '--tx': particle.tx + 'px',
              '--ty': particle.ty + 'px',
              left: particle.x + 'px',
              top: particle.y + 'px'
            }"
            @animationend="handleAnimationEnd(particle.id)"
          ></span>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.game-bottom-bar {
  height: 100px;
  background: linear-gradient(180deg, 
    rgba(10, 22, 40, 0.95) 0%, 
    rgba(7, 14, 27, 0.98) 100%
  );
  border-top: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 32px;
}

.function-buttons {
  display: flex;
  gap: 16px;
}

.game-button {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  min-width: 100px;
  border-radius: 12px;
  cursor: pointer;
  overflow: visible;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid;
}

.btn-default {
  background: rgba(26, 39, 64, 0.6);
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 
    0 0 0 rgba(59, 130, 246, 0),
    inset 0 0 20px rgba(59, 130, 246, 0.05);
}

.btn-default:hover {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.5);
  transform: translateY(-2px);
  box-shadow: 
    0 8px 24px rgba(59, 130, 246, 0.3),
    0 0 30px rgba(59, 130, 246, 0.2),
    inset 0 0 30px rgba(59, 130, 246, 0.1);
}

.btn-default:active,
.btn-clicking {
  transform: translateY(1px) scale(0.98);
  box-shadow: 
    0 2px 8px rgba(59, 130, 246, 0.2),
    inset 0 2px 8px rgba(0, 0, 0, 0.2);
}

.btn-active {
  background: rgba(59, 130, 246, 0.25);
  border-color: rgba(59, 130, 246, 0.6);
  box-shadow: 
    0 0 30px rgba(59, 130, 246, 0.4),
    0 0 60px rgba(59, 130, 246, 0.2),
    inset 0 0 40px rgba(59, 130, 246, 0.15);
  animation: btn-active-pulse 2s ease-in-out infinite;
}

.btn-active:hover {
  transform: translateY(-2px);
}

@keyframes btn-active-pulse {
  0%, 100% {
    box-shadow: 
      0 0 30px rgba(59, 130, 246, 0.4),
      0 0 60px rgba(59, 130, 246, 0.2);
  }
  50% {
    box-shadow: 
      0 0 40px rgba(59, 130, 246, 0.6),
      0 0 80px rgba(59, 130, 246, 0.3);
  }
}

.btn-disabled {
  background: rgba(26, 39, 64, 0.3);
  border-color: rgba(107, 114, 128, 0.2);
  cursor: not-allowed;
  opacity: 0.5;
  filter: grayscale(0.5);
}

.btn-disabled:hover {
  transform: none;
  box-shadow: none;
}

.button-icon {
  width: 32px;
  height: 32px;
  color: #3B82F6;
  transition: all 0.3s ease;
}

.btn-active .button-icon {
  color: #60A5FA;
  filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.6));
}

.btn-disabled .button-icon {
  color: #6B7280;
}

.button-icon svg {
  width: 100%;
  height: 100%;
}

.button-label {
  font-size: 13px;
  font-weight: 600;
  color: #F1F5F9;
  letter-spacing: 1px;
}

.btn-disabled .button-label {
  color: #6B7280;
}

.badge-container {
  position: absolute;
  top: 6px;
  right: 6px;
  z-index: 10;
}

.badge-dot {
  display: block;
  width: 8px;
  height: 8px;
  background: #EF4444;
  border-radius: 50%;
  border: 2px solid #0A1628;
}

.badge-breathing {
  display: block;
  width: 10px;
  height: 10px;
  background: #EF4444;
  border-radius: 50%;
  border: 2px solid #0A1628;
  animation: badge-breathe 1.5s ease-in-out infinite;
}

@keyframes badge-breathe {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 0 6px rgba(239, 68, 68, 0);
  }
}

.badge-number {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
  border-radius: 9px;
  font-size: 11px;
  font-weight: 600;
  color: #FFFFFF;
  border: 2px solid #0A1628;
  animation: badge-pop 0.3s ease-out;
}

@keyframes badge-pop {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.particle-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  border-radius: 12px;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #3B82F6;
  border-radius: 50%;
  animation: particle-burst 0.6s ease-out forwards;
  box-shadow: 0 0 6px rgba(59, 130, 246, 0.8);
}

@keyframes particle-burst {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  100% {
    transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1);
    opacity: 0;
  }
}
</style>