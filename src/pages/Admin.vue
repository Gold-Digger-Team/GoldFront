<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div class="max-w-7xl mx-auto px-6 py-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <img src="/assets/bsi-logo.png" class="h-12 w-auto" alt="BSI" />
            <div class="border-l border-gray-300 pl-4">
              <h1 class="text-2xl font-bold text-gray-800">Data Management</h1>
              <p class="text-sm text-gray-500">Kelola dan filter data dengan mudah</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="text-right">
              <p class="text-sm font-semibold text-gray-700">{{ adminUsername }}</p>
              <p class="text-xs text-gray-500">Administrator</p>
            </div>
            <button @click="handleLogout" class="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-6 py-8">
      <!-- Filters Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-2">Filter Nama</label>
            <input
              v-model="filters.nama"
              type="text"
              placeholder="Filter Nama"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-2">Filter Email</label>
            <input
              v-model="filters.email"
              type="text"
              placeholder="Filter Email"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-2">Filter Nomor Telepon</label>
            <input
              v-model="filters.noTelepon"
              type="text"
              placeholder="Filter Nomor Telepon"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-2">Filter Total Berat</label>
            <input
              v-model="filters.totalBerat"
              type="text"
              placeholder="Filter Total Berat"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-2">Filter Denominasi</label>
            <input
              v-model="filters.denominasi"
              type="text"
              placeholder="Filter Denominasi"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-2">Filter Tenor</label>
            <input
              v-model="filters.tenor"
              type="text"
              placeholder="Filter Tenor"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-2">Filter DP</label>
            <input
              v-model="filters.dp"
              type="text"
              placeholder="Filter DP"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <tr>
                <th class="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Nama</th>
                <th class="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Email</th>
                <th class="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Nomor Telepon</th>
                <th class="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Total Berat</th>
                <th class="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Denominasi</th>
                <th class="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Tenor</th>
                <th class="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">DP</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-if="loading" class="hover:bg-gray-50">
                <td colspan="7" class="px-4 py-12 text-center">
                  <div class="flex items-center justify-center gap-3">
                    <svg class="w-6 h-6 animate-spin text-blue-600" viewBox="0 0 24 24" fill="none">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span class="text-gray-600 font-medium">Memuat data...</span>
                  </div>
                </td>
              </tr>
              <tr v-else-if="paginatedData.length === 0" class="hover:bg-gray-50">
                <td colspan="7" class="px-4 py-12 text-center text-gray-500">
                  <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                  </svg>
                  <p class="text-lg font-semibold">Tidak ada data</p>
                </td>
              </tr>
              <tr
                v-else
                v-for="item in paginatedData"
                :key="item.SubmissionsID"
                class="hover:bg-blue-50 transition-colors duration-150"
              >
                <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.nama || '-' }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{{ item.email || '-' }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{{ item.no_telepon || '-' }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{{ formatNumber(item.total_gramase, ' gram') }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">{{ formatCurrencyNullable(item.dp_rupiah) }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{{ formatNumber(item.tenor_diinginkan, ' bulan') }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">{{ formatNumber(item.dp_pct_submit, '%') }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Previous
            </button>

            <div class="flex items-center gap-2">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-semibold transition-all',
                  page === currentPage
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>
            </div>

            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>

          <div class="flex items-center gap-4">
            <button
              @click="downloadCSV"
              :disabled="downloadingCSV"
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="!downloadingCSV" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <svg v-else class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ downloadingCSV ? 'Mengunduh...' : 'Download CSV' }}
            </button>

            <button
              @click="sendEmail"
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              Kirim Email
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Toast Notification with Animations -->
    <transition name="toast-slide">
      <div
        v-if="toast.show"
        :class="[
          'fixed top-6 right-6 z-50 max-w-md overflow-hidden rounded-xl shadow-2xl',
          toast.type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : '',
          toast.type === 'error' ? 'bg-gradient-to-r from-red-500 to-rose-600' : '',
          toast.type === 'warning' ? 'bg-gradient-to-r from-amber-500 to-orange-600' : '',
          toast.type === 'success' ? 'animate-bounce-in' : '',
          toast.type === 'error' ? 'animate-shake' : '',
          toast.type === 'warning' ? 'animate-swing' : ''
        ]"
      >
        <div class="relative p-4 flex items-start gap-4">
          <!-- Confetti animation for success -->
          <div v-if="toast.type === 'success'" class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="confetti" v-for="i in 20" :key="i" :style="{ left: Math.random() * 100 + '%', animationDelay: Math.random() * 0.5 + 's' }"></div>
          </div>

          <!-- Icon -->
          <div class="flex-shrink-0 relative z-10">
            <!-- Success Icon -->
            <div v-if="toast.type === 'success'" class="bg-white/20 p-2 rounded-full animate-pulse-scale">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>

            <!-- Warning Icon -->
            <div v-else-if="toast.type === 'warning'" class="bg-white/20 p-2 rounded-full animate-pulse-scale">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>

            <!-- Error Icon -->
            <div v-else class="bg-white/20 p-2 rounded-full">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 relative z-10">
            <h3 class="text-white font-bold text-lg mb-1">
              {{ toast.type === 'success' ? 'Berhasil! 🎉' : toast.type === 'warning' ? 'Perhatian! ⚠️' : 'Oops! ❌' }}
            </h3>
            <p class="text-white/90 text-sm leading-relaxed">{{ toast.message }}</p>
          </div>

          <!-- Close button -->
          <button
            @click="toast.show = false"
            class="flex-shrink-0 text-white/80 hover:text-white transition-colors relative z-10"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Progress bar -->
        <div class="h-1 bg-white/20">
          <div :class="[
            'h-full bg-white/50',
            toast.type === 'success' ? 'animate-progress' : '',
            toast.type === 'error' ? 'animate-progress-error' : '',
            toast.type === 'warning' ? 'animate-progress-warning' : ''
          ]"></div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiFetch } from '@/services/apiClient'

