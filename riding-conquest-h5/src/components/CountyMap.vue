/**
 * 县区级中国地图组件 v2.0
 * 支持 2800+ 县区级行政单位渲染
 * 三级下钻：全国 → 省 → 市/县区
 * 
 * @author 万钳 🔧
 * @date 2026-03-31
 */

<script setup>
import { ref, onMounted, watch, onUnmounted, computed, nextTick } from 'vue'
import * as echarts from 'echarts'
import TerritoryDetailPopup from './TerritoryDetailPopup.vue'

const props = defineProps({
  // 领土数据：[{ code: '110101', name: '东城区', team_id: 1, is_ally: true, defense_value: 100 }]
  territories: {
    type: Array,
    required: true,
    default: () => []
  },
  // 当前地图级别：'country' | 'province' | 'city'
  mapLevel: {
    type: String,
    default: 'country'
  },
  // 当前聚焦的省份/城市代码
  focusCode: {
    type: String,
    default: null
  },
  // 家乡代码
  hometownCode: {
    type: String,
    default: null
  },
  // 选中的领土
  selectedTerritory: {
    type: Object,
    default: null
  }
})

const emit = defineEmits([
  'territory-click',
  'level-change',
  'province-click',
  'go-home'
])

const mapContainer = ref(null)
let chartInstance = null
let geoJsonCache = {} // 缓存已加载的 GeoJSON
let currentLevel = 'country' // current map level
let currentFocusCode = null // current focus area code

// 弹窗状态
const popupVisible = ref(false)
const currentTerritory = ref(null)
const popupPosition = ref({ x: 0, y: 0 })

// 地图配置
const MAP_CONFIG = {
  country: {
    name: 'china',
    url: 'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json',
    center: [104.0, 36.0],
    zoom: 1.2
  },
  province: {
    // 省份代码会在点击时动态设置
    center: [104.0, 36.0],
    zoom: 2.5
  },
  city: {
    // 城市代码会在点击时动态设置
    center: [104.0, 36.0],
    zoom: 4.0
  }
}

// 省份中心点坐标（用于下钻时快速定位）
const PROVINCE_CENTERS = {
  '110000': [116.4074, 39.9042], // 北京
  '120000': [117.1901, 39.1255], // 天津
  '310000': [121.4737, 31.2304], // 上海
  '500000': [106.5516, 29.5630], // 重庆
  '130000': [114.5025, 38.0455], // 河北
  '140000': [112.5492, 37.8570], // 山西
  '210000': [123.4291, 41.7968], // 辽宁
  '220000': [125.3245, 43.8868], // 吉林
  '230000': [126.6424, 45.7569], // 黑龙江
  '320000': [118.7969, 32.0603], // 江苏
  '330000': [120.1551, 30.2741], // 浙江
  '340000': [117.2830, 31.8612], // 安徽
  '350000': [119.3062, 26.0753], // 福建
  '360000': [115.8922, 28.6760], // 江西
  '370000': [117.0009, 36.6758], // 山东
  '410000': [113.6654, 34.7579], // 河南
  '420000': [114.2986, 30.5844], // 湖北
  '430000': [112.9823, 28.1947], // 湖南
  '440000': [113.2644, 23.1291], // 广东
  '460000': [110.3312, 20.0310], // 海南
  '510000': [104.0657, 30.6595], // 四川
  '520000': [106.7135, 26.5783], // 贵州
  '530000': [102.7123, 25.0406], // 云南
  '610000': [108.9480, 34.2632], // 陕西
  '620000': [103.8236, 36.0580], // 甘肃
  '630000': [101.7782, 36.6171], // 青海
  '710000': [121.5091, 25.0443], // 台湾
  '150000': [111.6708, 40.8183], // 内蒙古
  '450000': [108.3200, 22.8240], // 广西
  '540000': [91.1322, 29.6600], // 西藏
  '640000': [106.2782, 38.4664], // 宁夏
  '650000': [87.6177, 43.7928], // 新疆
  '810000': [114.1694, 22.3193], // 香港
  '820000': [113.5439, 22.2006], // 澳门
  // 主要城市中心点（用于直接下钻到城市级）
  '440300': [114.0579, 22.5431], // 深圳市
  '310100': [121.4737, 31.2304], // 上海市
  '110100': [116.4074, 39.9042]  // 北京市
}

