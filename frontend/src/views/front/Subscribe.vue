<template>
  <div class="subscribe-page">
    <!-- 渐变 Hero 区 -->
    <div class="subscribe-hero">
      <div class="hero-bg">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
        <div class="blob blob-3"></div>
      </div>
      <div class="hero-content">
        <div class="blog-badge">
          <img src="/logo.png" alt="Justin的blog" class="badge-logo" />
          <span>Justin的blog</span>
        </div>
        <h1>订阅更新</h1>
        <p class="hero-subtitle">第一时间获取 <strong>Justin.Li</strong> 发布的最新文章</p>
        <div class="hero-stats">
          <div class="stat">
            <span class="stat-num">📬</span>
            <span class="stat-text">邮件推送</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-num">🔔</span>
            <span class="stat-text">新文提醒</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-num">↩️</span>
            <span class="stat-text">一键退订</span>
          </div>
        </div>
      </div>
    </div>

    <div class="container subscribe-content">
      <!-- 主订阅卡片 -->
      <div class="subscribe-card">
        <div class="card-header">
          <div class="card-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <div class="card-title">
            <h2>订阅 Justin.Li 的博客</h2>
            <p>留下邮箱，作者发布新文章时你会第一时间收到</p>
          </div>
        </div>
        <SubscribeBox />
      </div>

      <!-- 三大特性 -->
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon" style="background: rgba(37, 99, 235, 0.1); color: #2563eb;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h3>内容通知</h3>
          <p>新文章发布后立即通过邮件推送</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon" style="background: rgba(16, 185, 129, 0.1); color: #10b981;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h3>保护隐私</h3>
          <p>邮箱仅用于通知，绝不外泄</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon" style="background: rgba(245, 158, 11, 0.1); color: #f59e0b;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </div>
          <h3>随时退订</h3>
          <p>邮件底部一键退订，无需理由</p>
        </div>
      </div>

      <!-- 作者信息 -->
      <div class="author-card">
        <img src="/logo.png" alt="Justin.Li" class="author-avatar" />
        <div class="author-info">
          <h3>Justin.Li</h3>
          <p class="author-bio">「Justin的blog」作者 · 分享技术 / 生活 / 思考</p>
          <div class="author-meta">
            <span>📍 来自 Justin的blog</span>
            <span>·</span>
            <span>✉️ 订阅后立即生效</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import SubscribeBox from '@/components/SubscribeBox.vue'

onMounted(() => {
  document.title = '订阅更新 | Justin的blog'
})
</script>

<style scoped>
.subscribe-page {
  min-height: 100vh;
  background: var(--bg-body);
  color: var(--text-primary);
}

/* ========== Hero 区 ========== */
.subscribe-hero {
  position: relative;
  padding: 100px 24px 60px;
  text-align: center;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(37, 99, 235, 0.05) 0%, transparent 100%);
}

.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  animation: float 12s ease-in-out infinite;
}

.blob-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #2563eb 0%, transparent 70%);
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.blob-2 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, #8b5cf6 0%, transparent 70%);
  top: 50px;
  right: -80px;
  animation-delay: 4s;
}

.blob-3 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #06b6d4 0%, transparent 70%);
  bottom: -100px;
  left: 50%;
  animation-delay: 8s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.05); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 720px;
  margin: 0 auto;
}

.blog-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px 6px 6px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.badge-logo {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #2563eb;
}

.hero-content h1 {
  font-size: 48px;
  font-weight: 800;
  background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.hero-subtitle {
  font-size: 17px;
  color: var(--text-secondary);
  margin-bottom: 32px;
  line-height: 1.6;
}

.hero-subtitle strong {
  color: #2563eb;
  font-weight: 700;
}

.hero-stats {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  padding: 12px 24px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 100px;
  font-size: 14px;
  color: var(--text-secondary);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

.stat {
  display: flex;
  align-items: center;
  gap: 6px;
}

.stat-num {
  font-size: 16px;
}

.stat-divider {
  width: 1px;
  height: 16px;
  background: var(--border-color);
}

/* ========== 容器 ========== */
.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px 80px;
}

.subscribe-content {
  display: grid;
  gap: 28px;
  margin-top: -20px;
}

/* ========== 主订阅卡 ========== */
.subscribe-card {
  background: var(--bg-card);
  border-radius: 24px;
  border: 1px solid var(--border-color);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 28px 32px;
  border-bottom: 1px solid var(--border-color);
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.04) 0%, transparent 100%);
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
}

.card-title h2 {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 4px;
}

.card-title p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.subscribe-card :deep(.subscribe-box) {
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 28px 32px 32px;
  border-radius: 0;
}

/* ========== 特性卡 ========== */
.features-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.feature-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 18px;
  padding: 24px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--accent-color);
  opacity: 0;
  transition: opacity 0.3s;
}

.feature-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  border-color: transparent;
}

.feature-card:hover::before {
  opacity: 1;
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.feature-card h3 {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 6px;
}

.feature-card p {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

/* ========== 作者卡 ========== */
.author-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

.author-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 3px solid #2563eb;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.author-info h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 4px;
}

.author-bio {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 8px;
  line-height: 1.5;
}

.author-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  .subscribe-hero {
    padding: 70px 20px 40px;
  }

  .hero-content h1 {
    font-size: 32px;
  }

  .hero-subtitle {
    font-size: 15px;
  }

  .hero-stats {
    flex-wrap: wrap;
    gap: 12px;
    padding: 10px 16px;
  }

  .stat-divider {
    display: none;
  }

  .card-header {
    padding: 20px 20px 16px;
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .subscribe-card :deep(.subscribe-box) {
    padding: 20px;
  }

  .author-card {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
}
</style>
