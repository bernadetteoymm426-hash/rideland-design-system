import { ref, computed } from 'vue'

export interface CyclePhase {
  name: string
  startTime: Date
  endTime: Date
  description: string
}

export interface WeeklyCycle {
  weekNumber: number
  year: number
  phases: CyclePhase[]
  currentPhase: CyclePhase
  timeRemaining: number // 毫秒
}

/**
 * 周循环阶段定义
 * 
 * 根据 PRD 定义：
 * - 周一 12:00: 新周期开始，自动进入"征战阶段"
 * - 周日 12:00: 结算，进入"结算阶段"
 * - 周日 12:00-14:00: 结算期（2 小时）
 * - 周日 14:00-次日 12:00: 战报期
 * - 周一 00:00-12:00: 宣战期
 */
const PHASE_DEFINITIONS = [
  {
    name: '征战',
    description: '骑行征服，攻城掠地',
    durationHours: 144, // 周一 12:00 -> 周日 12:00 (6 天)
    color: '#EF4444', // 红色
    icon: '⚔️',
  },
  {
    name: '结算',
    description: '本周战果结算中',
    durationHours: 2, // 周日 12:00 -> 周日 14:00
    color: '#F59E0B', // 橙色
    icon: '📊',
  },
  {
    name: '战报',
    description: '查看本周战报',
    durationHours: 22, // 周日 14:00 -> 周一 00:00
    color: '#3B82F6', // 蓝色
    icon: '📰',
  },
  {
    name: '宣战',
    description: '选择下周目标',
    durationHours: 12, // 周一 00:00 -> 周一 12:00
    color: '#8B5CF6', // 紫色
    icon: '🎯',
  },
]

/**
 * 获取指定日期所在周的周一日期
 */
function getMondayOfWeek(date: Date): Date {
  const result = new Date(date)
  const day = result.getDay() // 0 = 周日，1 = 周一
  const diff = result.getDate() - day + (day === 0 ? -6 : 1)
  result.setDate(diff)
  result.setHours(0, 0, 0, 0)
  return result
}

/**
 * 计算当前时间属于哪个阶段
 */
function getCurrentPhase(weekStart: Date, now: Date): { phaseIndex: number, phaseStart: Date, phaseEnd: Date } {
  const msInHour = 3600 * 1000
  
  // 计算从周一 00:00 开始经过的小时数
  const mondayMidnight = new Date(weekStart)
  mondayMidnight.setHours(0, 0, 0, 0)
  
  const hoursSinceMonday = (now.getTime() - mondayMidnight.getTime()) / msInHour
  
  // 阶段切换点（相对于周一 00:00 的小时数）
  const phaseBoundaries = [
    12,  // 周一 12:00: 征战开始
    12 + 144, // 周日 12:00: 结算开始 (156)
    12 + 144 + 2, // 周日 14:00: 战报开始 (158)
    12 + 144 + 2 + 22, // 周一 00:00: 宣战开始 (180)
    12 + 144 + 2 + 22 + 12, // 周一 12:00: 新周期开始 (192 = 7 天)
  ]
  
  // 确定当前阶段
  let phaseIndex = 0
  for (let i = 0; i < phaseBoundaries.length - 1; i++) {
    if (hoursSinceMonday >= phaseBoundaries[i] && hoursSinceMonday < phaseBoundaries[i + 1]) {
      phaseIndex = i
      break
    }
  }
  
  // 计算阶段开始和结束时间
  const phaseStart = new Date(mondayMidnight.getTime() + phaseBoundaries[phaseIndex] * msInHour)
  const phaseEnd = new Date(mondayMidnight.getTime() + phaseBoundaries[phaseIndex + 1] * msInHour)
  
  return { phaseIndex, phaseStart, phaseEnd }
}

/**
 * 格式化倒计时
 */
function formatTimeRemaining(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  
  if (days > 0) {
    return `${days}天 ${hours}时 ${minutes}分`
  } else if (hours > 0) {
    return `${hours}时 ${minutes}分 ${seconds}秒`
  } else if (minutes > 0) {
    return `${minutes}分 ${seconds}秒`
  } else {
    return `${seconds}秒`
  }
}

/**
 * 周循环 Composable
 * 
 * 提供：
 * - 当前阶段信息
 * - 阶段倒计时
 * - 阶段切换事件
 */
export function useCycle() {
  const currentTime = ref(new Date())
  const updateInterval = ref<number | null>(null)
  
  // 当前周的起始时间（周一 00:00）
  const weekStart = computed(() => {
    return getMondayOfWeek(currentTime.value)
  })
  
  // 当前阶段信息
  const currentPhase = computed(() => {
    const { phaseIndex, phaseStart, phaseEnd } = getCurrentPhase(weekStart.value, currentTime.value)
    const phaseDef = PHASE_DEFINITIONS[phaseIndex]
    
    return {
      ...phaseDef,
      startTime: phaseStart,
      endTime: phaseEnd,
      index: phaseIndex,
    }
  })
  
  // 阶段倒计时（毫秒）
  const timeRemaining = computed(() => {
    const { phaseEnd } = getCurrentPhase(weekStart.value, currentTime.value)
    return Math.max(0, phaseEnd.getTime() - currentTime.value.getTime())
  })
  
  // 格式化的倒计时
  const formattedTimeRemaining = computed(() => {
    return formatTimeRemaining(timeRemaining.value)
  })
  
  // 阶段进度（0-1）
  const phaseProgress = computed(() => {
    const { phaseStart, phaseEnd } = getCurrentPhase(weekStart.value, currentTime.value)
    const total = phaseEnd.getTime() - phaseStart.getTime()
    const elapsed = currentTime.value.getTime() - phaseStart.getTime()
    return Math.min(1, Math.max(0, elapsed / total))
  })
  
  // 所有阶段信息（用于状态条展示）
  const allPhases = computed(() => {
    return PHASE_DEFINITIONS.map((phase, index) => ({
      ...phase,
      isActive: index === currentPhase.value.index,
      isCompleted: index < currentPhase.value.index,
      isUpcoming: index > currentPhase.value.index,
    }))
  })
  
  // 开始定时更新
  function startTimer() {
    if (updateInterval.value) return
    
    updateInterval.value = window.setInterval(() => {
      currentTime.value = new Date()
    }, 1000) // 每秒更新
  }
  
  // 停止定时更新
  function stopTimer() {
    if (updateInterval.value) {
      clearInterval(updateInterval.value)
      updateInterval.value = null
    }
  }
  
  // 获取阶段颜色
  function getPhaseColor(phaseIndex?: number): string {
    const index = phaseIndex !== undefined ? phaseIndex : currentPhase.value.index
    return PHASE_DEFINITIONS[index].color
  }
  
  return {
    // State
    currentTime,
    currentPhase,
    timeRemaining,
    formattedTimeRemaining,
    phaseProgress,
    allPhases,
    
    // Actions
    startTimer,
    stopTimer,
    getPhaseColor,
  }
}