const router = useRouter()

const adminUsername = ref(localStorage.getItem('admin_username') || 'Admin')

const loading = ref(false)
const error = ref('')
const forms = ref([])
const meta = ref(null)
const downloadingCSV = ref(false)

// Toast notification state
const toast = ref({
  show: false,
  type: '', // 'success' or 'error'
  message: ''
})

// Filters
const filters = ref({
  nama: '',
  email: '',
  noTelepon: '',
  totalBerat: '',
  denominasi: '',
  tenor: '',
  dp: ''
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(5)

const getCsrfToken = async () => {
  try {
    const res = await apiFetch('/csrf-token', {
      method: 'GET'
    })

    if (!res.ok) {
      throw new Error(`CSRF request failed (${res.status})`)
    }

    const data = await res.json().catch(() => ({}))
    return data.csrfToken || data.token || data['csrf-token'] || null
  } catch (err) {
    console.error('CSRF token error:', err)
    return null
  }
}

const fetchForms = async () => {
  loading.value = true
  error.value = ''

  try {
    const csrfToken = await getCsrfToken()
    if (!csrfToken) {
      throw new Error('CSRF token tidak ditemukan')
    }

    const response = await apiFetch('/api/forms', {
      headers: {
        'X-CSRF-Token': csrfToken
      }
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(text || `HTTP ${response.status}`)
    }

    const payload = await response.json().catch(() => ({}))
    forms.value = Array.isArray(payload.data) ? payload.data : []
    meta.value = payload.meta ?? null
  } catch (err) {
    error.value = err.message || 'Gagal memuat data'
    forms.value = []
  } finally {
    loading.value = false
  }
}

// Computed filtered data
const filteredData = computed(() => {
  return forms.value.filter(item => {
    const matchNama = (item.nama || '').toLowerCase().includes(filters.value.nama.toLowerCase())
    const matchEmail = (item.email || '').toLowerCase().includes(filters.value.email.toLowerCase())
    const matchNoTelepon = (item.no_telepon || '').includes(filters.value.noTelepon)
    const matchTotalBerat = (item.total_gramase?.toString() || '').includes(filters.value.totalBerat)
    const matchDenominasi = (item.dp_rupiah?.toString() || '').includes(filters.value.denominasi)
    const matchTenor = (item.tenor_diinginkan?.toString() || '').includes(filters.value.tenor)
    const matchDp = (item.dp_pct_submit?.toString() || '').includes(filters.value.dp)

    return matchNama && matchEmail && matchNoTelepon && matchTotalBerat && matchDenominasi && matchTenor && matchDp
  })
})

// Computed paginated data
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredData.value.slice(start, end)
})

// Total pages
const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / itemsPerPage.value)
})