// 处理 GeoJSON 特征，添加家乡高亮样式
const processGeoFeatures = (geoJson) => {
  if (!geoJson || !geoJson.features) return geoJson
  
  // 查找家乡区域
  const hometownFeature = geoJson.features.find(f => {
    const adcode = f.properties?.adcode?.toString()
    return props.hometownCode && adcode && adcode.startsWith(props.hometownCode.toString())
  })
  
  if (hometownFeature) {
    console.log('找到家乡区域:', hometownFeature.properties.name)
    // 可以在这里添加特殊样式标记
    hometownFeature.properties.isHometown = true
  }
  
  return geoJson
}
const loadGeoJson = async (level, code = '100000') => {
  const cacheKey = `${level}_${code}`
  
  if (geoJsonCache[cacheKey]) {
    return geoJsonCache[cacheKey]
  }
  
  let url
  if (level === 'country') {
    // 使用本地文件
    url = '/china.json'
  } else if (level === 'province') {
    // 省级数据
    url = `https://geo.datav.aliyun.com/areas_v3/bound/${code}_full.json`
  } else if (level === 'city') {
    // 市级数据（县区级）
    url = `https://geo.datav.aliyun.com/areas_v3/bound/${code}_full.json`
  }
  
  try {
    console.log('正在加载 GeoJSON', { level, code, url })
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    const geoJson = await response.json()
    console.log('GeoJSON 加载成功', { features: geoJson.features?.length, hometownCode: props.hometownCode })
    
    // 处理家乡高亮
    if (props.hometownCode && geoJson.features) {
      const hometownCodeStr = props.hometownCode.toString()
      // 在全国级别，匹配省级代码（如 110105 → 110000）
      const provinceCode = hometownCodeStr.substring(0, 2) + '0000'
      const hometownFeature = geoJson.features.find(f => {
        const adcode = f.properties?.adcode?.toString()
        return adcode && (adcode === hometownCodeStr || adcode === provinceCode || adcode.startsWith(hometownCodeStr.substring(0, 2)))
      })
      if (hometownFeature) {
        console.log('找到家乡区域:', hometownFeature.properties.name, hometownFeature.properties.adcode)
        hometownFeature.properties.isHometown = true
      } else {
        console.log('未找到家乡区域', { hometownCode: props.hometownCode, provinceCode })
      }
    }
    
    geoJsonCache[cacheKey] = geoJson
    return geoJson
  } catch (error) {
    console.error(`加载地图数据失败 (${level}/${code}):`, error)
    return null
  }
}

// 获取领土颜色
const getTerritoryStyle = (feature, territoryData) => {
  // 检查是否是家乡区域
  if (feature.properties?.isHometown) {
    return {
      areaColor: 'rgba(245, 158, 11, 0.4)', // 琥珀色高亮
      borderColor: 'rgba(245, 158, 11, 0.8)',
      borderWidth: 2,
      shadowColor: 'rgba(245, 158, 11, 0.6)',
      shadowBlur: 20
    }
  }
  
  const defaultProps = {
    areaColor: '#0A1628',
    borderColor: '#3B82F6',
    borderWidth: 1,
    shadowColor: 'rgba(59, 130, 246, 0.3)',
    shadowBlur: 10
  }
  
  if (!territoryData) {
    // 无主之地
    return {
      areaColor: 'rgba(107, 114, 128, 0.15)',
      borderColor: 'rgba(148, 163, 184, 0.3)',
      borderWidth: 1
    }
  }
  
  if (territoryData.is_ally) {
    // 我方领土 - 绿色
    return {
      areaColor: 'rgba(34, 197, 94, 0.35)',
      borderColor: 'rgba(34, 197, 94, 0.6)',
      borderWidth: 1.5,
      shadowColor: 'rgba(34, 197, 94, 0.4)',
      shadowBlur: 15
    }
  } else if (territoryData.team_id) {
    // 敌方领土 - 红色
    return {
      areaColor: 'rgba(239, 68, 68, 0.3)',
      borderColor: 'rgba(239, 68, 68, 0.5)',
      borderWidth: 1.5,
      shadowColor: 'rgba(239, 68, 68, 0.3)',
      shadowBlur: 12
    }
  }
  
  return defaultProps
}

