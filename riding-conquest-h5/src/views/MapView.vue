<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import ChinaMap from '@/components/ChinaMap.vue'
import HometownModal from '@/components/HometownModal.vue'
import CycleStatusBar from '@/components/CycleStatusBar.vue'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(true)
const territories = ref([])
const selectedTerritory = ref(null)

// 家乡定位相关
const showHometownModal = ref(false)
const recommendedHometown = ref(null)

const mockTerritories = [
  { id: 1, name: '北京市', team_id: 1, team_name: '骑行者联盟', defense_value: 1200, is_ally: true },
  { id: 2, name: '上海市', team_id: 2, team_name: '魔骑行', defense_value: 800, is_ally: false },
  { id: 3, name: '广东省', team_id: 1, team_name: '骑行者联盟', defense_value: 1500, is_ally: true },
  { id: 4, name: '浙江省', team_id: null, team_name: '无主之地', defense_value: 1000, is_ally: false },
  { id: 5, name: '江苏省', team_id: null, team_name: '无主之地', defense_value: 1000, is_ally: false },
]

const stats = computed(() => ({
  allied: territories.value.filter(t => t.is_ally).length,
  enemy: territories.value.filter(t => t.team_id && !t.is_ally).length,
  neutral: territories.value.filter(t => !t.team_id).length,
}))

onMounted(() => {
  // 初始化用户信息
  userStore.initializeUser()
  
  // 检查是否需要显示家乡定位弹窗（首次访问且未设置家乡）
  if (!userStore.hometownSet) {
    // 获取推荐的家乡（Mock IP 定位）
    recommendedHometown.value = userStore.getMockHometown()
    // 延迟显示弹窗，让用户先看到地图
    setTimeout(() => {
      showHometownModal.value = true
    }, 800)
  }
  
  setTimeout(() => {
    territories.value = mockTerritories
    loading.value = false
  }, 500)
})

// 确认家乡
function handleConfirmHometown(hometown) {
  userStore.setHometown(hometown)
  showHometownModal.value = false
  console.log('家乡已设置:', hometown)
}

// 跳过家乡设置
function handleSkipHometown() {
  showHometownModal.value = false
  console.log('用户跳过家乡设置')
}

// 获取家乡区域代码（用于高亮）
const hometownCode = computed(() => userStore.hometownCode)

function selectTerritory(territory) {
  selectedTerritory.value = territory
}

function getAttackButtonLabel() {
  if (!selectedTerritory.value) return '选择领土'
  if (selectedTerritory.value.is_ally) return '驻防'
  if (selectedTerritory.value.team_id) return '进攻'
  return '征服'
}

function getButtonColor() {
  if (!selectedTerritory.value) return 'secondary'
  if (selectedTerritory.value.is_ally) return 'defend'
  return 'attack'
}
</script>

