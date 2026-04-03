<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { UserHometown } from '@/stores/user'

interface Props {
  visible: boolean
  recommendedHometown?: UserHometown | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  confirm: [hometown: UserHometown]
  skip: []
  close: []
}>()

// 省份数据（简化版，实际应该用完整数据）
const provinces = ref([
  { name: '北京市', code: '110000', cities: [{ name: '北京市', code: '110100' }] },
  { name: '上海市', code: '310000', cities: [{ name: '上海市', code: '310100' }] },
  { name: '广东省', code: '440000', cities: [
    { name: '广州市', code: '440100' },
    { name: '深圳市', code: '440300' },
    { name: '东莞市', code: '441900' },
  ]},
  { name: '浙江省', code: '330000', cities: [
    { name: '杭州市', code: '330100' },
    { name: '宁波市', code: '330200' },
  ]},
  { name: '江苏省', code: '320000', cities: [
    { name: '南京市', code: '320100' },
    { name: '苏州市', code: '320500' },
  ]},
  { name: '山东省', code: '370000', cities: [
    { name: '济南市', code: '370100' },
    { name: '青岛市', code: '370200' },
  ]},
])

const selectedProvince = ref<string>('')
const selectedCity = ref<string>('')

// 当前选中的城市数据
const currentCities = computed(() => {
  if (!selectedProvince.value) return []
  const province = provinces.value.find(p => p.code === selectedProvince.value)
  return province?.cities || []
})

// 初始化选择
onMounted(() => {
  if (props.recommendedHometown) {
    selectedProvince.value = props.recommendedHometown.provinceCode
    selectedCity.value = props.recommendedHometown.cityCode
  } else if (provinces.value.length > 0) {
    selectedProvince.value = provinces.value[0].code
    currentCities.value = provinces.value[0].cities
    selectedCity.value = currentCities.value[0]?.code || ''
  }
})

function handleProvinceChange() {
  selectedCity.value = currentCities.value[0]?.code || ''
}

function handleConfirm() {
  if (!selectedProvince.value || !selectedCity.value) return
  
  const province = provinces.value.find(p => p.code === selectedProvince.value)
  const city = currentCities.value.find(c => c.code === selectedCity.value)
  
  if (province && city) {
    emit('confirm', {
      province: province.name,
      provinceCode: province.code,
      city: city.name,
      cityCode: city.code,
    })
  }
}

function handleSkip() {
  emit('skip')
}

function handleClose() {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="hometown-modal-overlay" @click="handleClose">
        <div class="hometown-modal" @click.stop>
          <!-- 头部 -->
          <div class="modal-header">
            <h3 class="modal-title">🏠 选择您的家乡</h3>
            <button class="modal-close" @click="handleClose">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          
          <!-- 内容区 -->
          <div class="modal-content">
            <!-- 推荐提示 -->
            <div v-if="recommendedHometown" class="recommend-hint">
              <div class="hint-icon">📍</div>
              <div class="hint-text">
                <div class="hint-title">系统检测到您可能来自</div>
                <div class="hint-location">
                  {{ recommendedHometown.province }} · {{ recommendedHometown.city }}
                </div>
              </div>
            </div>
            
            <!-- 省份选择 -->
            <div class="form-group">
              <label class="form-label">选择省份</label>
              <select 
                v-model="selectedProvince" 
                class="form-select"
                @change="handleProvinceChange"
              >
                <option 
                  v-for="province in provinces" 
                  :key="province.code" 
                  :value="province.code"
                >
                  {{ province.name }}
                </option>
              </select>
            </div>
            
            <!-- 城市选择 -->
            <div class="form-group">
              <label class="form-label">选择城市</label>
              <select v-model="selectedCity" class="form-select">
                <option 
                  v-for="city in currentCities" 
                  :key="city.code" 
                  :value="city.code"
                >
                  {{ city.name }}
                </option>
              </select>
            </div>
            
            <!-- 选择结果预览 -->
            <div class="selection-preview">
              <div class="preview-label">您的家乡将设置为：</div>
              <div class="preview-value">
                <span class="province">{{ provinces.find(p => p.code === selectedProvince)?.name }}</span>
                <span class="separator">·</span>
                <span class="city">{{ currentCities.find(c => c.code === selectedCity)?.name }}</span>
              </div>
            </div>
          </div>
          
          <!-- 底部按钮 -->
          <div class="modal-footer">
            <button class="btn btn-skip" @click="handleSkip">
              暂不设置
            </button>
            <button class="btn btn-confirm" @click="handleConfirm">
              确认家乡
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* 遮罩层 */
.hometown-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

/* 弹窗主体 */
.hometown-modal {
  background: linear-gradient(135deg, #F5E6D3 0%, #FFF8E7 100%);
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  border: 2px solid rgba(212, 175, 55, 0.3);
}

/* 头部 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, transparent 100%);
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: #2D2D2D;
  margin: 0;
}

.modal-close {
  background: transparent;
  border: none;
  color: #8B7355;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: rgba(212, 175, 55, 0.1);
  color: #D4AF37;
}

/* 内容区 */
.modal-content {
  padding: 24px;
}

/* 推荐提示 */
.recommend-hint {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 12px;
  margin-bottom: 24px;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.hint-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.hint-text {
  flex: 1;
}

.hint-title {
  font-size: 13px;
  color: #8B7355;
  margin-bottom: 4px;
}

.hint-location {
  font-size: 16px;
  font-weight: 600;
  color: #D4AF37;
}

/* 表单组 */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #2D2D2D;
  margin-bottom: 8px;
}

.form-select {
  width: 100%;
  padding: 12px 16px;
  font-size: 15px;
  color: #2D2D2D;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.form-select:focus {
  border-color: #D4AF37;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

/* 选择预览 */
.selection-preview {
  padding: 16px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  text-align: center;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.preview-label {
  font-size: 12px;
  color: #8B7355;
  margin-bottom: 8px;
}

.preview-value {
  font-size: 18px;
  font-weight: 700;
  color: #D4AF37;
}

.preview-value .separator {
  margin: 0 8px;
  color: #C9A961;
}

/* 底部按钮 */
.modal-footer {
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
  background: linear-gradient(135deg, transparent 0%, rgba(212, 175, 55, 0.05) 100%);
}

.btn {
  flex: 1;
  padding: 14px 20px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-skip {
  background: transparent;
  border: 2px solid rgba(139, 115, 85, 0.3);
  color: #8B7355;
}

.btn-skip:hover {
  border-color: #8B7355;
  background: rgba(139, 115, 85, 0.05);
}

.btn-confirm {
  background: linear-gradient(135deg, #D4AF37 0%, #C9A961 100%);
  color: #fff;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.btn-confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(212, 175, 55, 0.4);
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

.fade-enter-active .hometown-modal,
.fade-leave-active .hometown-modal {
  transition: transform 0.3s ease;
}

.fade-enter-from .hometown-modal,
.fade-leave-to .hometown-modal {
  transform: scale(0.95) translateY(10px);
}
</style>
