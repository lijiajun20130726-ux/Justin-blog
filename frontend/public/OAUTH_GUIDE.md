# 🎵 音乐播放器对接博客登录系统 - 给AI的完整对接文档

> 本文档是给**音乐播放器AI**看的，告诉它如何接入博客系统的登录功能。

---

## 📋 基本信息

| 项目 | 值 |
|------|---|
| **博客系统地址** | `http://localhost:5173` (前端) / `http://localhost:3000` (后端API) |
| **API 基础地址** | `http://localhost:3000/api/oauth` |
| **客户端ID** | `music_player` |
| **客户端密钥** | 见下面"获取密钥"部分 |
| **授权回调地址** | `http://localhost:8080/oauth/callback` (需提前配置) |

---

## 🔑 第一步：获取 client_secret

博客系统已为音乐播放器预创建了一个OAuth应用，但**client_secret 是动态生成的**。

**你（音乐播放器AI）需要做**：
1. 告诉博客开发者你的实际部署地址（包括端口）
2. 博客开发者会在数据库里把 `client_secret` 和 `redirect_uri` 加到白名单
3. 你会收到一个 `client_secret` 字符串（64位随机字符）

**当前默认配置**（仅本地测试用）：
```
client_id: music_player
client_secret: [请向博客开发者索取]
redirect_uris 白名单:
  - http://localhost:8080/oauth/callback
  - http://localhost:3000/oauth/callback
  - http://localhost:5175/oauth/callback
  - http://127.0.0.1:8080/oauth/callback
  - http://127.0.0.1:5175/oauth/callback
  - music-player://callback
```

---

## 🚀 第二步：完整登录流程

### 整体流程图

```
[1] 用户在音乐播放器点击"登录"
        ↓
[2] 音乐播放器构造授权URL，跳转到博客
        ↓
[3] 博客显示登录页（如果用户未登录）或授权确认页（如果已登录）
        ↓
[4] 用户确认授权
        ↓
[5] 博客跳回音乐播放器的回调地址，URL上带 ?code=xxx&state=xxx
        ↓
[6] 音乐播放器用 code 换取 access_token
        ↓
[7] 音乐播放器保存 access_token 和用户信息
        ↓
[8] 完成登录！
```

---

### 步骤1：构造授权URL

当用户点击"登录"按钮时，**跳转到下面的URL**：

```
http://localhost:5173/oauth/authorize?client_id=music_player&redirect_uri=http://localhost:8080/oauth/callback&state=随机字符串&scope=user.profile,user.email
```

**参数说明**：

| 参数 | 必填 | 说明 |
|------|------|------|
| `client_id` | ✅ | 固定值：`music_player` |
| `redirect_uri` | ✅ | 你的回调地址，必须在白名单中 |
| `state` | ✅ | 随机字符串，用于防CSRF攻击 |
| `scope` | ❌ | 授权范围，默认 `user.profile` |

**state 生成示例**（JavaScript）：

```javascript
// 生成随机state
const state = crypto.randomUUID() || Math.random().toString(36).substring(2, 15)
// 存到sessionStorage，回调时验证
sessionStorage.setItem('oauth_state', state)
```

---

### 步骤2：处理回调

博客授权完成后，会跳转到：

```
http://localhost:8080/oauth/callback?code=一次性授权码&state=你之前传的state
```

**你的回调页面需要做的**：

```javascript
// 1. 从URL中获取code和state
const urlParams = new URLSearchParams(window.location.search)
const code = urlParams.get('code')
const state = urlParams.get('state')
const error = urlParams.get('error')

// 2. 检查是否有错误
if (error) {
  const errorDesc = urlParams.get('error_description')
  alert('登录失败：' + errorDesc)
  return
}

// 3. 验证state（防CSRF）
const savedState = sessionStorage.getItem('oauth_state')
if (state !== savedState) {
  alert('安全验证失败，可能是CSRF攻击')
  return
}

// 4. 用code换token（见步骤3）
await exchangeCodeForToken(code)
```

---

### 步骤3：用 code 换取 access_token

调用博客后端API：

```
POST http://localhost:3000/api/oauth/token
Content-Type: application/json
```

**请求体**：

```json
{
  "grant_type": "authorization_code",
  "code": "步骤2获得的code",
  "client_id": "music_player",
  "client_secret": "你的client_secret",
  "redirect_uri": "http://localhost:8080/oauth/callback"
}
```

**成功响应**（HTTP 200）：

```json
{
  "code": 200,
  "message": "授权成功",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 7200,
    "refresh_token": "a1b2c3d4e5f6...",
    "refresh_expires_in": 2592000,
    "scope": "user.profile,user.email",
    "user_info": {
      "id": 123,
      "username": "xiaoming",
      "nickname": "小明",
      "email": "user@example.com",
      "avatar": "https://...",
      "role": "user"
    }
  }
}
```

**JavaScript 调用示例**：

