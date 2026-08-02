<template>
  <div class="forgot-password-container">
    <div class="background-blobs">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>

    <div class="forgot-card">
      <!-- 步骤指示器 -->
      <div class="steps-indicator">
        <div class="step" :class="{ 'active': currentStep === 1, 'completed': currentStep > 1 }">
          <div class="step-number">1</div>
          <span>输入邮箱</span>
        </div>
        <div class="step-line" :class="{ 'active': currentStep > 1 }"></div>
        <div class="step" :class="{ 'active': currentStep === 2, 'completed': currentStep > 2 }">
          <div class="step-number">2</div>
          <span>验证身份</span>
        </div>
        <div class="step-line" :class="{ 'active': currentStep > 2 }"></div>
        <div class="step" :class="{ 'active': currentStep === 3, 'completed': currentStep > 3 }">
          <div class="step-number">3</div>
          <span>设置新密码</span>
        </div>
      </div>

      <!-- 步骤 1: 输入邮箱 -->
      <div v-if="currentStep === 1" class="step-content">
        <div class="card-header">
          <div class="icon-wrapper email-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <h2>忘记密码？</h2>
          <p class="subtitle">请输入您注册时使用的邮箱地址，我们将发送验证码到您的邮箱</p>
        </div>

        <form @submit.prevent="handleSendCode" class="form-container">
          <div class="form-group">
            <label>邮箱地址</label>
            <div class="input-wrapper" :class="{ 
              'input-error': emailValidation.status === 'error',
              'input-success': emailValidation.status === 'success'
            }">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="input-icon">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input 
                v-model="form.email" 
                type="email" 
                placeholder="请输入您的邮箱地址" 
                required 
                :disabled="sendingCode || emailValidation.status === 'error'"
                ref="emailInput"
                @blur="checkEmailExists"
                @input="handleEmailInput"
              />
              <div class="validation-icon" v-if="emailValidation.status && form.email">
                <svg v-if="emailValidation.status === 'checking'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#667eea" stroke-width="2" class="spin-icon">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                <svg v-else-if="emailValidation.status === 'success'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <svg v-else-if="emailValidation.status === 'error'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="3">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              </div>
            </div>
            <Transition name="fade-up">
              <div class="validation-message" :class="`msg-${emailValidation.status}`" v-if="emailValidation.message && form.email">
                {{ emailValidation.message }}
              </div>
            </Transition>
          </div>

          <button type="submit" class="submit-btn primary-btn" :disabled="sendingCode || !form.email || emailValidation.status === 'error'">
            <span v-if="!sendingCode">发送验证码</span>
            <div v-else class="btn-loader"></div>
          </button>
          
          <div class="retry-section" v-if="emailValidation.status === 'error'">
            <p class="retry-hint">邮箱验证失败，无法继续操作</p>
            <button type="button" class="retry-btn" @click="resetEmailValidation">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="1 4 1 10 7 10"/>
                <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
              </svg>
              重新输入
            </button>
          </div>
        </form>

        <div class="card-footer">
          <router-link to="/login" class="back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            返回登录
          </router-link>
        </div>
      </div>

      <!-- 步骤 2: 输入验证码 -->
      <div v-if="currentStep === 2" class="step-content">
        <div class="card-header">
          <div class="icon-wrapper verify-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h2>验证您的身份</h2>
          <p class="subtitle">验证码已发送至 <strong>{{ maskEmail(form.email) }}</strong></p>
          <p class="hint-text">请在下方输入6位数字验证码，有效期5分钟</p>
        </div>

        <form @submit.prevent="handleVerifyCode" class="form-container">
          <div class="form-group">
            <label>验证码</label>
            <div class="code-input-wrapper">
              <input 
                v-for="(digit, index) in 6" 
                :key="index"
                v-model="codeDigits[index]"
                type="text" 
                maxlength="1"
                class="code-digit"
                :class="{ 'filled': codeDigits[index] }"
                :ref="el => { if (el) codeInputs[index] = el }"
                @input="handleCodeInput(index, $event)"
                @keydown="handleCodeKeydown(index, $event)"
                @paste="handleCodePaste"
                :disabled="verifying"
                autocomplete="one-time-code"
                inputmode="numeric"
                pattern="[0-9]*"
              />
            </div>
            <div class="code-error" v-if="codeError">{{ codeError }}</div>
          </div>

          <button type="submit" class="submit-btn primary-btn" :disabled="verifying || codeDigits.join('').length !== 6">
            <span v-if="!verifying">验证并继续</span>
            <div v-else class="btn-loader"></div>
          </button>

          <div class="resend-section">
            <span v-if="countdown > 0" class="countdown-text">
              {{ countdown }}秒后可重新发送
            </span>
            <button 
              v-else 
              type="button" 
              class="resend-btn"
              @click="handleResendCode"
              :disabled="sendingCode"
            >
              {{ sendingCode ? '发送中...' : '重新发送验证码' }}
            </button>
          </div>
        </form>

        <div class="card-footer">
          <button type="button" class="back-link" @click="goToStep(1)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            返回上一步
          </button>
        </div>
      </div>

      <!-- 步骤 3: 设置新密码 -->
      <div v-if="currentStep === 3" class="step-content">
        <div class="card-header">
          <div class="icon-wrapper password-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          </div>
          <h2>设置新密码</h2>
          <p class="subtitle">请输入您的新密码（至少6个字符）</p>
        </div>

        <form @submit.prevent="handleResetPassword" class="form-container">
          <div class="form-group">
            <label>新密码</label>
            <div class="input-wrapper">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="input-icon">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              <input 
                v-model="form.password" 
                :type="showPassword ? 'text' : 'password'" 
                placeholder="请输入新密码（至少6位）" 
                required 
                minlength="6"
                :disabled="resetting"
                @input="checkPasswordSameAsOld"
              />
              <button type="button" class="toggle-password" @click="showPassword = !showPassword" tabindex="-1">
                <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
            <div class="password-strength" v-if="form.password">
              <div class="strength-bar">
                <div class="strength-fill" :style="{ width: passwordStrength.percent + '%' }" :class="passwordStrength.level"></div>
              </div>
              <span class="strength-text" :class="passwordStrength.level">{{ passwordStrength.text }}</span>
            </div>
            <Transition name="fade-up">
              <div class="warning-message" v-if="passwordSameAsOld.show">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                {{ passwordSameAsOld.message }}
              </div>
            </Transition>
          </div>

          <div class="form-group">
            <label>确认新密码</label>
            <div class="input-wrapper">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="input-icon">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <polyline points="9 12 11 14 15 10"/>
              </svg>
              <input 
                v-model="form.confirmPassword" 
                :type="showConfirmPassword ? 'text' : 'password'" 
                placeholder="请再次输入新密码" 
                required 
                :disabled="resetting"
              />
              <button type="button" class="toggle-password" @click="showConfirmPassword = !showConfirmPassword" tabindex="-1">
                <svg v-if="!showConfirmPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
            <div class="error-message" v-if="form.confirmPassword && form.password !== form.confirmPassword">
              两次输入的密码不一致
            </div>
          </div>

          <button 
            type="submit" 
            class="submit-btn success-btn" 
            :disabled="resetting || !isPasswordValid"
          >
            <span v-if="!resetting">✓ 重置密码并登录</span>
            <div v-else class="btn-loader"></div>
          </button>
        </form>

        <div class="card-footer">
          <button type="button" class="back-link" @click="goToStep(2)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            返回上一步
          </button>
        </div>
      </div>

      <!-- 成功提示 -->
      <Transition name="fade-scale">
        <div v-if="showSuccess" class="success-overlay">
          <div class="success-content">
            <div class="success-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h3>密码重置成功！</h3>
            <p>您的密码已成功更新，正在跳转到登录页面...</p>
          </div>
        </div>
      </Transition>

      <!-- Toast Notification -->
      <Transition name="fade-up">
        <div v-if="toast.show" class="toast-notification" :class="[`toast-${toast.type}`]">
          <div class="toast-content">
            <span class="toast-icon">{{ toast.icon }}</span>
            <span>{{ toast.message }}</span>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const currentStep = ref(1)
