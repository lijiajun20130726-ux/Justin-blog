<template>
  <div class="music-page">
    <div class="music-card">
      <h1>🎵 音乐播放器</h1>
      <p class="subtitle">OAuth 授权后可使用完整功能</p>

      <div class="player">
        <div class="cover">
          <span>♪</span>
        </div>
        <div class="info">
          <h2>未选择歌曲</h2>
          <p>请通过 OAuth 登录后访问</p>
        </div>
      </div>

      <div class="progress">
        <span>0:00</span>
        <div class="bar"><div class="fill" :style="{ width: '0%' }"></div></div>
        <span>0:00</span>
      </div>

      <div class="controls">
        <button class="ctrl">⏮</button>
        <button class="ctrl play">▶</button>
        <button class="ctrl">⏭</button>
      </div>

      <div class="notice">
        提示：此功能依赖 OAuth 授权，<router-link to="/">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.music-page {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.music-card {
  width: 100%;
  max-width: 480px;
  background: var(--card-bg, #ffffff);
  border-radius: 16px;
  padding: 32px 28px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.music-card h1 {
  margin: 0 0 8px;
  font-size: 22px;
}

.subtitle {
  margin: 0 0 24px;
  color: var(--text-color-secondary, #6e6e73);
  font-size: 14px;
}

.player {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--bg-secondary, #f5f5f7);
  border-radius: 12px;
  margin-bottom: 16px;
}

.cover {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 28px;
  flex-shrink: 0;
}

.info {
  text-align: left;
  flex: 1;
}

.info h2 {
  margin: 0 0 4px;
  font-size: 16px;
}

.info p {
  margin: 0;
  font-size: 13px;
  color: var(--text-color-secondary, #6e6e73);
}

.progress {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 12px;
  color: var(--text-color-secondary, #6e6e73);
}

.bar {
  flex: 1;
  height: 4px;
  background: var(--bg-secondary, #f5f5f7);
  border-radius: 2px;
  overflow: hidden;
}

.fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.3s;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 20px;
}

.ctrl {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: var(--bg-secondary, #f5f5f7);
  cursor: pointer;
  font-size: 18px;
  transition: all 0.2s;
}

.ctrl:hover {
  background: #e5e5e7;
}

.ctrl.play {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 22px;
}

.notice {
  padding: 12px;
  background: var(--bg-secondary, #f5f5f7);
  border-radius: 8px;
  font-size: 13px;
  color: var(--text-color-secondary, #6e6e73);
}

.notice a {
  color: #667eea;
  text-decoration: none;
}
</style>