```javascript
async function exchangeCodeForToken(code) {
  const response = await fetch('http://localhost:3000/api/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code: code,
      client_id: 'music_player',
      client_secret: '你的client_secret',
      redirect_uri: 'http://localhost:8080/oauth/callback'
    })
  })

  const data = await response.json()

  if (data.code === 200) {
    // 成功！保存token和用户信息
    const { access_token, refresh_token, user_info } = data.data

    // 保存到localStorage
    localStorage.setItem('mp_access_token', access_token)
    localStorage.setItem('mp_refresh_token', refresh_token)
    localStorage.setItem('mp_user_info', JSON.stringify(user_info))

    // 更新UI
    showLoggedInUI(user_info)
  } else {
    alert('登录失败：' + data.message)
  }
}
```

---

### 步骤4：使用 access_token 调用博客API

之后每次调用博客API时，**带上 access_token**：

```
GET http://localhost:3000/api/some-endpoint
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 步骤5：刷新 token

access_token 有效期 2小时，过期后用 refresh_token 刷新：

```
POST http://localhost:3000/api/oauth/token
Content-Type: application/json
```

**请求体**：

```json
{
  "grant_type": "refresh_token",
  "refresh_token": "之前保存的refresh_token",
  "client_id": "music_player",
  "client_secret": "你的client_secret"
}
```

**自动刷新示例**：

```javascript
// 在每次API调用前检查token是否过期
async function callBlogAPI(url, options = {}) {
  let token = localStorage.getItem('mp_access_token')
  const tokenExpiry = localStorage.getItem('mp_token_expiry')
  const now = Date.now()

  // 提前5分钟刷新token
  if (tokenExpiry && now > parseInt(tokenExpiry) - 5 * 60 * 1000) {
    await refreshToken()
    token = localStorage.getItem('mp_access_token')
  }

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  })
}

async function refreshToken() {
  const refreshToken = localStorage.getItem('mp_refresh_token')
  const response = await fetch('http://localhost:3000/api/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: 'music_player',
      client_secret: '你的client_secret'
    })
  })
  const data = await response.json()
  if (data.code === 200) {
    localStorage.setItem('mp_access_token', data.data.access_token)
    localStorage.setItem('mp_refresh_token', data.data.refresh_token)
    localStorage.setItem('mp_token_expiry', Date.now() + data.data.expires_in * 1000)
  } else {
    // refresh_token也过期了，跳转登录
    localStorage.clear()
    window.location.href = buildAuthorizeUrl()
  }
}
```

---

### 步骤6：验证 token（可选）

如果你想验证 token 是否有效：

```
POST http://localhost:3000/api/oauth/verify
Content-Type: application/json
```

**请求体**：

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "client_id": "music_player"
}
```

**响应**：

```json
{
  "code": 200,
  "message": "Token有效",
  "data": {
    "valid": true,
    "user_id": 123,
    "client_id": "music_player",
    "scope": "user.profile,user.email",
    "user_info": { /* 用户信息 */ }
  }
}
```

---

### 步骤7：用户退出登录

```
POST http://localhost:3000/api/oauth/revoke
Content-Type: application/json
```

**请求体**：

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "client_id": "music_player"
}
```

**JavaScript**：

```javascript
async function logout() {
  const accessToken = localStorage.getItem('mp_access_token')
  await fetch('http://localhost:3000/api/oauth/revoke', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_token: accessToken,
      client_id: 'music_player'
    })
  })
  localStorage.clear()
  showLoggedOutUI()
}
```

---

## 🔧 第三步：处理单点登录（SSO）

如果用户**已经登录过博客**，再次访问你的音乐播放器时：

```
1. 你的播放器跳转: http://localhost:5173/oauth/authorize?...
2. 博客检测到用户已登录
3. 跳过登录页，直接显示授权确认页
4. 用户点击"授权"即可
```

**注意**：博客系统目前**不会**自动跳过授权确认页，每次都需要用户点"授权"。

---

## ⚠️ 重要注意事项

### 1. 跨域问题（CORS）

如果你的音乐播放器运行在 `http://localhost:8080`，博客在 `http://localhost:5173`，是**不同端口 = 不同域**，存在跨域问题。

**解决方案**：
- ✅ 用 **跳转方式**（推荐）：`window.location.href = 博客URL`
- ✅ 用 **form 提交**（避免fetch跨域）
- ❌ 不要用 fetch 直接调博客API（会CORS拦截）

**例外**：如果博客后端已配置 CORS 允许你的域名，则可以用 fetch。

### 2. 回调地址必须完全一致

申请授权时传的 `redirect_uri` 和换 token 时传的 `redirect_uri` 必须**完全一致**（包括大小写、端口、协议）。

### 3. 授权码只能用一次

`code` 只能用一次，换完 token 后就失效。**不要重复使用**。

### 4. token 存储安全

- ✅ 推荐存到 `localStorage`（持久化）
- ⚠️ 不要存到 Cookie（除非你的网站是 https）
- ❌ 不要明文存到 URL 或全局变量

