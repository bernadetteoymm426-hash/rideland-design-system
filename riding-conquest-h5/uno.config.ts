import { defineConfig } from 'unocss'

// 骑行征服 - 国风主题配置
// 设计理念：「千里江山·骑行天下」
export default defineConfig({
  theme: {
    colors: {
      // 主色 - 黛蓝/藏青
      primary: {
        DEFAULT: '#1B263B',
        light: '#2C3E5A',
        dark: '#0D1B2A',
      },
      // 强调色 - 鎏金
      gold: {
        DEFAULT: '#D4AF37',
        light: '#E8C547',
        dark: '#B8941F',
      },
      // 辅助色 - 朱红
      red: {
        DEFAULT: '#C41E3A',
        light: '#E03A52',
        dark: '#A01830',
      },
      // 青绿 - 友方/安全
      green: {
        DEFAULT: '#2E8B57',
        light: '#3CB371',
        dark: '#256B45',
      },
      // 米白 - 内容区
      beige: {
        DEFAULT: '#F5F5DC',
        light: '#FFFEF0',
        dark: '#E8E8C8',
      },
      // 淡紫 - 装饰
      purple: {
        DEFAULT: '#E0B1CB',
        light: '#F0C5DB',
        dark: '#C59DB5',
      },
      // 墨色 - 文字
      ink: {
        DEFAULT: '#2C2C2C',
        light: '#4A4A4A',
        dark: '#1A1A1A',
      },
      // 地图相关
      map: {
        bg: '#0D1B2A',
        surface: '#1B263B',
        border: '#D4AF37',
      },
      // 状态色
      status: {
        attack: '#C41E3A',
        defend: '#2E8B57',
        neutral: '#6B7280',
        occupied: '#D4AF37',
      },
    },
    breakpoints: {
      sm: '375px',
      md: '768px',
      lg: '1024px',
    },
    fontFamily: {
      serif: '"Noto Serif SC", "Ma Shan Zheng", "KaiTi", "STKaiti", serif',
      sans: '"Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
  },
  shortcuts: {
    // 布局
    'flex-center': 'flex justify-center items-center',
    'flex-col-center': 'flex flex-col justify-center items-center',
    'flex-between': 'flex justify-between items-center',
    
    // 国风卡片
    'guofeng-card': 'bg-primary-dark rounded-12 border-2 border-gold shadow-lg',
    'guofeng-card-content': 'bg-beige/10 rounded-10 p-4',
    
    // 国风按钮
    'guofeng-btn-primary': 'bg-gradient-135 from-gold to-gold-dark text-ink font-bold py-3 px-6 rounded-8 border border-gold-dark hover:brightness-110 transition-all',
    'guofeng-btn-secondary': 'bg-transparent text-gold font-bold py-3 px-6 rounded-8 border border-gold hover:bg-gold/10 transition-all',
    
    // 文字层级
    'text-title-xl': 'text-28 font-serif font-bold text-gold',
    'text-title-lg': 'text-24 font-serif font-bold text-gold',
    'text-title-md': 'text-20 font-serif font-semibold text-gold-light',
    'text-body-lg': 'text-16 text-beige',
    'text-body': 'text-14 text-beige/80',
    'text-body-sm': 'text-12 text-beige/60',
    
    // 装饰边框
    'border-guofeng': 'border-2 border-gold',
    'border-guofeng-light': 'border border-gold/30',
  },
  rules: [
    // 金色渐变背景
    ['bg-gold-gradient', { 
      background: 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)' 
    }],
    
    // 深蓝渐变背景
    ['bg-deep-gradient', { 
      background: 'linear-gradient(180deg, #0D1B2A 0%, #1B263B 100%)' 
    }],
    
    // 祥云渐变
    ['bg-cloud-gradient', { 
      background: 'linear-gradient(90deg, rgba(224,177,203,0.3) 0%, rgba(212,175,55,0.3) 100%)' 
    }],
    
    // 云纹装饰（用伪元素实现）
    ['cloud-pattern', {
      position: 'relative',
    }],
    
    // 阴影增强
    ['shadow-guofeng', {
      boxShadow: '0 4px 16px rgba(0,0,0,0.4), 0 0 20px rgba(212,175,55,0.2)',
    }],
  ],
  variants: [
    // 添加 hover 变体
    (matcher) => {
      if (!matcher.startsWith('hover:')) return matcher
      return {
        matcher: matcher.slice(6),
        selector: (s) => `${s}:hover`,
      }
    },
  ],
})
