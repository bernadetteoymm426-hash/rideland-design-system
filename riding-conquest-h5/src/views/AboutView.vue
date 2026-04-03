<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const appInfo = {
  name: '骑行征服',
  version: 'v1.0.0 Beta',
  description: '指点江山，攻城略地',
  team: '迈金科技 · 顽鹿竞技',
  copyright: '© 2026 Qingdao Magene Intelligence Technology Co., Ltd.',
}

function goBack() {
  router.back()
}
</script>

<template>
  <div class="about-page">
    <!-- 背景层 -->
    <div class="page-bg">
      <img src="/assets/images/bg-conquest-abstract.jpg" alt="" class="bg-image" />
      <div class="bg-darken"></div>
    </div>

    <!-- 内容层 -->
    <div class="page-content">
      <!-- 返回按钮 -->
      <div class="back-btn-wrapper">
        <button @click="goBack" class="btn-back">
          <van-icon name="arrow-left" size="20" color="#D4AF37" />
          <span>返回</span>
        </button>
      </div>

      <!-- 项目信息卡片 -->
      <div class="card about-card">
        <div class="card-body">
          <!-- Logo/标题区域 -->
          <div class="logo-section">
            <div class="logo-circle">
              <span class="logo-char">骑</span>
            </div>
            <h1 class="app-name">{{ appInfo.name }}</h1>
            <p class="app-tagline">{{ appInfo.description }}</p>
          </div>

          <!-- 分割线 -->
          <div class="divider-gold"></div>

          <!-- 版本信息 -->
          <div class="info-row">
            <span class="info-label">版本号</span>
            <span class="info-value">{{ appInfo.version }}</span>
          </div>

          <div class="info-row">
            <span class="info-label">开发团队</span>
            <span class="info-value">{{ appInfo.team }}</span>
          </div>

          <!-- 分割线 -->
          <div class="divider-gold"></div>

          <!-- 版权信息 -->
          <div class="copyright-section">
            <p class="copyright-text">{{ appInfo.copyright }}</p>
            <p class="copyright-desc">All Rights Reserved.</p>
          </div>
        </div>
      </div>

      <!-- 功能导航 -->
      <div class="card nav-card">
        <div class="card-body">
          <div class="nav-row" @click="router.push('/')">
            <van-icon name="wap-home-o" size="24" color="#D4AF37" />
            <span class="nav-text">返回首页</span>
            <van-icon name="arrow" size="16" color="#C9A961" />
          </div>
          <div class="divider-gold"></div>
          <div class="nav-row" @click="router.push('/profile')">
            <van-icon name="manager-o" size="24" color="#D4AF37" />
            <span class="nav-text">个人中心</span>
            <van-icon name="arrow" size="16" color="#C9A961" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ─── 页面结构 ─── */
.about-page {
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
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 80px;
}

/* ─── 返回按钮 ─── */
.back-btn-wrapper {
  margin-bottom: 16px;
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(212, 175, 55, 0.4);
  border-radius: 12px;
  padding: 10px 16px;
  color: #2D2D2D;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.btn-back:active {
  transform: scale(0.98);
  background: rgba(255, 255, 255, 0.95);
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
  margin-bottom: 16px;
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
  padding: 20px;
}

/* ─── Logo 区域 ─── */
.logo-section {
  text-align: center;
  padding: 20px 0;
}

.logo-circle {
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
  border-radius: 50%;
  background: linear-gradient(135deg, #D4AF37 0%, #C9A961 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(212, 175, 55, 0.3);
}

.logo-char {
  font-size: 36px;
  font-weight: bold;
  color: #FFF8E7;
  font-family: 'Noto Serif SC', serif;
}

.app-name {
  font-size: 28px;
  font-weight: bold;
  color: #2D2D2D;
  margin: 0 0 8px;
  background: linear-gradient(180deg, #D4AF37 0%, #C9A961 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.app-tagline {
  font-size: 14px;
  color: #8B7355;
  margin: 0;
  font-style: italic;
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
  margin: 20px 0;
}

/* ─── 信息行 ─── */
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.info-label {
  font-size: 14px;
  color: #8B7355;
}

.info-value {
  font-size: 14px;
  color: #2D2D2D;
  font-weight: 500;
}

/* ─── 版权区域 ─── */
.copyright-section {
  text-align: center;
  padding: 16px 0 8px;
}

.copyright-text {
  font-size: 12px;
  color: #A09070;
  margin: 0 0 4px;
}

.copyright-desc {
  font-size: 11px;
  color: #A09070;
  margin: 0;
  opacity: 0.7;
}

/* ─── 导航行 ─── */
.nav-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-row:active {
  opacity: 0.7;
}

.nav-text {
  flex: 1;
  font-size: 16px;
  color: #2D2D2D;
  font-weight: 500;
}
</style>
