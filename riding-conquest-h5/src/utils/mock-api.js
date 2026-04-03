/**
 * Mock API 服务 - 备用方案
 * 当后端 API 不可用时使用
 */

const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJwaG9uZSI6IjEzODAwMTM4MDAwIiwibmlja25hbWUiOiLmlocg57Sg5LiAIn0.mock-token'

const mockUser = {
  user_id: 1,
  phone: '138****8000',
  nickname: '骑友 001',
  avatar: null
}

const mockStats = {
  totalRides: 12,
  totalDistance: 286.5,
  totalDuration: 845,
  totalCalories: 8520,
  rank: 3
}

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

export const mockApi = {
  async login({ phone, nickname }) {
    await delay(800)
    return {
      token: mockToken,
      expires_in: 86400,
      user_id: 1,
      phone,
      nickname
    }
  },

  async refreshToken() {
    await delay(300)
    return { token: mockToken, expires_in: 86400 }
  },

  async getCurrentUser() {
    await delay(300)
    return mockUser
  },

  async getProfileStats() {
    await delay(500)
    return mockStats
  }
}

export default mockApi