const sendingCode = ref(false)
const verifying = ref(false)
const resetting = ref(false)
const showSuccess = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const countdown = ref(0)
const codeError = ref('')
let countdownTimer: ReturnType<typeof setInterval> | null = null

const form = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})

const codeDigits = ref(['', '', '', '', '', ''])
const codeInputs = ref<HTMLInputElement[]>([])

const emailInput = ref<HTMLInputElement>()

const emailValidation = reactive({
  status: '' as 'checking' | 'success' | 'error' | '',
  message: ''
})

let emailCheckTimer: ReturnType<typeof setTimeout> | null = null

const passwordSameAsOld = reactive({
  show: false,
  message: '',
  checking: false
})

let passwordCheckTimer: ReturnType<typeof setTimeout> | null = null

const toast = ref({
  show: false,
  message: '',
  type: 'info' as 'success' | 'error' | 'info',
  icon: ''
})

const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
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
  
  setTimeout(() => {
    toast.value.show = false
  }, 4000)
}

const maskEmail = (email: string) => {
  if (!email) return ''
  const [name, domain] = email.split('@')
  if (name.length <= 2) return email
  return `${name[0]}${'*'.repeat(name.length - 2)}${name.slice(-1)}@${domain}`
}

const passwordStrength = computed(() => {
  const pwd = form.password
  if (!pwd) return { percent: 0, level: '' as string, text: '' }
  
  let score = 0
  if (pwd.length >= 6) score += 25
  if (pwd.length >= 10) score += 15
  if (/[a-z]/.test(pwd)) score += 15
  if (/[A-Z]/.test(pwd)) score += 15
  if (/[0-9]/.test(pwd)) score += 15
  if (/[^a-zA-Z0-9]/.test(pwd)) score += 15
  
  if (score <= 30) return { percent: score, level: 'weak', text: '弱' }
  if (score <= 60) return { percent: score, level: 'medium', text: '中' }
  if (score <= 80) return { percent: score, level: 'strong', text: '强' }
  return { percent: Math.min(score, 100), level: 'very-strong', text: '非常强' }
})