// 构建地区数据映射
const buildTerritoryMap = () => {
  const map = {}
  props.territories.forEach(t => {
    // 支持 code 和 adcode 两种字段名
    const code = t.code || t.adcode
    if (code) {
      map[code] = t
    }
    // 也按名称映射（备用）
    if (t.name) {
      map[t.name] = t
    }
  })
  return map
}

// 初始化地图
const initChart = async () => {
  console.log('initChart 被调用', { currentLevel, currentFocusCode })
  
  if (!mapContainer.value) {
    console.error('mapContainer 不存在')
    return
  }
  
  // 销毁旧实例
  if (chartInstance) {
    chartInstance.dispose()
    console.log('旧图表实例已销毁')
  }
  
  chartInstance = echarts.init(mapContainer.value)
  console.log('新图表实例已创建')
  // 调试：暴露到 window 以便测试
  // @ts-ignore
  window.__testChart = chartInstance
  console.log('图表实例已暴露到 window.__testChart')
  
  // 加载 GeoJSON
  const geoJson = await loadGeoJson(currentLevel, currentFocusCode || '100000')
  if (!geoJson) {
    console.error('地图数据加载失败')
    return
  }
  
  // 注册地图
  const mapName = `china_${currentLevel}_${currentFocusCode || 'country'}`
  echarts.registerMap(mapName, geoJson)
  
  // 构建领土数据映射
  const territoryMap = buildTerritoryMap()
  
  // 处理 regions 数据
  const regions = geoJson.features.map(feature => {
    const adcode = feature.properties.adcode || feature.properties.adCode
    const name = feature.properties.name
    const territoryData = territoryMap[adcode] || territoryMap[name]
    const style = getTerritoryStyle(feature, territoryData)
    
    return {
      name: name,
      itemStyle: style,
      emphasis: {
        itemStyle: {
          areaColor: 'rgba(59, 130, 246, 0.3)',
          shadowColor: 'rgba(59, 130, 246, 0.8)',
          shadowBlur: 20
        }
      },
      select: {
        itemStyle: {
          areaColor: 'rgba(59, 130, 246, 0.5)',
          shadowColor: 'rgba(59, 130, 246, 1)',
          shadowBlur: 30
        }
      }
    }
  })
  
  // 配置项
  const option = {
    backgroundColor: 'transparent',
    geo: {
      map: mapName,
      roam: true,
      zoom: currentLevel === 'country' ? 1.2 : currentLevel === 'province' ? 2.5 : 4.0,
      center: getCenterPosition(),
      scaleLimit: {
        min: 0.8,
        max: currentLevel === 'country' ? 5 : currentLevel === 'province' ? 8 : 12
      },
      label: {
        show: currentLevel === 'country' ? false : true,
        color: '#F1F5F9',
        fontSize: currentLevel === 'country' ? 10 : 11,
        fontWeight: 'bold'
      },
      itemStyle: {
        areaColor: '#0A1628',
        borderColor: '#3B82F6',
        borderWidth: 1,
        shadowColor: 'rgba(59, 130, 246, 0.3)',
        shadowBlur: 10
      },
      emphasis: {
        label: {
          show: true,
          color: '#fff'
        },
        itemStyle: {
          areaColor: 'rgba(59, 130, 246, 0.2)'
        }
      },
      select: {
        itemStyle: {
          areaColor: 'rgba(59, 130, 246, 0.4)'
        }
      },
      regions: regions
    },
    animationDuration: 800,
    animationEasing: 'cubicOut'
  }
  
  chartInstance.setOption(option, true)
  
  // 如果是首次加载且有家乡代码，自动定位到家乡
  if (props.hometownCode && currentLevel === 'country') {
    setTimeout(() => {
      focusOnHometown()
    }, 1000)
  }
  
  // 绑定事件
  bindEvents()
}

