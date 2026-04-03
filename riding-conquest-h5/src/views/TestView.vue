<script setup>
</script>

<template>
  <div class="test-page">
    <!-- 背景层 -->
    <div class="page-bg">
      <img src="/assets/images/bg-conquest-abstract.jpg" alt="" class="bg-image" />
      <div class="bg-darken"></div>
    </div>

    <!-- 内容层 -->
    <div class="page-content">
      <h1 class="page-title">🧪 图片测试</h1>

      <!-- 背景图测试 -->
      <div class="card test-card">
        <div class="card-header">
          <div class="header-left">
            <div class="w-1 h-4 bg-gold rounded-full"></div>
            <h3>① 背景图测试</h3>
          </div>
        </div>
        <div class="card-body">
          <img src="/assets/images/bg-conquest-abstract.jpg" alt="背景图" class="test-img" />
          <p class="test-desc">主背景图 - 抽象疆域概念</p>
        </div>
      </div>

      <!-- 分割线测试 -->
      <div class="card test-card">
        <div class="card-header">
          <div class="header-left">
            <div class="w-1 h-4 bg-gold rounded-full"></div>
            <h3>② 分隔线测试</h3>
          </div>
        </div>
        <div class="card-body">
          <div class="divider-gold"></div>
          <p class="test-desc">金色渐变分割线</p>
          <div class="divider-gold"></div>
          <p class="test-desc">应用于内容分隔</p>
          <div class="divider-gold"></div>
        </div>
      </div>

      <!-- 边角装饰测试 -->
      <div class="card test-card">
        <div class="card-header">
          <div class="header-left">
            <div class="w-1 h-4 bg-gold rounded-full"></div>
            <h3>③ 边角装饰测试</h3>
          </div>
        </div>
        <div class="card-body">
          <p class="test-desc">卡片四角自动添加金色装饰</p>
          <p class="test-desc">透明度 40%，不抢内容</p>
        </div>
      </div>

      <!-- 按钮样式测试 -->
      <div class="card test-card">
        <div class="card-header">
          <div class="header-left">
            <div class="w-1 h-4 bg-gold rounded-full"></div>
            <h3>④ 按钮样式测试</h3>
          </div>
        </div>
        <div class="card-body">
          <div class="button-row">
            <button class="btn-gold">金色按钮</button>
            <button class="btn-black">墨黑按钮</button>
            <button class="btn-outline">描边按钮</button>
          </div>
        </div>
      </div>

      <!-- 数字样式测试 -->
      <div class="card test-card">
        <div class="card-header">
          <div class="header-left">
            <div class="w-1 h-4 bg-gold rounded-full"></div>
            <h3>⑤ 数字样式测试</h3>
          </div>
        </div>
        <div class="card-body">
          <div class="data-grid">
            <div class="data-cell">
              <div class="data-num">286.5</div>
              <div class="data-label">总里程 (km)</div>
            </div>
            <div class="grid-line-v"></div>
            <div class="data-cell">
              <div class="data-num">14h 5m</div>
              <div class="data-label">总时长</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ─── 页面结构 ─── */
.test-page {
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

/* ─── 页面标题 ─── */
.page-title {
  font-size: 24px;
  font-weight: bold;
  color: #2D2D2D;
  margin: 0 0 16px;
  text-align: center;
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-left h3 {
  font-size: 16px;
  font-weight: 600;
  color: #2D2D2D;
  margin: 0;
}

.bg-gold {
  background: #D4AF37;
}

.rounded-full {
  border-radius: 9999px;
}

.w-1 {
  width: 4px;
}

.h-4 {
  height: 16px;
}

.card-body {
  padding: 16px;
}

/* ─── 图片测试 ─── */
.test-img {
  width: 100%;
  border-radius: 8px;
  border: 2px solid rgba(212, 175, 55, 0.4);
}

.test-desc {
  font-size: 13px;
  color: #8B7355;
  margin: 12px 0 0;
  text-align: center;
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
  margin: 16px 0;
}

/* ─── 按钮样式 ─── */
.button-row {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-gold,
.btn-black,
.btn-outline {
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-gold {
  background: linear-gradient(135deg, #D4AF37 0%, #C9A961 100%);
  color: #FFF8E7;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.btn-gold:active {
  transform: scale(0.98);
}

.btn-black {
  background: #2D2D2D;
  color: #FFF8E7;
}

.btn-black:active {
  transform: scale(0.98);
}

.btn-outline {
  background: transparent;
  border: 2px solid rgba(212, 175, 55, 0.6);
  color: #2D2D2D;
}

.btn-outline:active {
  background: rgba(212, 175, 55, 0.1);
  transform: scale(0.98);
}

/* ─── 数据网格 ─── */
.data-grid {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  overflow: hidden;
}

.data-cell {
  flex: 1;
  padding: 16px;
  text-align: center;
}

.data-num {
  font-size: 24px;
  font-weight: bold;
  background: linear-gradient(180deg, #D4AF37 0%, #C9A961 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4px;
}

.data-label {
  font-size: 12px;
  color: #8B7355;
}

.grid-line-v {
  width: 1px;
  height: 40px;
  background: linear-gradient(180deg, 
    transparent 0%, 
    rgba(212, 175, 55, 0.3) 50%,
    transparent 100%
  );
}
</style>
