<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

interface Props {
  visible: boolean
  selectedHeadquarters?: {
    district: string
    code: string
  } | null
}

const props = withDefaults(defineProps<Props>(), {
  selectedHeadquarters: null
})

const emit = defineEmits<{
  confirm: [headquarters: { district: string; code: string }]
  close: []
}>()

// 地图容器
const mapContainer = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

// 地图数据
const chinaGeoJson = ref<any>(null)
const isLoading = ref(true)

// 当前视图级别：'country' | 'province'
const currentLevel = ref<'country' | 'province'>('country')
const currentProvince = ref<string | null>(null)

// 已选择的区域
const selectedCode = ref<string>('')
const selectedName = ref<string>('')

// 省份中心点（用于聚焦）
const provinceCenters: Record<string, [number, number]> = {
  '110000': [116.4074, 39.9042], // 北京
  '310000': [121.4737, 31.2304], // 上海
  '440000': [113.2644, 23.1291], // 广东
  '330000': [120.1551, 30.2741], // 浙江
  '320000': [118.7969, 32.0603], // 江苏
  '370000': [117.0009, 36.6758], // 山东
}

// 加载地图数据
onMounted(async () => {
  if (props.visible) {
    await loadMapData()
    initChart()
  }
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})

// 监听 visible 变化
const stopWatch = computed(() => props.visible)
if (stopWatch.value && !chartInstance) {
  loadMapData().then(() => initChart())
}

async function loadMapData() {
  try {
    isLoading.value = true
    const response = await fetch('/geojson/china.json')
    chinaGeoJson.value = await response.json()
    isLoading.value = false
  } catch (error) {
    console.error('加载地图数据失败:', error)
    isLoading.value = false
  }
}

function initChart() {
  if (!mapContainer.value || !chinaGeoJson.value) return

  // 注册地图
  echarts.registerMap('china', chinaGeoJson.value)

  // 初始化实例
  chartInstance = echarts.init(mapContainer.value, undefined, {
    renderer: 'canvas',
    devicePixelRatio: window.devicePixelRatio
  })

  // 配置项
  const option: EChartsOption = {
    backgroundColor: 'transparent',
    geo: {
      map: 'china',
      roam: true,
      zoom: 1.2,
      center: [104.2, 35.8],
      label: {
        show: true,
        color: '#fff',
        fontSize: 10
      },
      itemStyle: {
        areaColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1
      },
      emphasis: {
        label: {
          show: true,
          color: '#fff'
        },
        itemStyle: {
          areaColor: 'rgba(59, 130, 246, 0.6)'
        }
      },
      select: {
        itemStyle: {
          areaColor: 'rgba(212, 175, 55, 0.8)'
        }
      }
    },
    series: [
      {
        type: 'map',
        map: 'china',
        geoIndex: 0,
        data: [],
        select: {
          disabled: false
        }
      }
    ]
  }

  chartInstance.setOption(option)

  // 点击事件
  chartInstance.on('click', (params) => {
    if (params.componentType === 'series' || params.componentType === 'geo') {
      const adcode = params.data?.adcode || params.adcode
      if (adcode) {
        handleRegionClick(adcode, params.name)
      }
    }
  })

  // 已有选择时高亮
  if (props.selectedHeadquarters?.code) {
    selectedCode.value = props.selectedHeadquarters.code
    highlightRegion(props.selectedHeadquarters.code)
  }
}

function handleRegionClick(code: string, name: string) {
  selectedCode.value = code
  selectedName.value = name
  highlightRegion(code)
}

function handleConfirm() {
  if (selectedCode.value && selectedName.value) {
    emit('confirm', {
      district: selectedName.value,
      code: selectedCode.value
    })
  }
}

function highlightRegion(code: string) {
  if (!chartInstance) return
  
  chartInstance.setOption({
    series: [{
      type: 'map',
      map: 'china',
      data: [{
        name: getCodeName(code),
        selected: true
      }]
    }]
  })
}

function getCodeName(code: string): string {
  // 简化实现，实际应该从地图数据中获取
  const names: Record<string, string> = {
    '110000': '北京市',
    '310000': '上海市',
    '440000': '广东省',
    '330000': '浙江省',
    '320000': '江苏省',
    '370000': '山东省',
  }
  return names[code] || '未知区域'
}