const isPasswordValid = computed(() => {
  return form.password.length >= 6 && 
         form.password === form.confirmPassword &&
         !passwordSameAsOld.show
})

const handleEmailInput = () => {
  // 如果已经是错误状态，不允许通过输入重置（必须点"重新输入"按钮）
  if (emailValidation.status === 'error') {
    return
  }
  
  emailValidation.status = ''
  emailValidation.message = ''
  
  if (emailCheckTimer) {
    clearTimeout(emailCheckTimer)
    emailCheckTimer = null
  }
}

const resetEmailValidation = () => {
  form.email = ''
  emailValidation.status = ''
  emailValidation.message = ''
  
  nextTick(() => {
    emailInput.value?.focus()
  })
}

const checkEmailExists = async () => {
  const email = form.email.trim().toLowerCase()
  
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailValidation.status = ''
    emailValidation.message = ''
    return
  }
  
  try {
    emailValidation.status = 'checking'
    emailValidation.message = '正在检查邮箱...'
    
    // ✅ 新增：设置5秒超时
    const res = await axios.post('/api/user/check-email-exists', { email }, {
      timeout: 5000  // 5秒超时
    })
    
    if (res.data.code === 200 && res.data.exists) {
      emailValidation.status = 'success'
      emailValidation.message = '✓ 该邮箱已注册，可以继续'
    } else {
      emailValidation.status = 'error'
      emailValidation.message = res.data.message || '✗ 该邮箱未注册，请检查后重试'
    }
  } catch (err: any) {
    console.error('邮箱检查失败:', err)
    
    // ✅ 关键修复：正确处理所有类型的错误
    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      emailValidation.status = 'error'
      emailValidation.message = '✗ 检查超时，请稍后重试'
    } else if (err.response?.data) {
      const errorData = err.response.data
      
      if (errorData.code === 404) {
        emailValidation.status = 'error'
        emailValidation.message = '✗ 该邮箱未注册，请检查后重试'
      } else {
        emailValidation.status = 'error'
        emailValidation.message = `✗ ${errorData.message || '验证失败'}`
      }
    } else if (err.message?.includes('Network') || err.message?.includes('network')) {
      emailValidation.status = 'error'
      emailValidation.message = '✗ 网络连接失败，请检查网络后重试'
    } else {
      emailValidation.status = 'error'
      emailValidation.message = '✗ 邮箱验证失败，请稍后重试'
    }
  }
}

