<template>
  <div class="home-container">
    <!-- Hero Section: 个人展示 -->
    <section class="hero-section">
      <div class="container hero-inner">
        <div class="hero-text">
          <p class="hero-eyebrow">你好，我是</p>
          <h1 class="hero-name">李嘉骏 <span class="hero-en-name">/ Justin</span></h1>
          <p class="hero-tagline">{{ siteInfo.blog_subtitle || '欢迎来到我的博客，分享技术、生活与思考。' }}</p>

          <nav class="hero-links">
            <router-link to="/articles" class="hero-link">阅读文章 →</router-link>
            <router-link to="/about" class="hero-link">关于我 →</router-link>
            <router-link to="/subscribe" class="hero-link">订阅更新 →</router-link>
          </nav>
        </div>

        <div class="hero-aside">
          <ul class="hero-facts">
            <li>
              <span class="fact-num">{{ statistics.articles || 0 }}</span>
              <span class="fact-label">篇文章</span>
            </li>
            <li>
              <span class="fact-num">{{ categories.length || 0 }}</span>
              <span class="fact-label">个分类</span>
            </li>
            <li>
              <span class="fact-num">{{ siteInfo.total_views || 0 }}</span>
              <span class="fact-label">次阅读</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <div class="home-layout container">
      <div class="main-content">
        <div class="section-header">
          <h2 class="section-title">精选文章</h2>
          <div class="section-line"></div>
        </div>

        <div class="article-grid">
          <div 
            v-for="(article, index) in articles" 
            :key="article.id" 
            class="article-card-wrapper"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="article-card" @click="router.push(`/article/${article.id}`)">
              <div class="card-cover" v-if="article.cover_image">
                <img :src="article.cover_image" :alt="article.title" loading="lazy" />
                <div class="card-category" v-if="article.category_name">{{ article.category_name }}</div>
              </div>
              <div class="card-body">
                <h3 class="card-title">{{ article.title }}</h3>
                <p class="card-summary">{{ article.summary }}</p>
                
                <div class="card-footer">
                  <div class="card-meta">
                    <span>{{ formatDate(article.published_at) }}</span>
                    <span class="meta-dot"></span>
                    <span>{{ article.view_count }} 次阅读</span>
                  </div>
                  <div class="card-tags" v-if="article.tags?.length">
                    <span v-for="tag in article.tags.slice(0, 2)" :key="tag.id" class="mini-tag">
                      #{{ tag.name }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="articles.length === 0" class="empty-state">
          <div class="empty-icon">📂</div>
          <p>暂无文章发布呦~，欢迎多加关注哦~</p>
        </div>

        <div class="pagination-wrapper" v-if="pagination.totalPages > 1">
          <button 
            class="page-btn" 
            :disabled="pagination.page <= 1" 
            @click="changePage(pagination.page - 1)"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div class="page-info">
            <span class="current-page">{{ pagination.page }}</span>
            <span class="page-separator">/</span>
            <span class="total-pages">{{ pagination.totalPages }}</span>
          </div>
          <button 
            class="page-btn" 
            :disabled="pagination.page >= pagination.totalPages" 
            @click="changePage(pagination.page + 1)"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      <aside class="sidebar">
        <!-- Author Profile -->
        <div v-if="siteInfo.author_name" class="sidebar-widget profile-card">
          <div class="profile-header">
            <div class="avatar-ring">
              <img :src="siteInfo.author_avatar || `${uploadsUrl}/uploads/default-avatar.jpg`" class="profile-avatar" />
            </div>
            <h3 class="profile-name">{{ siteInfo.author_name }}</h3>
            <p class="profile-bio">{{ siteInfo.author_intro }}</p>
          </div>
          
          <div class="profile-stats">
            <div class="stat-item">
              <span class="stat-num">{{ statistics.articles || 0 }}</span>
              <span class="stat-label">文章</span>
            </div>
            <div class="stat-item">
              <span class="stat-num">{{ statistics.categories || 0 }}</span>
              <span class="stat-label">分类</span>
            </div>
            <div class="stat-item">
              <span class="stat-num">{{ statistics.tags || 0 }}</span>
              <span class="stat-label">标签</span>
            </div>
          </div>

          <div class="profile-social">
            <a v-if="siteInfo.contact_github || true" :href="siteInfo.contact_github || 'https://github.com/lijiajun20130726-ux'" target="_blank" class="social-btn github" title="GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 3.071 1.305 3.819.997.108-.775.482-1.305.89-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.362.81 1.096.81 2.22v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <a v-if="siteInfo.contact_youtube || true" :href="siteInfo.contact_youtube || 'https://www.youtube.com/@lijiajun-xtjj/'" target="_blank" class="social-btn youtube" title="YouTube">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a v-if="siteInfo.contact_email" :href="`mailto:${siteInfo.contact_email}`" class="social-btn email" title="Email">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </a>
            <div v-if="siteInfo.wechat_qrcode" class="social-btn wechat" title="微信">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8.69 13.585c.677 0 1.226-.549 1.226-1.226s-.549-1.226-1.226-1.226-1.226.549-1.226 1.226.549 1.226 1.226 1.226zm-2.903-1.226c0 .677.549 1.226 1.226 1.226s1.226-.549 1.226-1.226-.549-1.226-1.226-1.226-1.226.549-1.226 1.226zM12 0C5.373 0 0 4.28 0 9.507c0 2.937 1.667 5.568 4.252 7.279L3.3 20.25l4.38-2.19c1.332.368 2.76.577 4.252.577 6.627 0 12-4.28 12-9.507S18.627 0 12 0zm0 17.69c-5.893 0-10.667-3.667-10.667-8.183S6.107 1.324 12 1.324c5.893 0 10.667 3.667 10.667 8.183s-4.774 8.183-10.667 8.183zm5.226-7.33c-.677 0-1.226.549-1.226 1.226s.549 1.226 1.226 1.226 1.226-.549 1.226-1.226-.549-1.226-1.226-1.226zm-2.903 1.226c0-.677-.549-1.226-1.226-1.226s-1.226.549-1.226 1.226.549 1.226 1.226 1.226 1.226-.549 1.226-1.226z"/></svg>
              <div class="wechat-tooltip">
                <img :src="siteInfo.wechat_qrcode" alt="微信二维码" class="wechat-qr" />
              </div>
            </div>
            <div v-if="siteInfo.wechat_official_qrcode" class="social-btn wechat" title="微信公众号">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" />
                <rect x="7" y="15" width="10" height="2" rx="1" fill="#fff"/>
                <circle cx="9" cy="10" r="1.6" fill="#fff"/>
                <circle cx="15" cy="10" r="1.6" fill="#fff"/>
              </svg>
              <div class="wechat-tooltip">
                <img :src="siteInfo.wechat_official_qrcode" alt="微信公众号二维码" class="wechat-qr" />
              </div>
            </div>
          </div>
        </div>

        <!-- Categories -->
        <div class="sidebar-widget">
          <h3 class="widget-title">文章分类</h3>
          <div class="category-list">
            <router-link 
              v-for="cat in categories" 
              :key="cat.id" 
              :to="`/category/${cat.id}`"
              class="category-item"
            >
              <span class="cat-name">{{ cat.name }}</span>
              <span class="cat-count">{{ cat.article_count || 0 }}</span>
            </router-link>
          </div>
        </div>

        <!-- Popular Articles -->
        <div class="sidebar-widget">
          <h3 class="widget-title">热门文章</h3>
          <div class="hot-list">
            <router-link 
              v-for="(article, index) in hotArticles" 
              :key="article.id" 
              :to="`/article/${article.id}`"
              class="hot-item"
            >
              <span class="hot-index">{{ index + 1 }}</span>
              <span class="hot-title">{{ article.title }}</span>
            </router-link>
          </div>
        </div>

        <div class="sidebar-widget sidebar-subscribe">
          <SubscribeBox />
        </div>

      </aside>
    </div>

    <!-- 管理员侧边栏紧凑度调节工具 -->
    <transition name="sidebar-tool-fade">
      <div v-if="showSidebarTool" class="sidebar-tool">
        <div class="sidebar-tool-header">
          <span class="sidebar-tool-title">侧边栏调节</span>
          <button class="sidebar-tool-close" @click="showSidebarTool = false" title="关闭">×</button>
        </div>

        <div class="sidebar-tool-section">个人卡片</div>

        <div class="sidebar-tool-row">
          <label>头像大小 <span>{{ profileCfg.avatarSize }}px</span></label>
          <input type="range" min="48" max="120" step="2" v-model.number="profileCfg.avatarSize" />
        </div>

        <div class="sidebar-tool-row">
          <label>头像下边距 <span>{{ profileCfg.avatarGap }}px</span></label>
          <input type="range" min="4" max="32" step="1" v-model.number="profileCfg.avatarGap" />
        </div>

        <div class="sidebar-tool-row">
          <label>姓名字号 <span>{{ profileCfg.nameSize }}px</span></label>
          <input type="range" min="13" max="24" step="1" v-model.number="profileCfg.nameSize" />
        </div>

        <div class="sidebar-tool-row">
          <label>简介字号 <span>{{ profileCfg.bioSize }}px</span></label>
          <input type="range" min="11" max="16" step="1" v-model.number="profileCfg.bioSize" />
        </div>

        <div class="sidebar-tool-row">
          <label>简介下边距 <span>{{ profileCfg.bioGap }}px</span></label>
          <input type="range" min="4" max="32" step="1" v-model.number="profileCfg.bioGap" />
        </div>

        <div class="sidebar-tool-row">
          <label>统计数字字号 <span>{{ profileCfg.statSize }}px</span></label>
          <input type="range" min="12" max="24" step="1" v-model.number="profileCfg.statSize" />
        </div>

        <div class="sidebar-tool-row">
          <label>统计行间距 <span>{{ profileCfg.statGap }}px</span></label>
          <input type="range" min="0" max="32" step="1" v-model.number="profileCfg.statGap" />
        </div>

        <div class="sidebar-tool-row">
          <label>社交按钮大小 <span>{{ profileCfg.socialSize }}px</span></label>
          <input type="range" min="24" max="48" step="1" v-model.number="profileCfg.socialSize" />
        </div>

        <div class="sidebar-tool-section">通用模块</div>

        <div class="sidebar-tool-row">
          <label>卡片内边距 <span>{{ sidebarCfg.padding }}px</span></label>
          <input type="range" min="8" max="36" step="1" v-model.number="sidebarCfg.padding" />
        </div>

        <div class="sidebar-tool-row">
          <label>卡片间距 <span>{{ sidebarCfg.gap }}px</span></label>
          <input type="range" min="8" max="48" step="1" v-model.number="sidebarCfg.gap" />
        </div>

        <div class="sidebar-tool-section">分类 / 热门列表</div>

        <div class="sidebar-tool-row">
          <label>列表行间距 <span>{{ sidebarCfg.listGap }}px</span></label>
          <input type="range" min="0" max="20" step="1" v-model.number="sidebarCfg.listGap" />
        </div>

        <div class="sidebar-tool-row">
          <label>列表项内边距 Y <span>{{ sidebarCfg.itemPadY }}px</span></label>
          <input type="range" min="0" max="16" step="1" v-model.number="sidebarCfg.itemPadY" />
        </div>

        <div class="sidebar-tool-row">
          <label>列表项内边距 X <span>{{ sidebarCfg.itemPadX }}px</span></label>
          <input type="range" min="4" max="20" step="1" v-model.number="sidebarCfg.itemPadX" />
        </div>

        <div class="sidebar-tool-row">
          <label>标题字号 <span>{{ sidebarCfg.titleSize }}px</span></label>
          <input type="range" min="12" max="20" step="1" v-model.number="sidebarCfg.titleSize" />
        </div>

        <div class="sidebar-tool-row">
          <label>标题下边距 <span>{{ sidebarCfg.titleMargin }}px</span></label>
          <input type="range" min="4" max="28" step="1" v-model.number="sidebarCfg.titleMargin" />
        </div>

        <div class="sidebar-tool-actions">
          <button class="btn-reset" @click="resetAllCfg">重置默认</button>
        </div>
      </div>
    </transition>

    <!-- 触发按钮：管理员才能看到 -->
    <button v-if="isAdmin" class="sidebar-tool-toggle" @click="showSidebarTool = !showSidebarTool" title="侧边栏调节">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import SubscribeBox from '@/components/SubscribeBox.vue'
