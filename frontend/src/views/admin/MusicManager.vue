<template>
  <div class="music-manager">
    <div class="page-header">
      <h2>🎵 音乐管理</h2>
      <button class="btn-primary" @click="showAdd = true">
        + 添加音乐
      </button>
    </div>

    <div class="filter-bar">
      <input v-model="search" placeholder="搜索歌曲名/歌手..." class="search-input" />
      <select v-model="filterPlatform" class="filter-select">
        <option value="">全部平台</option>
        <option value="netease">网易云</option>
        <option value="tencent">QQ音乐</option>
        <option value="kugou">酷狗</option>
        <option value="kuwo">酷我</option>
      </select>
    </div>

    <div class="table-wrap">
      <table v-if="filteredList.length">
        <thead>
          <tr>
            <th>歌曲</th>
            <th>歌手</th>
            <th>平台</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredList" :key="item.id">
            <td>
              <div class="song">
                <div class="cover">{{ item.name?.charAt(0) || '♪' }}</div>
                <span>{{ item.name }}</span>
              </div>
            </td>
            <td>{{ item.artist }}</td>
            <td><span class="platform-badge">{{ getPlatformName(item.platform) }}</span></td>
            <td>
              <span :class="['status', item.enabled ? 'on' : 'off']">
                {{ item.enabled ? '已启用' : '已停用' }}
              </span>
            </td>
            <td>
              <button class="btn-link" @click="toggleEnabled(item)">
                {{ item.enabled ? '停用' : '启用' }}
              </button>
              <button class="btn-link danger" @click="remove(item)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty">暂无音乐数据</div>
    </div>

    <!-- 添加弹窗 -->
    <div v-if="showAdd" class="modal" @click.self="showAdd = false">
      <div class="modal-content">
        <h3>添加音乐</h3>
        <div class="form-group">
          <label>歌曲名</label>
          <input v-model="form.name" placeholder="请输入歌曲名" />
        </div>
        <div class="form-group">
          <label>歌手</label>
          <input v-model="form.artist" placeholder="请输入歌手" />
        </div>
        <div class="form-group">
          <label>平台</label>
          <select v-model="form.platform">
            <option value="netease">网易云</option>
            <option value="tencent">QQ音乐</option>
            <option value="kugou">酷狗</option>
            <option value="kuwo">酷我</option>
          </select>
        </div>
        <div class="form-group">
          <label>歌曲ID/链接</label>
          <input v-model="form.source_id" placeholder="音乐ID或完整链接" />
        </div>
        <div class="form-actions">
          <button class="btn-secondary" @click="showAdd = false">取消</button>
          <button class="btn-primary" @click="save">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
interface MusicItem {
  id: number
  name: string
  artist: string
  platform: string
  source_id: string
  enabled: boolean
}

const list = ref<MusicItem[]>([])
const search = ref('')
const filterPlatform = ref('')
const showAdd = ref(false)
const form = ref({
  name: '',
  artist: '',
  platform: 'netease',
  source_id: ''
})

onMounted(() => {
  loadList()
})

const loadList = () => {
  // 从 localStorage 加载（演示用）
  const saved = localStorage.getItem('admin_music_list')
  if (saved) {
    list.value = JSON.parse(saved)
  }
}

const saveList = () => {
  localStorage.setItem('admin_music_list', JSON.stringify(list.value))
}

const filteredList = computed(() => {
  return list.value.filter(item => {
    const matchSearch = !search.value ||
      item.name?.includes(search.value) ||
      item.artist?.includes(search.value)
    const matchPlatform = !filterPlatform.value || item.platform === filterPlatform.value
    return matchSearch && matchPlatform
  })
})

const getPlatformName = (p: string) => {
  const map: Record<string, string> = {
    netease: '网易云',
    tencent: 'QQ音乐',
    kugou: '酷狗',
    kuwo: '酷我'
  }
  return map[p] || p
}

const toggleEnabled = (item: MusicItem) => {
  item.enabled = !item.enabled
  saveList()
  alert(item.enabled ? '已启用' : '已停用')
}

const remove = (item: MusicItem) => {
  if (!confirm(`确定删除「${item.name}」吗？`)) return
  list.value = list.value.filter(x => x.id !== item.id)
  saveList()
  alert('删除成功')
}

const save = () => {
  if (!form.value.name || !form.value.artist) {
    alert('请填写歌曲名和歌手')
    return
  }
  list.value.unshift({
    id: Date.now(),
    ...form.value,
    enabled: true
  })
  saveList()
  showAdd.value = false
  form.value = { name: '', artist: '', platform: 'netease', source_id: '' }
  alert('添加成功')
}
</script>

<style scoped>
.music-manager {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
}

.btn-primary {
  padding: 8px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.btn-secondary {
  padding: 8px 20px;
  background: var(--bg-secondary, #f5f5f7);
  color: var(--text-color, #1d1d1f);
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.search-input,
.filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background: var(--card-bg, #fff);
  color: var(--text-color, #1d1d1f);
}

.search-input {
  flex: 1;
  max-width: 320px;
}

.table-wrap {
  background: var(--card-bg, #fff);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
}

th {
  background: var(--bg-secondary, #f5f5f7);
  font-weight: 600;
}

.song {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cover {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
}

.platform-badge {
  display: inline-block;
  padding: 2px 10px;
  background: rgba(102,126,234,0.1);
  color: #667eea;
  border-radius: 12px;
  font-size: 12px;
}

.status {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
}

.status.on {
  background: rgba(103,194,58,0.1);
  color: #67c23a;
}

.status.off {
  background: rgba(144,147,153,0.1);
  color: #909399;
}

.btn-link {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-size: 13px;
  margin-right: 8px;
  padding: 0;
}

.btn-link.danger {
  color: #f56c6c;
}

.empty {
  padding: 40px;
  text-align: center;
  color: var(--text-color-secondary, #909399);
}

.modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-width: 420px;
  background: var(--card-bg, #fff);
  border-radius: 12px;
  padding: 24px;
}

.modal-content h3 {
  margin: 0 0 20px;
  font-size: 18px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  color: var(--text-color-secondary, #6e6e73);
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background: var(--card-bg, #fff);
  color: var(--text-color, #1d1d1f);
  box-sizing: border-box;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
}
</style>