const checkPasswordSameAsOld = async (immediate: boolean = false) => {
  const password = form.password
  
  if (!password || password.length < 6) {
    passwordSameAsOld.show = false
    passwordSameAsOld.message = ''
    return
  }
  
  // 清除之前的定时器
  if (passwordCheckTimer) {
    clearTimeout(passwordCheckTimer)
    passwordCheckTimer = null
  }
  
  const doCheck = async () => {
    try {
      passwordSameAsOld.checking = true
      
      const res = await axios.post('/api/user/check-password-same', {
        email: form.email.trim().toLowerCase(),
        code: codeDigits.value.join(''),
        newPassword: password
      }, {
        timeout: 5000  // 5秒超时
      })
      
      if (res.data.code === 200 && res.data.isSame) {
        passwordSameAsOld.show = true
        passwordSameAsOld.message = '⚠️ 新密码不能与原密码相同，请重新设置'
      } else {
        passwordSameAsOld.show = false
        passwordSameAsOld.message = ''
      }
    } catch (err: any) {
      console.error('密码对比失败:', err)
      
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        passwordSameAsOld.show = true
        passwordSameAsOld.message = '⚠️ 密码验证超时，请稍后重试'
      } else if (err.response?.data) {
        const errorData = err.response.data
        
        if (errorData.code === 404) {
          passwordSameAsOld.show = false
          passwordSameAsOld.message = ''
        } else {
          passwordSameAsOld.show = true
          passwordSameAsOld.message = `⚠️ ${errorData.message || '密码验证失败'}`
        }
      } else if (err.message?.includes('Network') || err.message?.includes('network')) {
        passwordSameAsOld.show = true
        passwordSameAsOld.message = '⚠️ 网络错误，无法验证密码'
      } else {
        passwordSameAsOld.show = false
        passwordSameAsOld.message = ''
      }
    } finally {
      passwordSameAsOld.checking = false
    }
  }
  
  if (immediate) {
    // 立即执行（用于提交时）
    await doCheck()
  } else {
    // 防抖执行（用于输入时）
    passwordCheckTimer = setTimeout(doCheck, 800)
  }
}

const goToStep = async (step: number) => {
  currentStep.value = step
  codeError.value = ''
  if (step === 1) {
    codeDigits.value = ['', '', '', '', '', '']
  }
  await nextTick()
}

const handleSendCode = async () => {
  if (!form.email || sendingCode.value) return
  
  const email = form.email.trim().toLowerCase()
  
  // 格式验证
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('请输入有效的邮箱地址', 'error')
    return
  }
  
  // 如果还没有检查过邮箱，或检查状态不是success，则强制检查
  if (emailValidation.status !== 'success') {
    sendingCode.value = true
    try {
      await checkEmailExists()
      
      // 检查完成后再次判断
      if (emailValidation.status === 'error') {
        showToast(emailValidation.message || '该邮箱未注册，请检查后重试', 'error')
        return
      }
    } catch (err) {
      showToast('邮箱验证失败，请稍后重试', 'error')
      return
    }
  }
  
  sendingCode.value = true
  
  try {
    const res = await axios.post('/api/user/forgot-password', {
      email: form.email.trim().toLowerCase()
    })
    
    if (res.data.code === 200) {
      showToast('验证码已发送！', 'success')
      await goToStep(2)
      startCountdown()
      
      nextTick(() => {
        codeInputs.value[0]?.focus()
      })
    } else {
      showToast(res.data.message || '发送失败', 'error')
    }
  } catch (err: any) {
    const message = err.response?.data?.message || '网络错误，请稍后重试'
    showToast(message, 'error')
  } finally {
    sendingCode.value = false
  }
}

const handleCodeInput = (index: number, event: Event) => {
  const input = event.target as HTMLInputElement
  const value = input.value.replace(/[^0-9]/g, '')
  
  codeDigits.value[index] = value
  
  if (value && index < 5) {
    codeInputs.value[index + 1]?.focus()
  }
  
  codeError.value = ''
}

