<template>
  <div class="front-layout">
    <Header />
    <AnnouncementBar />
    <main class="main-wrapper">
      <router-view />
    </main>
    <footer class="footer">
      <div class="container footer-content">
        <div class="footer-section">
          <h3>关于帅气的网站</h3>
          <p>{{ siteInfo.blog_intro || 'Justin的科幻宇宙，一个专注于技术分享和生活记录的个人博客' }}</p>
        </div>
        <div class="footer-section">
          <h3>快速导航,找到你需要的内容</h3>
          <ul>
            <li><router-link to="/">首页</router-link></li>
            <li><router-link to="/articles">所有文章</router-link></li>
            <li><router-link to="/archive">归档</router-link></li>
            <li><router-link to="/categories">分类</router-link></li>
            <li><router-link to="/subscribe">订阅</router-link></li>
            <li v-if="youtubeLink"><a :href="youtubeLink" target="_blank" rel="noopener">YouTube</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3>社交平台</h3>
          <div class="footer-social">
            <a href="https://github.com/lijiajun20130726-ux" target="_blank" rel="noopener noreferrer" class="footer-social-btn" title="GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.44 9.8 8.21 11.39.6.11.79-.26.79-.58 0-.29-.01-1.05-.02-2.05-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .1-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.81 1.1.81 2.22 0 1.61-.01 2.9-.01 3.29 0 .32.19.7.8.58A12 12 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <span>GitHub</span>
            </a>
            <a href="https://www.douyin.com/user/MS4wLjABAAAAeRFjFXRZg5oh2_qMsvpVLXP5wPN-HzHkM3y9m2Npp9vOa7z_zx-u4pA4YVJdbEBm?from_tab_name=main" target="_blank" rel="noopener noreferrer" class="footer-social-btn" title="抖音">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.31a8.16 8.16 0 0 0 4.77 1.52V6.4a4.85 4.85 0 0 1-1.84-.21z"/>
              </svg>
              <span>抖音</span>
            </a>
            <a href="https://space.bilibili.com/3546849904429569?spm_id_from=333.337.0.0" target="_blank" rel="noopener noreferrer" class="footer-social-btn" title="Bilibili">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906l-1.173 1.12zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773H5.333zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374a1.337 1.337 0 0 1-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374a1.337 1.337 0 0 1-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386z"/>
              </svg>
              <span>Bilibili</span>
            </a>
            <a href="https://www.kuaishou.com/profile/3xnzssxtisj8rj2?source=SEARCH" target="_blank" rel="noopener noreferrer" class="footer-social-btn" title="快手">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.834 0c1.087 0 2.014.16 2.78.481.766.32 1.401.768 1.906 1.345.504.577.886 1.252 1.144 2.027.258.774.387 1.609.387 2.506v1.612h2.553c.396 0 .766.04 1.111.122.345.082.65.211.915.388.265.176.474.397.627.665.154.267.23.581.23.943v9.398c0 .362-.076.676-.23.943a2.012 2.012 0 0 1-.627.665c-.265.176-.57.305-.915.388-.345.082-.715.122-1.111.122H7.43c-.396 0-.766-.04-1.111-.122a2.423 2.423 0 0 1-.915-.388 2.012 2.012 0 0 1-.627-.665c-.154-.267-.23-.581-.23-.943V9.689c0-.362.076-.676.23-.943.154-.268.362-.489.627-.665.265-.177.57-.306.915-.388.345-.082.715-.122 1.111-.122h2.553V6.359c0-.73.166-1.385.498-1.967.331-.582.78-1.041 1.347-1.378.566-.336 1.218-.504 1.953-.504h.05L12.834 0z"/>
              </svg>
              <span>快手</span>
            </a>
          </div>
        </div>
        <div class="footer-section">
          <h3>联系方式</h3>
          <p v-if="siteInfo.contact_email">
            📧 <a :href="`mailto:${siteInfo.contact_email}`">{{ siteInfo.contact_email }}</a>
          </p>
          <p
            v-if="wechatImageUrl"
            class="wechat-caption"
            role="button"
            tabindex="0"
            @click="toggleWechat()"
            @keydown.enter.prevent="toggleWechat()"
            @keydown.space.prevent="toggleWechat()"
          >
            <span class="wechat-icon" aria-hidden="true">
              <svg viewBox="0 0 48 48" width="18" height="18">
                <circle cx="20" cy="20" r="12" fill="#09bb07"/>
                <circle cx="30" cy="28" r="10" fill="#09bb07"/>
                <circle cx="16" cy="18" r="2.2" fill="#fff"/>
                <circle cx="24" cy="18" r="2.2" fill="#fff"/>
                <circle cx="27" cy="26" r="2" fill="#fff"/>
                <circle cx="33" cy="26" r="2" fill="#fff"/>
              </svg>
            </span>
            微信联系
          </p>
          <div v-if="wechatImageUrl" v-show="wechatOpen" class="wechat-qrcode">
            <img :src="wechatImageUrl" alt="微信联系" class="wechat-img" />
          </div>
          <p
            v-if="wechatOfficialImageUrl"
            class="wechat-caption"
            role="button"
            tabindex="0"
            @click="toggleWechatOfficial()"
            @keydown.enter.prevent="toggleWechatOfficial()"
            @keydown.space.prevent="toggleWechatOfficial()"
          >
            <span class="wechat-icon" aria-hidden="true">
              <svg viewBox="0 0 48 48" width="18" height="18">
                <circle cx="24" cy="24" r="20" fill="#09bb07"/>
                <circle cx="19" cy="22" r="3" fill="#fff"/>
                <circle cx="29" cy="22" r="3" fill="#fff"/>
                <rect x="16" y="30" width="16" height="2.8" rx="1.4" fill="#fff"/>
              </svg>
            </span>
            微信公众号
          </p>
          <div v-if="wechatOfficialImageUrl" v-show="wechatOfficialOpen" class="wechat-qrcode">
            <img :src="wechatOfficialImageUrl" alt="微信公众号" class="wechat-img" />
          </div>
        </div>
      </div>
      <div id="subscribe" class="subscribe-footer">
        <SubscribeBox />
      </div>
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p>© 2025--2026 Justin的blog. All rights reserved.</p>
          <div class="footer-bottom-links">
            <router-link to="/privacy-policy">隐私政策</router-link>
            <span class="footer-divider">/</span>
            <router-link to="/terms-of-service">服务条款</router-link>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Header from '@/components/Header.vue'