// 聚焦到家乡区域
const focusOnHometown = () => {
  if (!props.hometownCode || !chartInstance) return
  
  const center = PROVINCE_CENTERS[props.hometownCode + '0000'.substring(0, 6 - props.hometownCode.length)]
  if (center) {
    chartInstance.setOption({
      geo: {
        center: center,
        zoom: 3
      }
    })
    console.log('已自动定位到家乡', props.hometownCode, center)
  }
}

// 获取中心位置
const getCenterPosition = () => {
  if (currentLevel === 'country') {
    return MAP_CONFIG.country.center
  } else if (currentFocusCode && PROVINCE_CENTERS[currentFocusCode]) {
    return PROVINCE_CENTERS[currentFocusCode]
  }
  return MAP_CONFIG.country.center
}

// 绑定交互事件
const bindEvents = () => {
  console.log('bindEvents 被调用', { hasChart: !!chartInstance })
  
  if (!chartInstance) {
    console.error('chartInstance 不存在，无法绑定事件')
    return
  }
  
  // 点击事件
  console.log('正在绑定点击事件...')
  chartInstance.on('click', (params) => {
    console.log('=== 地图点击事件触发 ===', {
      componentType: params.componentType,
      seriesType: params.seriesType,
      data: params.data,
      name: params.name,
      value: params.value
    })
    
    if (params.componentType === 'geo') {
      // 从 params.name 获取区域名称（params.data 可能为 undefined）
      const name = params.name
      const adcode = params.data?.adcode || params.data?.properties?.adcode
      console.log('点击的地理特征', { adcode, name, currentLevel })
      
      // 高亮选中的区域
      try {
        chartInstance.dispatchAction({
          type: 'highlight',
          name: name
        })
        console.log('高亮成功')
      } catch (e) {
        console.log('高亮失败:', e.message)
      }
      
      // 根据当前级别处理点击
      if (currentLevel === 'country') {
        // 国家级：点击省份 → 下钻到省
        console.log('国家级点击，下钻到省份')
        handleProvinceClick(adcode, name)
      } else if (currentLevel === 'province') {
        // 省级：点击城市 → 下钻到市/县区
        console.log('省级点击，下钻到城市')
        handleCityClick(adcode, name)
      } else {
        // 县区级：点击县区 → 选中领土 + 显示弹窗
        console.log('县区级点击，调用 handleCountyClick', { adcode, name })
        handleCountyClick(adcode, name, params)
      }
    } else {
      console.log('非 geo 组件点击', params.componentType)
    }
  })
  console.log('点击事件绑定完成')
  
  // 双击事件 - 快速聚焦
  chartInstance.getZr().on('dblclick', (params) => {
    const pointInPixel = [params.offsetX, params.offsetY]
    const pointInGeo = chartInstance.convertFromPixel('geo', pointInPixel)
    
    if (pointInGeo) {
      chartInstance.setOption({
        geo: {
          center: pointInGeo,
          zoom: currentLevel === 'country' ? 3 : currentLevel === 'province' ? 6 : 8
        }
      }, { lazyUpdate: true })
    }
  })
  
  // 地图漫游事件
  chartInstance.on('georoam', () => {
    const option = chartInstance.getOption()
    // 可以在这里保存当前视图状态
  })
}

// 处理省份点击（国家级 → 省级）
const handleProvinceClick = (adcode, name) => {
  if (!adcode) return
  
  // 检查是否有省级数据
  const provinceCode = adcode.toString().padEnd(6, '0')
  
  emit('province-click', {
    code: provinceCode,
    name: name,
    level: 'province'
  })
  
  // 下钻到省份
  drillDown('province', provinceCode)
}