// Visible page numbers
const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 3) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current === 1) {
      pages.push(1, 2, 3)
    } else if (current === total) {
      pages.push(total - 2, total - 1, total)
    } else {
      pages.push(current - 1, current, current + 1)
    }
  }

  return pages
})

const formatDate = (value) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('id-ID', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatDateTime = (date) =>
  date.toLocaleString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

const formatCurrency = (value) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return 'Rp 0'
  return value.toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  })
}

const formatCurrencyNullable = (value) =>
  typeof value === 'number' && !Number.isNaN(value) ? formatCurrency(value) : '-'

const formatNumber = (value, suffix = '') => {
  if (value == null || value === '') return '-'
  return `${value}${suffix}`
}

// Pagination methods
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page) => {
  currentPage.value = page
}

// Show toast notification
const showToast = (type, message) => {
  toast.value = {
    show: true,
    type,
    message
  }

  // Auto hide after 5 seconds
  setTimeout(() => {
    toast.value.show = false
  }, 5000)
}

// Generate CSV from client-side data (fallback)
const generateClientCSV = () => {
  console.log('📝 Generating CSV from client-side data')

  // CSV Headers matching backend format
  const headers = [
    'SubmissionsID',
    'submit_date',
    'nama',
    'no_telepon',
    'email',
    'total_gramase',
    'tenor_diinginkan',
    'total_keping',
    'dp_pct_submit',
    'dp_rupiah',
    'angsuran_bulanan',
    'total_angsuran',
    'harga_pergram_submit'
  ]

  // Convert data to CSV rows
  const rows = filteredData.value.map(item => {
    return [
      item.SubmissionsID || '',
      item.submit_date || '',
      item.nama || '',
      item.no_telepon || '',
      item.email || '',
      item.total_gramase || 0,
      item.tenor_diinginkan || 0,
      item.total_keping || 0,
      item.dp_pct_submit || 0,
      item.dp_rupiah || 0,
      item.angsuran_bulanan || 0,
      item.total_angsuran || 0,
      item.harga_pergram_submit || 0
    ].map(value => {
      // Escape values containing commas or quotes
      const stringValue = String(value)
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      return stringValue
    }).join(',')
  })

  // Combine headers and rows
  const csvContent = [headers.join(','), ...rows].join('\n')

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0]
  const filename = `forms_export_${timestamp}.csv`

  link.setAttribute('download', filename)
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()

  // Cleanup
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)

  return filename
}

// Download CSV from API with fallback
const downloadCSV = async () => {
  if (downloadingCSV.value) return

  downloadingCSV.value = true
  error.value = ''

  try {
    // Get CSRF token
    const csrfToken = await getCsrfToken()
    if (!csrfToken) {
      console.warn('⚠️ No CSRF token, using client-side fallback')
      throw new Error('CSRF_TOKEN_MISSING')
    }

    // Fetch CSV from API using the correct endpoint
    console.log('🔄 Fetching CSV from /api/forms/export.csv')

    const response = await apiFetch('/api/forms/export.csv', {
      method: 'GET',
      headers: {
        'X-CSRF-Token': csrfToken
      }
    })

    console.log('📊 Response status:', response.status)
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      console.error('❌ CSV export failed:', errorText)
      throw new Error(`API_ERROR_${response.status}`)
    }

    // Get the CSV content as blob
    const blob = await response.blob()

    // Create download link
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url

    // Get filename from Content-Disposition header or use default
    const contentDisposition = response.headers.get('Content-Disposition')
    let filename = 'forms_export.csv'

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i)
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '')
      }
    }

    link.setAttribute('download', filename)
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()

    // Cleanup
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    // Show success notification
    showToast('success', `CSV berhasil diunduh dari server! (${filteredData.value.length} data)`)
    console.log('✅ CSV downloaded successfully from API')
  } catch (err) {
    console.error('❌ Error downloading CSV from API:', err)

    // FALLBACK: Generate CSV from client-side
    try {
      console.log('🔄 Attempting client-side CSV generation...')
      const filename = generateClientCSV()

      // Show warning notification (yellow/orange theme)
      showToast('warning', `Server tidak tersedia. CSV diunduh dari data lokal (${filteredData.value.length} data). File: ${filename}`)
      console.log('✅ CSV generated from client-side successfully')
    } catch (fallbackErr) {
      console.error('❌ Client-side CSV generation also failed:', fallbackErr)
      error.value = 'Gagal mengunduh CSV dari server maupun client'

      // Show error notification
      showToast('error', 'Gagal mengunduh CSV. Tidak ada data yang tersedia.')
    }
  } finally {
    downloadingCSV.value = false
  }
}

