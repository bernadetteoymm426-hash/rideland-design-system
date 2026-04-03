<script setup lang="ts">
import { ref } from 'vue'
import HeadquartersSelector from '@/components/HeadquartersSelector.vue'

const showSelector = ref(false)
const selectedHeadquarters = ref<{ district: string; code: string } | null>(null)

function handleConfirm(headquarters: { district: string; code: string }) {
  selectedHeadquarters.value = headquarters
  showSelector.value = false
  console.log('✅ 已选择大本营:', headquarters)
}

function handleClose() {
  showSelector.value = false
}
</script>

<template>
  <div class="test-page">
    <h1>🏰 大本营选择器测试</h1>
    <p class="subtitle">Headquarters Selector Test</p>

    <div class="test-content">
      <button class="test-btn" @click="showSelector = true">
        🗺️ 打开地图选择器
      </button>

      <div v-if="selectedHeadquarters" class="result">
        <h3>✅ 已选择：</h3>
        <p><strong>地区：</strong>{{ selectedHeadquarters.district }}</p>
        <p><strong>代码：</strong>{{ selectedHeadquarters.code }}</p>
      </div>

      <div v-else class="hint">
        <p>👆 点击上方按钮打开地图选择器</p>
        <p>点击地图上的省份/城市进行选择</p>
      </div>
    </div>

    <!-- 大本营选择器 -->
    <HeadquartersSelector
      :visible="showSelector"
      @confirm="handleConfirm"
      @close="handleClose"
    />
  </div>
</template>

<style scoped>
.test-page {
  min-height: 100vh;
  background: #070E1B;
  padding: 40px 20px;
  text-align: center;
}

h1 {
  font-size: 32px;
  font-weight: 700;
  color: #F1F5F9;
  margin: 0 0 8px;
}

.subtitle {
  font-size: 14px;
  color: #94A3B8;
  margin: 0 0 40px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.test-content {
  max-width: 600px;
  margin: 0 auto;
}

.test-btn {
  padding: 16px 32px;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
}

.test-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.result {
  margin-top: 40px;
  padding: 24px;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 12px;
  text-align: left;
}

.result h3 {
  color: #22C55E;
  margin: 0 0 16px;
  font-size: 20px;
}

.result p {
  color: #F1F5F9;
  margin: 8px 0;
  font-size: 16px;
}

.hint {
  margin-top: 40px;
  padding: 24px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
}

.hint p {
  color: #94A3B8;
  margin: 8px 0;
  font-size: 15px;
}
</style>