// 处理城市点击（省级 → 县区级）
const handleCityClick = (adcode, name) => {
  if (!adcode) return
  
  emit('territory-click', {
    code: adcode,
    name: name,
    level: 'city'
  })
  
  // 下钻到城市/县区
  drillDown('city', adcode)
}

// 处理县区点击（选中领土 + 显示弹窗）
const handleCountyClick = (adcode, name, event) => {
  console.log('handleCountyClick 被调用', { 
    adcode: adcode?.toString(), 
    name, 
    eventType: event?.componentType,
    currentLevel 
  })
  
  const adcodeStr = adcode?.toString()
  console.log('当前领土数据:', props.territories.map(t => ({ code: t.code, name: t.name })))
  
  const territory = props.territories.find(t => {
    const tCode = t.code?.toString()
    const tAdcode = t.adcode?.toString()
    const match = tCode === adcodeStr || tAdcode === adcodeStr || t.name === name
    if (match) {
      console.log('找到匹配的领土:', t)
    }
    return match
  })
  
  console.log('查找结果:', territory ? '找到' : '未找到', { adcodeStr, name })
  
  if (territory) {
    // 发送点击事件
    emit('territory-click', {
      territory,
      level: 'county'
    })
    
    // 显示详情弹窗
    currentTerritory.value = territory
    if (event && event.event) {
      popupPosition.value = {
        x: event.event.offsetX,
        y: event.event.offsetY
      }
    } else {
      // 使用默认位置
      popupPosition.value = { x: 500, y: 400 }
    }
    popupVisible.value = true
    console.log('弹窗已显示', { popupVisible: popupVisible.value, territory })
  } else {
    console.log('未找到领土数据', { 
      adcode: adcodeStr, 
      name, 
      availableCodes: props.territories.map(t => t.code) 
    })
  }
}

// 下钻到指定级别
const drillDown = async (level, code) => {
  currentLevel = level
  currentFocusCode = code
  
  emit('level-change', {
    level,
    code,
    name: PROVINCE_CENTERS[code] ? '省份' : '城市'
  })
  
  await initChart()
}

// 返回上级
const goBack = async () => {
  if (currentLevel === 'city') {
    // 县区级 → 省级
    await drillDown('province', currentFocusCode?.substring(0, 2) + '0000')
  } else if (currentLevel === 'province') {
    // 省级 → 国家级
    await drillDown('country', null)
  }
}

// 返回家乡
const goToHometown = async () => {
  if (!props.hometownCode) return
  
  const code = props.hometownCode.toString()
  let targetLevel = 'country'
  let targetCode = null
  
  // 根据家乡代码长度判断级别
  if (code.length === 6) {
    // 县区级
    targetLevel = 'city'
    targetCode = code
  } else if (code.length === 4) {
    // 市级
    targetLevel = 'province'
    targetCode = code + '00'
  } else if (code.length === 2) {
    // 省级
    targetLevel = 'province'
    targetCode = code + '0000'
  }
  
  await drillDown(targetLevel, targetCode)
  
  emit('go-home', {
    code: props.hometownCode,
    level: targetLevel
  })
}

// 重置视图
const resetView = async () => {
  await drillDown('country', null)
}

// 监听数据变化
watch(() => props.territories, () => {
  if (chartInstance && currentLevel === 'country') {
    initChart() // 重新渲染
  }
}, { deep: true })

// 监听焦点变化
watch(() => props.focusCode, async (newCode) => {
  if (newCode && newCode !== currentFocusCode) {
    // 根据代码长度判断级别
    const level = newCode.length === 2 ? 'province' : newCode.length === 4 ? 'province' : 'city'
    await drillDown(level, newCode)
  }
})

// 窗口大小变化
const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

// 键盘事件
const handleKeyDown = (e) => {
  if (e.key === 'Escape') {
    goBack()
  } else if (e.key === ' ' && props.hometownCode) {
    e.preventDefault()
    goToHometown()
  } else if (e.key === '0') {
    resetView()
  }
}