// Send email
const sendEmail = () => {
  alert('Fitur kirim email akan segera tersedia')
}

const handleLogout = async () => {
  try {
    const csrfToken = await getCsrfToken()
    if (csrfToken) {
      await apiFetch('/api/admin/logout', {
        method: 'POST',
        headers: {
          'X-CSRF-Token': csrfToken
        }
      })
    }
  } catch (err) {
    console.error('Logout error:', err)
  } finally {
    localStorage.removeItem('admin_user')
    localStorage.removeItem('admin_username')
    localStorage.removeItem('admin_id')
    router.push('/login')
  }
}

const checkAuth = async () => {
  try {
    const res = await apiFetch('/api/admin/me')

    if (!res.ok) {
      router.push('/login')
      return
    }

    const data = await res.json().catch(() => ({}))
    if (data.user?.username) {
      adminUsername.value = data.user.username
      localStorage.setItem('admin_username', data.user.username)
    }

    await fetchForms()
  } catch (err) {
    console.error('Auth check error:', err)
    router.push('/login')
  }
}

onMounted(() => {
  checkAuth()
})
</script>

<style scoped>
/* Custom scrollbar for table */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Toast slide transition */
.toast-slide-enter-active {
  animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.toast-slide-leave-active {
  animation: slideOutRight 0.3s ease-in;
}

@keyframes slideInRight {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(400px);
    opacity: 0;
  }
}

/* Bounce in animation for success */
@keyframes bounceIn {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-bounce-in {
  animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Shake animation for error */
@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-10px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(10px);
  }
}

.animate-shake {
  animation: shake 0.6s;
}

/* Pulse scale animation for icon */
@keyframes pulseScale {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.animate-pulse-scale {
  animation: pulseScale 1s infinite;
}

/* Progress bar animation */
@keyframes progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

.animate-progress {
  animation: progress 5s linear;
}

.animate-progress-error {
  animation: progress 5s linear;
  background: rgba(255, 255, 255, 0.7) !important;
}

.animate-progress-warning {
  animation: progress 5s linear;
  background: rgba(255, 255, 255, 0.6) !important;
}

/* Swing animation for warning */
@keyframes swing {
  0%, 100% {
    transform: rotate(0deg);
  }
  15% {
    transform: rotate(5deg);
  }
  30% {
    transform: rotate(-5deg);
  }
  45% {
    transform: rotate(3deg);
  }
  60% {
    transform: rotate(-3deg);
  }
  75% {
    transform: rotate(2deg);
  }
}

.animate-swing {
  animation: swing 0.8s ease-in-out;
  transform-origin: top center;
}

/* Confetti animation */
.confetti {
  position: absolute;
  width: 8px;
  height: 8px;
  background: white;
  top: -10px;
  border-radius: 50%;
  animation: confettiFall 2s ease-out infinite;
  opacity: 0;
}

.confetti:nth-child(2n) {
  background: #fbbf24;
}

.confetti:nth-child(3n) {
  background: #60a5fa;
}

.confetti:nth-child(4n) {
  background: #f472b6;
}

.confetti:nth-child(5n) {
  width: 6px;
  height: 6px;
}

@keyframes confettiFall {
  0% {
    top: -10px;
    opacity: 1;
    transform: rotate(0deg);
  }
  50% {
    opacity: 1;
  }
  100% {
    top: 100%;
    opacity: 0;
    transform: rotate(360deg);
  }
}

/* Sparkle effect */
@keyframes sparkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
