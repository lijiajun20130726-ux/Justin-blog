<template>
  <div class="share-buttons-wrapper">
    <div class="share-trigger" @click="toggleShare">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="18" cy="5" r="3"/>
        <circle cx="6" cy="12" r="3"/>
        <circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>
      <span>分享</span>
      <div class="share-badge" v-if="showBadge">NEW</div>
    </div>

    <transition name="share-fade">
      <div v-if="isOpen" class="share-panel">
        <div class="share-panel-header">
          <h4>🚀 分享到社交平台</h4>
          <button @click="closeShare" class="close-btn">&times;</button>
        </div>
        
        <div class="share-platforms">
          <button 
            v-for="platform in platforms" 
            :key="platform.name"
            class="share-platform-btn"
            :class="[`platform-${platform.name.toLowerCase()}`, { 'is-sharing': isSharing === platform.name }]"
            @click="handleShare(platform)"
            :disabled="isSharing === platform.name"
          >
            <div class="platform-icon-wrapper">
              <component :is="platform.icon" />
              <div class="sharing-spinner" v-if="isSharing === platform.name"></div>
            </div>
            <span class="platform-label">{{ platform.label }}</span>
            <span class="platform-desc" v-if="platform.desc">{{ platform.desc }}</span>
          </button>
        </div>

        <div class="share-link-section">
          <div class="link-input-wrapper">
            <input 
              type="text" 
              :value="shareUrl" 
              readonly 
              class="share-url-input"
              ref="urlInput"
              @focus="$event.target.select()"
            />
            <button @click="copyLink" class="copy-btn" :class="{ 'is-copied': copied, 'is-copying': isCopying }">
              <template v-if="isCopying">
                <span class="btn-spinner"></span>
                复制中...
              </template>
              <template v-else-if="copied">
                ✓ 已复制
              </template>
              <template v-else>
                复制链接
              </template>
            </button>
          </div>
          <p class="copy-hint">点击即可复制文章链接</p>
        </div>

        <transition name="qr-expand">
          <div class="share-qr-section" v-if="showQRCode">
            <div class="qr-header">
              <div class="qr-icon">📱</div>
              <div class="qr-info">
                <h5>微信扫码分享</h5>
                <p>打开微信，扫一扫即可分享给好友</p>
              </div>
            </div>
            <div class="qr-code-container">
              <canvas ref="qrCanvas" class="qr-canvas"></canvas>
              <div class="qr-overlay" v-if="qrLoading">
                <div class="qr-loading-spinner"></div>
                <p>生成中...</p>
              </div>
            </div>
            <div class="qr-actions">
              <button @click="downloadQR" class="qr-action-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
                保存二维码
              </button>
              <button @click="closeQR" class="qr-action-btn secondary">
                关闭
              </button>
            </div>
          </div>
        </transition>

        <div class="share-stats" v-if="shareStats">
          <div class="stat-item">
            <span class="stat-icon">👁️</span>
            <span class="stat-value">{{ shareStats.views || 0 }} 次阅读</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">🔗</span>
            <span class="stat-value">{{ shareStats.shares || 0 }} 次分享</span>
          </div>
        </div>
      </div>
    </transition>

    <transition name="toast-fade">
      <div v-if="toast.show" class="share-toast" :class="[`toast-${toast.type}`]">
        <span class="toast-icon">{{ toast.icon }}</span>
        <span class="toast-message">{{ toast.message }}</span>
      </div>
    </transition>

    <div v-if="isOpen" class="share-overlay" @click="closeShare"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h, onMounted, nextTick, onUnmounted } from 'vue'
import QRCode from 'qrcode'

const props = defineProps<{
  title: string
  url?: string
  description?: string
  image?: string
  stats?: {
    views?: number
    shares?: number
  }
}>()

const isOpen = ref(false)
const copied = ref(false)
const isCopying = ref(false)
const showQRCode = ref(false)
const qrLoading = ref(false)
const isSharing = ref<string | null>(null)
const showBadge = ref(true)
const urlInput = ref<HTMLInputElement>()
const qrCanvas = ref<HTMLCanvasElement>()

