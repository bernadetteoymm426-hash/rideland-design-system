import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

// 切换 API 模式
// true = 使用 Mock 数据
// false = 使用真实后端 API
const USE_MOCK = false

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const authStore = useAuthStore()
    
    // 401 错误：Token 无效或过期
    if (error.response?.status === 401) {
      authStore.logout()
      window.location.hash = '/login'
    }
    
    return Promise.reject(error)
  }
)

export default apiClient
