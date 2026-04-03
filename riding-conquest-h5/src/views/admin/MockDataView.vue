<script setup>
import { ref } from 'vue'
import request from '@/utils/request'

const loading = ref(false)
const generating = ref(false)
const result = ref(null)
const error = ref('')

const formData = ref({
  user_count: 20,
  team_count: 5,
  rides_per_user: 10,
})

async function quickSetup() {
  loading.value = true
  error.value = ''
  result.value = null
  
  try {
    const response = await request.post('/mock/quick-setup')
    result.value = response.data
  } catch (err) {
    error.value = '生成失败：' + err.message
  } finally {
    loading.value = false
  }
}

async function generateData() {
  generating.value = true
  error.value = ''
  result.value = null
  
  try {
    const response = await request.post('/mock/generate', formData.value)
    result.value = response.data
  } catch (err) {
    error.value = '生成失败：' + err.message
  } finally {
    generating.value = false
  }
}

async function getLeaderboard() {
  loading.value = true
  error.value = ''
  result.value = null
  
  try {
    const response = await request.get('/mock/leaderboard')
    result.value = response.data
  } catch (err) {
    error.value = '获取失败：' + err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="mock-page">
    <!-- 背景层 -->
    <div class="page-bg">
      <img src="/assets/images/bg-conquest-abstract.jpg" alt="" class="bg-image" />
      <div class="bg-darken"></div>
    </div>

    <!-- 内容层 -->
    <div class="page-content">
      <!-- 标题区域 -->
      <div class="header-section">
        <h1 class="page-title">🛠️ 模拟数据管理</h1>
        <p class="page-subtitle">快速生成测试数据，无需真实骑行</p>
      </div>

      <!-- 操作按钮 -->
      <div class="card action-card">
        <div class="card-body">
          <div class="actions">
            <button @click="quickSetup" :disabled="loading" class="btn-primary">
              {{ loading ? '生成中...' : '⚡ 一键生成测试环境' }}
            </button>
            <button @click="getLeaderboard" :disabled="loading" class="btn-secondary">
              📊 生成排行榜数据
            </button>
          </div>
        </div>
      </div>

      <!-- 自定义生成 -->
      <div class="card custom-card">
        <div class="card-header">
          <div class="header-left">
            <div class="w-1 h-4 bg-gold rounded-full"></div>
            <h3>自定义生成</h3>
          </div>
        </div>
        <div class="card-body">
          <div class="form-grid">
            <div class="form-item">
              <label>用户数量 (1-100)</label>
              <input v-model.number="formData.user_count" type="number" min="1" max="100" />
            </div>
            <div class="form-item">
              <label>战队数量 (1-20)</label>
              <input v-model.number="formData.team_count" type="number" min="1" max="20" />
            </div>
            <div class="form-item">
              <label>每人骑行次数 (1-50)</label>
              <input v-model.number="formData.rides_per_user" type="number" min="1" max="50" />
            </div>
          </div>
          <button @click="generateData" :disabled="generating" class="btn-accent">
            {{ generating ? '生成中...' : '🔧 生成自定义数据' }}
          </button>
        </div>
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="card error-card">
        <div class="card-body error-body">
          <van-icon name="close-circle-o" size="20" color="#EF4444" />
          <span>{{ error }}</span>
        </div>
      </div>

      <!-- 结果展示 -->
      <div v-if="result" class="card result-card">
        <div class="card-header">
          <div class="header-left">
            <div class="w-1 h-4 bg-green rounded-full"></div>
            <h3>✅ {{ result.message }}</h3>
          </div>
        </div>
        <div class="card-body">
          <!-- 统计摘要 -->
          <div v-if="result.summary" class="summary-grid">
            <div class="summary-item" v-if="result.summary.users">
              <div class="data-num">{{ result.summary.users }}</div>
              <div class="data-label">用户</div>
            </div>
            <div class="summary-item" v-if="result.summary.teams">
              <div class="data-num">{{ result.summary.teams }}</div>
              <div class="data-label">战队</div>
            </div>
            <div class="summary-item" v-if="result.summary.total_rides">
              <div class="data-num">{{ result.summary.total_rides }}</div>
              <div class="data-label">骑行记录</div>
            </div>
            <div class="summary-item" v-if="result.summary.avg_rides">
              <div class="data-num">{{ result.summary.avg_rides }}</div>
              <div class="data-label">人均骑行</div>
            </div>
          </div>
          
          <!-- 数据预览 -->
          <div v-if="result.data" class="data-preview">
            <h4 class="preview-title">数据预览</h4>
            
            <div class="preview-section" v-if="result.data.users">
              <h5>用户 (前 5 个)</h5>
              <div class="data-list">
                <div v-for="user in result.data.users.slice(0, 5)" :key="user.id" class="data-item">
                  <div class="user-avatar">
                    <span class="user-char">{{ user.nickname.charAt(0) }}</span>
                  </div>
                  <div class="user-info">
                    <div class="user-name">{{ user.nickname }}</div>
                    <div class="user-phone">{{ user.phone }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="preview-section" v-if="result.data.teams">
              <h5>战队</h5>
              <div class="data-list">
                <div v-for="team in result.data.teams" :key="team.id" class="data-item team-item">
                  <div class="team-icon">
                    <van-icon name="friends-o" size="20" color="#D4AF37" />
                  </div>
                  <div class="team-info">
                    <div class="team-name">{{ team.name }}</div>
                    <div class="team-leader">队长：{{ team.leader_id }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="preview-section" v-if="result.data.team_rank">
              <h5>战队排行榜</h5>
              <div class="rank-list">
                <div v-for="item in result.data.team_rank.slice(0, 5)" :key="item.rank" class="rank-item">
                  <div class="rank-badge" :class="'rank-' + item.rank">{{ item.rank }}</div>
                  <span class="rank-name">{{ item.team_name }}</span>
                  <span class="rank-dist">{{ item.total_distance.toFixed(1) }} km</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 使用指南 -->
      <div class="card tips-card">
        <div class="card-header">
          <div class="header-left">
            <div class="w-1 h-4 bg-gold rounded-full"></div>
            <h3>💡 使用指南</h3>
          </div>
        </div>
        <div class="card-body">
          <ul class="tips-list">
            <li>
              <van-icon name="bolt" size="18" color="#D4AF37" />
              <span><strong>一键生成：</strong>快速创建 20 用户 +5 战队 +200 骑行记录</span>
            </li>
            <li>
              <van-icon name="setting-o" size="18" color="#D4AF37" />
              <span><strong>自定义生成：</strong>按需配置用户、战队、骑行数据量</span>
            </li>
            <li>
              <van-icon name="chart-trending-o" size="18" color="#D4AF37" />
              <span><strong>排行榜数据：</strong>生成完整的战队排行榜</span>
            </li>
            <li>
              <van-icon name="replay" size="18" color="#D4AF37" />
              <span><strong>测试流程：</strong>生成数据后，刷新页面查看效果</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ─── 页面结构 ─── */
.mock-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.page-bg {
  position: absolute;
  inset: 0;
}

.bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

.bg-darken {
  position: absolute;
  inset: 0;
  background: rgba(245, 230, 211, 0.85);
}

.page-content {
  position: relative;
  z-index: 10;
  height: 100%;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 80px;
}

/* ─── 标题区域 ─── */
.header-section {
  text-align: center;
  margin-bottom: 20px;
}

.page-title {
  font-size: 22px;
  font-weight: bold;
  color: #2D2D2D;
  margin: 0 0 8px;
}

.page-subtitle {
  font-size: 14px;
  color: #8B7355;
  margin: 0;
}

/* ─── 卡片样式 ─── */
.card {
  background: rgba(255, 255, 255, 0.9);
  background-image: url('/assets/images/texture-card-subtle.jpg');
  background-size: 400px;
  background-blend-mode: multiply;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(212, 175, 55, 0.4);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(212, 175, 55, 0.15);
  margin-bottom: 16px;
  position: relative;
  overflow: hidden;
}

.card::before,
.card::after {
  content: '';
  position: absolute;
  width: 60px;
  height: 60px;
  background: url('/assets/images/corner-abstract-gold.jpg');
  background-size: cover;
  opacity: 0.4;
  pointer-events: none;
}

.card::before {
  top: 0;
  left: 0;
}

.card::after {
  bottom: 0;
  right: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-left h3 {
  font-size: 16px;
  font-weight: 600;
  color: #2D2D2D;
  margin: 0;
}

.bg-gold {
  background: #D4AF37;
}

.bg-green {
  background: #22C55E;
}

.rounded-full {
  border-radius: 9999px;
}

.w-1 {
  width: 4px;
}

.h-4 {
  height: 16px;
}

.card-body {
  padding: 16px;
}

/* ─── 按钮组 ─── */
.actions {
  display: flex;
  gap: 12px;
}

.btn-primary,
.btn-secondary,
.btn-accent {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn-primary {
  background: linear-gradient(135deg, #D4AF37 0%, #C9A961 100%);
  color: #FFF8E7;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.btn-primary:active:not(:disabled) {
  transform: scale(0.98);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(212, 175, 55, 0.4);
  color: #2D2D2D;
  backdrop-filter: blur(10px);
}

.btn-secondary:active:not(:disabled) {
  transform: scale(0.98);
}

.btn-accent {
  width: 100%;
  background: linear-gradient(135deg, #D4AF37 0%, #C9A961 100%);
  color: #FFF8E7;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
  margin-top: 12px;
}

.btn-accent:active:not(:disabled) {
  transform: scale(0.98);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ─── 表单样式 ─── */
.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.form-item label {
  display: block;
  color: #8B7355;
  font-size: 12px;
  margin-bottom: 6px;
}

.form-item input {
  width: 100%;
  padding: 10px;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 8px;
  color: #2D2D2D;
  font-size: 14px;
  text-align: center;
  transition: all 0.3s ease;
}

.form-item input:focus {
  outline: none;
  border-color: rgba(212, 175, 55, 0.6);
  background: rgba(255, 255, 255, 0.95);
}

/* ─── 错误卡片 ─── */
.error-card {
  border-color: rgba(239, 68, 68, 0.4);
}

.error-body {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #DC2626;
  font-size: 14px;
}

/* ─── 结果卡片 ─── */
.result-card {
  border-color: rgba(34, 197, 94, 0.4);
}

/* ─── 统计网格 ─── */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.summary-item {
  text-align: center;
  padding: 16px 12px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.summary-item .data-num {
  font-size: 24px;
  font-weight: bold;
  background: linear-gradient(180deg, #D4AF37 0%, #C9A961 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4px;
}

.summary-item .data-label {
  font-size: 12px;
  color: #8B7355;
}

/* ─── 数据预览 ─── */
.data-preview {
  margin-top: 20px;
}

.preview-title {
  font-size: 15px;
  font-weight: 600;
  color: #2D2D2D;
  margin: 0 0 16px;
}

.preview-section {
  margin-bottom: 20px;
}

.preview-section h5 {
  font-size: 13px;
  color: #8B7355;
  margin: 0 0 10px;
  font-weight: 500;
}

.data-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.data-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
  border: 1px solid rgba(212, 175, 55, 0.15);
}

/* 用户项 */
.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #D4AF37 0%, #C9A961 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-char {
  font-size: 18px;
  font-weight: bold;
  color: #FFF8E7;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 14px;
  color: #2D2D2D;
  font-weight: 500;
}

.user-phone {
  font-size: 12px;
  color: #8B7355;
  margin-top: 2px;
}

/* 战队项 */
.team-item {
  padding: 10px 12px;
}

.team-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 50%;
  flex-shrink: 0;
}

.team-info {
  flex: 1;
}

.team-name {
  font-size: 14px;
  color: #2D2D2D;
  font-weight: 500;
}

.team-leader {
  font-size: 12px;
  color: #8B7355;
  margin-top: 2px;
}

/* 排行榜 */
.rank-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rank-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
  border: 1px solid rgba(212, 175, 55, 0.15);
}

.rank-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  color: #FFF8E7;
  flex-shrink: 0;
}

.rank-1 {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
}

.rank-2 {
  background: linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%);
}

.rank-3 {
  background: linear-gradient(135deg, #CD7F32 0%, #B87333 100%);
}

.rank-4,
.rank-5 {
  background: linear-gradient(135deg, #D4AF37 0%, #C9A961 100%);
}

.rank-name {
  flex: 1;
  font-size: 14px;
  color: #2D2D2D;
  font-weight: 500;
}

.rank-dist {
  font-size: 13px;
  color: #22C55E;
  font-weight: 600;
}

/* ─── 提示卡片 ─── */
.tips-card {
  border-color: rgba(212, 175, 55, 0.4);
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 0;
  font-size: 13px;
  color: #5A4A42;
  line-height: 1.6;
}

.tips-list li:first-child {
  padding-top: 0;
}

.tips-list li:last-child {
  padding-bottom: 0;
}

.tips-list strong {
  color: #2D2D2D;
  font-weight: 600;
}
</style>
