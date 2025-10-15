<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#00b6a1] via-[#00a594] to-[#009488] p-4 relative overflow-hidden">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>
      <div class="floating-shape shape-4"></div>
      <div class="floating-shape shape-5"></div>
      <div class="floating-shape shape-6"></div>
    </div>

    <!-- Animated Particles -->
    <div class="particles">
      <div v-for="i in 20" :key="i" class="particle" :style="{
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${5 + Math.random() * 10}s`
      }"></div>
    </div>

    <div class="w-full max-w-md relative z-10">
      <!-- Logo Card with Animation -->
      <div class="text-center mb-8 animate-fade-in-down">
        <div class="inline-block bg-white rounded-2xl p-4 shadow-lg mb-4 transform hover:scale-110 transition-transform duration-300">
          <img src="/assets/bsi-logo.png" class="h-12 w-auto" alt="Bank Syariah Indonesia" />
        </div>
        <h1 class="text-3xl font-bold text-white mb-2 animate-pulse-slow">Admin Portal</h1>
        <p class="text-white/80">Masuk untuk mengelola sistem</p>
      </div>

      <!-- Login Card with Animation -->
      <div class="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 animate-fade-in-up">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="input-group">
            <label class="block text-sm font-semibold text-slate-700 mb-2">Username</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                v-model="username"
                type="text"
                required
                class="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b6a1] focus:border-transparent transition-all"
                placeholder="Masukkan username"
              />
            </div>
          </div>

          <div class="input-group">
            <label class="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                minlength="6"
                class="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b6a1] focus:border-transparent transition-all"
                placeholder="Masukkan password (min. 6 karakter)"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <svg v-if="!showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center animate-shake">
            <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            {{ error }}
          </div>

          <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center animate-fade-in">
            <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            {{ success }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-[#00b6a1] to-[#009488] text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg transform hover:-translate-y-1 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
          >
            <span class="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
            <span v-if="!loading" class="relative">Masuk</span>
            <span v-else class="flex items-center justify-center relative">
              <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memproses...
            </span>
          </button>
        </form>
      </div>

      <!-- Footer -->
      <div class="text-center mt-6 text-white/80 text-sm animate-fade-in">
        <p>Bank Syariah Indonesia - Admin Dashboard</p>
        <p class="text-white/60 text-xs mt-1">Secure Login Portal</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiFetch, ensureSuccess } from '@/services/apiClient'

const router = useRouter()
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref('')

// Fetch CSRF token dari server
const getCsrfToken = async () => {
  try {
    const response = await apiFetch('/csrf-token', {
      method: 'GET'
    })

    await ensureSuccess(response)

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      throw new Error('Invalid CSRF response (expected JSON)')
    }

    const data = await response.json().catch(() => null)
    if (!data?.csrfToken) {
      throw new Error('CSRF token tidak ditemukan di respons')
    }

    return data.csrfToken
  } catch (e) {
    console.error('Error fetching CSRF token:', e)
    return null
  }
}

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    // Ambil CSRF token terlebih dahulu
    const csrfToken = await getCsrfToken()

    if (!csrfToken) {
      error.value = 'Gagal mendapatkan CSRF token. Pastikan backend sudah berjalan.'
      loading.value = false
      return
    }

    const response = await apiFetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        'Access-Control-Allow-Credentials': 'true',
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
      credentials: 'include', // untuk menyimpan cookie JWT
    })

    const contentType = response.headers.get('content-type') || ''
    const data = contentType.includes('application/json')
      ? await response.json().catch(() => ({}))
      : {}

    if (response.ok) {
      // Login berhasil
      success.value = data.message || 'Login sukses'

      // Simpan data user ke localStorage
      localStorage.setItem('admin_user', JSON.stringify(data.user))
      localStorage.setItem('admin_username', data.user.username)
      localStorage.setItem('admin_id', data.user.AdminID)

      // Redirect ke admin page setelah 1 detik
      setTimeout(() => {
        router.push('/admin')
      }, 1000)
    } else {
      // Login gagal
      error.value = data.message || 'Username atau password salah'
    }
  } catch (e) {
    console.error('Login error:', e)
    error.value = 'Tidak dapat terhubung ke server. Pastikan backend sudah berjalan.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Animations */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

@keyframes particle-float {
  0% {
    transform: translateY(100vh) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) scale(1);
    opacity: 0;
  }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.animate-fade-in-down {
  animation: fadeInDown 0.6s ease-out;
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}

/* Floating Shapes */
.floating-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 15s ease-in-out infinite;
  backdrop-filter: blur(2px);
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
  animation-duration: 12s;
}

.shape-2 {
  width: 120px;
  height: 120px;
  top: 60%;
  left: 80%;
  animation-delay: 2s;
  animation-duration: 15s;
}

.shape-3 {
  width: 60px;
  height: 60px;
  top: 80%;
  left: 20%;
  animation-delay: 1s;
  animation-duration: 10s;
}

.shape-4 {
  width: 100px;
  height: 100px;
  top: 20%;
  left: 70%;
  animation-delay: 3s;
  animation-duration: 13s;
}

.shape-5 {
  width: 90px;
  height: 90px;
  top: 50%;
  left: 5%;
  animation-delay: 4s;
  animation-duration: 14s;
}

.shape-6 {
  width: 70px;
  height: 70px;
  top: 30%;
  left: 50%;
  animation-delay: 1.5s;
  animation-duration: 11s;
}

/* Particles */
.particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: particle-float linear infinite;
  bottom: 0;
}

/* Input Groups */
.input-group {
  animation: fadeInUp 0.6s ease-out both;
}

.input-group:nth-child(1) {
  animation-delay: 0.3s;
}

.input-group:nth-child(2) {
  animation-delay: 0.4s;
}
</style>
