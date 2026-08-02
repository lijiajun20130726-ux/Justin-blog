<template>
  <div class="reading-progress-wrapper">
    <div class="progress-bar-container" :class="{ 'is-visible': isVisible }">
      <div class="progress-info">
        <span class="reading-time" v-if="readingTime">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          {{ readingTime }}
        </span>
        <span class="progress-percent">{{ progress }}%</span>
      </div>
      <div class="progress-track">
        <div 
          class="progress-fill" 
          :style="{ width: `${progress}%` }"
          :class="{ 'is-complete': progress >= 100 }"
        >
          <div class="progress-glow"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps<{
  content?: string
}>()

const progress = ref(0)
const isVisible = ref(false)
let ticking = false

const readingTime = computed(() => {
  if (!props.content) return null
  
  const text = props.content.replace(/<[^>]+>/g, '').replace(/\s+/g, '')
  const charCount = text.length
  const minutes = Math.ceil(charCount / 300)
  
  if (minutes < 1) return '约需 1 分钟阅读'
  return `约需 ${minutes} 分钟阅读`
})

const updateProgress = () => {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  const scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0
  
  progress.value = Math.min(100, Math.max(0, scrollPercent))
  
  if (scrollTop > 100) {
    isVisible.value = true
  } else {
    isVisible.value = false
  }
  
  ticking = false
}

const handleScroll = () => {
  if (!ticking) {
    requestAnimationFrame(updateProgress)
    ticking = true
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  updateProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.reading-progress-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  pointer-events: none;
}

.progress-bar-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding: 8px 24px;
  transform: translateY(-100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.progress-bar-container.is-visible {
  transform: translateY(0);
  pointer-events: auto;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  font-size: 12px;
  color: #666;
}

.reading-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
}

.reading-time svg {
  opacity: 0.7;
}

.progress-percent {
  font-weight: 600;
  color: #333;
  font-variant-numeric: tabular-nums;
}

.progress-track {
  height: 3px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 2px;
  transition: width 0.15s ease-out;
  position: relative;
  min-width: 0;
}

.progress-fill.is-complete {
  background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
}

.progress-glow {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 100%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%);
  animation: glow-pulse 1.5s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

@media (max-width: 768px) {
  .progress-bar-container {
    padding: 6px 16px;
  }
  
  .progress-info {
    font-size: 11px;
  }
  
  .progress-track {
    height: 2px;
  }
}
</style>
