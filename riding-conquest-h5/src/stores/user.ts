import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface UserHometown {
  province: string
  provinceCode: string
  city: string
  cityCode: string
  district?: string
  districtCode?: string
}

interface UserInfo {
  user_id: number
  phone: string
  nickname: string
  avatar?: string
  hometown?: UserHometown
}

interface UserState {
  userInfo: UserInfo | null
  hometownSet: boolean
}

const STORAGE_KEY = 'riding_conquest_user'

// Mock 家乡数据（用于首次定位）
const MOCK_HOMETOWNS: Record<string, UserHometown> = {
  'beijing': {
    province: '北京市',
    provinceCode: '110000',
    city: '北京市',
    cityCode: '110100',
  },
  'shanghai': {
    province: '上海市',
    provinceCode: '310000',
    city: '上海市',
    cityCode: '310100',
  },
  'guangdong': {
    province: '广东省',
    provinceCode: '440000',
    city: '广州市',
    cityCode: '440100',
  },
  'zhejiang': {
    province: '浙江省',
    provinceCode: '330000',
    city: '杭州市',
    cityCode: '330100',
  },
  'jiangsu': {
    province: '江苏省',
    provinceCode: '320000',
    city: '南京市',
    cityCode: '320100',
  },
  'shandong': {
    province: '山东省',
    provinceCode: '370000',
    city: '青岛市',
    cityCode: '370200',
  },
}

export const useUserStore = defineStore('user', () => {
  // State
  const userInfo = ref<UserInfo | null>(null)
  const hometownSet = ref<boolean>(false)

  // Getters
  const isAuthenticated = computed(() => !!userInfo.value)
  const userId = computed(() => userInfo.value?.user_id)
  const nickname = computed(() => userInfo.value?.nickname)
  const hometown = computed(() => userInfo.value?.hometown)
  const hometownCode = computed(() => {
    if (userInfo.value?.hometown?.districtCode) {
      return userInfo.value.hometown.districtCode
    }
    if (userInfo.value?.hometown?.cityCode) {
      return userInfo.value.hometown.cityCode
    }
    return userInfo.value?.hometown?.provinceCode
  })

  // Actions
  /**
   * 初始化用户信息（从 auth store 同步或 Mock）
   */
  function initializeUser() {
    // 从 localStorage 恢复
    restoreFromStorage()
    
    // 如果没有用户信息，使用 Mock 数据
    if (!userInfo.value) {
      userInfo.value = {
        user_id: 10001,
        phone: '138****8888',
        nickname: '骑行者',
        avatar: undefined,
        hometown: undefined,
      }
    }
    
    // 检查是否已设置家乡
    hometownSet.value = !!userInfo.value.hometown
  }

  /**
   * 设置家乡（首次定位或手动修改）
   */
  function setHometown(hometown: UserHometown) {
    if (userInfo.value) {
      userInfo.value.hometown = hometown
      hometownSet.value = true
      saveToStorage()
    }
  }

  /**
   * 获取 Mock 家乡数据（用于首次定位推荐）
   */
  function getMockHometown(): UserHometown | null {
    // 随机返回一个 Mock 家乡（模拟 IP 定位）
    const keys = Object.keys(MOCK_HOMETOWNS)
    const randomKey = keys[Math.floor(Math.random() * keys.length)]
    return MOCK_HOMETOWNS[randomKey] || null
  }

  /**
   * 从 localStorage 恢复
   */
  function restoreFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data: UserState = JSON.parse(stored)
        userInfo.value = data.userInfo
        hometownSet.value = data.hometownSet
      }
    } catch (e) {
      console.error('Failed to restore user state:', e)
    }
  }

  /**
   * 保存到 localStorage
   */
  function saveToStorage() {
    try {
      const data: UserState = {
        userInfo: userInfo.value,
        hometownSet: hometownSet.value,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
      console.error('Failed to save user state:', e)
    }
  }

  /**
   * 清除家乡设置（用于测试）
   */
  function clearHometown() {
    if (userInfo.value) {
      userInfo.value.hometown = undefined
      hometownSet.value = false
      saveToStorage()
    }
  }

  return {
    // State
    userInfo,
    hometownSet,
    
    // Getters
    isAuthenticated,
    userId,
    nickname,
    hometown,
    hometownCode,
    
    // Actions
    initializeUser,
    setHometown,
    getMockHometown,
    restoreFromStorage,
    saveToStorage,
    clearHometown,
  }
})
