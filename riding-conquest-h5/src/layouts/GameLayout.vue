<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import WeekStatusBar from '@/components/WeekStatusBar.vue'
import GameBottomBar from '@/components/GameBottomBar.vue'
import PlayerAvatar from '@/components/PlayerAvatar.vue'
import ChinaMap from '@/components/ChinaMap.vue'
import FirstTimeExperience from '@/components/FirstTimeExperience.vue'
import TerritoryDetailPopup from '@/components/TerritoryDetailPopup.vue'
import WarProgressOverlay from '@/components/WarProgressOverlay.vue'

const router = useRouter()
const isFirstTime = ref(false)
const showTeamOverlay = ref(false)
const showBattleOverlay = ref(false)
const showReportOverlay = ref(false)
const showRankingOverlay = ref(false)
const showProfileOverlay = ref(false)

const selectedTerritory = ref(null)
const popupPosition = ref({ x: 0, y: 0 })

const hometown = ref({
  name: '北京市',
  teamName: '骑行者联盟',
  days: 12,
  todayKm: 3284
})

const hometownStatus = ref('defending')

const territories = ref([
  { id: 1, name: '北京市', team_id: 1, team_name: '骑行者联盟', defense_value: 1200, is_ally: true, strategic_value: 4 },
  { id: 2, name: '上海市', team_id: 2, team_name: '魔骑行', defense_value: 800, is_ally: false, strategic_value: 3 },
  { id: 3, name: '广东省', team_id: 1, team_name: '骑行者联盟', defense_value: 1500, is_ally: true, strategic_value: 5 },
  { id: 4, name: '浙江省', team_id: null, team_name: '无主之地', defense_value: 1000, is_ally: false, strategic_value: 3 },
  { id: 5, name: '江苏省', team_id: null, team_name: '无主之地', defense_value: 1000, is_ally: false, strategic_value: 2 },
  { id: 6, name: '四川省', team_id: 1, team_name: '骑行者联盟', defense_value: 1100, is_ally: true, strategic_value: 4 },
  { id: 7, name: '湖北省', team_id: 2, team_name: '魔骑行', defense_value: 900, is_ally: false, strategic_value: 3 },
  { id: 8, name: '河南省', team_id: null, team_name: '无主之地', defense_value: 1000, is_ally: false, strategic_value: 2 },
])

const activeButton = ref(null)
const badges = ref({
  team: null,
  battle: 'breathing',
  report: 3,
  ranking: 'dot'
})

const mapRef = ref(null)

function handleTerritoryClick(data) {
  selectedTerritory.value = data.territory
  popupPosition.value = data.position
}

function closeTerritoryPopup() {
  selectedTerritory.value = null
}

function handleTerritoryAttack(territory) {
  console.log('进攻', territory.name)
  closeTerritoryPopup()
  showBattleOverlay.value = true
}

function handleTerritoryDefend(territory) {
  console.log('驻防', territory.name)
  closeTerritoryPopup()
}

function handleTerritoryDetail(territory) {
  console.log('详情', territory.name)
  closeTerritoryPopup()
}

function handleGoHome() {
  console.log('返回家乡')
}

function handleFirstTimeComplete() {
  isFirstTime.value = false
}

function handleFirstTimeSkip() {
  isFirstTime.value = false
}

function closeOverlay() {
  showTeamOverlay.value = false
  showBattleOverlay.value = false
  showReportOverlay.value = false
  showRankingOverlay.value = false
  showProfileOverlay.value = false
  activeButton.value = null
}

function handlePhaseClick(phase) {
  if (phase === 'report') {
    showReportOverlay.value = true
  }
}

// 底部导航点击处理
function handleTeamClick() {
  // 跳转到战队页面
  router.push('/team-setup')
}

function handleBattleClick() {
  showBattleOverlay.value = true
}

function handleReportClick() {
  showReportOverlay.value = true
}

function handleRankingClick() {
  showRankingOverlay.value = true
}

onMounted(() => {
  // Check if first time user
  const hasSeenIntro = localStorage.getItem('rideland_intro_seen')
  if (!hasSeenIntro) {
    isFirstTime.value = true
  }
})
</script>

