<script setup>
import { ref, onMounted, watch, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  territories: {
    type: Array,
    required: true
  },
  selectedTerritory: {
    type: Object,
    default: null
  },
  hometown: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['territory-click', 'territory-double-click', 'go-home'])

const mapContainer = ref(null)
let chartInstance = null
let currentZoom = 1.2
let currentCenter = [104.0, 36.0]
let isDragging = false
let dragStart = null
let currentMapLevel = ref('country') // 'country' | 'province' | 'city'
let currentProvinceCode = ref(null)

// 地图数据缓存
const mapCache = new Map()

// 省份 adcode 映射
const provinceAdcodes = {
  '北京市': '110000',
  '天津市': '120000',
  '河北省': '130000',
  '山西省': '140000',
  '内蒙古自治区': '150000',
  '辽宁省': '210000',
  '吉林省': '220000',
  '黑龙江省': '230000',
  '上海市': '310000',
  '江苏省': '320000',
  '浙江省': '330000',
  '安徽省': '340000',
  '福建省': '350000',
  '江西省': '360000',
  '山东省': '370000',
  '河南省': '410000',
  '湖北省': '420000',
  '湖南省': '430000',
  '广东省': '440000',
  '广西壮族自治区': '450000',
  '海南省': '460000',
  '重庆市': '500000',
  '四川省': '510000',
  '贵州省': '520000',
  '云南省': '530000',
  '西藏自治区': '540000',
  '陕西省': '610000',
  '甘肃省': '620000',
  '青海省': '630000',
  '宁夏回族自治区': '640000',
  '新疆维吾尔自治区': '650000',
  '台湾省': '710000',
  '香港特别行政区': '810000',
  '澳门特别行政区': '820000'
}

const cityCoordinates = {
  '北京市': [116.4074, 39.9042],
  '上海市': [121.4737, 31.2304],
  '天津市': [117.1901, 39.1255],
  '重庆市': [106.5516, 29.5630],
  '河北省': [114.5025, 38.0455],
  '山西省': [112.5492, 37.8570],
  '辽宁省': [123.4291, 41.7968],
  '吉林省': [125.3245, 43.8868],
  '黑龙江省': [126.6424, 45.7569],
  '江苏省': [118.7969, 32.0603],
  '浙江省': [120.1551, 30.2741],
  '安徽省': [117.2830, 31.8612],
  '福建省': [119.3062, 26.0753],
  '江西省': [115.8922, 28.6760],
  '山东省': [117.0009, 36.6758],
  '河南省': [113.6654, 34.7579],
  '湖北省': [114.2986, 30.5844],
  '湖南省': [112.9823, 28.1947],
  '广东省': [113.2644, 23.1291],
  '海南省': [110.3312, 20.0310],
  '四川省': [104.0657, 30.6595],
  '贵州省': [106.7135, 26.5783],
  '云南省': [102.7123, 25.0406],
  '陕西省': [108.9480, 34.2632],
  '甘肃省': [103.8236, 36.0580],
  '青海省': [101.7782, 36.6171],
  '台湾省': [121.5091, 25.0443],
  '内蒙古自治区': [111.6708, 40.8183],
  '广西壮族自治区': [108.3200, 22.8240],
  '西藏自治区': [91.1322, 29.6600],
  '宁夏回族自治区': [106.2782, 38.4664],
  '新疆维吾尔自治区': [87.6177, 43.7928],
  '香港特别行政区': [114.1694, 22.3193],
  '澳门特别行政区': [113.5439, 22.2006]
}

// 省份下钻状态
const showProvinceHint = ref(false)
const currentProvinceName = ref(null)
const currentCityName = ref(null)
const currentCityCode = ref(null)

