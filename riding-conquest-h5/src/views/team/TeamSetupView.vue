<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTeamStore } from '@/stores/team'
import HeadquartersSelector from '@/components/HeadquartersSelector.vue'

const teamStore = useTeamStore()

// 状态
const activeTab = ref<'create' | 'join'>('create')
const showHeadquartersSelector = ref(false)

// 创建战队表单
const createForm = ref({
  name: '',
  headquarters_district: '',
  headquarters_code: ''
})

// 加入战队表单
const joinForm = ref({
  keyword: ''
})

// 搜索结果
const searchResults = ref<any[]>([])
const isSearching = ref(false)

// 验证
const isCreateFormValid = computed(() => {
  return createForm.value.name.trim().length >= 2 && 
         createForm.value.name.trim().length <= 20 &&
         createForm.value.headquarters_district !== ''
})

const isJoinFormValid = computed(() => {
  return joinForm.value.keyword.trim().length >= 2
})

// 事件处理
async function handleCreateTeam() {
  if (!isCreateFormValid.value) return
  
  const success = await teamStore.createTeam(
    createForm.value.name.trim(),
    createForm.value.headquarters_district,
    createForm.value.headquarters_code
  )
  
  if (success) {
    // 创建成功，显示成功提示
    alert('✅ 战队创建成功！\n\n还需要 2 名成员加入才能激活战队哦～')
  } else {
    alert('❌ 创建失败，请重试')
  }
}

async function handleSearch() {
  if (!isJoinFormValid.value) return
  
  isSearching.value = true
  searchResults.value = await teamStore.searchTeams(joinForm.value.keyword.trim())
  isSearching.value = false
}

async function handleJoinTeam(team: any) {
  const confirm = window.confirm(`确定要加入"${team.name}"吗？`)
  if (!confirm) return
  
  const success = await teamStore.joinTeam(team.team_id)
  
  if (success) {
    alert('✅ 加入成功！')
  } else {
    alert('❌ 加入失败，请重试')
  }
}

function handleSelectHeadquarters(headquarters: { district: string; code: string }) {
  createForm.value.headquarters_district = headquarters.district
  createForm.value.headquarters_code = headquarters.code
  showHeadquartersSelector.value = false
}

function openHeadquartersSelector() {
  showHeadquartersSelector.value = true
}
</script>

