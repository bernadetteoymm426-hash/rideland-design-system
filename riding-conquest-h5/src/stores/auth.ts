import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface UserInfo {
  user_id: number
  phone: string
  nickname: string
  avatar?: string
}

interface AuthState {
  token: string | null
  user: UserInfo | null
}

const STORAGE_KEY = 'riding_conquest_auth'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref<string | null>(null)
  const user = ref<UserInfo | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const userId = computed(() => user.value?.user_id)
  const nickname = computed(() => user.value?.nickname)

  // Actions
  /**
   * 登录并保存 token
   */
  function login(newToken: string, userInfo: UserInfo) {
    token.value = newToken
    user.value = userInfo
    
    // 保存到 localStorage
    saveToStorage()
  }

  /**
   * 登出
   */
  function logout() {
    token.value = null
    user.value = null
    
    // 清除 localStorage
    localStorage.removeItem(STORAGE_KEY)
  }

  /**
   * 从 localStorage 恢复登录状态
   */
  function restoreFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data: AuthState = JSON.parse(stored)
        token.value = data.token
        user.value = data.user
      }
    } catch (e) {
      console.error('Failed to restore auth state:', e)
      logout()
    }
  }

  /**
   * 保存到 localStorage
   */
  function saveToStorage() {
    try {
      const data: AuthState = {
        token: token.value,
        user: user.value,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
      console.error('Failed to save auth state:', e)
    }
  }

  /**
   * 更新 token
   */
  function updateToken(newToken: string) {
    token.value = newToken
    saveToStorage()
  }

  return {
    // State
    token,
    user,
    
    // Getters
    isAuthenticated,
    userId,
    nickname,
    
    // Actions
    login,
    logout,
    restoreFromStorage,
    updateToken,
  }
})
