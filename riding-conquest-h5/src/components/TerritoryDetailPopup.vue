/**
 * 领土详情弹窗组件
 * 显示区域归属、城防值、攻防进度等信息
 */

<script setup>
import { computed } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  territory: {
    type: Object,
    default: null
  },
  position: {
    type: Object,
    default: () => ({ x: 0, y: 0 })
  }
})

const emit = defineEmits(['close'])

// 计算领土状态
const statusInfo = computed(() => {
  if (!props.territory) return { text: '未知', color: '#94A3B8' }
  
  if (props.territory.is_ally) {
    return { text: '我方领土', color: '#10B981' }
  } else if (props.territory.team_id) {
    return { text: '敌方领土', color: '#EF4444' }
  } else {
    return { text: '无主之地', color: '#6B7280' }
  }
})

// 计算攻防进度（示例：假设当前正在攻打）
const attackProgress = computed(() => {
  if (!props.territory) return 0
  // 这里后续对接真实数据
  return props.territory.attack_progress || 0
})

// 关闭弹窗
const handleClose = () => {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="territory-popup-overlay" @click="handleClose">
        <div 
          class="territory-popup" 
          :style="{ left: position.x + 'px', top: position.y + 'px' }"
          @click.stop
        >
          <!-- 关闭按钮 -->
          <button class="close-btn" @click="handleClose">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          
          <!-- 区域名称 -->
          <div class="popup-header">
            <h3 class="territory-name">{{ territory?.name || '未知区域' }}</h3>
            <span class="territory-code">{{ territory?.code }}</span>
          </div>
          
          <!-- 状态标签 -->
          <div class="status-badge" :style="{ backgroundColor: statusInfo.color + '20', color: statusInfo.color }">
            <span class="status-dot" :style="{ backgroundColor: statusInfo.color }"></span>
            {{ statusInfo.text }}
          </div>
          
          <!-- 详细信息 -->
          <div class="popup-content">
            <!-- 归属战队 -->
            <div class="info-row">
              <span class="info-label">归属战队</span>
              <span class="info-value">
                {{ territory?.team_name || (territory?.is_ally ? '本战队' : '无') }}
              </span>
            </div>
            
            <!-- 城防值 -->
            <div class="info-row">
              <span class="info-label">城防值</span>
              <span class="info-value" :class="{ 'low-defense': (territory?.defense_value || 0) < 50 }">
                {{ territory?.defense_value || 0 }}
              </span>
            </div>
            
            <!-- 攻防进度 -->
            <div class="info-row">
              <span class="info-label">攻防进度</span>
              <div class="progress-container">
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ 
                      width: attackProgress + '%',
                      backgroundColor: territory?.is_ally ? '#10B981' : '#EF4444'
                    }"
                  ></div>
                </div>
                <span class="progress-text">{{ attackProgress }}%</span>
              </div>
            </div>
            
            <!-- 本周贡献 -->
            <div class="info-row" v-if="territory?.weekly_contribution">
              <span class="info-label">本周贡献</span>
              <span class="info-value highlight">{{ territory?.weekly_contribution }} km</span>
            </div>
          </div>
          
          <!-- 操作按钮 -->
          <div class="popup-actions" v-if="territory?.is_ally">
            <button class="action-btn primary">
              查看战况
            </button>
            <button class="action-btn">
              增援
            </button>
          </div>
          
          <div class="popup-actions" v-else-if="!territory?.team_id">
            <button class="action-btn primary">
              宣战
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* 遮罩层 */
.territory-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}

/* 弹窗主体 */
.territory-popup {
  position: absolute;
  width: 320px;
  background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(59, 130, 246, 0.2);
  color: #F1F5F9;
  backdrop-filter: blur(12px);
}

/* 关闭按钮 */
.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 6px;
  color: #94A3B8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #F1F5F9;
}

/* 头部 */
.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-right: 30px;
}

.territory-name {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: #F1F5F9;
}

.territory-code {
  font-size: 12px;
  color: #64748B;
  font-family: monospace;
}

/* 状态标签 */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 20px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 内容区 */
.popup-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-size: 14px;
  color: #94A3B8;
}

.info-value {
  font-size: 16px;
  font-weight: 600;
  color: #F1F5F9;
}

.info-value.low-defense {
  color: '#EF4444';
}

.info-value.highlight {
  color: #3B82F6;
}

/* 进度条 */
.progress-container {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 13px;
  font-weight: 600;
  color: #F1F5F9;
  min-width: 40px;
  text-align: right;
}

/* 操作按钮 */
.popup-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  flex: 1;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #F1F5F9;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.action-btn.primary {
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
  border-color: transparent;
}

.action-btn.primary:hover {
  background: linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%);
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
