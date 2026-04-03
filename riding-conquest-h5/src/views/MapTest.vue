/**
 * 县区级地图测试页面
 * 用于验证 2800+ 县区渲染和下钻功能
 */

<script setup>
import { ref, onMounted } from 'vue'
import CountyMap from '../components/CountyMap.vue'

const mapRef = ref(null)
const currentLevel = ref('country')
const focusCode = ref(null)
const selectedTerritory = ref(null)
const loadError = ref(null)

// 模拟领土数据（示例：只填充部分数据用于测试）
const territories = ref([
  // 北京市 - 全部设为我方
  { code: '110101', name: '东城区', team_id: 1, is_ally: true, defense_value: 100 },
  { code: '110102', name: '西城区', team_id: 1, is_ally: true, defense_value: 100 },
  { code: '110105', name: '朝阳区', team_id: 1, is_ally: true, defense_value: 100 },
  { code: '110106', name: '丰台区', team_id: 1, is_ally: true, defense_value: 100 },
  
  // 上海市 - 部分敌方
  { code: '310101', name: '黄浦区', team_id: 2, is_ally: false, defense_value: 150 },
  { code: '310104', name: '徐汇区', team_id: 2, is_ally: false, defense_value: 120 },
  { code: '310105', name: '长宁区', team_id: 1, is_ally: true, defense_value: 100 },
  
  // 广东省深圳市 - 混合
  { code: '440303', name: '罗湖区', team_id: 1, is_ally: true, defense_value: 100 },
  { code: '440304', name: '福田区', team_id: 1, is_ally: true, defense_value: 100 },
  { code: '440305', name: '南山区', team_id: 3, is_ally: false, defense_value: 200 },
  { code: '440306', name: '宝安区', team_id: null, is_ally: false, defense_value: 0 },
  { code: '440307', name: '龙岗区', team_id: null, is_ally: false, defense_value: 0 },
  { code: '440308', name: '盐田区', team_id: null, is_ally: false, defense_value: 0 },
  { code: '440309', name: '龙华区', team_id: 1, is_ally: true, defense_value: 100 },
  { code: '440310', name: '坪山区', team_id: null, is_ally: false, defense_value: 0 },
  { code: '440311', name: '光明区', team_id: 2, is_ally: false, defense_value: 150 },
  
  // 家乡（示例：北京）
  { code: '110000', name: '北京市', is_hometown: true }
])

const hometownCode = ref('110105') // 朝阳区作为家乡
const handleTerritoryClick = (data) => {
  console.log('领土点击:', data)
  selectedTerritory.value = data.territory || data
  
  // 弹窗会由 CountyMap 组件自动显示，不需要 alert
  console.log('选中领土:', data.territory?.name, '归属:', data.territory?.is_ally ? '我方' : '敌方')
}

const handleLevelChange = (data) => {
  console.log('级别变化:', data)
  currentLevel.value = data.level
  focusCode.value = data.code
}

const handleProvinceClick = (data) => {
  console.log('省份点击:', data)
}

const handleGoHome = (data) => {
  console.log('返回家乡:', data)
}

const handleError = (error) => {
  loadError.value = error
  console.error('地图加载错误:', error)
}

const retryLoad = () => {
  loadError.value = null
  if (mapRef.value) {
    mapRef.value.resetView()
  }
}

// 测试功能：显示弹窗
const testShowPopup = () => {
  const testTerritory = territories.value[0] // 东城区
  if (mapRef.value && mapRef.value.showTerritoryPopup) {
    mapRef.value.showTerritoryPopup(testTerritory, { x: 500, y: 400 })
    console.log('已调用 showTerritoryPopup', testTerritory)
  } else {
    console.log('mapRef 或 showTerritoryPopup 不存在')
  }
}

const testDrillDown = async (level, code) => {
  if (mapRef.value) {
    if (level === 'province') {
      await mapRef.value.drillDown('province', code)
    } else if (level === 'city') {
      await mapRef.value.drillDown('city', code)
    }
  }
}

const testReset = async () => {
  if (mapRef.value) {
    await mapRef.value.resetView()
  }
}

onMounted(() => {
  console.log('地图测试页面已加载')
  console.log('测试数据:', territories.value)
})
</script>

