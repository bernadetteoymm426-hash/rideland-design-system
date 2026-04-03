<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
  variant?: 'default' | 'scroll' | 'medal'
  gradient?: boolean
}

defineProps<Props>()
</script>

<template>
  <div 
    class="guofeng-card relative overflow-hidden"
    :class="{
      'scroll-style': variant === 'scroll',
      'medal-style': variant === 'medal',
    }"
  >
    <!-- 四角装饰 -->
    <div class="corner-decoration top-left"></div>
    <div class="corner-decoration top-right"></div>
    <div class="corner-decoration bottom-left"></div>
    <div class="corner-decoration bottom-right"></div>
    
    <!-- 标题栏 -->
    <div v-if="title || subtitle" class="card-header flex-between px-4 py-3 border-b-guofeng-light">
      <div class="flex items-center gap-2">
        <div class="w-1 h-4 bg-gold rounded-full"></div>
        <h3 class="text-title-md">{{ title }}</h3>
      </div>
      <span v-if="subtitle" class="text-body-sm">{{ subtitle }}</span>
    </div>
    
    <!-- 内容区 -->
    <div class="card-content p-4">
      <slot></slot>
    </div>
    
    <!-- 底部装饰线 -->
    <div class="cloud-divider h-8 w-full opacity-30"></div>
  </div>
</template>

<style scoped>
.guofeng-card {
  background: linear-gradient(180deg, rgba(27, 38, 59, 0.95) 0%, rgba(13, 27, 42, 0.98) 100%);
  border: 2px solid #D4AF37;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.4), 0 0 20px rgba(212,175,55,0.15);
}

.border-b-guofeng-light {
  border-bottom: 1px solid rgba(212, 175, 55, 0.3);
}

/* 四角装饰 */
.corner-decoration {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid #D4AF37;
  pointer-events: none;
}

.corner-decoration.top-left {
  top: 6px;
  left: 6px;
  border-right: none;
  border-bottom: none;
  border-radius: 4px 0 0 0;
}

.corner-decoration.top-right {
  top: 6px;
  right: 6px;
  border-left: none;
  border-bottom: none;
  border-radius: 0 4px 0 0;
}

.corner-decoration.bottom-left {
  bottom: 6px;
  left: 6px;
  border-right: none;
  border-top: none;
  border-radius: 0 0 0 4px;
}

.corner-decoration.bottom-right {
  bottom: 6px;
  right: 6px;
  border-left: none;
  border-top: none;
  border-radius: 0 0 4px 0;
}

/* 卷轴样式 */
.scroll-style {
  background: linear-gradient(180deg, #F5F5DC 0%, #E8E8C8 100%);
  border-color: #B8941F;
}

.scroll-style .card-header {
  background: rgba(212, 175, 55, 0.2);
}

.scroll-style .text-title-md {
  color: #2C2C2C;
}

/* 勋章样式 */
.medal-style {
  background: linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(184,148,31,0.3) 100%);
  border-color: #D4AF37;
}

/* 云纹分隔线 */
.cloud-divider {
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10 Q20 5, 30 10 T50 10 T70 10 T90 10' stroke='%23D4AF37' fill='none' opacity='0.5'/%3E%3C/svg%3E");
  background-repeat: repeat-x;
  background-position: center;
}
</style>
