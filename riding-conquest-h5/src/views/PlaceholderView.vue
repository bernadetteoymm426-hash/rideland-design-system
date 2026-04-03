<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  router.back()
}

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="placeholder-page">
    <!-- 背景层 -->
    <div class="page-bg">
      <img src="/assets/images/bg-conquest-abstract.jpg" alt="" class="bg-image" />
      <div class="bg-darken"></div>
    </div>

    <!-- 内容层 -->
    <div class="page-content">
      <!-- 占位卡片 -->
      <div class="card placeholder-card">
        <div class="card-body">
          <!-- 图标 -->
          <div class="icon-wrapper">
            <div class="icon-circle">
              <van-icon name="under-construction-o" size="48" color="#D4AF37" />
            </div>
          </div>

          <!-- 标题 -->
          <h1 class="page-title">🚧 页面开发中</h1>
          <p class="page-subtitle">该功能正在紧张开发中，敬请期待！</p>

          <!-- 分割线 -->
          <div class="divider-gold"></div>

          <!-- 提示信息 -->
          <div class="hint-section">
            <div class="hint-item">
              <van-icon name="clock-o" size="20" color="#D4AF37" />
              <span>我们的团队正在努力构建这个功能</span>
            </div>
            <div class="hint-item">
              <van-icon name="gem-o" size="20" color="#D4AF37" />
              <span>敬请期待更多精彩内容</span>
            </div>
            <div class="hint-item">
              <van-icon name="location-o" size="20" color="#D4AF37" />
              <span>您可以先探索其他已上线的功能</span>
            </div>
          </div>

          <!-- 分割线 -->
          <div class="divider-gold"></div>

          <!-- 操作按钮 -->
          <div class="action-buttons">
            <button @click="goHome" class="btn-primary">
              <van-icon name="wap-home-o" size="18" />
              <span>返回首页</span>
            </button>
            <button @click="goBack" class="btn-secondary">
              <van-icon name="arrow-left" size="18" />
              <span>返回上一页</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 装饰性文字 -->
      <div class="decorative-text">
        <p>指点江山 · 攻城略地</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ─── 页面结构 ─── */
.placeholder-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.page-bg {
  position: absolute;
  inset: 0;
}

.bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

.bg-darken {
  position: absolute;
  inset: 0;
  background: rgba(245, 230, 211, 0.85);
}

.page-content {
  position: relative;
  z-index: 10;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

/* ─── 卡片样式 ─── */
.card {
  background: rgba(255, 255, 255, 0.9);
  background-image: url('/assets/images/texture-card-subtle.jpg');
  background-size: 400px;
  background-blend-mode: multiply;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(212, 175, 55, 0.4);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(212, 175, 55, 0.15);
  width: 100%;
  max-width: 400px;
  position: relative;
  overflow: hidden;
}

.card::before,
.card::after {
  content: '';
  position: absolute;
  width: 60px;
  height: 60px;
  background: url('/assets/images/corner-abstract-gold.jpg');
  background-size: cover;
  opacity: 0.4;
  pointer-events: none;
}

.card::before {
  top: 0;
  left: 0;
}

.card::after {
  bottom: 0;
  right: 0;
}

.card-body {
  padding: 32px 24px;
  text-align: center;
}

/* ─── 图标区域 ─── */
.icon-wrapper {
  margin-bottom: 24px;
}

.icon-circle {
  width: 96px;
  height: 96px;
  margin: 0 auto;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(201, 169, 97, 0.3) 100%);
  border: 3px solid rgba(212, 175, 55, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(212, 175, 55, 0.2);
}

/* ─── 标题区域 ─── */
.page-title {
  font-size: 24px;
  font-weight: bold;
  color: #2D2D2D;
  margin: 0 0 12px;
}

.page-subtitle {
  font-size: 14px;
  color: #8B7355;
  margin: 0 0 24px;
}

/* ─── 分割线 ─── */
.divider-gold {
  height: 2px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(212, 175, 55, 0.3) 20%,
    rgba(212, 175, 55, 0.8) 50%,
    rgba(212, 175, 55, 0.3) 80%,
    transparent 100%
  );
  margin: 24px 0;
}

/* ─── 提示区域 ─── */
.hint-section {
  text-align: left;
  margin-bottom: 24px;
}

.hint-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  font-size: 14px;
  color: #5A4A42;
}

/* ─── 按钮区域 ─── */
.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-primary,
.btn-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #D4AF37 0%, #C9A961 100%);
  color: #FFF8E7;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.btn-primary:active {
  transform: scale(0.98);
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.2);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(212, 175, 55, 0.4);
  color: #2D2D2D;
  backdrop-filter: blur(10px);
}

.btn-secondary:active {
  transform: scale(0.98);
  background: rgba(255, 255, 255, 0.95);
}

/* ─── 装饰文字 ─── */
.decorative-text {
  margin-top: 32px;
  text-align: center;
}

.decorative-text p {
  font-size: 14px;
  color: #8B7355;
  margin: 0;
  letter-spacing: 2px;
  font-style: italic;
  opacity: 0.7;
}
</style>