// 城市 adcode 映射（部分示例，实际应该包含所有城市）
const cityAdcodes = {
  // 广东省
  '广州市': '440100',
  '深圳市': '440300',
  '珠海市': '440400',
  '汕头市': '440500',
  '佛山市': '440600',
  '韶关市': '440200',
  '湛江市': '440800',
  '肇庆市': '441200',
  '江门市': '440700',
  '茂名市': '440900',
  '惠州市': '441300',
  '梅州市': '441400',
  '汕尾市': '441500',
  '河源市': '441600',
  '阳江市': '441700',
  '清远市': '441800',
  '东莞市': '441900',
  '中山市': '442000',
  '潮州市': '445100',
  '揭阳市': '445200',
  '云浮市': '445300',
  // 江苏省
  '南京市': '320100',
  '苏州市': '320500',
  '无锡市': '320200',
  '常州市': '320400',
  '镇江市': '321100',
  '南通市': '320600',
  '扬州市': '321000',
  '泰州市': '321200',
  '徐州市': '320300',
  '连云港市': '320700',
  '淮安市': '320800',
  '盐城市': '320900',
  '宿迁市': '321300',
  // 浙江省
  '杭州市': '330100',
  '宁波市': '330200',
  '温州市': '330300',
  '嘉兴市': '330400',
  '湖州市': '330500',
  '绍兴市': '330600',
  '金华市': '330700',
  '衢州市': '330800',
  '舟山市': '330900',
  '台州市': '331000',
  '丽水市': '331100',
  // 北京市（区级）
  '东城区': '110101',
  '西城区': '110102',
  '朝阳区': '110105',
  '丰台区': '110106',
  '石景山区': '110107',
  '海淀区': '110108',
  '门头沟区': '110109',
  '房山区': '110111',
  '通州区': '110112',
  '顺义区': '110113',
  '昌平区': '110114',
  '大兴区': '110115',
  // 上海市（区级）
  '黄浦区': '310101',
  '徐汇区': '310104',
  '长宁区': '310105',
  '静安区': '310106',
  '普陀区': '310107',
  '虹口区': '310109',
  '杨浦区': '310110',
  '闵行区': '310112',
  '宝山区': '310113',
  '嘉定区': '310114',
  '浦东新区': '310115',
  '松江区': '310117',
  '青浦区': '310118',
  '奉贤区': '310120',
  '崇明区': '310151',
  // 深圳市（区级）
  '福田区': '440304',
  '罗湖区': '440303',
  '南山区': '440305',
  '宝安区': '440306',
  '龙岗区': '440307',
  '盐田区': '440308',
  '龙华区': '440309',
  '坪山区': '440310',
  '光明区': '440311'
}

const loadChinaMap = async () => {
  try {
    const response = await fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
    const geoJson = await response.json()
    echarts.registerMap('china', geoJson)
    initChart()
  } catch (error) {
    console.error('加载地图失败:', error)
    initChart()
  }
}

