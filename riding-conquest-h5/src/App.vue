<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BottomNav from '@/components/BottomNav.vue'

const route = useRoute()
const showNav = computed(() => route.name !== 'login')
</script>

<template>
  <div id="app">
    <router-view />
    <BottomNav v-if="showNav" />
  </div>
</template>

<style>
/* ════════════════════════════════════════════════════════
   全局设置 - 系统字体优先，避免加载闪烁
   ════════════════════════════════════════════════════════ */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 科技地理深色主题 - 卫星夜景图 + 战略指挥屏风格 */
html, body, #app {
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* 深色背景 */
  background-color: #070E1B;
  overflow-x: hidden;
  min-height: 100vh;
}

#app > div {
  max-width: 100%;
  margin: 0;
}

/* 数字用等宽字体防止跳动 */
.num,
.data-num,
.stat-num,
.stat-value,
.rank-num,
.rank-val,
[class*="num-"],
[class*="number-"],
.data-num .unit,
.ride-distance,
.territory-defense .num {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "PingFang SC", sans-serif !important;
  font-weight: 700 !important;
  letter-spacing: 0.5px !important;
  font-variant-numeric: tabular-nums;
}

/* ════════════════════════════════════════════════════════
   Vant 组件覆盖 - 科技地理深色主题
   ════════════════════════════════════════════════════════ */
:root {
  --van-primary-color: #3B82F6;
  --van-text-color: #F1F5F9;
  --van-text-color-secondary: #94A3B8;
  --van-background-color: transparent;
  --van-cell-background-color: transparent;
}

:deep(.van-button--primary) {
  background: #3B82F6 !important;
  border-color: #2563EB !important;
  color: #FFFFFF !important;
}

:deep(.van-tag--primary) {
  background: rgba(59, 130, 246, 0.15) !important;
  color: #3B82F6 !important;
  border-color: rgba(59, 130, 246, 0.3) !important;
}

:deep(.van-cell),
:deep(.van-cell__title),
:deep(.van-cell__value),
:deep(.van-card),
:deep(.van-card__title),
:deep(.van-card__desc) {
  color: #F1F5F9 !important;
}

:deep(.van-icon) {
  font-family: "vant-icon" !important;
}
</style>