const toast = ref({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error' | 'info',
  icon: '✓'
})

let toastTimer: ReturnType<typeof setTimeout> | null = null

const shareUrl = computed(() => props.url || window.location.href)
const shareStats = computed(() => props.stats)

const WeChatIcon = () => h('svg', { width: 32, height: 32, viewBox: '0 0 24 24', fill: '#07C160' }, [
  h('path', { d: 'M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.857c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.945 2.453 3.766 4.227 6.961 4.227.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.047c.134 0 .24-.111.24-.247 0-.06-.023-.118-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-7.062-6.132zM13.998 13.44c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.97.983.976.976 0 01-.968-.983c0-.542.434-.982.969-.982z' })
])

const WeiboIcon = () => h('svg', { width: 32, height: 32, viewBox: '0 0 24 24', fill: '#E6162D' }, [
  h('path', { d: 'M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zm-1.409-7.498c-2.623.269-4.602 2.136-4.419 4.182.184 2.044 2.448 3.507 5.071 3.237 2.624-.269 4.603-2.137 4.419-4.184-.183-2.044-2.447-3.505-5.071-3.235zm1.35 3.755c-.486.195-.92-.149-.99-.55-.07-.398.16-.782.57-.89.464-.126.954.124 1.06.56.105.436-.155.86-.64 1.056v-.176zm1.73-1.627c-.185-.08-.303-.27-.264-.428.038-.157.198-.232.383-.152.184.08.302.27.263.428-.038.158-.197.232-.382.152z' }),
  h('path', { d: 'M17.516 8.635c-.327-.107-.55-.18-.38-.645.365-.98.405-1.825.005-2.428-.75-1.128-2.803-1.068-5.16-.03 0 0-.74.33-.55-.27.36-1.175.305-2.158-.255-2.726C10.18 1.644 7.58 2.6 5.082 4.765 3.277 6.33 2.187 8.165 2.187 9.81c0 3.306 4.247 5.317 8.403 5.317 5.448 0 9.07-3.168 9.07-5.683 0-1.522-1.283-2.386-2.144-2.809z' }),
  h('circle', { cx: '19.985', cy: '4.145', r: '1.765' })
])

const QQIcon = () => h('svg', { width: 32, height: 32, viewBox: '0 0 24 24', fill: '#12B7F5' }, [
  h('path', { d: 'M12.003 2c-2.265 0-6.29 1.364-6.29 7.325v1.195S4.5 11.46 4.5 13.404c0 .995.515 2.31 1.323 3.576-.3.895-.67 2.375-.213 3.511.49 1.205 2.014 1.61 3.393 1.81 1.147.166 2.404.199 2.994.199h.012c.59 0 1.847-.033 2.994-.199 1.379-.2 2.903-.605 3.393-1.81.457-1.136.088-2.616-.213-3.511.808-1.266 1.323-2.581 1.323-3.576 0-1.944-1.213-2.884-1.213-2.884V9.325C18.293 3.364 14.268 2 12.003 2z' })
])

const LinkIcon = () => h('svg', { width: 32, height: 32, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
  h('path', { d: 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71' }),
  h('path', { d: 'M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71' })
])

const platforms = [
  { name: 'WeChat', label: '微信', icon: WeChatIcon, desc: '扫一扫分享' },
  { name: 'Weibo', label: '微博', icon: WeiboIcon, desc: '微博分享' },
  { name: 'QQ', label: 'QQ', icon: QQIcon, desc: 'QQ空间' },
  { name: 'Link', label: '复制链接', icon: LinkIcon, desc: '一键复制' }
]

const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  const icons = {
    success: '✓',
    error: '✗',
    info: 'ℹ'
  }
  
  toast.value = {
    show: true,
    message,
    type,
    icon: icons[type]
  }
  
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

const toggleShare = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    showQRCode.value = false
    if (showBadge.value) {
      setTimeout(() => { showBadge.value = false }, 2000)
    }
  }
}

const closeShare = () => {
  isOpen.value = false
  showQRCode.value = false
  isSharing.value = null
}

const closeQR = () => {
  showQRCode.value = false
}