import { getArticles, getCategories, getHotArticles, getSiteInfo, getStatistics } from '@/api/front'
import { uploadsUrl } from '@/utils/url'

const router = useRouter()
const articles = ref<any[]>([])
const categories = ref<any[]>([])
const hotArticles = ref<any[]>([])
const siteInfo = ref<any>({})
const statistics = ref<any>({})
const pagination = ref({ page: 1, pageSize: 10, total: 0, totalPages: 0 })


// ========== 侧边栏调节工具（仅管理员） ==========
const SIDEBAR_CFG_KEY = 'home_sidebar_cfg_v1'
const PROFILE_CFG_KEY = 'home_profile_cfg_v1'

const defaultSidebarCfg = {
  padding: 18,        // 卡片内边距
  gap: 20,            // 卡片外间距
  listGap: 2,         // 列表行间距
  itemPadY: 6,        // 列表项上下内边距
  itemPadX: 10,       // 列表项左右内边距
  titleSize: 14,      // 标题字号
  titleMargin: 12     // 标题下边距
}
const defaultProfileCfg = {
  avatarSize: 72,     // 头像大小
  avatarGap: 10,      // 头像下边距
  nameSize: 17,       // 姓名字号
  bioSize: 12,        // 简介字号
  bioGap: 12,         // 简介下边距
  statSize: 16,       // 统计数字字号
  statGap: 12,        // 统计行间距（与社交按钮距离）
  socialSize: 32      // 社交按钮大小
}

