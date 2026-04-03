<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const mapContainer = ref(null)
const loadStatus = ref('loading')
const errorMessage = ref('')
const mapInfo = ref({})

const initMap = async () => {
  try {
    loadStatus.value = 'loading'
    
    const response = await fetch('/china.json')
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    const geoJson = await response.json()
    console.log('GeoJSON loaded:', geoJson.features?.length, 'features')
    
    echarts.registerMap('china', geoJson)
    const chart = echarts.init(mapContainer.value)
    
    mapInfo.value = {
      totalFeatures: geoJson.features?.length || 0,
      provinceCount: new Set(geoJson.features?.map(f => f.properties?.adcode?.toString().substring(0, 2)) || []).size,
      sampleName: geoJson.features?.[0]?.properties?.name
    }
    
    chart.setOption({
      backgroundColor: '#070E1B',
      geo: {
        map: 'china',
        roam: true,
        zoom: 1.2,
        center: [104.0, 36.0],
        label: { show: false },
        itemStyle: {
          areaColor: '#0A1628',
          borderColor: '#3B82F6',
          borderWidth: 1
        },
        emphasis: {
          itemStyle: { areaColor: '#1A2740' }
        }
      }
    })
    
    loadStatus.value = 'success'
    window.addEventListener('resize', () => chart.resize())
  } catch (error) {
    console.error('地图加载失败:', error)
    loadStatus.value = 'error'
    errorMessage.value = error.message
  }
}

onMounted(() => {
  initMap()
})
</script>

<template>
  <div class="simple-map-test">
    <div class="status-bar">
      <span v-if="loadStatus === 'loading'" class="status loading">🔄 加载中...</span>
      <span v-else-if="loadStatus === 'success'" class="status success">✅ 加载成功</span>
      <span v-else-if="loadStatus === 'error'" class="status error">❌ 加载失败</span>
      
      <div v-if="loadStatus === 'success'" class="map-info">
        <span>📊 县区数量：{{ mapInfo.totalFeatures }}</span>
        <span>🗺️ 省份数量：{{ mapInfo.provinceCount }}</span>
        <span>📍 示例：{{ mapInfo.sampleName }}</span>
      </div>
    </div>
    
    <div v-if="loadStatus === 'error'" class="error-box">
      <h4>错误信息</h4>
      <p>{{ errorMessage }}</p>
      <button @click="initMap" class="retry-btn">重试</button>
    </div>
    
    <div ref="mapContainer" class="map-container"></div>
    
    <div class="instructions">
      <h4>操作说明</h4>
      <ul>
        <li>滚轮缩放地图</li>
        <li>拖拽平移地图</li>
        <li>双击快速聚焦</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.simple-map-test {
  padding: 20px;
  background: #070E1B;
  min-height: 100vh;
  color: #F1F5F9;
}

.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px 15px;
  background: rgba(26, 39, 64, 0.6);
  border-radius: 8px;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.status { font-weight: 600; font-size: 14px; }
.status.loading { color: #F59E0B; }
.status.success { color: #22C55E; }
.status.error { color: #EF4444; }

.map-info {
  display: flex;
  gap: 20px;
  font-size: 13px;
  color: #94A3B8;
}

.error-box {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}

.error-box h4 { margin: 0 0 10px 0; color: #EF4444; }
.error-box p { margin: 0 0 10px 0; font-family: monospace; color: #F1F5F9; }

.retry-btn {
  padding: 8px 16px;
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.4);
  border-radius: 6px;
  color: #F1F5F9;
  cursor: pointer;
}

.map-container {
  width: 100%;
  height: 70vh;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(59, 130, 246, 0.3);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
}

.instructions {
  margin-top: 20px;
  padding: 15px;
  background: rgba(26, 39, 64, 0.6);
  border-radius: 8px;
}

.instructions h4 { margin: 0 0 10px 0; color: #3B82F6; }
.instructions ul { margin: 0; padding-left: 20px; color: #94A3B8; }
.instructions li { margin: 5px 0; }
</style>
