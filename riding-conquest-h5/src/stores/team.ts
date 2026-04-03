import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface TeamMember {
  user_id: number
  nickname: string
  avatar?: string
  role: 'captain' | 'member'
  joined_at: string
  total_distance: number
}

export interface Team {
  team_id: number
  name: string
  captain_id: number
  captain_name: string
  member_count: number
  max_members: number
  headquarters_district: string
  headquarters_code: string
  created_at: string
  status: 'inactive' | 'active' | 'disbanded'
  members: TeamMember[]
}

interface TeamState {
  myTeam: Team | null
  isCaptain: boolean
  isLoading: boolean
}

const STORAGE_KEY = 'riding_conquest_team'

export const useTeamStore = defineStore('team', () => {
  // State
  const myTeam = ref<Team | null>(null)
  const isCaptain = ref<boolean>(false)
  const isLoading = ref<boolean>(false)

  // Getters
  const hasTeam = computed(() => !!myTeam.value)
  const isActive = computed(() => myTeam.value?.status === 'active')
  const canCreateTeam = computed(() => !myTeam.value)
  const canJoinTeam = computed(() => !myTeam.value)
  const memberCount = computed(() => myTeam.value?.member_count || 0)
  const needMoreMembers = computed(() => {
    if (!myTeam.value) return 0
    return Math.max(0, 3 - myTeam.value.member_count)
  })

  // Actions
  /**
   * 初始化战队信息
   */
  function initializeTeam() {
    restoreFromStorage()
  }

  /**
   * 创建战队
   */
  async function createTeam(name: string, headquarters_district: string, headquarters_code: string): Promise<boolean> {
    isLoading.value = true
    
    try {
      // Mock API 调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newTeam: Team = {
        team_id: Date.now(),
        name,
        captain_id: 10001,
        captain_name: '骑行者',
        member_count: 1,
        max_members: 50,
        headquarters_district,
        headquarters_code,
        created_at: new Date().toISOString(),
        status: 'inactive', // 需要 3 人激活
        members: [{
          user_id: 10001,
          nickname: '骑行者',
          role: 'captain',
          joined_at: new Date().toISOString(),
          total_distance: 0
        }]
      }
      
      myTeam.value = newTeam
      isCaptain.value = true
      saveToStorage()
      
      return true
    } catch (error) {
      console.error('创建战队失败:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 加入战队
   */
  async function joinTeam(team_id: number): Promise<boolean> {
    isLoading.value = true
    
    try {
      // Mock API 调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock 加入后的战队信息
      myTeam.value = {
        team_id,
        name: '魔都骑行',
        captain_id: 10002,
        captain_name: '骑友 A',
        member_count: 5,
        max_members: 50,
        headquarters_district: '上海市浦东新区',
        headquarters_code: '310115',
        created_at: new Date().toISOString(),
        status: 'active',
        members: [
          {
            user_id: 10002,
            nickname: '骑友 A',
            role: 'captain',
            joined_at: new Date().toISOString(),
            total_distance: 520
          },
          {
            user_id: 10001,
            nickname: '骑行者',
            role: 'member',
            joined_at: new Date().toISOString(),
            total_distance: 0
          }
        ]
      }
      
      isCaptain.value = false
      saveToStorage()
      
      return true
    } catch (error) {
      console.error('加入战队失败:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 退出战队
   */
  async function quitTeam(): Promise<boolean> {
    isLoading.value = true
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      myTeam.value = null
      isCaptain.value = false
      saveToStorage()
      
      return true
    } catch (error) {
      console.error('退出战队失败:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 搜索战队
   */
  async function searchTeams(keyword: string): Promise<Team[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock 搜索结果
      const mockTeams: Team[] = [
        {
          team_id: 1001,
          name: '魔都骑行',
          captain_id: 10002,
          captain_name: '骑友 A',
          member_count: 12,
          max_members: 50,
          headquarters_district: '上海市浦东新区',
          headquarters_code: '310115',
          created_at: new Date().toISOString(),
          status: 'active',
          members: []
        },
        {
          team_id: 1002,
          name: '京城飞骑',
          captain_id: 10003,
          captain_name: '骑友 B',
          member_count: 8,
          max_members: 50,
          headquarters_district: '北京市朝阳区',
          headquarters_code: '110105',
          created_at: new Date().toISOString(),
          status: 'active',
          members: []
        },
        {
          team_id: 1003,
          name: '广州铁骑',
          captain_id: 10004,
          captain_name: '骑友 C',
          member_count: 15,
          max_members: 50,
          headquarters_district: '广州市天河区',
          headquarters_code: '440106',
          created_at: new Date().toISOString(),
          status: 'active',
          members: []
        }
      ]
      
      if (keyword) {
        return mockTeams.filter(t => t.name.includes(keyword))
      }
      
      return mockTeams
    } catch (error) {
      console.error('搜索战队失败:', error)
      return []
    }
  }

  /**
   * 保存到 localStorage
   */
  function saveToStorage() {
    try {
      const data: TeamState = {
        myTeam: myTeam.value,
        isCaptain: isCaptain.value,
        isLoading: false
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
      console.error('Failed to save team state:', e)
    }
  }

  /**
   * 从 localStorage 恢复
   */
  function restoreFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data: TeamState = JSON.parse(stored)
        myTeam.value = data.myTeam
        isCaptain.value = data.isCaptain
      }
    } catch (e) {
      console.error('Failed to restore team state:', e)
    }
  }

  /**
   * 清除战队数据（测试用）
   */
  function clearTeam() {
    myTeam.value = null
    isCaptain.value = false
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    // State
    myTeam,
    isCaptain,
    isLoading,
    
    // Getters
    hasTeam,
    isActive,
    canCreateTeam,
    canJoinTeam,
    memberCount,
    needMoreMembers,
    
    // Actions
    initializeTeam,
    createTeam,
    joinTeam,
    quitTeam,
    searchTeams,
    clearTeam,
  }
})