const loadCfg = (key, defaults) => {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return { ...defaults, ...JSON.parse(raw) }
  } catch (e) {}
  return { ...defaults }
}

const sidebarCfg = ref(loadCfg(SIDEBAR_CFG_KEY, defaultSidebarCfg))
const profileCfg = ref(loadCfg(PROFILE_CFG_KEY, defaultProfileCfg))
const showSidebarTool = ref(false)
const isAdmin = ref(false)

const resetAllCfg = () => {
  sidebarCfg.value = { ...defaultSidebarCfg }
  profileCfg.value = { ...defaultProfileCfg }
}

watch(sidebarCfg, (val) => {
  localStorage.setItem(SIDEBAR_CFG_KEY, JSON.stringify(val))
  applySidebarStyle()
}, { deep: true })

watch(profileCfg, (val) => {
  localStorage.setItem(PROFILE_CFG_KEY, JSON.stringify(val))
  applySidebarStyle()
}, { deep: true })

const applySidebarStyle = () => {
  if (typeof document === 'undefined') return
  const id = 'home-sidebar-tool-style'
  let el = document.getElementById(id) as HTMLStyleElement | null
  if (!el) {
    el = document.createElement('style')
    el.id = id
    document.head.appendChild(el)
  }
  const s = sidebarCfg.value
  const p = profileCfg.value
  el.textContent = `
    .home-layout .sidebar .sidebar-widget {
      padding: ${s.padding}px ${s.padding}px !important;
      margin-bottom: ${s.gap}px !important;
    }
    .home-layout .sidebar .profile-card .avatar-ring {
      width: ${p.avatarSize}px !important;
      height: ${p.avatarSize}px !important;
      margin-bottom: ${p.avatarGap}px !important;
    }
    .home-layout .sidebar .profile-card .profile-name {
      font-size: ${p.nameSize}px !important;
    }
    .home-layout .sidebar .profile-card .profile-bio {
      font-size: ${p.bioSize}px !important;
      margin-bottom: ${p.bioGap}px !important;
    }
    .home-layout .sidebar .profile-card .stat-num {
      font-size: ${p.statSize}px !important;
    }
    .home-layout .sidebar .profile-card .profile-stats {
      margin-bottom: ${p.statGap}px !important;
    }
    .home-layout .sidebar .profile-card .social-btn {
      width: ${p.socialSize}px !important;
      height: ${p.socialSize}px !important;
    }
  `
}

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const loadArticles = async (page = 1) => {
  const res: any = await getArticles({ page, pageSize: 10 })
  if (res.code === 200) {
    articles.value = res.data.list
    pagination.value = res.data.pagination
  }
}

