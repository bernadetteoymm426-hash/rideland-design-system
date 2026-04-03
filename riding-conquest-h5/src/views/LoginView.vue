<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import request from '@/utils/request'
import { showToast } from 'vant'

const authStore = useAuthStore()
const loading = ref(false)

const phone = ref('13800138000')
const nickname = ref('测试用户')

async function loginWithRealAPI() {
  if (!phone.value || phone.value.length !== 11) {
    showToast('请输入正确的手机号')
    return
  }
  if (!nickname.value || nickname.value.length < 2) {
    showToast('昵称至少 2 个字符')
    return
  }

  loading.value = true

  try {
    const response = await request.post('/auth/login', {
      phone: phone.value,
      nickname: nickname.value,
      avatar: '',
    })

    await authStore.login(response.data.token, {
      user_id: response.data.user_id,
      phone: response.data.phone,
      nickname: response.data.nickname,
      avatar: '',
    })

    window.location.hash = '/'
  } catch (err) {
    showToast('登录失败：' + err.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-content">
      <h1 class="title">骑行征服</h1>
      <p class="subtitle">每一公里都在改变全国</p>

      <div class="form-container">
        <van-field
          v-model="phone"
          type="tel"
          placeholder="请输入手机号"
          maxlength="11"
          clearable
        />
        
        <van-field
          v-model="nickname"
          type="text"
          placeholder="请输入昵称（2-20 字符）"
          maxlength="20"
          clearable
        />
        
        <van-button
          type="primary"
          block
          round
          size="large"
          :loading="loading"
          loading-text="登录中..."
          @click="loginWithRealAPI"
        >
          开始征服
        </van-button>
      </div>

      <van-empty v-if="false" description="获取用户信息失败" />

      <div class="tips">
        <van-icon name="checked" color="#22c55e" />
        <span>后端 API 已连接</span>
        <br />
        <van-icon name="user-o" color="#00B8D9" />
        <span>测试账号：13800138000 / 测试用户</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #F5E6D3 0%, #FFF8E7 50%, #F5E6D3 100%);
  padding: 60px 40px;
  position: relative;
  overflow: hidden;
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(212, 175, 55, 0.08) 0%, transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(212, 175, 55, 0.08) 0%, transparent 40%);
  pointer-events: none;
}

.login-content {
  width: 100%;
  max-width: 400px;
  text-align: center;
  position: relative;
  z-index: 1;
}

.title {
  font-size: 2.8rem;
  font-weight: bold;
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 50%, #3B82F6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 10px rgba(212, 175, 55, 0.2);
  letter-spacing: 8px;
}

.subtitle {
  font-size: 1rem;
  color: #94A3B8;
  margin-bottom: 3rem;
  font-weight: 400;
  letter-spacing: 2px;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

/* 输入框样式 */
:deep(.van-cell) {
  background: rgba(26, 39, 64, 0.6) !important;
  border: 1.5px solid rgba(212, 175, 55, 0.3) !important;
  border-radius: 12px !important;
  padding: 12px 16px !important;
  transition: all 0.3s ease !important;
}

:deep(.van-cell--borderless) {
  border-radius: 12px !important;
}

:deep(.van-field__control) {
  color: #F1F5F9 !important;
  font-size: 15px !important;
}

:deep(.van-field__control::placeholder) {
  color: #B0A080 !important;
}

:deep(.van-cell:focus-within) {
  border-color: #3B82F6 !important;
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.3) !important;
  transform: translateY(-1px) !important;
}

/* 按钮样式 */
:deep(.van-button--primary) {
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%) !important;
  border: none !important;
  border-radius: 12px !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  letter-spacing: 4px !important;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4) !important;
  transition: all 0.3s ease !important;
}

:deep(.van-button--primary:active) {
  transform: scale(0.98) !important;
  box-shadow: 0 2px 10px rgba(212, 175, 55, 0.3) !important;
}

.tips {
  margin-top: 2rem;
  padding: 1.2rem;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 12px;
  border: 1.5px solid rgba(212, 175, 55, 0.3);
  color: #94A3B8;
  font-size: 0.85rem;
  line-height: 2;
}

.tips van-icon {
  vertical-align: middle;
  margin-right: 6px;
}
</style>
