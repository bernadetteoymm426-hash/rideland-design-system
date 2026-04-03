<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium',
})

const emit = defineEmits<{
  click: []
}>()

const handleClick = () => {
  if (!props.disabled && !props.loading) {
    emit('click')
  }
}
</script>

<template>
  <button
    class="guofeng-btn flex-center gap-2 transition-all duration-200"
    :class="[
      `btn-${variant}`,
      `btn-${size}`,
      { 'btn-disabled': disabled || loading },
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="loading-spinner"></span>
    <van-icon v-else-if="icon" :name="icon" />
    <slot></slot>
  </button>
</template>

<style scoped>
.guofeng-btn {
  font-family: "Noto Serif SC", "KaiTi", serif;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

/* 主按钮 - 金色渐变 */
.btn-primary {
  background: linear-gradient(135deg, #D4AF37 0%, #B8941F 100%);
  color: #2C2C2C;
  border: 1px solid #B8941F;
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
}

.btn-primary:hover:not(.btn-disabled) {
  background: linear-gradient(135deg, #E8C547 0%, #C9A82A 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);
}

/* 次按钮 - 透明背景金色边框 */
.btn-secondary {
  background: transparent;
  color: #D4AF37;
  border: 1px solid #D4AF37;
}

.btn-secondary:hover:not(.btn-disabled) {
  background: rgba(212, 175, 55, 0.15);
  transform: translateY(-1px);
}

/* 危险按钮 - 朱红色 */
.btn-danger {
  background: linear-gradient(135deg, #C41E3A 0%, #A01830 100%);
  color: #FFFFFF;
  border: 1px solid #A01830;
  box-shadow: 0 2px 8px rgba(196, 30, 58, 0.3);
}

.btn-danger:hover:not(.btn-disabled) {
  background: linear-gradient(135deg, #E03A52 0%, #C41E3A 100%);
  transform: translateY(-1px);
}

/* 尺寸 */
.btn-small {
  padding: 6px 16px;
  font-size: 12px;
  border-radius: 6px;
  min-height: 32px;
}

.btn-medium {
  padding: 10px 24px;
  font-size: 14px;
  border-radius: 8px;
  min-height: 44px;
}

.btn-large {
  padding: 14px 32px;
  font-size: 16px;
  border-radius: 10px;
  min-height: 52px;
}

/* 禁用状态 */
.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

/* 加载动画 */
.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 点击效果 */
.guofeng-btn:active:not(.btn-disabled) {
  transform: translateY(1px);
}
</style>