const handleCodeKeydown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace' && !codeDigits.value[index] && index > 0) {
    codeInputs.value[index - 1]?.focus()
  }
  
  if (event.key === 'Enter' && codeDigits.value.join('').length === 6) {
    handleVerifyCode()
  }
}

const handleCodePaste = (event: ClipboardEvent) => {
  const pasteData = event.clipboardData?.getData('text')?.replace(/[^0-9]/g, '') || ''
  
  if (pasteData.length >= 6) {
    event.preventDefault()
    for (let i = 0; i < 6; i++) {
      codeDigits.value[i] = pasteData[i] || ''
    }
    
    if (pasteData.length >= 6) {
      setTimeout(() => handleVerifyCode(), 100)
    }
  }
}

const handleVerifyCode = async () => {
  const code = codeDigits.value.join('')
  if (code.length !== 6) {
    codeError.value = '请输入完整的6位验证码'
    return
  }
  
  verifying.value = true
  codeError.value = ''
  
  try {
    // 本地格式验证（只检查是否为6位数字）
    const codeRegex = /^\d{6}$/
    if (!codeRegex.test(code)) {
      codeError.value = '验证码必须为6位数字'
      showToast(codeError.value, 'error')
      verifying.value = false
      return
    }
    
    showToast('验证码已确认', 'success')
    await goToStep(3)
  } catch (err: any) {
    const message = err.response?.data?.message || '验证失败'
    codeError.value = message
    showToast(message, 'error')
  } finally {
    verifying.value = false
  }
}

const handleResendCode = async () => {
  if (sendingCode.value) return
  
  sendingCode.value = true
  
  try {
    const res = await axios.post('/api/user/forgot-password', {
      email: form.email.trim().toLowerCase()
    })
    
    if (res.data.code === 200) {
      showToast('验证码已重新发送！', 'success')
      codeDigits.value = ['', '', '', '', '', '']
      codeError.value = ''
      startCountdown()
      codeInputs.value[0]?.focus()
    } else {
      showToast(res.data.message || '发送失败', 'error')
    }
  } catch (err: any) {
    showToast(err.response?.data?.message || '网络错误', 'error')
  } finally {
    sendingCode.value = false
  }
}

const handleResetPassword = async () => {
  // 基本验证
  if (form.password.length < 6) {
    showToast('新密码长度至少6个字符', 'error')
    return
  }
  
  if (form.password !== form.confirmPassword) {
    showToast('两次输入的密码不一致', 'error')
    return
  }
  
  if (resetting.value) return
  
  // 强制检查密码是否与原密码相同（防止用户直接点击提交）
  resetting.value = true
  
  try {
    await checkPasswordSameAsOld(true)  // 立即检查，不等待防抖
    
    // 检查完成后再次判断
    if (passwordSameAsOld.show) {
      showToast(passwordSameAsOld.message || '新密码不能与原密码相同，请重新设置', 'error')
      return
    }
  } catch (err) {
    showToast('密码验证失败，请稍后重试', 'error')
    return
  }
  
  try {
    const code = codeDigits.value.join('')
    const res = await axios.post('/api/user/reset-password', {
      email: form.email.trim().toLowerCase(),
      code: code,
      password: form.password
    })
    
    if (res.data.code === 200) {
      showSuccess.value = true
      
      setTimeout(() => {
        router.push({
          path: '/login',
          query: { resetSuccess: 'true' }
        })
      }, 2500)
    } else {
      showToast(res.data.message || '重置失败', 'error')
    }
  } catch (err: any) {
    showToast(err.response?.data?.message || '网络错误', 'error')
  } finally {
    resetting.value = false
  }
}

const startCountdown = () => {
  countdown.value = 60
  
  if (countdownTimer) clearInterval(countdownTimer)
  
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      if (countdownTimer) clearInterval(countdownTimer)
      countdownTimer = null
    }
  }, 1000)
}

onMounted(async () => {
  await nextTick()
  emailInput.value?.focus()
})

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
})
</script>

<style scoped>
.forgot-password-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  background-color: var(--bg-body);
  overflow: hidden;
}

