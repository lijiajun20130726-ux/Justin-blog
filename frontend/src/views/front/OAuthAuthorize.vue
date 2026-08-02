<template>
  <div class="oauth-authorize">
    <div class="oauth-card">
      <h1>授权登录</h1>
      <p class="subtitle">应用请求访问你的账号</p>

      <div v-if="loading" class="status loading">
        <span class="spinner"></span>
        正在处理授权请求...
      </div>

      <div v-else-if="error" class="status error">
        <strong>授权失败</strong>
        <p>{{ error }}</p>
        <button @click="goBack">返回</button>
      </div>

      <div v-else class="status pending">
        <p>应用 <strong>{{ clientName || '第三方应用' }}</strong> 请求获取你的基本资料</p>
        <div class="actions">
          <button class="btn-secondary" @click="deny">拒绝</button>
          <button class="btn-primary" @click="approve">同意授权</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const error = ref('')
const clientName = ref('')

onMounted(() => {
  clientName.value = (route.query.client_name as string) || ''
  if (!userStore.token) {
    alert('请先登录')
    router.replace({
      path: '/login',
      query: { redirect: route.fullPath }
    })
  }
})

const approve = async () => {
  loading.value = true
  error.value = ''
  try {
    // 同意授权后跳回前端根路径
    alert('授权成功')
    router.push('/')
  } catch (e: any) {
    error.value = e?.message || '授权失败'
  } finally {
    loading.value = false
  }
}

const deny = () => {
  alert('已取消授权')
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.oauth-authorize {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: var(--bg-color, #f5f7fa);
}

.oauth-card {
  width: 100%;
  max-width: 420px;
  background: var(--card-bg, #ffffff);
  border-radius: 12px;
  padding: 32px 28px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.oauth-card h1 {
  margin: 0 0 8px;
  font-size: 22px;
  color: var(--text-color, #1d1d1f);
}

.subtitle {
  margin: 0 0 24px;
  color: var(--text-color-secondary, #6e6e73);
  font-size: 14px;
}

.status {
  padding: 16px;
  border-radius: 8px;
  text-align: center;
}

.status.loading,
.status.pending {
  background: var(--bg-secondary, #f5f5f7);
  color: var(--text-color, #1d1d1f);
}

.status.error {
  background: rgba(245, 108, 108, 0.1);
  color: #f56c6c;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ccc;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: 8px;
  vertical-align: middle;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 16px;
}

button {
  padding: 10px 24px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-secondary {
  background: transparent;
  color: var(--text-color-secondary, #6e6e73);
  border: 1px solid #ccc;
}

.btn-secondary:hover {
  background: var(--bg-secondary, #f5f5f7);
}
</style>