// 城市中心点坐标（用于下钻后自动聚焦）
const cityCenters = {
  // 广东省
  '440100': [113.2644, 23.1291], // 广州市
  '440300': [114.0579, 22.5431], // 深圳市
  '440400': [113.5767, 22.2719], // 珠海市
  '440500': [116.6824, 23.3544], // 汕头市
  '440600': [113.1228, 23.0215], // 佛山市
  '440200': [113.5977, 24.8108], // 韶关市
  '440800': [110.3594, 21.2744], // 湛江市
  '441200': [112.4653, 23.0786], // 肇庆市
  '440700': [113.0818, 22.5791], // 江门市
  '440900': [110.9253, 21.6631], // 茂名市
  '441300': [114.4152, 23.1115], // 惠州市
  '441400': [116.1225, 24.2888], // 梅州市
  '441500': [115.3752, 22.7865], // 汕尾市
  '441600': [114.6975, 23.7437], // 河源市
  '441700': [111.9828, 21.8579], // 阳江市
  '441800': [113.0513, 23.6817], // 清远市
  '441900': [113.7518, 23.0205], // 东莞市
  '442000': [113.3927, 22.5170], // 中山市
  '445100': [116.6226, 23.6569], // 潮州市
  '445200': [116.3729, 23.5418], // 揭阳市
  '445300': [112.0445, 22.9150], // 云浮市
  // 江苏省
  '320100': [118.7969, 32.0603], // 南京市
  '320500': [120.5853, 31.2989], // 苏州市
  '320200': [120.3119, 31.4912], // 无锡市
  '320400': [119.9739, 31.8115], // 常州市
  '321100': [119.4519, 32.2044], // 镇江市
  '320600': [120.8943, 32.0162], // 南通市
  '321000': [119.4129, 32.3942], // 扬州市
  '321200': [119.9177, 32.4912], // 泰州市
  '320300': [117.1848, 34.2692], // 徐州市
  '320700': [119.2224, 34.5967], // 连云港市
  '320800': [119.0153, 33.5889], // 淮安市
  '320900': [120.1253, 33.3475], // 盐城市
  '321300': [118.2757, 33.9631], // 宿迁市
  // 浙江省
  '330100': [120.1551, 30.2741], // 杭州市
  '330200': [121.5497, 29.8683], // 宁波市
  '330300': [120.6994, 28.0005], // 温州市
  '330400': [120.7555, 30.7467], // 嘉兴市
  '330500': [120.0934, 30.8943], // 湖州市
  '330600': [120.5820, 30.0327], // 绍兴市
  '330700': [119.6497, 29.0789], // 金华市
  '330800': [118.8739, 28.9698], // 衢州市
  '330900': [122.2072, 29.9852], // 舟山市
  '331000': [121.4207, 28.6563], // 台州市
  '331100': [119.9219, 28.4516], // 丽水市
  // 北京市（区级）
  '110101': [116.4187, 39.9175], // 东城区
  '110102': [116.3668, 39.9153], // 西城区
  '110105': [116.4431, 39.9211], // 朝阳区
  '110106': [116.2863, 39.8585], // 丰台区
  '110107': [116.2227, 39.9063], // 石景山区
  '110108': [116.2981, 39.9590], // 海淀区
  '110109': [116.1009, 39.9406], // 门头沟区
  '110111': [116.1431, 39.7489], // 房山区
  '110112': [116.6584, 39.9085], // 通州区
  '110113': [116.6544, 40.1303], // 顺义区
  '110114': [116.2316, 40.2206], // 昌平区
  '110115': [116.3413, 39.7266], // 大兴区
  // 上海市（区级）
  '310101': [121.4892, 31.2335], // 黄浦区
  '310104': [121.4368, 31.1880], // 徐汇区
  '310105': [121.4246, 31.2204], // 长宁区
  '310106': [121.4479, 31.2286], // 静安区
  '310107': [121.3973, 31.2496], // 普陀区
  '310109': [121.4947, 31.2646], // 虹口区
  '310110': [121.5292, 31.2521], // 杨浦区
  '310112': [121.3816, 31.1129], // 闵行区
  '310113': [121.4897, 31.4041], // 宝山区
  '310114': [121.2655, 31.3747], // 嘉定区
  '310115': [121.5447, 31.2212], // 浦东新区
  '310117': [121.2235, 31.0328], // 松江区
  '310118': [121.1243, 31.1516], // 青浦区
  '310120': [121.4737, 30.9179], // 奉贤区
  '310151': [121.3973, 31.6233], // 崇明区
  // 深圳市（区级）
  '440304': [114.0543, 22.5217], // 福田区
  '440303': [114.1177, 22.5664], // 罗湖区
  '440305': [113.9309, 22.5329], // 南山区
  '440306': [113.8817, 22.5562], // 宝安区
  '440307': [114.2497, 22.7209], // 龙岗区
  '440308': [114.2753, 22.5917], // 盐田区
  '440309': [114.0229, 22.6569], // 龙华区
  '440310': [114.3528, 22.6914], // 坪山区
  '440311': [113.9255, 22.7699]  // 光明区
}