const changePage = (page: number) => {
  loadArticles(page)
  window.scrollTo({ top: 400, behavior: 'smooth' })
}

onMounted(async () => {
  window.scrollTo({ top: 0 });
  loadArticles()
  const [catRes, hotRes, siteRes, statRes]: any[] = await Promise.all([
    getCategories(true), 
    getHotArticles(5),
    getSiteInfo(),
    getStatistics()
  ])
  if (catRes.code === 200) categories.value = catRes.data
  if (hotRes.code === 200) hotArticles.value = hotRes.data
  if (siteRes.code === 200) {
    siteInfo.value = siteRes.data
    // 设置首页标题
    document.title = `${siteInfo.value.blog_title || '李嘉骏的博客'} - ${siteInfo.value.blog_subtitle || '技术分享与生活记录'}`
  }
  if (statRes.code === 200) statistics.value = statRes.data

  // 侧边栏调节工具初始化
  try {
    const userRaw = localStorage.getItem('user')
    if (userRaw) {
      const u = JSON.parse(userRaw)
      isAdmin.value = u.role === 'admin' || u.is_admin === 1 || u.is_admin === true
    }
  } catch (e) {}
  applySidebarStyle()
})
</script>

<style scoped>
/* ==========================================================
   全局变量（极简：单色调 + 细线）
   ========================================================== */