.background-blobs {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: blob-float 8s ease-in-out infinite;
}

.blob-1 {
  width: 400px;
  height: 400px;
  background: var(--accent-glow-1);
  top: -100px;
  left: -100px;
}

.blob-2 {
  width: 300px;
  height: 300px;
  background: var(--accent-glow-2);
  bottom: -50px;
  right: -50px;
  animation-delay: 2s;
}

.blob-3 {
  width: 200px;
  height: 200px;
  background: var(--accent-glow-1);
  top: 50%;
  right: 20%;
  animation-delay: 4s;
}

@keyframes blob-float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.05); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
}

.forgot-card {
  position: relative;
  width: 100%;
  max-width: 480px;
  background: var(--bg-card);
  border-radius: 24px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
  overflow: hidden;
  z-index: 1;
}

.steps-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 28px 32px 20px;
  background: linear-gradient(to bottom, var(--bg-surface-muted), transparent);
  border-bottom: 1px solid var(--border-color);
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.step-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  background: var(--bg-surface-muted);
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.step.active .step-number {
  background: var(--accent-gradient);
  color: var(--text-invert);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  transform: scale(1.1);
}

.step.completed .step-number {
  background: var(--success-color);
  color: white;
}

.step span {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
}

.step.active span {
  color: var(--text-primary);
  font-weight: 600;
}

.step-line {
  width: 40px;
  height: 3px;
  background: var(--border-color);
  border-radius: 2px;
  transition: background 0.3s ease;
  margin-top: -12px;
}

.step-line.active {
  background: var(--accent-gradient);
}

.step-content {
  padding: 32px;
  animation: fadeInUp 0.4s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-header {
  text-align: center;
  margin-bottom: 28px;
}

.icon-wrapper {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.email-icon {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.25));
  color: var(--accent-color);
}

.verify-icon {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.25));
  color: #d97706;
}

.password-icon {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.25));
  color: var(--success-color);
}

.card-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.hint-text {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 8px;
  opacity: 0.7;
}

.form-container {
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  color: var(--text-secondary);
  pointer-events: none;
  z-index: 1;
}

.input-wrapper input {
  width: 100%;
  padding: 14px 14px 14px 44px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 15px;
  color: var(--text-primary);
  transition: all 0.2s ease;
  background: var(--bg-input);
}

.input-wrapper input:focus {
  outline: none;
  border-color: var(--accent-color);
  background: var(--bg-card);
  box-shadow: 0 0 0 4px var(--accent-glow-1);
}

.input-wrapper input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: var(--bg-surface-muted);
}

.toggle-password {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  z-index: 1;
  transition: color 0.2s;
}

.toggle-password:hover {
  color: var(--accent-color);
}

.input-error {
  border-color: var(--error-color) !important;
}

.input-error input:focus {
  border-color: var(--error-color) !important;
  box-shadow: 0 0 0 4px var(--error-bg) !important;
}

.input-success {
  border-color: var(--success-color) !important;
}

.input-success input:focus {
  border-color: var(--success-color) !important;
  box-shadow: 0 0 0 4px var(--success-bg) !important;
}

.validation-icon {
  position: absolute;
  right: 14px;
  display: flex;
  align-items: center;
  z-index: 2;
}

.spin-icon {
  animation: spin 1s linear infinite;
  color: var(--accent-color);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.validation-message {
  margin-top: 8px;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.5;
  animation: fadeInUp 0.3s ease;
}

.msg-checking {
  background: var(--accent-glow-1);
  color: var(--accent-color);
  border-left: 3px solid var(--accent-color);
}

.msg-success {
  background: var(--success-bg);
  color: var(--success-color);
  border-left: 3px solid var(--success-color);
}

.msg-error {
  background: var(--error-bg);
  color: var(--error-color);
  border-left: 3px solid var(--error-color);
}

.warning-message {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 12px 16px;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.2));
  color: #92400e;
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-left: 4px solid #f59e0b;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.5;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.code-input-wrapper {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.code-digit {
  width: 48px;
  height: 56px;
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-input);
  color: var(--text-primary);
  transition: all 0.2s ease;
  caret-color: var(--accent-color);
}

