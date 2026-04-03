<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import apiClient from '@/utils/request'

const mapContainer = ref(null)
let chartInstance = null
const loading = ref(true)
const territories = ref([])
const currentLevel = ref('national') // national/province/county
const currentProvince = ref(null)

// 地图配置 - 白金帝王风配色
const mapConfig = {
  national: {
    map: 'china',
    zoom: 1.2,
    center: [104.0, 37.0],
  },
  province: {
    zoom: 2,
  },
  county: {
    zoom: 4,
  },
}

// 初始化地图
onMounted(async () => {
  chartInstance = echarts.init(mapContainer.value)
  
  // 加载中国地图数据
  const chinaMap = await import('echarts/map/china.json')
  echarts.registerMap('china', chinaMap.default)
  
  // 加载领土数据
  await loadTerritories()
  
  // 渲染地图
  renderMap()
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
  
  loading.value = false
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
  }
  window.removeEventListener('resize', handleResize)
})

// 加载领土数据
async function loadTerritories() {
  try {
    const response = await apiClient.get('/territory/list')
    territories.value = response.data || []
  } catch (error) {
    console.error('Failed to load territories:', error)
  }
}

// 渲染地图
function renderMap() {
  const option = {
    geo: {
      map: 'china',
      roam: true,
      zoom: mapConfig.national.zoom,
      center: mapConfig.national.center,
      itemStyle: {
        // 玉脂白底色
        areaColor: 'rgba(245, 230, 211, 0.5)',
        // 鎏金色边框
        borderColor: '#D4AF37',
        borderWidth: 1.5,
        shadowColor: 'rgba(212, 175, 55, 0.3)',
        shadowBlur: 10,
      },
      emphasis: {
        itemStyle: {
          // 悬停时更亮的金色
          areaColor: 'rgba(255, 248, 231, 0.8)',
          borderColor: '#FFD700',
          borderWidth: 2,
        },
        label: {
          show: true,
          color: '#2D2D2D',
          fontSize: 12,
          fontWeight: 'bold',
        },
      },
      label: {
        show: false,
        color: '#8B7355',
        fontSize: 10,
      },
      regions: territories.value.map(t => ({
        name: t.name,
        itemStyle: {
          areaColor: getTerritoryColor(t),
        },
      })),
    },
    series: [
      {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: getTeamLocations(),
        symbolSize: 12,
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke',
          scale: 3,
        },
        itemStyle: {
          // 金色光晕标记点
          color: '#D4AF37',
          shadowColor: '#D4AF37',
          shadowBlur: 10,
        },
        label: {
          show: true,
          formatter: (params) => params.name,
          position: 'right',
          color: '#2D2D2D',
          fontSize: 11,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: [4, 8],
          borderRadius: 4,
        },
      },
      // 添加征服路线效果
      {
        type: 'lines',
        coordinateSystem: 'geo',
        data: getConquestRoutes(),
        polyline: true,
        effect: {
          show: true,
          period: 6,
          trailLength: 0.7,
          color: '#D4AF37',
          symbolSize: 3,
        },
        lineStyle: {
          color: '#D4AF37',
          opacity: 0.4,
          curveness: 0.2,
        },
      },
    ],
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#D4AF37',
      borderWidth: 2,
      textStyle: {
        color: '#2D2D2D',
        fontSize: 13,
      },
      formatter: (params) => {
        if (params.componentType === 'geo') {
          const territory = territories.value.find(t => t.name === params.name)
          if (territory) {
            const teamInfo = territory.team_name || '无主之地'
            const defenseInfo = territory.defense_value || 0
            return `
              <div style="padding: 4px 0; font-weight: bold; border-bottom: 1px solid rgba(212, 175, 55, 0.3); margin-bottom: 6px;">
                ${territory.name}
              </div>
              <div style="padding: 2px 0;">
                <span style="color: #8B7355;">占领战队：</span>
                <span style="color: #2D2D2D; font-weight: 500;">${teamInfo}</span>
              </div>
              <div style="padding: 2px 0;">
                <span style="color: #8B7355;">城防值：</span>
                <span style="color: #D4AF37; font-weight: bold;">${defenseInfo}</span>
              </div>
            `
          }
          return params.name
        }
        return `${params.name}<br/>骑行距离：${params.value[2]} km`
      },
    },
  }
  
  chartInstance.setOption(option)
}

// 获取领土颜色 - 白金帝王风
function getTerritoryColor(territory) {
  if (!territory.team_id) {
    // 无主之地 - 淡灰色带透明
    return 'rgba(139, 115, 85, 0.2)'
  }
  if (territory.is_ally) {
    // 友方 - 淡金色
    return 'rgba(212, 175, 55, 0.4)'
  }
  // 敌方 - 淡古铜色
  return 'rgba(201, 169, 97, 0.3)'
}