onMounted(async () => {
  currentLevel = props.mapLevel
  currentFocusCode = props.focusCode
  
  await initChart()
  
  window.addEventListener('resize', handleResize)
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
  }
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('keydown', handleKeyDown)
})

// 暴露方法给父组件
defineExpose({
  goBack,
  goToHometown,
  resetView,
  drillDown,
  showTerritoryPopup,
  getCurrentLevel: () => currentLevel,
  getCurrentFocus: () => currentFocusCode
})

// 显示领土弹窗（测试用）
function showTerritoryPopup(territory, position) {
  currentTerritory.value = territory
  popupPosition.value = position
  popupVisible.value = true
  console.log('弹窗已显示', territory)
}
</script>

<template>
  <div class="map-wrapper">
    <div ref="mapContainer" class="county-map-container"></div>
    
    <!-- 地图控制按钮 -->
    <div class="map-controls">
      <button 
        v-if="currentLevel !== 'country'" 
        class="control-btn" 
        @click="goBack" 
        title="返回上级 (Esc)"
      >
        <span>⬆️</span>
      </button>
      <button 
        v-if="hometownCode" 
        class="control-btn" 
        @click="goToHometown" 
        title="返回家乡 (空格键)"
      >
        <span>🏠</span>
      </button>
      <button 
        class="control-btn" 
        @click="resetView" 
        title="重置视图 (0 键)"
      >
        <span>🎯</span>
      </button>
    </div>
    
    <!-- 地图级别提示 -->
    <div class="map-level-indicator">
      <span class="level-tag" :class="currentLevel">
        {{ currentLevel === 'country' ? '全国' : currentLevel === 'province' ? '省级' : '县区级' }}
      </span>
    </div>
    
    <!-- 操作提示 -->
    <div class="map-hint">
      <span>滚轮缩放</span>
      <span>拖拽平移</span>
      <span>点击下钻</span>
      <span v-if="currentLevel !== 'country'">Esc 返回</span>
    </div>
    
    <!-- 领土详情弹窗 -->
    <TerritoryDetailPopup
      :visible="popupVisible"
      :territory="currentTerritory"
      :position="popupPosition"
      @close="popupVisible = false"
    />
  </div>
</template>

<style scoped>
.map-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.county-map-container {
  width: 100%;
  height: 100%;
  min-height: 500px;
  cursor: grab;
}

.county-map-container:active {
  cursor: grabbing;
}

/* 控制按钮 */
.map-controls {
  position: absolute;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 10;
}

.control-btn {
  width: 44px;
  height: 44px;
  background: rgba(26, 39, 64, 0.9);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 10px;
  color: #F1F5F9;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);
}

.control-btn:hover {
  background: rgba(59, 130, 246, 0.3);
  border-color: rgba(59, 130, 246, 0.5);
  transform: scale(1.05);
}

.control-btn:active {
  transform: scale(0.95);
}

/* 级别指示器 */
.map-level-indicator {
  position: absolute;
  top: 24px;
  left: 24px;
  z-index: 10;
}

.level-tag {
  padding: 8px 16px;
  background: rgba(26, 39, 64, 0.9);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
  color: #F1F5F9;
  font-size: 13px;
  font-weight: 600;
  backdrop-filter: blur(8px);
}

.level-tag.country {
  border-color: rgba(59, 130, 246, 0.5);
}

.level-tag.province {
  border-color: rgba(34, 197, 94, 0.5);
}

.level-tag.city {
  border-color: rgba(245, 158, 11, 0.5);
}

/* 操作提示 */
.map-hint {
  position: absolute;
  bottom: 24px;
  left: 24px;
  display: flex;
  gap: 12px;
  z-index: 10;
}

.map-hint span {
  padding: 6px 12px;
  background: rgba(26, 39, 64, 0.7);
  border-radius: 6px;
  font-size: 11px;
  color: #64748B;
  backdrop-filter: blur(4px);
}
</style>
