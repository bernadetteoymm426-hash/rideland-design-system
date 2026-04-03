<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTeamStore } from '@/stores/team'

const router = useRouter()
const teamStore = useTeamStore()

const loading = ref(true)

const team = computed(() => teamStore.myTeam)
const members = computed(() => team.value?.members || [])

// 退出战队
async function handleQuitTeam() {
  if (!confirm('确定要退出战队吗？退出后有 72 小时冷却期。')) return
  const success = await teamStore.quitTeam()
  if (success) {
    alert('已退出战队')
  }
}

// 跳转到创建/加入页
function goTeamSetup() {
  router.push('/team-setup')
}

onMounted(() => {
  teamStore.initializeTeam()

  // 如果没有战队数据，用 mock 填充用于展示
  if (!teamStore.hasTeam) {
    // Mock 创建一个默认战队用于展示
    teamStore.createTeam('骑行者联盟', '北京市东城区', '110101')
  }

  loading.value = false
})
</script>

<template>
  <div class="team-page">
    <!-- 内容层 -->
    <div class="page-content">
      <!-- 页面头部 -->
      <div class="page-header">
        <h1 class="page-title">我的战队</h1>
        <p class="page-subtitle">Team Base</p>
      </div>

      <!-- 无战队状态 -->
      <div v-if="!team && !loading" class="no-team-state">
        <div class="no-team-icon">🏴</div>
        <div class="no-team-title">还未加入战队</div>
        <div class="no-team-desc">创建或加入一支战队，开始征服全国领土！</div>
        <button class="btn-go-setup" @click="goTeamSetup">
          创建/加入战队
        </button>
      </div>

      <!-- 战队信息卡片 -->
      <template v-if="team">
        <div class="card team-card">
          <div class="card-body">
            <div class="team-header">
              <div class="team-logo">
                <span>{{ team.name.charAt(0) }}</span>
              </div>
              <div class="team-info">
                <div class="team-name">{{ team.name }}</div>
                <div class="team-meta">
                  <span class="status-tag" :class="team.status">
                    {{ team.status === 'active' ? '已激活' : team.status === 'inactive' ? '待激活' : '已解散' }}
                  </span>
                  <span class="member-info-text">{{ team.member_count }}/{{ team.max_members }} 人</span>
                </div>
                <div class="team-location">
                  <van-icon name="location-o" size="14" />
                  {{ team.headquarters_district }}
                </div>
              </div>
            </div>

            <!-- 待激活提示 -->
            <div v-if="team.status === 'inactive'" class="activation-hint">
              <span class="hint-icon">⚡</span>
              <span>还需 {{ 3 - team.member_count }} 名成员加入才能激活战队</span>
            </div>

            <!-- 战队统计 -->
            <div class="team-stats">
              <div class="stat-item">
                <div class="stat-num font-mono">{{ team.member_count }}</div>
                <div class="stat-label">成员</div>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <div class="stat-num font-mono">0</div>
                <div class="stat-label">本周骑行</div>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <div class="stat-num font-mono">0</div>
                <div class="stat-label">总里程 km</div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="team-actions">
              <button v-if="!teamStore.isCaptain" class="btn-quit" @click="handleQuitTeam">
                退出战队
              </button>
            </div>
          </div>
        </div>

        <!-- 分割线 -->
        <div class="divider"></div>

        <!-- 章节标题 -->
        <div class="section-title">
          <div class="title-left">
            <div class="title-bar"></div>
            <h3>成员列表</h3>
          </div>
          <span class="title-count">{{ members.length }} 人</span>
        </div>

        <!-- 成员列表 -->
        <div class="member-list">
          <div
            v-for="member in members"
            :key="member.user_id"
            class="member-card"
          >
            <div class="member-left">
              <div class="member-avatar">
                <span class="avatar-char">{{ member.nickname.charAt(0) }}</span>
              </div>
              <div class="member-info">
                <div class="member-name">{{ member.nickname }}</div>
                <div class="member-meta">
                  <span class="role" :class="member.role">{{ member.role === 'captain' ? '队长' : '队员' }}</span>
                  <span class="join-date">累计 {{ member.total_distance }} km</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
/* ─── 页面结构 ─── */
.team-page {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: #070E1B;
}

.page-content {
  position: relative;
  z-index: 10;
  height: 100%;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 80px;
}

/* ─── 页面头部 ─── */
.page-header {
  text-align: center;
  margin-bottom: 20px;
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
  letter-spacing: 1px;
}

/* ─── 战队卡片 ─── */
.card {
  background: rgba(26, 39, 64, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  margin-bottom: 16px;
  backdrop-filter: blur(10px);
}

.card-body {
  padding: 16px;
}

.team-card {
  margin-bottom: 16px;
}

.team-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.team-logo {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
  flex-shrink: 0;
  border: 3px solid rgba(59, 130, 246, 0.3);
}

.team-logo span {
  font-size: 28px;
  font-weight: bold;
  color: #FFFFFF;
}

.team-info {
  flex: 1;
}

.team-name {
  font-size: 18px;
  font-weight: 700;
  color: #F1F5F9;
  margin-bottom: 6px;
}

.team-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}