<template>
  <div class="team-setup-page">
    <!-- 头部 -->
    <div class="page-header">
      <h1 class="page-title">加入战队</h1>
      <p class="page-subtitle">Join a Team</p>
    </div>

    <!-- Tab 切换 -->
    <div class="tab-container">
      <div 
        class="tab-item" 
        :class="{ active: activeTab === 'create' }"
        @click="activeTab = 'create'"
      >
        <span class="tab-icon">🦁</span>
        <span class="tab-text">创建战队</span>
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeTab === 'join' }"
        @click="activeTab = 'join'"
      >
        <span class="tab-icon">🤝</span>
        <span class="tab-text">加入战队</span>
      </div>
    </div>

    <!-- 创建战队 -->
    <div v-if="activeTab === 'create'" class="tab-content">
      <!-- 说明卡片 -->
      <div class="info-card">
        <div class="info-icon">💡</div>
        <div class="info-text">
          <div class="info-title">创建战队须知</div>
          <ul class="info-list">
            <li>战队名称 2-20 个字符</li>
            <li>需要选择大本营所在地</li>
            <li>创建后需 3 人加入才能激活</li>
            <li>激活后可参与领土争夺</li>
          </ul>
        </div>
      </div>

      <!-- 表单 -->
      <div class="form-card">
        <div class="form-group">
          <label class="form-label">战队名称 <span class="required">*</span></label>
          <input 
            v-model="createForm.name"
            type="text"
            class="form-input"
            placeholder="请输入战队名称（2-20 字符）"
            maxlength="20"
          />
          <div class="input-hint">
            {{ createForm.name.length }}/20
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">大本营所在地 <span class="required">*</span></label>
          <div class="form-input clickable" @click="openHeadquartersSelector">
            <span v-if="createForm.headquarters_district" class="selected-value">
              {{ createForm.headquarters_district }}
            </span>
            <span v-else class="placeholder">
              选择大本营所在城市
            </span>
            <van-icon name="arrow" size="16" />
          </div>
          <div class="input-hint">
            大本营是战队的初始领土
          </div>
        </div>

        <button 
          class="btn-submit"
          :disabled="!isCreateFormValid || teamStore.isLoading"
          @click="handleCreateTeam"
        >
          <span v-if="teamStore.isLoading" class="loading-spinner"></span>
          <span v-else>🦁 创建战队</span>
        </button>
      </div>
    </div>

    <!-- 加入战队 -->
    <div v-if="activeTab === 'join'" class="tab-content">
      <!-- 说明卡片 -->
      <div class="info-card">
        <div class="info-icon">💡</div>
        <div class="info-text">
          <div class="info-title">加入战队须知</div>
          <ul class="info-list">
            <li>搜索战队名称或战队 ID</li>
            <li>申请后需等待队长审批</li>
            <li>加入后可立即参与骑行</li>
            <li>退出战队有 72 小时冷却期</li>
          </ul>
        </div>
      </div>

      <!-- 搜索框 -->
      <div class="search-box">
        <div class="search-input-wrapper">
          <van-icon name="search" size="18" />
          <input 
            v-model="joinForm.keyword"
            type="text"
            class="search-input"
            placeholder="搜索战队名称"
            @keyup.enter="handleSearch"
          />
        </div>
        <button 
          class="btn-search"
          :disabled="!isJoinFormValid || isSearching"
          @click="handleSearch"
        >
          {{ isSearching ? '搜索中...' : '搜索' }}
        </button>
      </div>

      <!-- 搜索结果 -->
      <div v-if="searchResults.length > 0" class="search-results">
        <div class="results-header">
          <span>找到 {{ searchResults.length }} 个战队</span>
        </div>
        
        <div v-for="team in searchResults" :key="team.team_id" class="team-card">
          <div class="team-header">
            <div class="team-logo">
              <span>{{ team.name.charAt(0) }}</span>
            </div>
            <div class="team-info">
              <div class="team-name">{{ team.name }}</div>
              <div class="team-meta">
                <span class="member-count">{{ team.member_count }}/{{ team.max_members }} 人</span>
                <span class="location">
                  <van-icon name="location-o" size="12" />
                  {{ team.headquarters_district }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="team-actions">
            <button class="btn-join" @click="handleJoinTeam(team)">
              申请加入
            </button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="joinForm.keyword && searchResults.length === 0 && !isSearching" class="empty-state">
        <div class="empty-icon">🔍</div>
        <div class="empty-text">没有找到相关战队</div>
        <div class="empty-hint">试试其他关键词或创建新战队</div>
      </div>

      <!-- 初始状态 -->
      <div v-else class="empty-state">
        <div class="empty-icon">🤝</div>
        <div class="empty-text">搜索并加入心仪的战队</div>
        <div class="empty-hint">输入战队名称开始搜索</div>
      </div>
    </div>

    <!-- 大本营选择弹窗 -->
    <HeadquartersSelector
      :visible="showHeadquartersSelector"
      @confirm="handleSelectHeadquarters"
      @close="showHeadquartersSelector = false"
    />
  </div>
</template>

<style scoped>
.team-setup-page {
  min-height: 100vh;
  background: #070E1B;
  padding: 16px;
  padding-bottom: 80px;
}

/* 页面头部 */
.page-header {
  text-align: center;
  margin-bottom: 24px;
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

/* Tab 切换 */
.tab-container {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  background: rgba(26, 39, 64, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  padding: 4px;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 20px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-item.active {
  background: linear-gradient(135deg, #3B82F6, #2563EB);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.tab-icon {
  font-size: 24px;
}

.tab-text {
  font-size: 14px;
  font-weight: 600;
  color: #94A3B8;
}

.tab-item.active .tab-text {
  color: #fff;
}

/* 说明卡片 */
.info-card {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  margin-bottom: 20px;
}

.info-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.info-text {
  flex: 1;
}

.info-title {
  font-size: 14px;
  font-weight: 600;
  color: #F1F5F9;
  margin-bottom: 8px;
}

.info-list {
  margin: 0;
  padding-left: 16px;
  font-size: 12px;
  color: #94A3B8;
  line-height: 1.8;
}

/* 表单卡片 */
.form-card {
  background: rgba(26, 39, 64, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #F1F5F9;
  margin-bottom: 8px;
}

.required {
  color: #EF4444;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  font-size: 15px;
  color: #F1F5F9;
  background: rgba(10, 22, 40, 0.6);
  border: 2px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease;
}

.form-input:focus {
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input.clickable {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.selected-value {
  color: #F1F5F9;
}

.placeholder {
  color: #64748B;
}

.input-hint {
  font-size: 12px;
  color: #64748B;
  margin-top: 6px;
}

/* 提交按钮 */
.btn-submit {
  width: 100%;
  padding: 14px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #3B82F6, #2563EB);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 搜索框 */
.search-box {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.search-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(10, 22, 40, 0.6);
  border: 2px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  color: #F1F5F9;
  background: transparent;
}

.btn-search {
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #3B82F6, #2563EB);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-search:hover:not(:disabled) {
  transform: translateY(-2px);
}

.btn-search:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 搜索结果 */
.results-header {
  font-size: 13px;
  color: #94A3B8;
  margin-bottom: 12px;
}

.team-card {
  background: rgba(26, 39, 64, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}

.team-header {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.team-logo {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3B82F6, #2563EB);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.team-info {
  flex: 1;
}

.team-name {
  font-size: 16px;
  font-weight: 600;
  color: #F1F5F9;
  margin-bottom: 6px;
}

.team-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #94A3B8;
}

.member-count {
  color: #3B82F6;
}

.location {
  display: flex;
  align-items: center;
  gap: 4px;
}

.team-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-join {
  padding: 8px 20px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #22C55E, #16A34A);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-join:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 16px;
  color: #94A3B8;
  margin-bottom: 8px;
}

.empty-hint {
  font-size: 13px;
  color: #64748B;
}

/* 加载动画 */
.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