// 省份中心点坐标（用于下钻后自动聚焦）
const provinceCenters = {
  '110000': [116.4074, 39.9042], // 北京市
  '120000': [117.1901, 39.1255], // 天津市
  '130000': [114.5025, 38.0455], // 河北省
  '140000': [112.5492, 37.8570], // 山西省
  '150000': [111.6708, 40.8183], // 内蒙古自治区
  '210000': [123.4291, 41.7968], // 辽宁省
  '220000': [125.3245, 43.8868], // 吉林省
  '230000': [126.6424, 45.7569], // 黑龙江省
  '310000': [121.4737, 31.2304], // 上海市
  '320000': [118.7969, 32.0603], // 江苏省
  '330000': [120.1551, 30.2741], // 浙江省
  '340000': [117.2830, 31.8612], // 安徽省
  '350000': [119.3062, 26.0753], // 福建省
  '360000': [115.8922, 28.6760], // 江西省
  '370000': [117.0009, 36.6758], // 山东省
  '410000': [113.6654, 34.7579], // 河南省
  '420000': [114.2986, 30.5844], // 湖北省
  '430000': [112.9823, 28.1947], // 湖南省
  '440000': [113.2644, 23.1291], // 广东省
  '450000': [108.3200, 22.8240], // 广西壮族自治区
  '460000': [110.3312, 20.0310], // 海南省
  '500000': [106.5516, 29.5630], // 重庆市
  '510000': [104.0657, 30.6595], // 四川省
  '520000': [106.7135, 26.5783], // 贵州省
  '530000': [102.7123, 25.0406], // 云南省
  '540000': [91.1322, 29.6600], // 西藏自治区
  '610000': [108.9480, 34.2632], // 陕西省
  '620000': [103.8236, 36.0580], // 甘肃省
  '630000': [101.7782, 36.6171], // 青海省
  '640000': [106.2782, 38.4664], // 宁夏回族自治区
  '650000': [87.6177, 43.7928], // 新疆维吾尔自治区
  '710000': [121.5091, 25.0443], // 台湾省
  '810000': [114.1694, 22.3193], // 香港特别行政区
  '820000': [113.5439, 22.2006]  // 澳门特别行政区
}

// 加载省级地图
const loadProvinceMap = async (provinceName, provinceCode) => {
  try {
    // 检查缓存
    if (mapCache.has(provinceCode)) {
      const geoJson = mapCache.get(provinceCode)
      echarts.registerMap('province', geoJson)
      return true
    }
    
    const response = await fetch(`https://geo.datav.aliyun.com/areas_v3/bound/${provinceCode}_full.json`)
    if (!response.ok) {
      throw new Error(`Failed to load province map: ${provinceCode}`)
    }
    const geoJson = await response.json()
    mapCache.set(provinceCode, geoJson)
    echarts.registerMap('province', geoJson)
    return true
  } catch (error) {
    console.error('加载省份地图失败:', error)
    return false
  }
}

// 下钻到省份
const drillDownToProvince = async (provinceName) => {
  // 获取省份的 adcode
  const provinceCode = provinceAdcodes[provinceName]
  if (!provinceCode) {
    console.warn('未找到省份代码:', provinceName)
    return
  }
  
  const success = await loadProvinceMap(provinceName, provinceCode)
  
  if (success && chartInstance) {
    currentMapLevel.value = 'province'
    currentProvinceCode.value = provinceCode
    currentCityName.value = null
    currentCityCode.value = null
    
    // 获取省份中心点坐标
    const center = provinceCenters[provinceCode] || [104.0, 36.0]
    
    // 完全重新设置地图配置
    chartInstance.clear()
    chartInstance.setOption({
      backgroundColor: 'transparent',
      geo: {
        map: 'province',
        roam: true,
        center: center,
        zoom: 2.5,
        scaleLimit: { min: 0.8, max: 5 },
        label: {
          show: true,
          color: '#F1F5F9',
          fontSize: 9,
          fontWeight: '500'
        },
        emphasis: {
          label: {
            show: true,
            color: '#F1F5F9',
            fontSize: 10,
            fontWeight: 'bold'
          },
          itemStyle: {
            areaColor: '#1A2740',
            shadowColor: 'rgba(59, 130, 246, 0.8)',
            shadowBlur: 20
          }
        },
        itemStyle: {
          areaColor: '#0A1628',
          borderColor: '#3B82F6',
          borderWidth: 1,
          shadowColor: 'rgba(59, 130, 246, 0.3)',
          shadowBlur: 10
        },
        select: {
          itemStyle: {
            areaColor: '#3B82F6',
            shadowColor: 'rgba(59, 130, 246, 1)',
            shadowBlur: 30
          }
        },
        regions: getGeoRegions()
      },
      series: []
    }, { notMerge: true }) // ✅ 不合并配置，完全重置
    
    // 添加返回按钮提示
    showProvinceHint.value = true
    currentProvinceName.value = provinceName
  }
}