<template>
  <div class="test-page">
    <header class="test-header">
      <h1>🗺️ 县区级地图测试</h1>
      <p class="subtitle">三级下钻：全国 → 省 → 市/县区</p>
    </header>
    
    <div class="test-controls">
      <button @click="testShowPopup" class="test-btn">
        测试弹窗（东城区）
      </button>
      <button @click="testDrillDown('province', '110000')" class="test-btn">
        下钻到北京市
      </button>
      <button @click="testDrillDown('province', '310000')" class="test-btn">
        下钻到上海市
      </button>
      <button @click="testDrillDown('province', '440000')" class="test-btn">
        下钻到广东省
      </button>
      <button @click="testDrillDown('city', '440300')" class="test-btn">
        下钻到深圳市
      </button>
      <button @click="testReset" class="test-btn reset">
        重置地图
      </button>
    </div>
    
    <div class="map-info">
      <div class="info-card">
        <h3>当前状态</h3>
        <p>级别：<strong>{{ currentLevel }}</strong></p>
        <p>聚焦代码：<strong>{{ focusCode || '无' }}</strong></p>
        <p>选中领土：<strong>{{ selectedTerritory?.name || '无' }}</strong></p>
      </div>
      
      <div class="info-card">
        <h3>测试数据</h3>
        <p>领土数量：<strong>{{ territories.length }}</strong></p>
        <p>我方领土：<strong>{{ territories.filter(t => t.is_ally).length }}</strong></p>
        <p>敌方领土：<strong>{{ territories.filter(t => t.team_id && !t.is_ally).length }}</strong></p>
        <p>无主之地：<strong>{{ territories.filter(t => !t.team_id && !t.is_ally).length }}</strong></p>
      </div>
    </div>
    
    <div class="map-container">
      <CountyMap
        ref="mapRef"
        :territories="territories"
        :map-level="currentLevel"
        :focus-code="focusCode"
        :hometown-code="hometownCode"
        :selected-territory="selectedTerritory"
        @territory-click="handleTerritoryClick"
        @level-change="handleLevelChange"
        @province-click="handleProvinceClick"
        @go-home="handleGoHome"
      />
    </div>
    
    <div v-if="loadError" class="error-message">
      <h3>⚠️ 地图加载失败</h3>
      <p>{{ loadError }}</p>
      <button @click="retryLoad" class="retry-btn">重试</button>
    </div>
    
    <footer class="test-footer">
      <h3>📖 使用说明</h3>
      <ul>
        <li><strong>点击省份</strong> → 下钻到省级（显示该省所有城市）</li>
        <li><strong>点击城市</strong> → 下钻到县区级（显示该市所有县区）</li>
        <li><strong>点击县区</strong> → 选中领土，显示详情</li>
        <li><strong>滚轮</strong> → 缩放地图</li>
        <li><strong>拖拽</strong> → 平移地图</li>
        <li><strong>双击</strong> → 快速聚焦到点击位置</li>
        <li><strong>Esc</strong> → 返回上级</li>
        <li><strong>空格键</strong> → 返回家乡</li>
        <li><strong>0 键</strong> → 重置到全国视图</li>
      </ul>
    </footer>
  </div>
</template>

<style scoped>
.test-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #070E1B 0%, #0A1628 100%);
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
}

.test-header {
  text-align: center;
  margin-bottom: 20px;
}

.test-header h1 {
  color: #F1F5F9;
  font-size: 28px;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.subtitle {
  color: #94A3B8;
  font-size: 14px;
  margin: 0;
}

.test-controls {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.test-btn {
  padding: 10px 20px;
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.4);
  border-radius: 8px;
  color: #F1F5F9;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.test-btn:hover {
  background: rgba(59, 130, 246, 0.3);
  border-color: rgba(59, 130, 246, 0.6);
  transform: translateY(-2px);
}

.test-btn.reset {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.4);
}

.test-btn.reset:hover {
  background: rgba(239, 68, 68, 0.3);
  border-color: rgba(239, 68, 68, 0.6);
}

.map-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.info-card {
  background: rgba(26, 39, 64, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 12px;
  padding: 16px;
  backdrop-filter: blur(8px);
}

.info-card h3 {
  color: #3B82F6;
  font-size: 16px;
  margin: 0 0 12px 0;
}

.info-card p {
  color: #94A3B8;
  font-size: 13px;
  margin: 6px 0;
}

.info-card strong {
  color: #F1F5F9;
}

.map-container {
  height: calc(100vh - 500px);
  min-height: 600px;
  max-height: 900px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(59, 130, 246, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  margin-bottom: 20px;
}

.test-footer {
  background: rgba(26, 39, 64, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(8px);
}

.test-footer h3 {
  color: #F59E0B;
  font-size: 16px;
  margin: 0 0 12px 0;
}

.test-footer ul {
  color: #94A3B8;
  font-size: 13px;
  margin: 0;
  padding-left: 20px;
}

.test-footer li {
  margin: 6px 0;
  line-height: 1.6;
}

.test-footer strong {
  color: #3B82F6;
}

.error-message {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  text-align: center;
}

.error-message h3 {
  color: #EF4444;
  margin: 0 0 10px 0;
}

.error-message p {
  color: #F1F5F9;
  margin: 0 0 15px 0;
}

.retry-btn {
  padding: 10px 24px;
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.4);
  border-radius: 8px;
  color: #F1F5F9;
  cursor: pointer;
  font-size: 14px;
}

.retry-btn:hover {
  background: rgba(239, 68, 68, 0.3);
}
</style>