.home-container {
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ==========================================================
   Hero Section：极简衬线大字版
   ========================================================== */
.hero-section {
  padding: 96px 0 80px;
  background: var(--bg-body);
  border-bottom: 1px solid var(--border-color);
}

.hero-inner {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 64px;
  align-items: end;
  padding: 0 24px;
}

@media (max-width: 768px) {
  .hero-inner {
    grid-template-columns: 1fr;
    gap: 48px;
  }
  .hero-section { padding: 56px 0 48px; }
}

.hero-text { display: flex; flex-direction: column; }

.hero-eyebrow {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin: 0 0 20px;
  display: inline-flex;
  align-items: center;
  gap: 12px;
}
.hero-eyebrow::before {
  content: '';
  width: 32px;
  height: 1px;
  background: currentColor;
  display: inline-block;
}

.hero-name {
  font-size: 60px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.05;
  letter-spacing: -0.025em;
  margin: 0 0 24px;
  font-family: Georgia, 'Times New Roman', 'Songti SC', '宋体', serif;
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
}

.hero-en-name {
  font-size: 28px;
  font-weight: 500;
  color: var(--text-secondary);
  font-family: Georgia, 'Times New Roman', serif;
}

.hero-tagline {
  font-size: 17px;
  line-height: 1.65;
  color: var(--text-secondary);
  max-width: 520px;
  margin: 0 0 32px;
}

.hero-links {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  font-size: 14px;
  font-weight: 500;
}

.hero-link {
  color: var(--text-primary);
  text-decoration: none;
  padding-bottom: 2px;
  border-bottom: 1px solid transparent;
  transition: color 200ms, border-color 200ms;
  cursor: pointer;
}
.hero-link:hover {
  color: var(--accent-color);
  border-bottom-color: var(--accent-color);
}

.hero-aside {
  border-left: 1px solid var(--border-color);
  padding-left: 48px;
}
@media (max-width: 768px) {
  .hero-aside {
    border-left: none;
    border-top: 1px solid var(--border-color);
    padding-left: 0;
    padding-top: 32px;
  }
}

.hero-facts {
  list-style: none;
  margin: 0;
  padding: 0;
}
.hero-facts li {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 18px 0;
  border-bottom: 1px solid var(--border-color);
}
.hero-facts li:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.hero-facts li:first-child { padding-top: 0; }

.fact-num {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
  font-family: Georgia, 'Times New Roman', serif;
}
.fact-label {
  font-size: 13px;
  color: var(--text-secondary);
}

/* ==========================================================
   Home Layout：主内容 + 侧边栏
   ========================================================== */
.home-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 56px;
  padding: 64px 0 80px;
}