// 加载城市/县区地图
const loadCityMap = async (cityName, cityCode) => {
  try {
    // 检查缓存
    if (mapCache.has(cityCode)) {
      const geoJson = mapCache.get(cityCode)
      echarts.registerMap('city', geoJson)
      return true
    }
    
    const response = await fetch(`https://geo.datav.aliyun.com/areas_v3/bound/${cityCode}_full.json`)
    if (!response.ok) {
      throw new Error(`Failed to load city map: ${cityCode}`)
    }
    const geoJson = await response.json()
    mapCache.set(cityCode, geoJson)
    echarts.registerMap('city', geoJson)
    return true
  } catch (error) {
    console.error('加载城市地图失败:', error)
    return false
  }
}

// 下钻到城市/县区
const drillDownToCity = async (cityName) => {
  const cityCode = cityAdcodes[cityName]
  if (!cityCode) {
    console.warn('未找到城市代码或暂不支持该城市下钻:', cityName)
    // 即使没有代码，也更新 UI 提示
    showCityHint.value = true
    currentCityName.value = cityName
    return false
  }
  
  const success = await loadCityMap(cityName, cityCode)
  
  if (success && chartInstance) {
    currentMapLevel.value = 'city'
    currentCityCode.value = cityCode
    
    // 获取城市中心点坐标 - ✅ 自动聚焦到城市中心
    const center = cityCenters[cityCode] || [114.0579, 22.5431] // 默认深圳中心
    
    // 更新提示
    showCityHint.value = true
    currentCityName.value = cityName
    
    // 完全重新设置地图配置
    chartInstance.clear()
    chartInstance.setOption({
      backgroundColor: 'transparent',
      geo: {
        map: 'city',
        roam: true,
        center: center,
        zoom: 3.0,
        scaleLimit: { min: 0.8, max: 5 },
        label: {
          show: true,
          color: '#F1F5F9',
          fontSize: 8,
          fontWeight: '500'
        },
        emphasis: {
          label: {
            show: true,
            color: '#F1F5F9',
            fontSize: 9,
            fontWeight: 'bold'
          },
          itemStyle: {
            areaColor: '#1A2740',
            shadowColor: 'rgba(59, 130, 246, 0.8)',
            shadowBlur: 20
          }
        },
        itemStyle: {
          areaColor: '#0A1628',
          borderColor: '#3B82F6',
          borderWidth: 1,
          shadowColor: 'rgba(59, 130, 246, 0.3)',
          shadowBlur: 10
        },
        select: {
          itemStyle: {
            areaColor: '#3B82F6',
            shadowColor: 'rgba(59, 130, 246, 1)',
            shadowBlur: 30
          }
        },
        regions: getGeoRegions()
      },
      series: []
    }, { notMerge: true }) // ✅ 不合并配置，完全重置
    
    return true
  }
  
  return false
}

// 城市下钻提示
const showCityHint = ref(false)

// 返回上一级
const backToPrevious = () => {
  if (!chartInstance) return
  
  if (currentMapLevel.value === 'city' && currentProvinceCode.value) {
    // 从城市返回省份
    currentMapLevel.value = 'province'
    showCityHint.value = false
    currentCityName.value = null
    currentCityCode.value = null
    
    const center = provinceCenters[currentProvinceCode.value] || [104.0, 36.0]
    chartInstance.setOption({
      geo: {
        map: 'province',
        center: center,
        zoom: 2.5,
        label: getLabelConfig(),
        emphasis: {
          label: getEmphasisLabelConfig()
        }
      }
    }, { lazyUpdate: true })
  } else if (currentMapLevel.value === 'province') {
    // 从省份返回全国
    backToCountry()
  }
}

const getTerritoryColor = (territory) => {
  if (!territory) return '#6B7280'
  if (territory.is_ally) return '#22C55E'
  if (territory.team_id) return '#EF4444'
  return '#6B7280'
}