import AnnouncementBar from '@/components/AnnouncementBar.vue'
import SubscribeBox from '@/components/SubscribeBox.vue'
import { getSiteInfo } from '@/api/front'
import { uploadsUrl } from '@/utils/url'

const youtubeFallback = 'https://www.youtube.com/@lijiajun-xtjj/'
const siteInfo = ref<any>({
  blog_title: '李嘉骏的博客',
  blog_intro: '一个专注于技术分享和生活记录的个人博客。',
  contact_email: '',
  contact_github: '',
  contact_youtube: ''
})
const youtubeLink = computed(() => {
  return siteInfo.value?.contact_youtube || youtubeFallback
})

const wechatImageUrl = computed(() => {
  const raw = (siteInfo.value?.wechat_qrcode || siteInfo.value?.contact_wechat || '').toString().trim()
  if (!raw) return ''
  if (raw.startsWith('http') || raw.startsWith('data:') || raw.startsWith('/')) return raw
  return `${uploadsUrl}/uploads/${raw}`
})

const wechatOpen = ref(false)
const toggleWechat = () => {
  wechatOpen.value = !wechatOpen.value
}

const wechatOfficialImageUrl = computed(() => {
  const raw = (siteInfo.value?.wechat_official_qrcode || siteInfo.value?.contact_wechat_official || '').toString().trim()
  if (!raw) return ''
  if (raw.startsWith('http') || raw.startsWith('data:') || raw.startsWith('/')) return raw
  return `${uploadsUrl}/uploads/${raw}`
})