@media (max-width: 1024px) {
  .home-layout {
    grid-template-columns: 1fr;
    gap: 48px;
  }
}

/* ==========================================================
   Section Header：纯文字 + hairline
   ========================================================== */
.section-header {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}
.section-title {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-primary);
  white-space: nowrap;
}
.section-line { display: none; }
.section-meta {
  font-size: 12px;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
}

/* ==========================================================
   Article Card：横向布局（封面 + 内容）+ 圆角 + hover 效果
   ========================================================== */
.article-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.article-card-wrapper {
  border-bottom: none;
}
.article-card-wrapper:last-child { border-bottom: none; }

.article-card {
  display: flex;
  background: var(--bg-card);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  transition: box-shadow 300ms, border-color 300ms, transform 300ms;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  position: relative;
}

.article-card:hover {
  transform: translateY(-3px);
  box-shadow:
    0 12px 28px rgba(15, 23, 42, 0.06),
    0 4px 12px rgba(15, 23, 42, 0.04);
  border-color: var(--text-secondary);
}

.card-cover {
  display: block;
  flex: 0 0 260px;
  position: relative;
  overflow: hidden;
  background: var(--bg-surface-muted);
}

.card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 600ms ease;
}

.article-card:hover .card-cover img {
  transform: scale(1.04);
}

.card-category {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.02em;
}

.card-body {
  flex: 1;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
  letter-spacing: -0.01em;
  margin: 0 0 8px;
  transition: color 200ms;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-card:hover .card-title {
  color: var(--accent-color);
}

.card-summary {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 400;
}

.meta-dot {
  width: 3px;
  height: 3px;
  background: var(--border-color-hover);
  border-radius: 50%;
}

.card-tags {
  display: flex;
  gap: 6px;
}

.mini-tag {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-secondary);
  padding: 2px 8px;
  background: var(--bg-surface-muted);
  border-radius: 4px;
}

@media (max-width: 768px) {
  .article-card { flex-direction: column; }
  .card-cover { flex: 0 0 180px; width: 100%; }
}

/* ==========================================================
   Empty State
   ========================================================== */
.empty-state {
  text-align: center;
  padding: 100px 0;
  color: var(--text-secondary);
  font-size: 14px;
}
.empty-icon { display: none; }

/* ==========================================================
   Pagination：纯文字 + 边框按钮
   ========================================================== */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 56px;
  padding-top: 32px;
  border-top: 1px solid var(--border-color);
}
.page-btn {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  cursor: pointer;
  transition: border-color 200ms, color 200ms;
}
.page-btn:hover:not(:disabled) {
  border-color: var(--text-primary);
  color: var(--text-primary);
}
.page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.page-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}
.current-page { color: var(--text-primary); font-weight: 600; }
.page-separator, .total-pages { color: var(--text-secondary); }

/* ==========================================================
   Sidebar：所有 widget 统一为细线卡片
   ========================================================== */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.sidebar-widget {
  background: transparent;
  border-radius: 0;
  padding: 0;
  border: none;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 28px;
  margin-bottom: 0;
  box-shadow: none;
  transition: none;
}
.sidebar-widget:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.sidebar-widget:hover { box-shadow: none; transform: none; }

