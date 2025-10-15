<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <!-- Header -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <img src="/assets/bsi-logo.png" class="h-10 w-auto" alt="BSI" />
            <div class="border-l border-slate-300 pl-4">
              <h1 class="text-xl font-bold text-slate-800">Admin Dashboard</h1>
              <p class="text-sm text-slate-500">Customer Management</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="text-right">
              <p class="text-sm font-semibold text-slate-700">{{ adminUsername }}</p>
              <p class="text-xs text-slate-500">Administrator</p>
            </div>
            <button @click="handleLogout" class="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-6 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-sm font-medium">Total Pengajuan</p>
              <p class="text-3xl font-bold mt-2">{{ totalSubmissions }}</p>
            </div>
            <div class="bg-white/20 p-3 rounded-xl">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-100 text-sm font-medium">Pengajuan Dengan DP</p>
              <p class="text-3xl font-bold mt-2">{{ withDownPayment }}</p>
            </div>
            <div class="bg-white/20 p-3 rounded-xl">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-100 text-sm font-medium">Rata-Rata Angsuran</p>
              <p class="text-3xl font-bold mt-2">{{ formatCurrency(averageInstallment) }}</p>
            </div>
            <div class="bg-white/20 p-3 rounded-xl">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters & Actions -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
        <div class="grid gap-4 md:grid-cols-4">
          <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-slate-700 mb-2">Cari Pengajuan</label>
            <div class="relative">
              <input
                v-model.trim="searchTerm"
                class="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b6a1] focus:border-transparent transition-all"
                placeholder="Cari nama, email, no telepon, atau ringkasan item..."
              />
              <svg class="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Filter DP</label>
            <select
              v-model="dpStatus"
              class="px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b6a1] bg-white min-w-[150px]"
            >
              <option value="all">Semua</option>
              <option value="with">Dengan DP</option>
              <option value="without">Tanpa DP</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Tenor</label>
            <select
              v-model="tenorFilter"
              class="px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b6a1] bg-white min-w-[150px]"
            >
              <option value="all">Semua Tenor</option>
              <option
                v-for="tenor in uniqueTenors"
                :key="tenor"
                :value="tenor"
              >
                {{ tenor }} bulan
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Urutkan</label>
            <select
              v-model="sortDir"
              class="px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b6a1] bg-white"
            >
              <option value="desc">Terbaru terlebih dahulu</option>
              <option value="asc">Terlama terlebih dahulu</option>
            </select>
          </div>
        </div>

        <div class="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
          <div class="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <span>Data ditampilkan: <strong>{{ filteredForms.length }}</strong> dari <strong>{{ totalSubmissions }}</strong> pengajuan</span>
            <span v-if="meta" class="hidden sm:inline-block text-slate-400">•</span>
            <span v-if="meta">
              Meta: {{ meta.total ?? totalSubmissions }} total, halaman {{ meta.page ?? 1 }}
            </span>
            <span class="hidden sm:inline-block text-slate-400">•</span>
            <span>Pembaruan terakhir: {{ lastUpdatedAt }}</span>
          </div>
          <button
            type="button"
            @click="handleRefresh"
            class="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 transition hover:border-[#00b6a1] hover:text-[#009488]"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M4 4v6h6M20 20v-6h-6M5 19A9 9 0 0119 5" />
            </svg>
            Segarkan
          </button>
        </div>
      </div>

      <!-- Submissions List -->
      <section class="space-y-4">
        <div v-if="loading" class="bg-white border border-slate-200 rounded-2xl px-6 py-12 text-center text-slate-500 shadow-sm">
          <svg class="w-10 h-10 mx-auto mb-3 animate-spin text-[#00b6a1]" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Memuat data pengajuan...
        </div>

        <div v-else-if="filteredForms.length === 0" class="bg-white border border-dashed border-slate-300 rounded-2xl px-6 py-16 text-center text-slate-500 shadow-sm">
          <svg class="w-16 h-16 mx-auto mb-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="text-lg font-semibold text-slate-600">Tidak ada data yang sesuai dengan filter.</p>
          <p class="text-sm text-slate-400 mt-2">Ubah kata kunci pencarian atau reset filter untuk melihat data lainnya.</p>
        </div>

        <div
          v-for="form in filteredForms"
          :key="form.SubmissionsID"
          class="group rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#00b6a1]/60 hover:shadow-lg"
        >
          <button
            type="button"
            class="w-full text-left"
            @click="openDetail(form)"
          >
            <div class="grid gap-6 px-6 py-6 md:grid-cols-[1.2fr_1.1fr_0.8fr_1fr_1fr] md:items-start">
              <div class="space-y-1">
                <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">Tanggal &amp; ID</p>
                <p class="text-base font-semibold text-slate-900">{{ formatDate(form.submit_date) }}</p>
                <p class="text-xs text-slate-400 break-all">{{ form.SubmissionsID }}</p>
              </div>

              <div class="space-y-1">
                <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">Pemohon</p>
                <p class="text-base font-semibold text-slate-900">{{ form.nama || '-' }}</p>
                <p class="text-sm text-slate-600">{{ form.email || '-' }}</p>
                <p class="text-xs text-slate-500">{{ form.no_telepon || '-' }}</p>
              </div>

              <div class="space-y-1">
                <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">DP</p>
                <p class="text-base font-semibold text-slate-900">{{ formatNumber(form.dp_pct_submit, '%') }}</p>
                <p class="text-sm text-slate-600">{{ formatCurrencyNullable(form.dp_rupiah) }}</p>
              </div>

              <div class="space-y-1">
                <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">Paket Emas</p>
                <p class="text-sm text-slate-700">Gramase: <span class="font-semibold">{{ formatNumber(form.total_gramase, ' gr') }}</span></p>
                <p class="text-sm text-slate-700">Keping: <span class="font-semibold">{{ formatNumber(form.total_keping, ' pcs') }}</span></p>
                <p class="text-xs text-slate-500">Harga/gram: {{ formatCurrencyNullable(form.harga_pergram_submit) }}</p>
              </div>

              <div class="space-y-1">
                <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">Pembiayaan</p>
                <p class="text-sm text-slate-700">Tenor: <span class="font-semibold">{{ formatNumber(form.tenor_diinginkan, ' bln') }}</span></p>
                <p class="text-sm text-slate-700">Angsuran/bulan: {{ formatCurrencyNullable(form.angsuran_bulanan) }}</p>
                <p class="text-xs text-slate-500">Total angsuran: {{ formatCurrencyNullable(form.total_angsuran) }}</p>
              </div>
            </div>

            <div class="border-t border-slate-100 bg-slate-50 px-6 py-4 rounded-b-3xl text-sm text-slate-600 flex items-center justify-between">
              <div>
                <span class="text-xs font-semibold uppercase tracking-wide text-slate-400">Rincian Produk</span>
                <p class="mt-1 text-sm text-slate-700">{{ formatItemsSummary(form) }}</p>
              </div>
              <div class="hidden items-center gap-2 text-[#009488] font-semibold md:flex">
                Lihat Detail
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        </div>
      </section>

      <!-- Detail Modal -->
      <transition name="fade">
        <div
          v-if="selectedForm"
          class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-8 backdrop-blur-sm"
          @click.self="closeDetail"
        >
          <div class="max-w-3xl w-full rounded-3xl bg-white shadow-2xl">
            <div class="flex items-start justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Pengajuan</p>
                <h2 class="text-xl font-semibold text-slate-900">{{ formatDate(selectedForm.submit_date) }}</h2>
                <p class="mt-1 text-xs text-slate-400 break-all">{{ selectedForm.SubmissionsID }}</p>
              </div>
              <button
                type="button"
                class="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-[#00b6a1] hover:text-[#009488]"
                @click="closeDetail"
              >
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="grid gap-6 px-6 py-6 md:grid-cols-2">
              <div class="space-y-4">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Pemohon</p>
                  <p class="mt-1 text-base font-semibold text-slate-900">{{ selectedForm.nama || '-' }}</p>
                  <p class="text-sm text-slate-600">{{ selectedForm.email || '-' }}</p>
                  <p class="text-sm text-slate-500">{{ selectedForm.no_telepon || '-' }}</p>
                </div>

                <div>
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Down Payment</p>
                  <p class="mt-1 text-base font-semibold text-slate-900">{{ formatNumber(selectedForm.dp_pct_submit, '%') }}</p>
                  <p class="text-sm text-slate-600">{{ formatCurrencyNullable(selectedForm.dp_rupiah) }}</p>
                </div>

                <div>
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Catatan Sistem</p>
                  <p class="mt-1 text-xs text-slate-500">
                    Harga emas per gram saat pengajuan:
                    <span class="font-semibold text-slate-700">{{ formatCurrencyNullable(selectedForm.harga_pergram_submit) }}</span>
                  </p>
                </div>
              </div>

              <div class="space-y-4">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Paket Emas</p>
                  <p class="mt-1 text-sm text-slate-700">Total gramase: <span class="font-semibold">{{ formatNumber(selectedForm.total_gramase, ' gr') }}</span></p>
                  <p class="text-sm text-slate-700">Total keping: <span class="font-semibold">{{ formatNumber(selectedForm.total_keping, ' pcs') }}</span></p>
                </div>

                <div>
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Pembiayaan</p>
                  <p class="mt-1 text-sm text-slate-700">Tenor: <span class="font-semibold">{{ formatNumber(selectedForm.tenor_diinginkan, ' bln') }}</span></p>
                  <p class="text-sm text-slate-700">Angsuran per bulan: {{ formatCurrencyNullable(selectedForm.angsuran_bulanan) }}</p>
                  <p class="text-sm text-slate-600">Total angsuran: {{ formatCurrencyNullable(selectedForm.total_angsuran) }}</p>
                </div>

                <div>
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Rincian Produk</p>
                  <div class="mt-2 space-y-1">
                    <p v-if="!selectedForm.items?.length" class="text-sm text-slate-500">Tidak ada item terlampir.</p>
                    <div v-else class="flex flex-wrap gap-2">
                      <span
                        v-for="item in selectedForm.items"
                        :key="item.ItemID"
                        class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                      >
                        {{ item.gramase }}g × {{ item.qty }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                type="button"
                class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-[#00b6a1] hover:text-[#009488]"
                @click="closeDetail"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Status Messages -->
      <div v-if="loading" class="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
        <svg class="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-blue-700 font-medium">Memuat data pengajuan...</p>
      </div>

      <div v-if="error" class="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
        <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p class="text-red-700 font-medium">{{ error }}</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const API_BASE = 'http://192.168.23.22:3001'

const router = useRouter()

const adminUsername = ref(localStorage.getItem('admin_username') || 'Admin')

const loading = ref(false)
const error = ref('')
const forms = ref([])
const meta = ref(null)

const searchTerm = ref('')
const dpStatus = ref('all')
const tenorFilter = ref('all')
const sortDir = ref('desc')

const getCsrfToken = async () => {
  try {
    const res = await fetch(`${API_BASE}/csrf-token`, {
      method: 'GET',
      credentials: 'include'
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

    const response = await fetch(`${API_BASE}/api/forms`, {
      credentials: 'include',
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

const totalSubmissions = computed(() => forms.value.length)
const withDownPayment = computed(
  () =>
    forms.value.filter((item) => {
      const pct = item.dp_pct_submit
      const dp = item.dp_rupiah
      return (pct != null && pct !== '') || (typeof dp === 'number' && dp > 0)
    }).length
)
const withoutDownPayment = computed(() => totalSubmissions.value - withDownPayment.value)
const averageInstallment = computed(() => {
  const values = forms.value
    .map((item) => item.angsuran_bulanan)
    .filter((value) => typeof value === 'number' && value > 0)

  if (!values.length) return 0
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
})

const uniqueTenors = computed(() => {
  const set = new Set()
  forms.value.forEach((item) => {
    if (item.tenor_diinginkan != null) {
      set.add(Number(item.tenor_diinginkan))
    }
  })
  return Array.from(set).sort((a, b) => a - b)
})

const filteredForms = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()

  let result = forms.value.slice()

  if (term) {
    result = result.filter((item) => {
      const fields = [
        item.nama,
        item.email,
        item.no_telepon,
        item.items_summary,
        item.SubmissionsID
      ]
      return fields.some((field) => (field ?? '').toString().toLowerCase().includes(term))
    })
  }

  if (dpStatus.value === 'with') {
    result = result.filter((item) => {
      const pct = item.dp_pct_submit
      const dp = item.dp_rupiah
      return (pct != null && pct !== '') || (typeof dp === 'number' && dp > 0)
    })
  } else if (dpStatus.value === 'without') {
    result = result.filter((item) => {
      const pct = item.dp_pct_submit
      const dp = item.dp_rupiah
      return (pct == null || pct === '') && !(typeof dp === 'number' && dp > 0)
    })
  }

  if (tenorFilter.value !== 'all') {
    const tenorNumber = Number(tenorFilter.value)
    result = result.filter((item) => Number(item.tenor_diinginkan) === tenorNumber)
  }

  result.sort((a, b) => {
    const aTime = new Date(a.submit_date ?? 0).getTime()
    const bTime = new Date(b.submit_date ?? 0).getTime()
    return sortDir.value === 'asc' ? aTime - bTime : bTime - aTime
  })

  return result
})

const lastUpdatedAt = computed(() => {
  if (!forms.value.length) return '-'
  const latest = forms.value.reduce((latestDate, item) => {
    const current = new Date(item.submit_date ?? 0).getTime()
    return current > latestDate ? current : latestDate
  }, 0)

  return latest ? formatDateTime(new Date(latest)) : '-'
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

const formatItemsSummary = (item) => {
  if (item.items_summary) return item.items_summary
  if (Array.isArray(item.items) && item.items.length > 0) {
    return item.items.map((prod) => `${prod.gramase}g x${prod.qty}`).join('; ')
  }
  return '-'
}

const handleRefresh = () => {
  fetchForms()
}

const selectedForm = ref(null)
const openDetail = (form) => {
  selectedForm.value = form
}
const closeDetail = () => {
  selectedForm.value = null
}

const handleLogout = async () => {
  try {
    const csrfToken = await getCsrfToken()
    if (csrfToken) {
      await fetch(`${API_BASE}/api/admin/logout`, {
        method: 'POST',
        headers: {
          'X-CSRF-Token': csrfToken
        },
        credentials: 'include'
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
    const res = await fetch(`${API_BASE}/api/admin/me`, {
      credentials: 'include'
    })

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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
