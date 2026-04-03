export interface JSBridge {
  /**
   * 获取用户信息
   */
  getUserInfo?: () => Promise<{
    phone: string
    nickname: string
    avatar?: string
    [key: string]: any
  }>

  /**
   * 获取骑行数据
   */
  getRideData?: () => Promise<{
    distance: number
    duration: number
    calories?: number
    track?: any
    [key: string]: any
  }>

  /**
   * 推送通知
   */
  pushNotification?: (title: string, message: string) => void

  /**
   * 分享
   */
  share?: (params: { title: string; description: string; url: string }) => void
}

// 全局 JSBridge 对象
declare global {
  interface Window {
    JSBridge?: JSBridge
  }
}

export {}