.sidebar-subscribe {
  padding: 0;
  border: none;
  background: transparent;
  box-shadow: none;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 28px;
  margin-bottom: 0;
  /* 防止订阅卡被侧边栏自身 padding 推到看不见的地方 */
  position: relative;
  z-index: 1;
}
.sidebar-subscribe:hover { box-shadow: none; transform: none; }

/* 订阅框：恢复圆角 + 模糊 + 立体感 + 过渡动画 */
.sidebar-subscribe :deep(.subscribe-box) {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow:
    0 8px 20px rgba(15, 23, 42, 0.04),
    0 2px 6px rgba(15, 23, 42, 0.02);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: box-shadow 300ms, transform 300ms;
  overflow: hidden;
}

.sidebar-subscribe :deep(.subscribe-box:hover) {
  box-shadow:
    0 16px 40px rgba(15, 23, 42, 0.08),
    0 4px 12px rgba(15, 23, 42, 0.04);
  transform: translateY(-2px);
}

.sidebar-subscribe :deep(.subscribe-box input),
.sidebar-subscribe :deep(.subscribe-box button) {
  border-radius: 8px;
  transition: background 200ms, color 200ms, border-color 200ms;
}

.sidebar-subscribe :deep(.subscribe-box button) {
  cursor: pointer;
}

.sidebar-subscribe :deep(.subscribe-box button:hover) {
  filter: brightness(0.95);
}

.widget-title {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin: 0 0 16px;
  display: block;
  padding: 0;
}
.widget-title::before { content: none; }

/* ==========================================================
   Profile Card：侧边个人卡（去装饰）
   ========================================================== */
.profile-card {
  text-align: left;
  background: transparent;
}

.avatar-ring {
  width: 56px;
  height: 56px;
  margin: 0 0 12px;
  padding: 0;
  border: none;
  border-radius: 50%;
  display: block;
  overflow: hidden;
}
.profile-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}

.profile-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 4px;
  letter-spacing: -0.01em;
}
.profile-bio {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0 0 16px;
}

.profile-stats {
  display: flex;
  gap: 0;
  margin: 0 0 16px;
  padding: 12px 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}
.profile-stats .stat-item {
  flex: 1;
  text-align: left;
  padding: 0;
  background: transparent;
  border-radius: 0;
  border: none;
  transition: none;
}
.profile-stats .stat-item:hover { transform: none; box-shadow: none; }

.stat-num {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
  margin: 0;
}
.stat-label {
  font-size: 10px;
  color: var(--text-secondary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 2px 0 0;
  display: block;
}

.profile-social {
  display: flex;
  gap: 0;
}
.social-btn {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--border-color);
  margin-right: 6px;
  transition: color 200ms, border-color 200ms;
  cursor: pointer;
}
.social-btn:hover { transform: none; }
.social-btn.github:hover { color: var(--text-primary); border-color: var(--text-primary); box-shadow: none; }
.social-btn.youtube:hover { color: var(--text-primary); border-color: var(--text-primary); box-shadow: none; }
.social-btn.email:hover { color: var(--text-primary); border-color: var(--text-primary); box-shadow: none; }
.social-btn.wechat { position: relative; }
.social-btn.wechat:hover { color: var(--text-primary); border-color: var(--text-primary); box-shadow: none; }

.wechat-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  background: var(--bg-card);
  color: var(--text-primary);
  padding: 6px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  opacity: 0;
  visibility: hidden;
  transition: opacity 200ms, transform 200ms;
  pointer-events: none;
  border: 1px solid var(--border-color);
  display: flex;
  justify-content: center;
  align-items: center;
}
.wechat-qr { width: 140px; height: 140px; object-fit: contain; border-radius: 2px; }
.wechat-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: var(--bg-card) transparent transparent transparent;
}
.social-btn.wechat:hover .wechat-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(-4px);
}

/* ==========================================================
   Category / Hot List：纯文字行
   ========================================================== */
.category-list, .hot-list {
  display: flex;
  flex-direction: column;
}