// 获取队友位置
function getTeamLocations() {
  return [
    { name: '北京战队', value: [116.4, 39.9, 286.5] },
    { name: '上海战队', value: [121.4, 31.2, 342.8] },
    { name: '广州战队', value: [113.3, 23.1, 298.2] },
    { name: '成都战队', value: [104.1, 30.7, 256.4] },
  ]
}

// 获取征服路线
function getConquestRoutes() {
  return [
    {
      coords: [
        [116.4, 39.9],
        [121.4, 31.2],
      ],
    },
    {
      coords: [
        [121.4, 31.2],
        [113.3, 23.1],
      ],
    },
    {
      coords: [
        [113.3, 23.1],
        [104.1, 30.7],
      ],
    },
  ]
}

// 处理窗口大小变化
function handleResize() {
  chartInstance?.resize()
}

// 点击地图
function onMapClick(params) {
  if (params.componentType === 'geo') {
    // 下钻到省份
    currentProvince.value = params.name
    currentLevel.value = 'province'
    // TODO: 加载省份地图数据
  }
}
</script>

<template>
  <div class="map-container">
    <!-- 头部信息 -->
    <div class="map-header">
      <div class="header-content">
        <h1 class="map-title">全国疆域</h1>
        <p class="map-subtitle">指点江山 · 攻城略地</p>
      </div>
      
      <!-- 统计信息 -->
      <div class="map-stats">
        <div class="stat-item">
          <div class="stat-icon allied-icon">
            <van-icon name="friends-o" size="16" color="#22C55E" />
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ territories.filter(t => t.is_ally).length }}</div>
            <div class="stat-label">我方</div>
          </div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-icon enemy-icon">
            <van-icon name="cluster-o" size="16" color="#EF4444" />
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ territories.filter(t => !t.is_ally && t.team_id).length }}</div>
            <div class="stat-label">敌方</div>
          </div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-icon neutral-icon">
            <van-icon name="location-o" size="16" color="#8B7355" />
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ territories.filter(t => !t.team_id).length }}</div>
            <div class="stat-label">无主</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 地图内容 -->
    <div ref="mapContainer" class="map-content" @click="onMapClick"></div>
    
    <!-- 加载提示 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-card">
        <div class="loading-spinner">
          <van-icon name="loading" size="32" color="#D4AF37" />
        </div>
        <p class="loading-text">正在加载疆域...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ─── 容器 ─── */
.map-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, rgba(245, 230, 211, 0.9) 0%, rgba(255, 248, 231, 0.85) 100%);
  background-image: url('/assets/images/bg-conquest-abstract.jpg');
  background-size: cover;
  background-position: center top;
}

/* ─── 头部 ─── */
.map-header {
  padding: 16px;
  background: rgba(255, 255, 255, 0.9);
  background-image: url('/assets/images/texture-card-subtle.jpg');
  background-size: 400px;
  background-blend-mode: multiply;
  backdrop-filter: blur(10px);
  border-bottom: 2px solid rgba(212, 175, 55, 0.3);
  box-shadow: 0 4px 16px rgba(212, 175, 55, 0.1);
  z-index: 10;
}

.header-content {
  margin-bottom: 12px;
}

.map-title {
  font-size: 20px;
  font-weight: bold;
  color: #2D2D2D;
  margin: 0 0 4px;
  background: linear-gradient(180deg, #D4AF37 0%, #C9A961 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.map-subtitle {
  font-size: 12px;
  color: #8B7355;
  margin: 0;
  font-style: italic;
  letter-spacing: 1px;
}

/* ─── 统计栏 ─── */
.map-stats {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 8px 0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(212, 175, 55, 0.3);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: #2D2D2D;
  line-height: 1;
}

.stat-label {
  font-size: 11px;
  color: #8B7355;
  margin-top: 2px;
}

.stat-divider {
  width: 1px;
  height: 24px;
  background: linear-gradient(180deg, 
    transparent 0%, 
    rgba(212, 175, 55, 0.3) 50%,
    transparent 100%
  );
}

/* ─── 地图内容 ─── */
.map-content {
  flex: 1;
  width: 100%;
  height: 100%;
}

/* ─── 加载覆盖层 ─── */
.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(245, 230, 211, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.loading-card {
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(212, 175, 55, 0.4);
  border-radius: 16px;
  padding: 24px 32px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(212, 175, 55, 0.2);
}

.loading-spinner {
  margin-bottom: 12px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 14px;
  color: #8B7355;
  margin: 0;
}
</style>