<template>
  <div class="map-page">
    <!-- 横屏布局 - 三分屏 -->
    <div class="landscape-layout">
      <!-- 左侧：主地图区 -->
      <div class="main-map-section">
        <!-- 周循环状态条 -->
        <CycleStatusBar />
        
        <!-- 顶部状态栏 -->
        <div class="top-bar">
          <h1 class="page-title">疆域</h1>
          <div class="stats-inline" v-if="!loading">
            <div class="stat-badge allied">
              <span class="stat-value">{{ stats.allied }}</span>
              <span class="stat-label">我方</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-badge enemy">
              <span class="stat-value">{{ stats.enemy }}</span>
              <span class="stat-label">敌方</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-badge neutral">
              <span class="stat-value">{{ stats.neutral }}</span>
              <span class="stat-label">无主</span>
            </div>
          </div>
        </div>
        
        <!-- 地图可视化区 -->
        <div class="map-container">
          <!-- 真实中国地图组件 -->
          <ChinaMap 
            :territories="territories"
            :selected-territory="selectedTerritory"
            :hometown="userStore.hometown"
            @territory-click="selectTerritory"
          />
        </div>
      </div>
      
      <!-- 右侧：信息面板 -->
      <div class="info-panel">
        <!-- 领土列表 -->
        <div class="territory-list-section">
          <div class="section-header">
            <h3 class="section-title">领土列表</h3>
            <span class="section-count">{{ territories.length }} 个区域</span>
          </div>
          
          <div class="territory-list">
            <div
              v-for="t in territories"
              :key="t.id"
              class="territory-item"
              :class="{ 
                'allied': t.is_ally, 
                'enemy': t.team_id && !t.is_ally, 
                'neutral': !t.team_id,
                'selected': selectedTerritory?.id === t.id 
              }"
              @click="selectTerritory(t)"
            >
              <div class="item-left">
                <div class="status-indicator" :class="{ allied: t.is_ally, enemy: t.team_id && !t.is_ally, neutral: !t.team_id }">
                  <div class="indicator-dot"></div>
                </div>
                <div class="item-info">
                  <div class="item-name">{{ t.name }}</div>
                  <div class="item-team">{{ t.team_name }}</div>
                </div>
              </div>
              <div class="item-defense">
                <span class="defense-value">{{ t.defense_value }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 详情面板（横屏独占） -->
        <div class="detail-section" v-if="selectedTerritory">
          <div class="section-header">
            <h3 class="section-title">详情</h3>
            <button class="btn-close" @click="selectedTerritory = null">
              <van-icon name="cross" size="16" />
            </button>
          </div>
          
          <div class="detail-card">
            <div class="detail-header">
              <h4 class="detail-name">{{ selectedTerritory.name }}</h4>
              <div class="detail-status" :class="{ allied: selectedTerritory.is_ally, enemy: selectedTerritory.team_id && !selectedTerritory.is_ally, neutral: !selectedTerritory.team_id }">
                {{ selectedTerritory.team_name }}
              </div>
            </div>
            
            <div class="detail-stats">
              <div class="detail-stat">
                <span class="stat-label">城防值</span>
                <span class="stat-value">{{ selectedTerritory.defense_value }}</span>
              </div>
              <div class="detail-stat">
                <span class="stat-label">战略价值</span>
                <div class="stars">
                  <van-icon name="star" size="14" />
                  <van-icon name="star" size="14" />
                  <van-icon name="star" size="14" />
                  <van-icon name="star" size="14" />
                  <van-icon name="star-o" size="14" />
                </div>
              </div>
            </div>
            
            <div class="detail-actions">
              <button class="action-btn" :class="getButtonColor()">
                <van-icon name="play-circle-o" size="18" />
                <span>{{ getAttackButtonLabel() }}</span>
              </button>
              <button class="action-btn secondary">
                <van-icon name="info-o" size="18" />
                <span>详情</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 竖屏布局 - 保持原有单列布局 -->
    <div class="portrait-layout">
      <!-- 周循环状态条 -->
      <CycleStatusBar />
      
      <!-- 页面头部 -->
      <div class="page-header">
        <h1 class="page-title">疆域</h1>
        <p class="page-subtitle">Territory Overview</p>
      </div>

      <!-- 统计信息 -->
      <div v-if="!loading" class="stats-card">
        <div class="stat-item">
          <div class="stat-icon allied-icon">
            <van-icon name="friends-o" size="18" />
          </div>
          <div class="stat-info">
            <div class="stat-value allied font-mono">{{ stats.allied }}</div>
            <div class="stat-label">我方</div>
          </div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-icon enemy-icon">
            <van-icon name="cluster-o" size="18" />
          </div>
          <div class="stat-info">
            <div class="stat-value enemy font-mono">{{ stats.enemy }}</div>
            <div class="stat-label">敌方</div>
          </div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-icon neutral-icon">
            <van-icon name="location-o" size="18" />
          </div>
          <div class="stat-info">
            <div class="stat-value neutral font-mono">{{ stats.neutral }}</div>
            <div class="stat-label">无主</div>
          </div>
        </div>
      </div>

      <!-- 地图入口卡片 -->
      <div class="card map-entry-card" @click="$router.push('/map-fullscreen')">
        <div class="card-body map-entry-body">
          <div class="map-icon-wrapper">
            <div class="map-icon-bg">
              <van-icon name="wap-home-o" size="40" />
            </div>
          </div>
          <div class="map-entry-text">
            <h3>全国疆域图</h3>
            <p>点击查看完整地图</p>
          </div>
          <van-icon name="arrow" size="20" />
        </div>
      </div>
      
      <!-- 家乡信息卡片（如果已设置） -->
      <div v-if="userStore.hometown" class="card hometown-card">
        <div class="card-body hometown-body">
          <div class="hometown-icon">🏠</div>
          <div class="hometown-info">
            <div class="hometown-label">您的家乡</div>
            <div class="hometown-name">
              {{ userStore.hometown.province }} · {{ userStore.hometown.city }}
            </div>
          </div>
          <button class="btn-goto-home" @click.stop="$router.push('/map-fullscreen')">
            <van-icon name="location-o" size="18" />
          </button>
        </div>
      </div>

      <!-- 分割线 -->
      <div class="divider"></div>

      <!-- 领土列表标题 -->
      <div class="section-title">
        <div class="title-left">
          <div class="title-bar"></div>
          <h3>领土列表</h3>
        </div>
        <span class="title-count">{{ territories.length }} 个区域</span>
      </div>

      <!-- 领土列表 -->
      <div class="territory-list-portrait">
        <div
          v-for="t in territories"
          :key="t.id"
          class="territory-card"
          @click="selectTerritory(t)"
        >
          <div class="territory-left">
            <div class="territory-status" :class="{ allied: t.is_ally, enemy: t.team_id && !t.is_ally, neutral: !t.team_id }">
              <div class="status-dot"></div>
            </div>
            <div class="territory-info">
              <div class="territory-name">{{ t.name }}</div>
              <div class="territory-team">{{ t.team_name }}</div>
            </div>
          </div>
          <div class="territory-defense">
            <div class="defense-num">{{ t.defense_value }}</div>
            <div class="defense-label">城防值</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 家乡定位弹窗 -->
    <HometownModal
      :visible="showHometownModal"
      :recommended-hometown="recommendedHometown"
      @confirm="handleConfirmHometown"
      @skip="handleSkipHometown"
      @close="showHometownModal = false"
    />
  </div>
</template>

<style scoped>
/* ─── 页面基础 ─── */
.map-page {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: #070E1B;
}

/* ─── 横屏布局 (Landscape) ─── */
.landscape-layout {
  display: none !important;
}

@media (orientation: landscape) and (min-width: 769px) {
  .landscape-layout {
    display: grid !important;
    grid-template-columns: 2fr 1fr;
    height: 100vh;
    gap: 1px;
    background: rgba(59, 130, 246, 0.1);
  }
}

@media (orientation: landscape) and (min-width: 769px) {
  .landscape-layout {
    display: grid;
    grid-template-columns: 2fr 1fr;
    height: 100vh;
    gap: 1px;
    background: rgba(59, 130, 246, 0.1);
  }
  
  .main-map-section {
    background: #070E1B;
    display: flex;
    flex-direction: column;
  }
  
  .info-panel {
    background: rgba(10, 22, 40, 0.5);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  /* 顶部状态栏 */
  .top-bar {
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(59, 130, 246, 0.2);
  }
  
  .page-title {
    font-size: 28px;
    font-weight: 700;
    color: #F1F5F9;
    margin: 0;
    letter-spacing: 4px;
  }
  
  .stats-inline {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .stat-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  
  .stat-badge .stat-value {
    font-size: 20px;
    font-weight: 700;
  }
  
  .stat-badge.allied .stat-value { color: #22C55E; }
  .stat-badge.enemy .stat-value { color: #EF4444; }
  .stat-badge.neutral .stat-value { color: #94A3B8; }
  
  .stat-badge .stat-label {
    font-size: 11px;
    color: #64748B;
  }
  
  .stat-divider {
    width: 1px;
    height: 24px;
    background: rgba(59, 130, 246, 0.3);
  }
  
  /* 地图容器 */
  .map-container {
    flex: 1;
    position: relative;
    overflow: hidden;
    background: #070E1B;
  }
  
  /* 横屏提示 */
  .landscape-hint {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(26, 39, 64, 0.9);
    border: 1px solid rgba(59, 130, 246, 0.3);
    border-radius: 12px;
    padding: 12px 20px;
    display: none;
  }
  
  .hint-content {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #94A3B8;
    font-size: 13px;
  }
  
  .hint-icon {
    font-size: 18px;
  }
  
  /* 领土列表区 */
  .territory-list-section {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    border-bottom: 1px solid rgba(59, 130, 246, 0.2);
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .section-title {
    font-size: 16px;
    font-weight: 700;
    color: #F1F5F9;
    margin: 0;
  }
  
  .section-count {
    font-size: 12px;
    color: #64748B;
  }
  
  .territory-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    margin-bottom: 8px;
    background: rgba(26, 39, 64, 0.4);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid transparent;
  }
  
  .territory-item:hover {
    background: rgba(26, 39, 64, 0.6);
  }
  
  .territory-item.selected {
    border-color: #3B82F6;
    background: rgba(59, 130, 246, 0.1);
  }
  
  .territory-item.allied { border-left: 3px solid #22C55E; }
  .territory-item.enemy { border-left: 3px solid #EF4444; }
  .territory-item.neutral { border-left: 3px solid #6B7280; }
  
  .item-left {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
  }
  
  .status-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
  
  .indicator-dot {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  
  .status-indicator.allied .indicator-dot { 
    background: #22C55E;
    box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
  }
  .status-indicator.enemy .indicator-dot { 
    background: #EF4444;
    box-shadow: 0 0 8px rgba(239, 68, 68, 0.6);
  }
  .status-indicator.neutral .indicator-dot { 
    background: #6B7280;
  }
  
  .item-info {
    flex: 1;
  }
  
  .item-name {
    font-size: 14px;
    font-weight: 600;
    color: #F1F5F9;
    margin-bottom: 4px;
  }
  
  .item-team {
    font-size: 11px;
    color: #64748B;
  }
  
  .item-defense {
    text-align: right;
  }
  
  .defense-value {
    font-size: 16px;
    font-weight: 700;
    color: #3B82F6;
  }
  
  /* 详情面板 */
  .detail-section {
    height: 300px;
    padding: 16px;
    background: rgba(7, 14, 27, 0.5);
  }
  
  .detail-card {
    background: rgba(26, 39, 64, 0.6);
    border: 1px solid rgba(59, 130, 246, 0.2);
    border-radius: 12px;
    padding: 16px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .detail-name {
    font-size: 18px;
    font-weight: 700;
    color: #F1F5F9;
    margin: 0;
  }
  
  .detail-status {
    font-size: 12px;
    padding: 4px 12px;
    border-radius: 6px;
    font-weight: 600;
  }
  
  .detail-status.allied { 
    background: rgba(34, 197, 94, 0.2);
    color: #22C55E;
  }
  .detail-status.enemy { 
    background: rgba(239, 68, 68, 0.2);
    color: #EF4444;
  }
  .detail-status.neutral { 
    background: rgba(107, 114, 128, 0.2);
    color: #94A3B8;
  }
  
  .detail-stats {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: auto;
  }
  
  .detail-stat {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .detail-stat .stat-label {
    font-size: 12px;
    color: #94A3B8;
  }
  
  .detail-stat .stat-value {
    font-size: 20px;
    font-weight: 700;
    color: #3B82F6;
  }
  
  .stars {
    display: flex;
    gap: 2px;
    color: #F59E0B;
  }
  
  .detail-actions {
    display: flex;
    gap: 8px;
    margin-top: 16px;
  }
  
  .action-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 12px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    color: #fff;
  }
  
  .action-btn.attack {
    background: linear-gradient(135deg, #EF4444, #DC2626);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }
  
  .action-btn.defend {
    background: linear-gradient(135deg, #22C55E, #16A34A);
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
  }
  
  .action-btn.secondary {
    background: transparent;
    border: 1px solid rgba(59, 130, 246, 0.3);
    color: #F1F5F9;
  }
  
  .btn-close {
    background: transparent;
    border: none;
    color: #94A3B8;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .btn-close:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

/* ─── 竖屏布局 (Portrait) ─── */
.portrait-layout {
  height: 100%;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 80px;
}

/* 横屏模式隐藏竖屏布局 */
@media (orientation: landscape) and (min-width: 769px) {
  .portrait-layout {
    display: none !important;
  }
}

.page-header {
  text-align: center;
  margin-bottom: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #F1F5F9;
  margin: 0 0 6px;
  letter-spacing: 2px;
}

.page-subtitle {
  font-size: 12px;
  color: #94A3B8;
  margin: 0;
  text-transform: uppercase;
}

.stats-card {
  background: rgba(26, 39, 64, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 16px;
  margin-bottom: 16px;
  backdrop-filter: blur(10px);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(59, 130, 246, 0.15);
  border: 2px solid rgba(59, 130, 246, 0.3);
}

.stat-icon.allied-icon { background: rgba(34, 197, 94, 0.15); border-color: rgba(34, 197, 94, 0.3); }
.stat-icon.enemy-icon { background: rgba(239, 68, 68, 0.15); border-color: rgba(239, 68, 68, 0.3); }
.stat-icon.neutral-icon { background: rgba(107, 114, 128, 0.15); border-color: rgba(107, 114, 128, 0.3); }

.stat-info { display: flex; flex-direction: column; }

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #F1F5F9;
  line-height: 1;
}

.stat-value.allied { color: #22C55E; }
.stat-value.enemy { color: #EF4444; }
.stat-value.neutral { color: #94A3B8; }

.stat-label {
  font-size: 11px;
  color: #94A3B8;
  margin-top: 2px;
}

.stat-divider {
  width: 1px;
  height: 28px;
  background: linear-gradient(180deg, transparent 0%, rgba(59, 130, 246, 0.3) 50%, transparent 100%);
}

.card {
  background: rgba(26, 39, 64, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  margin-bottom: 16px;
  cursor: pointer;
  backdrop-filter: blur(10px);
}

.card-body { padding: 16px; }

.map-entry-body {
  display: flex;
  align-items: center;
  gap: 16px;
}

.map-icon-wrapper { flex-shrink: 0; }

.map-icon-bg {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.3) 100%);
  border: 3px solid rgba(59, 130, 246, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-icon-bg svg { stroke: #3B82F6; }

.map-entry-text { flex: 1; }

.map-entry-text h3 {
  font-size: 16px;
  font-weight: 600;
  color: #F1F5F9;
  margin: 0 0 4px;
}

.map-entry-text p {
  font-size: 12px;
  color: #94A3B8;
  margin: 0;
}

.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.3) 20%, rgba(59, 130, 246, 0.5) 50%, transparent 100%);
  margin: 20px 0;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.title-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-bar {
  width: 4px;
  height: 16px;
  background: #3B82F6;
  border-radius: 2px;
}

.title-left h3 {
  font-size: 16px;
  font-weight: 600;
  color: #F1F5F9;
  margin: 0;
}

.title-count {
  font-size: 12px;
  color: #94A3B8;
}

.territory-list-portrait {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.territory-card {
  background: rgba(26, 39, 64, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.territory-card.allied { border-left: 4px solid #22C55E; }
.territory-card.enemy { border-left: 4px solid #EF4444; }
.territory-card.neutral { border-left: 4px solid #6B7280; }

.territory-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.territory-status {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.status-dot {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.territory-status.allied .status-dot { background: #22C55E; box-shadow: 0 0 8px rgba(34, 197, 94, 0.6); }
.territory-status.enemy .status-dot { background: #EF4444; box-shadow: 0 0 8px rgba(239, 68, 68, 0.6); }
.territory-status.neutral .status-dot { background: #6B7280; }

.territory-info { flex: 1; }

.territory-name {
  font-size: 15px;
  font-weight: 600;
  color: #F1F5F9;
  margin-bottom: 4px;
}

.territory-team {
  font-size: 12px;
  color: #94A3B8;
}

.territory-defense { text-align: right; }

.defense-num {
  font-size: 18px;
  font-weight: 700;
  color: #3B82F6;
}

.defense-label {
  font-size: 11px;
  color: #94A3B8;
}

/* 家乡卡片 */
.hometown-card {
  background: linear-gradient(135deg, rgba(245, 230, 211, 0.95) 0%, rgba(255, 248, 231, 0.9) 100%);
  border: 2px solid rgba(212, 175, 55, 0.4);
}

.hometown-body {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hometown-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.hometown-info {
  flex: 1;
}

.hometown-label {
  font-size: 11px;
  color: #8B7355;
  margin-bottom: 4px;
}

.hometown-name {
  font-size: 15px;
  font-weight: 700;
  color: #D4AF37;
}

.btn-goto-home {
  background: linear-gradient(135deg, #D4AF37 0%, #C9A961 100%);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.btn-goto-home:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(212, 175, 55, 0.4);
}
</style>