### 5. state 必须验证

回调时必须验证 `state` 是否和你发出的一致，**防止CSRF攻击**。

---

## 🧪 完整测试流程

### 测试场景1：全新用户登录

```
1. 打开音乐播放器 http://localhost:8080
2. 点击"登录"按钮
3. 跳转到博客授权页 http://localhost:5173/oauth/authorize?...
4. 输入邮箱密码登录（如果没登录过）
5. 看到"授权登录"页面，显示"音乐播放器 申请使用你的博客账号登录"
6. 点击"授权并登录"
7. 自动跳回 http://localhost:8080/oauth/callback?code=xxx&state=xxx
8. 音乐播放器用code换token
9. 显示登录成功，显示用户信息
```

### 测试场景2：已登录用户再次授权

```
1. 用户已经在博客登录过（http://localhost:5173）
2. 打开音乐播放器 http://localhost:8080
3. 点击"登录"按钮
4. 跳转到博客授权页
5. 因为已登录，直接显示授权确认页
6. 点击"授权并登录"即可
```

### 测试场景3：取消授权

```
1. 在授权确认页点击"取消"
2. 跳回 http://localhost:8080/oauth/callback?error=access_denied&error_description=用户取消了授权
3. 音乐播放器检测到error，显示"您取消了登录"
```

### 测试场景4：token过期刷新

```
1. 登录成功，access_token有效期2小时
2. 2小时后调用API，返回401
3. 自动用refresh_token换新access_token
4. 重新调用API
```

---

## 📞 需要告诉博客开发者的信息

为了完成对接，**音乐播放器AI**需要告诉**博客开发者**：

1. **部署地址**：你的音乐播放器跑在哪个端口
   - 例：`http://localhost:8080`
2. **回调地址**：你的OAuth回调地址
   - 例：`http://localhost:8080/oauth/callback`
3. **是否使用 HTTPS**（生产环境必须）
4. **应用名称和Logo**（显示在授权页）

博客开发者会给你：
- `client_secret`（密钥）
- 把你的回调地址加入白名单

---

## 🎯 完整代码示例（Vue 3 + JavaScript）

```vue
<!-- LoginButton.vue -->
<template>
  <button @click="handleLogin" class="login-btn">
    🎵 使用博客账号登录
  </button>
</template>

<script setup>
import { ref } from 'vue'

const CLIENT_ID = 'music_player'
const CLIENT_SECRET = '你的client_secret' // 实际应该从后端获取，不要硬编码在前端
const BLOG_URL = 'http://localhost:5173'
const REDIRECT_URI = 'http://localhost:8080/oauth/callback'

const handleLogin = () => {
  // 1. 生成state
  const state = crypto.randomUUID()
  sessionStorage.setItem('oauth_state', state)

  // 2. 构造授权URL
  const authUrl = new URL(`${BLOG_URL}/oauth/authorize`)
  authUrl.searchParams.set('client_id', CLIENT_ID)
  authUrl.searchParams.set('redirect_uri', REDIRECT_URI)
  authUrl.searchParams.set('state', state)
  authUrl.searchParams.set('scope', 'user.profile,user.email')

  // 3. 跳转
  window.location.href = authUrl.toString()
}
</script>
```

```vue
<!-- OAuthCallback.vue -->
<template>
  <div>正在登录中...</div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  const state = urlParams.get('state')
  const error = urlParams.get('error')

  if (error) {
    alert('登录失败：' + urlParams.get('error_description'))
    return
  }

  // 验证state
  if (state !== sessionStorage.getItem('oauth_state')) {
    alert('安全验证失败')
    return
  }

  // 用code换token
  const res = await fetch('http://localhost:3000/api/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code: code,
      client_id: 'music_player',
      client_secret: '你的client_secret',
      redirect_uri: 'http://localhost:8080/oauth/callback'
    })
  })

  const data = await res.json()
  if (data.code === 200) {
    // 保存
    localStorage.setItem('mp_access_token', data.data.access_token)
    localStorage.setItem('mp_refresh_token', data.data.refresh_token)
    localStorage.setItem('mp_user_info', JSON.stringify(data.data.user_info))
    localStorage.setItem('mp_token_expiry', Date.now() + data.data.expires_in * 1000)

    // 跳转到主页
    window.location.href = '/'
  } else {
    alert('登录失败：' + data.message)
  }
})
</script>
```

---

## ✅ 总结：音乐播放器AI要做的事

1. **告诉博客开发者**你的部署地址和回调地址
2. **从博客开发者**那里拿到 `client_secret`
3. **实现登录按钮**：点击后跳转到博客授权页
4. **实现回调页面**：用 `code` 换 `access_token`
5. **保存 token** 到 localStorage
6. **每次调用博客API**带上 `Authorization: Bearer xxx`
7. **token 过期时**自动用 `refresh_token` 刷新
8. **退出登录**时调用 revoke 接口

---

**有问题随时联系博客开发者！** 🎉