function handleClose() {
  emit('close')
}

// 监听窗口大小变化
function handleResize() {
  if (chartInstance) {
    chartInstance.resize()
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="headquarters-selector-overlay" @click="handleClose">
        <div class="headquarters-selector" @click.stop>
          <!-- 头部 -->
          <div class="selector-header">
            <div class="header-title">
              <span class="icon">🏰</span>
              <span class="text">选择战队大本营</span>
            </div>
            <button class="close-btn" @click="handleClose">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <!-- 提示区 -->
          <div class="selector-hint">
            <div class="hint-content">
              <span class="hint-icon">💡</span>
              <span class="hint-text">点击地图选择战队大本营所在地</span>
            </div>
            <div class="hint-tips">
              <span>🖱️ 点击省份/城市</span>
              <span>🔍 滚轮缩放</span>
              <span>✋ 拖拽平移</span>
            </div>
          </div>

          <!-- 地图容器 -->
          <div class="map-wrapper">
            <div v-if="isLoading" class="map-loading">
              <div class="loading-spinner"></div>
              <span>加载地图中...</span>
            </div>
            <div ref="mapContainer" class="map-container"></div>
          </div>

          <!-- 已选区域 -->
          <div v-if="selectedCode" class="selected-info">
            <span class="selected-label">已选择：</span>
            <span class="selected-value">{{ selectedName || getCodeName(selectedCode) }}</span>
          </div>

          <!-- 底部按钮 -->
          <div class="selector-footer">
            <button class="btn btn-cancel" @click="handleClose">
              取消
            </button>
            <button
              class="btn btn-confirm"
              :disabled="!selectedCode"
              @click="handleConfirm"
            >
              确认选择
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* 遮罩层 */
.headquarters-selector-overlay {
  position: fixed;
  inset: 0;
  background: rgba(7, 14, 27, 0.85);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

/* 选择器主体 */
.headquarters-selector {
  background: linear-gradient(135deg, rgba(26, 39, 64, 0.98) 0%, rgba(10, 22, 40, 0.98) 100%);
  border-radius: 16px;
  width: 100%;
  max-width: 900px;
  max-height: 80vh;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 头部 */
.selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(59, 130, 246, 0.2);
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 700;
  color: #F1F5F9;
}

.header-title .icon {
  font-size: 24px;
}

.close-btn {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 8px;
  color: #94A3B8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #F1F5F9;
}

.close-btn svg {
  width: 20px;
  height: 20px;
}

/* 提示区 */
.selector-hint {
  padding: 16px 24px;
  background: rgba(59, 130, 246, 0.05);
  border-bottom: 1px solid rgba(59, 130, 246, 0.1);
}

.hint-content {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.hint-icon {
  font-size: 18px;
}

.hint-text {
  font-size: 14px;
  color: #94A3B8;
}

.hint-tips {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #64748B;
}

/* 地图容器 */
.map-wrapper {
  flex: 1;
  position: relative;
  min-height: 400px;
  background: rgba(7, 14, 27, 0.5);
}

.map-container {
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.map-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #94A3B8;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(59, 130, 246, 0.3);
  border-top-color: #3B82F6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 已选区域信息 */
.selected-info {
  padding: 12px 24px;
  background: rgba(59, 130, 246, 0.1);
  border-top: 1px solid rgba(59, 130, 246, 0.2);
  display: flex;
  align-items: center;
  gap: 8px;
}

.selected-label {
  font-size: 13px;
  color: #94A3B8;
}

.selected-value {
  font-size: 15px;
  font-weight: 600;
  color: #3B82F6;
}

/* 底部按钮 */
.selector-footer {
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid rgba(59, 130, 246, 0.2);
  background: rgba(7, 14, 27, 0.5);
}

.btn {
  flex: 1;
  padding: 14px 24px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #94A3B8;
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  color: #F1F5F9;
}

.btn-confirm {
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
  color: #fff;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-confirm:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.btn-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active .headquarters-selector,
.fade-leave-active .headquarters-selector {
  transition: transform 0.3s ease;
}

.fade-enter-from .headquarters-selector,
.fade-leave-to .headquarters-selector {
  transform: scale(0.95) translateY(20px);
}
</style>
