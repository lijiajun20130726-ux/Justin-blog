<template>
  <div class="unsubscribe-page">
    <div class="container">
      <div v-if="loading" class="state">
        <div class="spinner" aria-hidden="true"></div>
        <p class="muted">正在处理...</p>
      </div>

      <div v-else-if="state === 'success'" class="state">
        <div class="icon-wrap success" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1>已退订</h1>
        <p class="muted">你将不再收到新文章邮件通知。</p>
        <div class="email-line">{{ email }}</div>
        <div class="actions">
          <router-link to="/subscribe" class="btn btn-primary">重新订阅</router-link>
          <router-link to="/" class="btn btn-ghost">返回博客</router-link>
        </div>
      </div>

      <div v-else-if="state === 'already'" class="state">
        <div class="icon-wrap success" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1>你已退订</h1>
        <p class="muted">该邮箱之前已退订，无需重复操作。</p>
        <div class="email-line">{{ email }}</div>
        <div class="actions">
          <router-link to="/subscribe" class="btn btn-primary">重新订阅</router-link>
          <router-link to="/" class="btn btn-ghost">返回博客</router-link>
        </div>
      </div>

      <div v-else class="state">
        <div class="icon-wrap danger" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h1>{{ errorTitle }}</h1>
        <p class="muted">{{ errorMessage }}</p>
        <div class="actions">
          <router-link to="/" class="btn btn-primary">返回博客</router-link>
        </div>
      </div>

      <footer class="footer">
        <p>Justin的blog · by Justin.Li</p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { unsubscribe } from '@/api/subscription'

const route = useRoute()
const loading = ref(true)
const state = ref<'success' | 'already' | 'error' | null>(null)
const email = ref('')
const errorTitle = ref('退订失败')
const errorMessage = ref('')

onMounted(async () => {
  document.title = '退订 | Justin的blog by Justin.Li'
  const e = String(route.query.email || '').trim()
  email.value = e

  if (!e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
    loading.value = false
    state.value = 'error'
    errorTitle.value = '无效的退订链接'
    errorMessage.value = '链接缺少邮箱参数，请从邮件中点击退订按钮。'
    return
  }

  try {
    const res: any = await unsubscribe(e)
    if (res?.code === 200) {
      state.value = res?.data?.alreadyUnsubscribed ? 'already' : 'success'
    } else {
      state.value = 'error'
      errorMessage.value = res?.message || '请稍后重试'
    }
  } catch (err: any) {
    state.value = 'error'
    errorMessage.value = err?.message || '服务器异常，请稍后重试'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.unsubscribe-page {
  min-height: 100vh;
  background-color: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@media (prefers-color-scheme: dark) {
  .unsubscribe-page {
    background-color: #0f172a;
  }
}

.container {
  width: 100%;
  max-width: 420px;
  text-align: center;
}

.state {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.icon-wrap.success {
  background-color: #f0fdf4;
  color: #16a34a;
}

.icon-wrap.danger {
  background-color: #fef2f2;
  color: #dc2626;
}

@media (prefers-color-scheme: dark) {
  .icon-wrap.success {
    background-color: rgba(34, 197, 94, 0.1);
    color: #22c55e;
  }
  .icon-wrap.danger {
    background-color: rgba(220, 38, 38, 0.1);
    color: #ef4444;
  }
}

h1 {
  font-size: 20px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 8px;
  letter-spacing: -0.01em;
}

.muted {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 24px;
  line-height: 1.5;
}

@media (prefers-color-scheme: dark) {
  h1 { color: #f1f5f9; }
  .muted { color: #94a3b8; }
}

.email-line {
  font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
  font-size: 13px;
  color: #475569;
  background-color: #f1f5f9;
  padding: 8px 14px;
  border-radius: 6px;
  margin: 0 0 32px;
  word-break: break-all;
}

@media (prefers-color-scheme: dark) {
  .email-line {
    color: #cbd5e1;
    background-color: #1e293b;
  }
}

.actions {
  display: flex;
  gap: 8px;
  justify-content: center;
  width: 100%;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background-color 200ms, border-color 200ms, color 200ms;
  line-height: 1.2;
}

.btn-primary {
  background-color: #0f172a;
  color: #ffffff;
}

.btn-primary:hover {
  background-color: #1e293b;
}

.btn-ghost {
  background-color: transparent;
  color: #475569;
  border-color: #e2e8f0;
}

.btn-ghost:hover {
  background-color: #f1f5f9;
}

@media (prefers-color-scheme: dark) {
  .btn-primary {
    background-color: #f1f5f9;
    color: #0f172a;
  }
  .btn-primary:hover {
    background-color: #e2e8f0;
  }
  .btn-ghost {
    color: #cbd5e1;
    border-color: #1e293b;
  }
  .btn-ghost:hover {
    background-color: #1e293b;
  }
}

.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #e2e8f0;
  border-top-color: #0f172a;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

@media (prefers-color-scheme: dark) {
  .spinner {
    border-color: #1e293b;
    border-top-color: #f1f5f9;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.footer {
  margin-top: 64px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.footer p {
  font-size: 12px;
  color: #94a3b8;
  margin: 0;
  letter-spacing: 0.02em;
}

@media (prefers-color-scheme: dark) {
  .footer { border-top-color: #1e293b; }
  .footer p { color: #64748b; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

@media (max-width: 480px) {
  .actions {
    flex-direction: column;
  }
  .btn {
    width: 100%;
  }
}
</style>