const getMapData = () => {
  return props.territories.map(t => {
    const coords = cityCoordinates[t.name] || [116.4074, 39.9042]
    return {
      ...t,
      name: t.name,
      value: [...coords, 1],
      itemStyle: {
        color: getTerritoryColor(t)
      }
    }
  })
}

const getGeoRegions = () => {
  return props.territories.map(t => ({
    name: t.name,
    itemStyle: {
      areaColor: t.is_ally 
        ? 'rgba(34, 197, 94, 0.25)' 
        : t.team_id 
          ? 'rgba(239, 68, 68, 0.2)' 
          : 'rgba(107, 114, 128, 0.1)',
      borderColor: t.is_ally 
        ? 'rgba(34, 197, 94, 0.5)' 
        : t.team_id 
          ? 'rgba(239, 68, 68, 0.4)' 
          : 'rgba(148, 163, 184, 0.3)',
      borderWidth: 1
    }
  }))
}

// 根据地图级别获取 label 配置
const getLabelConfig = () => {
  if (currentMapLevel.value === 'country') {
    // 全国级别：显示省份名称
    return {
      show: false, // 默认不显示，悬停时显示
      color: '#fff',
      fontSize: 10
    }
  } else if (currentMapLevel.value === 'province') {
    // 省级级别：显示城市名称，隐藏省份名称
    return {
      show: true,
      color: '#F1F5F9',
      fontSize: 9,
      fontWeight: '500'
    }
  } else {
    // 市级级别：显示区县名称，隐藏城市名称
    return {
      show: true,
      color: '#F1F5F9',
      fontSize: 8,
      fontWeight: '500'
    }
  }
}

// 根据地图级别获取 emphasis label 配置
const getEmphasisLabelConfig = () => {
  if (currentMapLevel.value === 'country') {
    return {
      show: true,
      color: '#fff'
    }
  } else if (currentMapLevel.value === 'province') {
    return {
      show: true,
      color: '#F1F5F9',
      fontSize: 10,
      fontWeight: 'bold'
    }
  } else {
    return {
      show: true,
      color: '#F1F5F9',
      fontSize: 9,
      fontWeight: 'bold'
    }
  }
}