<template>
  <div class="game-layout">
    <FirstTimeExperience
      v-if="isFirstTime"
      :hometown="hometown"
      :territory-status="hometownStatus"
      @complete="handleFirstTimeComplete"
      @skip="handleFirstTimeSkip"
    />

    <header class="top-bar">
      <div class="logo-section">
        <h1 class="game-logo">骑迹大陆</h1>
        <span class="game-subtitle">RIDELAND</span>
      </div>
      <WeekStatusBar @phase-click="handlePhaseClick" />
    </header>

    <main class="main-map">
      <ChinaMap 
        ref="mapRef"
        :territories="territories"
        :selected-territory="selectedTerritory"
        :hometown="hometown"
        @territory-click="handleTerritoryClick"
        @go-home="handleGoHome"
      />
    </main>

    <GameBottomBar
      :badges="badges"
      :active-button="activeButton"
      @team-click="handleTeamClick"
      @battle-click="handleBattleClick"
      @report-click="handleReportClick"
      @ranking-click="handleRankingClick"
    />

    <PlayerAvatar 
      class="player-avatar"
      @click="showProfileOverlay = true"
    />

    <TerritoryDetailPopup
      v-if="selectedTerritory"
      :territory="selectedTerritory"
      :position="popupPosition"
      @close="closeTerritoryPopup"
      @attack="handleTerritoryAttack"
      @defend="handleTerritoryDefend"
      @detail="handleTerritoryDetail"
    />

    <Teleport to="body">
      <Transition name="overlay">
        <div v-if="showTeamOverlay" class="overlay-backdrop" @click="closeOverlay">
          <div class="overlay-content" @click.stop>
            <button class="overlay-close" @click="closeOverlay">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <TeamOverlay @close="closeOverlay" />
          </div>
        </div>
      </Transition>

      <WarProgressOverlay
        :visible="showBattleOverlay"
        @close="closeOverlay"
      />

      <Transition name="overlay">
        <div v-if="showReportOverlay" class="overlay-backdrop" @click="closeOverlay">
          <div class="overlay-content" @click.stop>
            <button class="overlay-close" @click="closeOverlay">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <ReportOverlay @close="closeOverlay" />
          </div>
        </div>
      </Transition>

      <Transition name="overlay">
        <div v-if="showRankingOverlay" class="overlay-backdrop" @click="closeOverlay">
          <div class="overlay-content" @click.stop>
            <button class="overlay-close" @click="closeOverlay">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <RankingOverlay @close="closeOverlay" />
          </div>
        </div>
      </Transition>

      <Transition name="overlay">
        <div v-if="showProfileOverlay" class="overlay-backdrop" @click="closeOverlay">
          <div class="overlay-content overlay-right" @click.stop>
            <button class="overlay-close" @click="closeOverlay">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <ProfileOverlay @close="closeOverlay" />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.game-layout {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  background: #070E1B;
  overflow: hidden;
}

.top-bar {
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32px;
  background: linear-gradient(180deg, 
    rgba(10, 22, 40, 0.95) 0%, 
    rgba(7, 14, 27, 0.8) 100%
  );
  border-bottom: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  z-index: 100;
}

.logo-section {
  display: flex;
  flex-direction: column;
}

.game-logo {
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(180deg, #FFFFFF 0%, #94A3B8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: 4px;
}

.game-subtitle {
  font-size: 12px;
  color: #64748B;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.main-map {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.overlay-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(7, 14, 27, 0.85);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay-content {
  position: relative;
  background: rgba(26, 39, 64, 0.95);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 16px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
  max-width: 800px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.overlay-right {
  margin-left: auto;
  margin-right: 32px;
  max-width: 500px;
}

.overlay-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  background: rgba(0, 0, 0, 0.3);
  border: none;
  border-radius: 8px;
  color: #94A3B8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
}

.overlay-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #F1F5F9;
}

.overlay-close svg {
  width: 20px;
  height: 20px;
}

.overlay-enter-active,
.overlay-leave-active {
  transition: all 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.overlay-enter-from .overlay-content,
.overlay-leave-to .overlay-content {
  transform: scale(0.95) translateY(20px);
  opacity: 0;
}

.player-avatar {
  position: absolute;
  top: 100px;
  right: 32px;
  z-index: 200;
}
</style>