.code-digit:focus {
  outline: none;
  border-color: var(--accent-color);
  background: var(--bg-card);
  box-shadow: 0 0 0 4px var(--accent-glow-1);
  transform: translateY(-2px);
}

.code-digit.filled {
  border-color: var(--accent-color);
  background: var(--bg-card);
}

.code-error {
  color: var(--error-color);
  font-size: 13px;
  text-align: center;
  margin-top: 8px;
  font-weight: 500;
}

.password-strength {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
}

.strength-bar {
  flex: 1;
  height: 6px;
  background: var(--border-color);
  border-radius: 3px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  border-radius: 3px;
  transition: all 0.3s ease;
}

.strength-fill.weak { background: var(--error-color); }
.strength-fill.medium { background: #f59e0b; }
.strength-fill.strong { background: var(--success-color); }
.strength-fill.very-strong { background: #059669; }

.strength-text {
  font-size: 12px;
  font-weight: 600;
  min-width: 40px;
}

.strength-text.weak { color: var(--error-color); }
.strength-text.medium { color: #f59e0b; }
.strength-text.strong { color: var(--success-color); }
.strength-text.very-strong { color: #059669; }

.error-message {
  color: var(--error-color);
  font-size: 13px;
  margin-top: 6px;
  font-weight: 500;
}

.submit-btn {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  letter-spacing: 0.3px;
}

.primary-btn {
  background: var(--accent-gradient);
  color: var(--text-invert);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.35);
}

.primary-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.45);
}

.success-btn {
  background: linear-gradient(135deg, var(--success-color) 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.35);
}

.success-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.45);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.retry-section {
  margin-top: 16px;
  text-align: center;
  padding: 16px;
  background: var(--error-bg);
  border-radius: 12px;
  border: 1px solid rgba(239, 68, 68, 0.2);
  animation: fadeInUp 0.3s ease;
}

.retry-hint {
  font-size: 13px;
  color: var(--error-color);
  font-weight: 600;
  margin: 0 0 10px 0;
}

.retry-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  background: var(--bg-card);
  border: 2px solid var(--error-color);
  border-radius: 8px;
  color: var(--error-color);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  background: var(--error-color);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.btn-loader {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.resend-section {
  text-align: center;
  margin-top: 16px;
}

.countdown-text {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
}

.resend-btn {
  background: none;
  border: none;
  color: var(--accent-color);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 8px;
  transition: all 0.2s;
}

.resend-btn:hover:not(:disabled) {
  background: var(--accent-glow-1);
  color: var(--accent-color-hover);
}

.resend-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.card-footer {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s;
  background: none;
  border: none;
  cursor: pointer;
}

.back-link:hover {
  color: var(--text-primary);
  background: var(--bg-surface-muted);
}

.success-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-card);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.success-content {
  text-align: center;
  padding: 48px;
}

.success-icon {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.3));
  color: var(--success-color);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  animation: success-bounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes success-bounce {
  0% { transform: scale(0); }
  100% { transform: scale(1); }
}

.success-content h3 {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 12px 0;
}

.success-content p {
  font-size: 15px;
  color: var(--text-secondary);
  margin: 0;
}

.toast-notification {
  position: fixed;
  top: 24px;
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
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(10px);
  max-width: 90vw;
  animation: toastSlideIn 0.3s ease;
}

.toast-success {
  background: linear-gradient(135deg, var(--success-color) 0%, #059669 100%);
}

.toast-error {
  background: linear-gradient(135deg, var(--error-color) 0%, #dc2626 100%);
}

.toast-info {
  background: var(--accent-gradient);
}

.toast-icon {
  font-size: 18px;
  font-weight: 700;
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

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.3s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.4s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

@media (max-width: 520px) {
  .forgot-card {
    margin: 16px;
    border-radius: 20px;
  }
  
  .steps-indicator {
    padding: 20px 16px 16px;
    gap: 8px;
  }
  
  .step-number {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }
  
  .step-line {
    width: 24px;
  }
  
  .step span {
    font-size: 11px;
  }
  
  .step-content {
    padding: 24px 20px;
  }
  
  .code-digit {
    width: 42px;
    height: 50px;
    font-size: 20px;
  }
}
</style>