const initChart = () => {
  if (!mapContainer.value) return
  
  chartInstance = echarts.init(mapContainer.value)
  
  const option = {
    backgroundColor: 'transparent',
    geo: {
      map: 'china',
      roam: true,
      zoom: currentZoom,
      center: currentCenter,
      scaleLimit: {
        min: 0.8,
        max: 5
      },
      label: getLabelConfig(),
      itemStyle: {
        areaColor: '#0A1628',
        borderColor: '#3B82F6',
        borderWidth: 1,
        shadowColor: 'rgba(59, 130, 246, 0.3)',
        shadowBlur: 10
      },
      emphasis: {
        label: getEmphasisLabelConfig(),
        itemStyle: {
          areaColor: '#1A2740',
          shadowColor: 'rgba(59, 130, 246, 0.8)',
          shadowBlur: 20
        }
      },
      select: {
        itemStyle: {
          areaColor: '#3B82F6',
          shadowColor: 'rgba(59, 130, 246, 1)',
          shadowBlur: 30
        }
      },
      regions: getGeoRegions()
    },
    series: [
      {
        name: '领土标记',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: getMapData(),
        symbolSize: 10,
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke',
          scale: 3,
          period: 3
        },
        label: {
          show: true,
          formatter: '{b}',
          position: 'right',
          color: '#F1F5F9',
          fontSize: 11,
          fontWeight: 'bold',
          textShadowColor: 'rgba(0, 0, 0, 0.8)',
          textShadowBlur: 4
        },
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(59, 130, 246, 0.5)'
        }
      },
      {
        name: '家乡标记',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: props.hometown ? [{
          name: props.hometown.name || '家乡',
          value: [...(cityCoordinates[props.hometown.name] || [116.4074, 39.9042]), 10],
          itemStyle: {
            color: '#F59E0B'
          },
          label: {
            show: true,
            formatter: '🏠',
            position: 'inside',
            fontSize: 12
          }
        }] : [],
        symbolSize: 30,
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke',
          scale: 4,
          period: 2
        },
        itemStyle: {
          color: '#F59E0B',
          shadowBlur: 20,
          shadowColor: 'rgba(245, 158, 11, 0.6)'
        }
      }
    ],
    animationDuration: 1000,
    animationEasing: 'cubicOut'
  }
  
  chartInstance.setOption(option, true)
  
  // 单击事件 - 支持三级下钻
  chartInstance.on('click', async (params) => {
    // 点击的是地图区域（geo）
    if (params.componentType === 'geo' || params.componentType === 'series') {
      const territoryName = params.name
      
      // 根据当前地图级别处理点击
      if (currentMapLevel.value === 'country') {
        // 全国级别：双击省份下钻（已在 dblclick 处理）
        // 单击显示详情
        const territory = props.territories.find(t => t.name === territoryName)
        if (territory) {
          emit('territory-click', {
            territory,
            position: { x: params.event.offsetX, y: params.event.offsetY }
          })
        }
      } else if (currentMapLevel.value === 'province') {
        // 省级级别：点击城市下钻到县区
        const cityCode = cityAdcodes[territoryName]
        if (cityCode) {
          console.log('点击城市，准备下钻:', territoryName)
          await drillDownToCity(territoryName)
        } else {
          // 没有下钻数据，显示详情
          const territory = props.territories.find(t => t.name === territoryName)
          if (territory) {
            emit('territory-click', {
              territory,
              position: { x: params.event.offsetX, y: params.event.offsetY }
            })
          }
        }
      } else if (currentMapLevel.value === 'city') {
        // 县区级别：显示详情
        const territory = props.territories.find(t => t.name === territoryName)
        if (territory) {
          emit('territory-click', {
            territory,
            position: { x: params.event.offsetX, y: params.event.offsetY }
          })
        }
      }
    }
  })
  
  // 双击事件 - 下钻到省份或快速聚焦
  chartInstance.getZr().on('dblclick', async (params) => {
    // 检查是否点击在地图区域上
    const pointInPixel = [params.offsetX, params.offsetY]
    
    // 尝试获取点击位置的地理信息
    if (currentMapLevel.value === 'country') {
      // 在全国级别，双击省份进行下钻
      // 先通过单击事件获取省份名称
      console.log('双击地图，准备下钻到省份...')
      // 下钻逻辑在单击事件中处理
    } else {
      // 在省级级别，双击聚焦
      const pointInGeo = chartInstance.convertFromPixel('geo', pointInPixel)
      if (pointInGeo) {
        chartInstance.setOption({
          geo: {
            center: pointInGeo,
            zoom: 3
          }
        }, { lazyUpdate: true })
      }
    }
  })
  
  // 单击 geo 区域 - 支持下钻
  chartInstance.on('click', { geoIndex: 0 }, (params) => {
    if (currentMapLevel.value === 'country' && params.name) {
      // 检查是否是省份点击
      const provinceCode = provinceAdcodes[params.name]
      if (provinceCode) {
        console.log('点击省份，准备下钻:', params.name)
        drillDownToProvince(params.name)
      }
    }
  })
  
  // 地图缩放事件
  chartInstance.on('georoam', () => {
    const option = chartInstance.getOption()
    currentZoom = option.geo[0].zoom
    currentCenter = option.geo[0].center
  })
}

// 返回家乡
const goToHometown = () => {
  if (!props.hometown || !chartInstance) return
  
  const coords = cityCoordinates[props.hometown.name] || [116.4074, 39.9042]
  
  chartInstance.setOption({
    geo: {
      center: coords,
      zoom: 3.5
    }
  }, { lazyUpdate: true })
}

// 重置地图视图
const resetView = () => {
  if (!chartInstance) return
  
  if (currentMapLevel.value !== 'country') {
    // 如果在省级视图，返回全国
    currentMapLevel.value = 'country'
    currentProvinceCode.value = null
    showProvinceHint.value = false
    currentProvinceName.value = null
    
    chartInstance.setOption({
      geo: {
        map: 'china',
        center: [104.0, 36.0],
        zoom: 1.2
      }
    }, { lazyUpdate: true })
  } else {
    // 在全国视图，重置到默认
    chartInstance.setOption({
      geo: {
        center: [104.0, 36.0],
        zoom: 1.2
      }
    }, { lazyUpdate: true })
  }
}