const wechatOfficialOpen = ref(false)
const toggleWechatOfficial = () => {
  wechatOfficialOpen.value = !wechatOfficialOpen.value
}

onMounted(async () => {
  try {
    const res: any = await getSiteInfo()
    if (res.code === 200 && res.data) {
      siteInfo.value = res.data
    }
  } catch (err) {
    console.error('获取网站信息失败', err)
  }
})
</script>

<style scoped>
/* ===== UI/UX Pro Max 前台布局 ===== */

:root {
  --color-primary: var(--accent-color);
  --color-primary-hover: var(--accent-color-hover);
  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-bg-light: var(--bg-body);
  --color-border-light: var(--border-color);
  --color-shadow-sm: var(--shadow-sm);
  --color-shadow-md: var(--shadow-md);
}

.front-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--bg-body);
}

.main-wrapper {
  flex: 1;
}

/* ===== 页脚区域 ===== */
.footer {
  background: var(--bg-hero-alt);
  border-top: 1px solid var(--border-color);
  margin-top: 80px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 50px;
  padding: 48px 20px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 页脚段落 */
.footer-section h3 {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  padding-bottom: 10px;
}

.footer-section h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 30px;
  height: 2px;
  background: var(--color-primary);
  border-radius: 1px;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.footer-section:hover h3::after {
  width: 60px;
}

.footer-section p {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.8;
  margin: 0 0 12px 0;
  transition: color 0.3s ease;
}

.footer-section:hover p {
  color: var(--color-text-primary);
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section ul li {
  margin-bottom: 10px;
}

.footer-section a {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  display: inline-block;
}

.footer-section a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-primary);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 1px;
}

.footer-section a:hover {
  color: var(--color-primary-hover);
  transform: translateX(2px);
}

.footer-section a:hover::after {
  width: 100%;
}

.footer-social {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-social-btn {
  display: flex !important;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  color: var(--color-text-secondary) !important;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.footer-social-btn::after {
  display: none;
}

.footer-social-btn svg {
  flex-shrink: 0;
  color: currentColor;
  transition: all 0.3s ease;
}

.footer-social-btn:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  border-color: #2563eb;
  color: #ffffff !important;
  transform: translateX(4px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.35);
}

.footer-social-btn:hover svg {
  transform: scale(1.15);
  color: #ffffff;
}

/* 页脚底部 */
.footer-bottom {
  padding: 24px 20px;
  border-top: 1px solid var(--border-color);
  background: var(--bg-card);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);}

.footer-bottom-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.footer-bottom p {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
  font-weight: 500;
  letter-spacing: 0.3px;
  transition: color 0.3s ease;
}

.footer-bottom:hover p {
  color: var(--color-text-secondary);
}

.footer-bottom-links {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.footer-bottom-links a {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
}

.footer-bottom-links a:hover {
  color: var(--color-primary-hover);
}

.footer-divider {
  color: var(--text-secondary);
}

.subscribe-footer {
  max-width: 900px;
  margin: 0 auto 20px;
  padding: 0 20px 20px;
}

.subscribe-footer :deep(.subscribe-box) {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-md);
}

.wechat-qrcode {
  margin-top: 8px;
}

.wechat-img {
  width: 180px;
  height: 180px;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
}

.wechat-caption {
  margin-top: 6px;
  font-size: 13px;
  color: var(--color-primary);
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  user-select: none;
}

.wechat-icon {
  display: inline-flex;
}

.wechat-caption:hover {
  color: var(--color-primary-hover);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 40px 16px;
  }

  .footer {
    margin-top: 60px;
  }

  .footer-section h3 {
    font-size: 14px;
    margin-bottom: 14px;
  }

  .footer-section p {
    font-size: 13px;
  }
  
  .wechat-img {
    width: 140px;
    height: 140px;
  }
}
</style>
