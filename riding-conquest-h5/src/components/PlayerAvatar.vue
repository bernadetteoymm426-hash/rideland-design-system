<script setup>
// 玩家头像组件
</script>

<template>
  <div class="player-avatar">
    <div class="avatar-ring"></div>
    <div class="avatar-circle">
      <span class="avatar-char">骑</span>
    </div>
    <div class="avatar-badge"></div>
  </div>
</template>

<style scoped>
.player-avatar {
  position: relative;
  width: 64px;
  height: 64px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.player-avatar:hover {
  transform: scale(1.05);
}

.avatar-ring {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    rgba(59, 130, 246, 0.8) 0deg,
    rgba(59, 130, 246, 0.2) 120deg,
    rgba(59, 130, 246, 0.8) 240deg,
    rgba(59, 130, 246, 0.2) 360deg
  );
  animation: ring-rotate 3s linear infinite;
  filter: blur(2px);
}

@keyframes ring-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.avatar-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 24px rgba(59, 130, 246, 0.5);
  border: 3px solid rgba(59, 130, 246, 0.4);
  position: relative;
  z-index: 1;
}

.avatar-char {
  font-size: 24px;
  font-weight: bold;
  color: #FFFFFF;
}

.avatar-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #F59E0B, #D97706);
  border-radius: 50%;
  border: 2px solid #070E1B;
  z-index: 2;
}
</style>