// 返回全国视图
const backToCountry = () => {
  resetView()
}

// 键盘事件处理
const handleKeyDown = (e) => {
  if (e.key === ' ') {
    e.preventDefault()
    goToHometown()
    emit('go-home')
  } else if (e.key === 'Escape') {
    resetView()
  }
}

// 更新数据
watch(() => props.territories, () => {
  if (chartInstance) {
    chartInstance.setOption({
      geo: { regions: getGeoRegions() },
      series: [{ data: getMapData() }]
    })
  }
}, { deep: true })

// 选中状态
watch(() => props.selectedTerritory, (newVal) => {
  if (chartInstance && newVal) {
    chartInstance.dispatchAction({
      type: 'highlight',
      seriesIndex: 0,
      name: newVal.name
    })
  }
}, { immediate: true })

// 窗口大小变化
const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

onMounted(() => {
  loadChinaMap()
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

defineExpose({
  goToHometown,
  resetView
})
</script>

<template>
  <div class="map-wrapper">
    <div ref="mapContainer" class="china-map-container"></div>
    
    <!-- 省份下钻提示 -->
    <Transition name="slide-down">
      <div v-if="showProvinceHint && !showCityHint" class="province-hint">
        <div class="hint-content">
          <span class="hint-icon">📍</span>
          <span class="hint-text">当前查看：<strong>{{ currentProvinceName }}</strong></span>
          <span class="hint-sub">点击城市可下钻到区县</span>
        </div>
        <button class="btn-back" @click="backToPrevious">
          <span>↩</span>
          <span>{{ currentCityName ? '返回省份' : '返回全国' }}</span>
        </button>
      </div>
    </Transition>
    
    <!-- 城市下钻提示 -->
    <Transition name="slide-down">
      <div v-if="showCityHint" class="province-hint">
        <div class="hint-content">
          <span class="hint-icon">📍</span>
          <span class="hint-text">当前查看：<strong>{{ currentProvinceName }}</strong> · {{ currentCityName }}</span>
        </div>
        <button class="btn-back" @click="backToPrevious">
          <span>↩</span>
          <span>返回省份</span>
        </button>
      </div>
    </Transition>
    
    <div class="map-controls">
      <button class="control-btn" @click="goToHometown" title="返回家乡 (空格键)">
        <span>🏠</span>
      </button>
      <button class="control-btn" @click="resetView" title="重置视图 (Esc)">
        <span>🎯</span>
      </button>
      <button 
        v-if="showProvinceHint || showCityHint" 
        class="control-btn back-btn" 
        @click="backToPrevious" 
        title="返回上一级"
      >
        <span>↩</span>
      </button>
    </div>
    
    <div class="map-hint">
      <span>滚轮缩放</span>
      <span>拖拽平移</span>
      <span>双击聚焦</span>
      <span>空格回家</span>
    </div>
  </div>
</template>

<style scoped>
.map-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.china-map-container {
  width: 100%;
  height: 100%;
  min-height: 400px;
  cursor: grab;
}

.china-map-container:active {
  cursor: grabbing;
}

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

.map-hint {
  position: absolute;
  bottom: 24px;
  left: 24px;
  display: flex;
  gap: 16px;
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

/* 省份下钻提示 */
.province-hint {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(26, 39, 64, 0.95);
  border: 2px solid rgba(59, 130, 246, 0.4);
  border-radius: 12px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 20;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.hint-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hint-icon {
  font-size: 20px;
}

.hint-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 14px;
  color: #94A3B8;
}

.hint-text strong {
  color: #F1F5F9;
  font-weight: 600;
}

.hint-sub {
  font-size: 12px;
  color: #64748B;
  margin-top: 2px;
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #3B82F6, #2563EB);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-back:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.back-btn {
  background: rgba(59, 130, 246, 0.3) !important;
  border-color: rgba(59, 130, 246, 0.5) !important;
}

/* 动画 */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}
</style>