const handleShare = async (platform: typeof platforms[0]) => {
  const url = shareUrl.value
  const title = props.title
  const description = props.description || ''
  const image = props.image || ''
  
  isSharing.value = platform.name
  
  try {
    switch (platform.name) {
      case 'WeChat':
        showQRCode.value = true
        await nextTick()
        await generateRealQRCode(url)
        showToast('二维码已生成，请使用微信扫描', 'info')
        break
        
      case 'Weibo':
        const weiboParams = new URLSearchParams({
          url: url,
          title: `${title} ${description ? '- ' + description : ''}`,
          pic: image,
          appkey: ''
        })
        const weiboUrl = `https://service.weibo.com/share/share.php?${weiboParams.toString()}`
        window.open(weiboUrl, '_blank', 'width=650,height=500,scrollbars=yes,resizable=yes')
        showToast('正在打开微博分享页面...', 'info')
        break
        
      case 'QQ':
        const qqParams = new URLSearchParams({
          url: url,
          title: title,
          summary: description,
          pics: image,
          site: window.location.hostname
        })
        const qqUrl = `https://connect.qq.com/widget/shareqq/index.html?${qqParams.toString()}`
        window.open(qqUrl, '_blank', 'width=650,height=500,scrollbars=yes,resizable=yes')
        showToast('正在打开QQ分享页面...', 'info')
        break
        
      case 'Link':
        await copyLink()
        break
    }
    
    setTimeout(() => {
      if (platform.name !== 'WeChat') {
        isSharing.value = null
      } else {
        setTimeout(() => { isSharing.value = null }, 1000)
      }
    }, 1500)
    
  } catch (error) {
    console.error('分享失败:', error)
    showToast('分享失败，请重试', 'error')
    isSharing.value = null
  }
}

const copyLink = async () => {
  isCopying.value = true
  
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(shareUrl.value)
    } else {
      if (urlInput.value) {
        urlInput.value.select()
        document.execCommand('copy')
      }
    }
    
    copied.value = true
    showToast('链接已复制到剪贴板 ✓', 'success')
    
    setTimeout(() => {
      copied.value = false
    }, 2500)
    
  } catch (err) {
    console.error('复制失败:', err)
    showToast('复制失败，请手动选择文本复制', 'error')
  } finally {
    isCopying.value = false
  }
}

const generateRealQRCode = async (text: string) => {
  if (!qrCanvas.value) return
  
  qrLoading.value = true
  
  try {
    const canvas = qrCanvas.value
    const size = 180
    
    canvas.width = size
    canvas.height = size
    
    await QRCode.toCanvas(canvas, text, {
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
    
    showToast('二维码生成成功 ✓', 'success')
    
  } catch (error) {
    console.error('二维码生成失败:', error)
    showToast('二维码生成失败', 'error')
    
    const ctx = qrCanvas.value?.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, 180, 180)
      ctx.fillStyle = '#ff4444'
      ctx.font = '14px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('生成失败', 90, 90)
    }
  } finally {
    qrLoading.value = false
  }
}

const downloadQR = () => {
  if (!qrCanvas.value) return
  
  try {
    const link = document.createElement('a')
    link.download = `qrcode-${Date.now()}.png`
    link.href = qrCanvas.value.toDataURL('image/png')
    link.click()
    
    showToast('二维码已保存 ✓', 'success')
    
  } catch (error) {
    console.error('保存失败:', error)
    showToast('保存失败，请右键保存图片', 'error')
  }
}

onMounted(() => {
  setTimeout(() => {
    showBadge.value = true
  }, 1000)
})

onUnmounted(() => {
  if (toastTimer) {
    clearTimeout(toastTimer)
  }
})
</script>

<style scoped>
.share-buttons-wrapper {
  position: relative;
  display: inline-block;
}

.share-trigger {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  letter-spacing: 0.3px;
}

.share-trigger:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
}

.share-trigger:active {
  transform: translateY(-1px);
}

.share-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  font-size: 9px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 10px;
  animation: badge-pulse 2s ease-in-out infinite;
}

