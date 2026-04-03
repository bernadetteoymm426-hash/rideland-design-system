<script setup>
import { useRoute, useRouter } from 'vue-router'
import HomeIcon from '@/components/icons/HomeIcon.vue'
import MapIcon from '@/components/icons/MapIcon.vue'
import RideIcon from '@/components/icons/RideIcon.vue'
import TeamIcon from '@/components/icons/TeamIcon.vue'
import RankIcon from '@/components/icons/RankIcon.vue'

const route = useRoute()
const router = useRouter()

const menuItems = [
  { path: '/', name: 'home', label: '首页', icon: 'home', component: HomeIcon },
  { path: '/map', name: 'map', label: '疆域', icon: 'map', component: MapIcon },
  { path: '/ride', name: 'ride', label: '骑行', icon: 'ride', component: RideIcon },
  { path: '/team', name: 'team', label: '战队', icon: 'team', component: TeamIcon },
  { path: '/rank', name: 'rank', label: '排行', icon: 'rank', component: RankIcon },
]

function isActive(path) {
  return route.path === path
}

function navigate(path) {
  router.push(path)
}
</script>

<template>
  <div class="bottom-nav">
    <div 
      v-for="item in menuItems" 
      :key="item.path"
      class="nav-item"
      :class="{ active: isActive(item.path) }"
      @click="navigate(item.path)"
    >
      <div class="nav-icon-wrapper">
        <div class="nav-icon-bg">
          <component :is="item.component" class="nav-icon" />
        </div>
      </div>
      <span class="nav-label">{{ item.label }}</span>
    </div>
  </div>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: linear-gradient(180deg, 
    rgba(10, 22, 40, 0.95) 0%, 
    rgba(7, 14, 27, 0.98) 100%
  );
  backdrop-filter: blur(20px);
  padding: 8px 0;
  padding-bottom: calc(8px + env(safe-area-inset-bottom));
  border-top: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.4),
              0 -2px 8px rgba(59, 130, 246, 0.1);
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.nav-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-icon-bg {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle, 
    rgba(59, 130, 246, 0.1) 0%, 
    rgba(59, 130, 246, 0.05) 50%,
    transparent 100%
  );
  border-radius: 50%;
  border: 2px solid rgba(59, 130, 246, 0.15);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2),
              inset 0 1px 0 rgba(59, 130, 246, 0.1);
  transition: all 0.3s ease;
}

.nav-item.active .nav-icon-bg {
  background: radial-gradient(circle, 
    rgba(59, 130, 246, 0.2) 0%, 
    rgba(59, 130, 246, 0.1) 50%,
    transparent 100%
  );
  border-color: rgba(59, 130, 246, 0.4);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3),
              inset 0 1px 0 rgba(59, 130, 246, 0.15);
}

.nav-icon {
  width: 28px;
  height: 28px;
  stroke: #64748B;
  stroke-width: 2;
  fill: none;
  opacity: 0.6;
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.nav-item.active .nav-icon {
  stroke: #3B82F6;
  stroke-width: 2.2;
  opacity: 1;
  filter: drop-shadow(0 0 12px rgba(59, 130, 246, 0.6));
}

.nav-item:hover .nav-icon {
  stroke: #94A3B8;
  opacity: 0.8;
}

.nav-label {
  font-size: 10px;
  color: #64748B;
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.nav-item.active .nav-label {
  color: #3B82F6;
  font-weight: 600;
  text-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
}

/* 激活状态指示器 */
.nav-item.active::before {
  content: '';
  position: absolute;
  top: 0px;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    #3B82F6 20%,
    #60A5FA 50%,
    #3B82F6 80%,
    transparent 100%
  );
  border-radius: 2px;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
}

/* 悬停效果 */
.nav-item:hover .nav-icon-bg {
  transform: translateY(-2px);
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.2),
              inset 0 1px 0 rgba(59, 130, 246, 0.1);
}

.nav-item:hover .nav-icon {
  opacity: 0.7;
}

.nav-item:hover .nav-label {
  color: #94A3B8;
}

/* 点击反馈 */
.nav-item:active {
  transform: scale(0.95);
}

.nav-item:active .nav-icon-bg {
  transform: translateY(0);
}
</style>
