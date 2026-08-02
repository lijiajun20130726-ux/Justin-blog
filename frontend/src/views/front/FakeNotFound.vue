<template>
  <div class="fake-not-found">
    <div class="content">
      <div class="lock-icon">🔒</div>
      <h1>访问受限</h1>
      <p>该页面不存在或已被移除</p>
      <router-link to="/" class="btn">返回首页</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.fake-not-found {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.content {
  text-align: center;
  max-width: 420px;
}

.lock-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.content h1 {
  margin: 0 0 8px;
  font-size: 24px;
  color: var(--text-color, #1d1d1f);
}

.content p {
  margin: 0 0 24px;
  color: var(--text-color-secondary, #6e6e73);
  font-size: 14px;
}

.btn {
  display: inline-block;
  padding: 10px 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  text-decoration: none;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 500;
  transition: opacity 0.2s;
}

.btn:hover {
  opacity: 0.9;
}
</style>