@keyframes badge-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.share-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
  backdrop-filter: blur(2px);
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.share-panel {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 360px;
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05);
  z-index: 1000;
  animation: slideUpBounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideUpBounce {
  0% {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.share-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f3f4f6;
}

.share-panel-header h4 {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  letter-spacing: 0.3px;
}

.close-btn {
  background: #f3f4f6;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 20px;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #1f2937;
  transform: rotate(90deg);
}

.share-platforms {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.share-platform-btn {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  background: white;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.share-platform-btn:hover:not(:disabled) {
  border-color: #667eea;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.2);
}

.share-platform-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.platform-icon-wrapper {
  position: relative;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  padding: 8px;
  transition: all 0.3s;
}

.share-platform-btn:hover:not(:disabled) .platform-icon-wrapper {
  transform: scale(1.1);
}

.platform-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.platform-desc {
  font-size: 11px;
  color: #9ca3af;
  font-weight: 400;
}

.is-sharing {
  pointer-events: none;
}

.sharing-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

.platform-wechat:hover {
  border-color: #07C160;
  background: linear-gradient(135deg, #f0fff4 0%, #dcfce7 100%);
}

.platform-weibo:hover {
  border-color: #E6162D;
  background: linear-gradient(135deg, #fff5f5 0%, #fee2e2 100%);
}

.platform-qq:hover {
  border-color: #12B7F5;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}

.link-input-wrapper {
  display: flex;
  gap: 10px;
  margin-bottom: 8px;
}

.share-url-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 13px;
  color: #6b7280;
  background: #f9fafb;
  transition: all 0.2s;
}

.share-url-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.copy-btn {
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.3s;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 100px;
  justify-content: center;
}

.copy-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.copy-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.copy-btn.is-copied {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.copy-hint {
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
  margin: 0;
}

.qr-expand-enter-active,
.qr-expand-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 500px;
  overflow: hidden;
}

.qr-expand-enter-from,
.qr-expand-leave-to {
  max-height: 0;
  opacity: 0;
  margin-top: 0;
}

.share-qr-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #f3f4f6;
}

.qr-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.qr-icon {
  font-size: 32px;
}

.qr-info h5 {
  font-size: 15px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.qr-info p {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

.qr-code-container {
  position: relative;
  display: flex;
  justify-content: center;
  padding: 20px;
  background: #f9fafb;
  border-radius: 16px;
  border: 2px dashed #d1d5db;
  min-height: 220px;
  align-items: center;
}

.qr-canvas {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.qr-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-radius: 14px;
}

.qr-loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.qr-overlay p {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
}

.qr-actions {
  display: flex;
  gap: 10px;
  margin-top: 16px;
  justify-content: center;
}

.qr-action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border: 2px solid #667eea;
  background: white;
  color: #667eea;
  border-radius: 10px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s;
}

.qr-action-btn:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

.qr-action-btn.secondary {
  border-color: #d1d5db;
  color: #6b7280;
}

.qr-action-btn.secondary:hover {
  background: #f3f4f6;
  color: #374151;
  border-color: #9ca3af;
}

.share-stats {
  display: flex;
  gap: 16px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 2px solid #f3f4f6;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #6b7280;
}

.stat-icon {
  font-size: 16px;
}

.stat-value {
  font-weight: 600;
  color: #374151;
}

.share-toast {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%) translateY(-20px);
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 10000;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  animation: toastSlideIn 0.3s ease;
}

.toast-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.toast-error {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.toast-info {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.toast-icon {
  font-size: 18px;
  font-weight: 700;
}

.toast-message {
  letter-spacing: 0.3px;
}

@keyframes toastSlideIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}

.share-fade-enter-active,
.share-fade-leave-active {
  transition: opacity 0.2s ease;
}

.share-fade-enter-from,
.share-fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .share-panel {
    width: calc(100vw - 40px);
    right: -20px;
    padding: 20px;
  }
  
  .share-platforms {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  
  .share-platform-btn {
    padding: 12px 8px;
  }
  
  .platform-icon-wrapper {
    width: 40px;
    height: 40px;
  }
}
</style>