.category-item, .hot-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  text-decoration: none;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 400;
  border-bottom: 1px solid var(--border-color);
  transition: color 200ms;
  cursor: pointer;
  min-width: 0;
}
.category-list .category-item:last-child,
.hot-list .hot-item:last-child { border-bottom: none; }
.category-item:hover, .hot-item:hover { color: var(--text-primary); }

.cat-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cat-count {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-secondary);
  background: transparent;
  padding: 0;
  border-radius: 0;
  font-variant-numeric: tabular-nums;
}
.category-item:hover .cat-count {
  background: transparent;
  color: var(--text-primary);
}

.hot-item { gap: 10px; align-items: baseline; }
.hot-index {
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 500;
  color: var(--text-secondary);
  font-style: normal;
  width: 18px;
  font-variant-numeric: tabular-nums;
}
.hot-item:nth-child(1) .hot-index,
.hot-item:nth-child(2) .hot-index,
.hot-item:nth-child(3) .hot-index { color: var(--text-primary); font-weight: 600; }

.hot-title {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  font-weight: 400;
  color: inherit;
  line-height: 1.5;
  transition: none;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.hot-item:hover .hot-title { color: var(--text-primary); }

/* ==========================================================
   Tag Cloud
   ========================================================== */
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.tag-pill {
  padding: 4px 10px;
  background: transparent;
  color: var(--text-secondary);
  border-radius: 0;
  font-size: 12px;
  font-weight: 400;
  text-decoration: none;
  border: 1px solid var(--border-color);
  transition: color 200ms, border-color 200ms;
  cursor: pointer;
}
.tag-pill:hover {
  background: transparent;
  color: var(--text-primary);
  border-color: var(--text-primary);
  transform: none;
}

/* ==========================================================
   管理员侧边栏调节工具
   ========================================================== */
.sidebar-tool-toggle {
  position: fixed;
  left: 24px;
  bottom: 100px;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  background: var(--text-primary);
  color: var(--bg-body);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
  transition: opacity 200ms;
}
.sidebar-tool-toggle:hover {
  transform: none;
  opacity: 0.8;
  box-shadow: none;
}

.sidebar-tool {
  position: fixed;
  left: 24px;
  bottom: 156px;
  width: 280px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 16px;
  z-index: 9999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  backdrop-filter: none;
}
.sidebar-tool-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
}
.sidebar-tool-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}
.sidebar-tool-close {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  color: var(--text-secondary);
  border-radius: 4px;
  transition: background 200ms;
}
.sidebar-tool-close:hover { background: var(--bg-surface-muted); }

.sidebar-tool-section {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 12px 0 8px;
  padding-top: 10px;
  border-top: 1px solid var(--border-color);
}
.sidebar-tool-section:first-of-type {
  margin-top: 0;
  padding-top: 0;
  border-top: none;
}
.sidebar-tool-row { margin-bottom: 10px; }
.sidebar-tool-row label {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 4px;
  font-weight: 400;
}
.sidebar-tool-row label span {
  color: var(--text-primary);
  font-weight: 500;
  font-family: 'SF Mono', Monaco, monospace;
  font-variant-numeric: tabular-nums;
}
.sidebar-tool-row input[type="range"] {
  width: 100%;
  accent-color: var(--text-primary);
  cursor: pointer;
}

.sidebar-tool-actions {
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid var(--border-color);
  text-align: center;
}
.btn-reset {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-primary);
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: border-color 200ms, background 200ms;
}
.btn-reset:hover {
  background: var(--text-primary);
  color: var(--bg-body);
  border-color: var(--text-primary);
}

.sidebar-tool-fade-enter-active,
.sidebar-tool-fade-leave-active {
  transition: opacity 200ms ease;
}
.sidebar-tool-fade-enter-from,
.sidebar-tool-fade-leave-to {
  opacity: 0;
}

/* ==========================================================
   全局：去掉 transform 缩放等可能造成 layout shift 的动画
   ========================================================== */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
</style>