.team-meta .level {
  font-size: 13px;
  font-weight: 600;
  color: #3B82F6;
  padding: 2px 8px;
  background: rgba(59, 130, 246, 0.15);
  border-radius: 6px;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.team-meta .exp {
  font-size: 12px;
  color: #94A3B8;
}

.team-location {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #94A3B8;
}

.team-location svg {
  stroke: #94A3B8;
}

/* ─── 战队统计 ─── */
.team-stats {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 16px 0;
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-num {
  font-size: 24px;
  font-weight: 700;
  color: #3B82F6;
  margin-bottom: 4px;
  font-variant-numeric: tabular-nums;
}

.stat-label {
  font-size: 11px;
  color: #94A3B8;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: linear-gradient(180deg, 
    transparent 0%, 
    rgba(59, 130, 246, 0.3) 50%,
    transparent 100%
  );
}

/* ─── 经验条 ─── */
.exp-section {
  padding-top: 16px;
  border-top: 1px solid rgba(59, 130, 246, 0.2);
}

.exp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.exp-label {
  font-size: 13px;
  color: #94A3B8;
}

.exp-value {
  font-size: 13px;
  color: #F1F5F9;
  font-weight: 600;
}

.exp-bar {
  width: 100%;
  height: 8px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.exp-fill {
  height: 100%;
  background: linear-gradient(90deg, #3B82F6, #60A5FA);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.exp-desc {
  font-size: 11px;
  color: #94A3B8;
  text-align: center;
}

/* ─── 分割线 ─── */
.divider {
  height: 1px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(59, 130, 246, 0.3) 20%,
    rgba(59, 130, 246, 0.5) 50%,
    rgba(59, 130, 246, 0.3) 80%,
    transparent 100%
  );
  margin: 20px 0;
}

/* ─── 章节标题 ─── */
.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 0 4px;
}

.title-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-bar {
  width: 4px;
  height: 16px;
  background: #3B82F6;
  border-radius: 2px;
}

.title-left h3 {
  font-size: 16px;
  font-weight: 600;
  color: #F1F5F9;
  margin: 0;
}

.title-count {
  font-size: 13px;
  color: #94A3B8;
}

/* ─── 成员列表 ─── */
.member-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.member-card {
  background: rgba(26, 39, 64, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(10px);
}

.member-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.member-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.3);
  flex-shrink: 0;
}

.avatar-char {
  font-size: 20px;
  font-weight: bold;
  color: #FFFFFF;
}

.member-info {
  flex: 1;
}

.member-name {
  font-size: 15px;
  font-weight: 600;
  color: #F1F5F9;
  margin-bottom: 6px;
}

.member-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.member-meta .role {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 600;
}

.member-meta .role.captain {
  background: rgba(245, 158, 11, 0.15);
  color: #F97316;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.member-meta .role.member {
  background: rgba(59, 130, 246, 0.15);
  color: #3B82F6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.member-meta .join-date {
  font-size: 11px;
  color: #94A3B8;
}

.member-stats {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.member-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ─── 等宽数字 ─── */
.font-mono {
  font-family: "SF Mono", "Monaco", "Inconsolata", "Fira Mono", monospace;
  font-variant-numeric: tabular-nums;
}

/* ─── 无战队状态 ─── */
.no-team-state {
  text-align: center;
  padding: 60px 20px;
}

.no-team-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.no-team-title {
  font-size: 20px;
  font-weight: 700;
  color: #F1F5F9;
  margin-bottom: 8px;
}

.no-team-desc {
  font-size: 14px;
  color: #94A3B8;
  margin-bottom: 24px;
}

.btn-go-setup {
  padding: 14px 32px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #3B82F6, #2563EB);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
}

.btn-go-setup:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

/* ─── 状态标签 ─── */
.status-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 600;
}

.status-tag.active {
  background: rgba(34, 197, 94, 0.15);
  color: #22C55E;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.status-tag.inactive {
  background: rgba(245, 158, 11, 0.15);
  color: #F59E0B;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.member-info-text {
  font-size: 12px;
  color: #94A3B8;
}

/* ─── 激活提示 ─── */
.activation-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 13px;
  color: #F59E0B;
}

.hint-icon {
  font-size: 16px;
}

/* ─── 操作按钮 ─── */
.team-actions {
  padding-top: 12px;
  border-top: 1px solid rgba(59, 130, 246, 0.1);
  display: flex;
  justify-content: flex-end;
}

.btn-quit {
  padding: 8px 20px;
  font-size: 13px;
  font-weight: 600;
  color: #EF4444;
  background: transparent;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-quit:hover {
  background: rgba(239, 68, 68, 0.1);
}
</style>
