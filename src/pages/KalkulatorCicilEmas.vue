<template>
  <section
    class="relative flex min-h-[600px] flex-col overflow-hidden rounded-[28px] border-[5px] border-[#1BC0B7] bg-white px-6 pb-8 pt-16 shadow-[0_18px_48px_rgba(16,24,40,0.08)]"
  >
    <header class="absolute left-1/2 top-0 translate-y-0 -translate-x-1/2">
      <div class="rounded-b-[24px] bg-gradient-to-r from-yellow-400 to-amber-400 px-6 py-2 text-lg font-semibold text-white">
        Rekomendasi Cicil Emas
      </div>
    </header>

    <div class="mt-4 grid gap-6 grid-cols-1 lg:grid-cols-[0.85fr_1.15fr]">
      <!-- LEFT: Pengukuran Kapasitas -->
      <section class="rounded-[20px] bg-[#FFF4DA] px-6 py-5 shadow-inner self-start">
        <h3 class="text-lg font-semibold text-slate-800 mb-4">Pengukuran Kapasitas</h3>

        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="text-xs text-slate-600 block mb-1.5">Pemasukan per bulan</label>
            <input
              v-model.number="income"
              type="number"
              min="0"
              class="w-full rounded-xl border border-white bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
              placeholder="0"
            />
          </div>

          <div>
            <label class="text-xs text-slate-600 block mb-1.5">Pengeluaran per bulan</label>
            <input
              v-model.number="expense"
              type="number"
              min="0"
              class="w-full rounded-xl border border-white bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
              placeholder="0"
            />
          </div>
        </div>

        <div class="mt-4 rounded-xl border-2 border-teal-200 bg-gradient-to-r from-teal-50 to-white px-4 py-3 shadow">
          <p class="text-xs font-semibold text-slate-700 mb-1">Sisa Uang Bulanan</p>
          <p class="text-lg font-bold text-teal-600">{{ fmt(disposableIncome) }}</p>
        </div>
      </section>

      <!-- RIGHT: Rekomendasi Pengambilan Cicil Emas -->
      <section
        class="flex flex-col gap-4 rounded-[20px] px-6 py-6 shadow-inner min-h-[300px]"
        :class="theme.container"
      >
        <h3 class="text-lg font-semibold text-slate-800">Rekomendasi Pengambilan Cicil Emas</h3>

        <div v-if="fetchError" class="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-600">
          {{ fetchError }}
        </div>
        <div v-else-if="isLoading" class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-600">
          Menghitung rekomendasi terbaik berdasarkan penghasilan &amp; pengeluaran kamu...
        </div>

        <!-- Summary Info -->
        <div class="rounded-xl bg-white px-4 py-3 text-xs shadow-sm border border-slate-200">
          <div class="flex justify-between items-center mb-2">
            <span class="text-slate-600">Penghasilan per bulan:</span>
            <span class="font-bold text-slate-800">{{ fmt(income) }}</span>
          </div>
          <div class="flex justify-between items-center mb-2">
            <span class="text-slate-600">Pengeluaran per bulan:</span>
            <span class="font-bold text-rose-600">{{ fmt(expense) }}</span>
          </div>
          <div class="flex justify-between items-center pt-2 border-t-2 border-slate-200">
            <div>
              <div class="text-slate-700 font-semibold">Disposable Income:</div>
              <div class="text-[10px] text-slate-500 mt-0.5">
                (Sisa uang yang bisa digunakan untuk cicilan)
              </div>
            </div>
            <div class="text-right">
              <div class="font-bold text-lg text-emerald-600">{{ fmt(serverDisposable ?? disposableIncome) }}</div>
              <div class="text-[10px] text-slate-500" v-if="income > 0 && (serverDisposable ?? disposableIncome) > 0">
                {{ ((serverDisposable ?? disposableIncome) / income * 100).toFixed(1) }}% dari penghasilan
              </div>
            </div>
          </div>
        </div>

        <!-- Risk Profile Buttons -->
        <div class="inline-flex w-full items-center gap-2 rounded-full p-1" :class="theme.toggle">
          <button
            v-for="risk in riskTabs"
            :key="risk.value"
            type="button"
            class="flex-1 rounded-full px-4 py-2 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
            :class="riskButtonClass(risk.value)"
            @click="selectRisk(risk.value)"
          >
            {{ risk.label }}
          </button>
        </div>

        <!-- Risk Capacity Info -->
        <div v-if="riskCapDisplay" class="rounded-xl bg-white px-4 py-3 text-xs shadow-md border-2" :class="theme.borderCard">
          <div class="flex justify-between items-center mb-2">
            <span class="font-semibold text-slate-700">Kapasitas angsuran profil ini:</span>
            <div class="text-right">
              <div class="font-bold text-lg" :class="theme.accentText">{{ fmt(riskCapDisplay) }}</div>
              <div class="text-[10px] font-semibold" :class="theme.accentText">
                {{ getRiskPercentage(activeRisk) }}% dari sisa penghasilan
              </div>
            </div>
          </div>
          <div class="text-[11px] text-slate-500 border-t border-slate-200 pt-2">
            💡 {{ getRiskCapacityExplanation(activeRisk) }}
          </div>
        </div>

        <!-- Main Recommendation Card -->
        <div v-if="selectedRecommendation" class="rounded-xl bg-white px-5 py-4 shadow-md border-2" :class="theme.borderCard">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Rekomendasi Terbaik</span>
            <span class="text-xs px-2 py-1 rounded-full" :class="theme.badge">{{ activeRisk }}</span>
          </div>

          <!-- Berat Emas & Tenor -->
          <div class="grid gap-3 grid-cols-2 mb-3">
            <div class="text-center">
              <p class="text-xs text-slate-600">Berat Emas</p>
              <p class="text-2xl font-bold mt-1" :class="theme.accentText">{{ selectedRecommendation.gramase }}g</p>
            </div>
            <div class="text-center">
              <p class="text-xs text-slate-600">Tenor</p>
              <p class="text-2xl font-bold mt-1" :class="theme.accentText">{{ formatTenor(selectedRecommendation.tenor) }}</p>
            </div>
          </div>

          <!-- DP Info (Fixed 10%) -->
          <div class="bg-slate-50 rounded-lg px-3 py-2 mb-3">
            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-600">Down Payment (DP)</span>
              <div class="text-right">
                <span class="font-semibold text-slate-800">{{ fmt(selectedRecommendation.dp_rupiah) }}</span>
                <span class="text-slate-500 ml-1">({{ dpPercentInput }}%)</span>
              </div>
            </div>
          </div>

          <!-- Angsuran per bulan -->
          <div class="bg-gradient-to-r from-slate-50 to-white rounded-lg px-3 py-3 mb-3 border" :class="theme.borderLight">
            <p class="text-xs text-slate-600 mb-1">Angsuran per bulan</p>
            <p class="text-xl font-bold" :class="theme.accentText">{{ fmt(selectedRecommendation.nominal) }}</p>
          </div>

          <!-- Total Angsuran -->
          <div class="bg-slate-50 rounded-lg px-3 py-2 mb-3">
            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-600">Total yang harus dibayar</span>
              <span class="font-semibold text-slate-800">{{ fmt(selectedRecommendation.total_angsuran) }}</span>
            </div>
          </div>

          <!-- Detail Perhitungan -->
          <div class="bg-gradient-to-br from-slate-50 to-white rounded-lg px-3 py-3 border border-slate-100">
            <p class="text-[11px] font-semibold text-slate-700 mb-2">📊 Detail Perhitungan:</p>
            <div class="space-y-1.5 text-[11px] text-slate-600">
              <div class="flex justify-between">
                <span>Harga emas hari ini:</span>
                <span class="font-semibold text-slate-700">
                  {{ goldPrice ? fmt(goldPrice) + '/gram' : 'Loading...' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span>Nilai emas ({{ selectedRecommendation.gramase }}g):</span>
                <span class="font-semibold text-slate-700">{{ fmt(calculateGoldValue(selectedRecommendation.gramase)) }}</span>
              </div>
              <div class="flex justify-between pt-1 border-t border-slate-200">
                <span>Down Payment (10%):</span>
                <span class="font-semibold text-slate-700">{{ fmt(selectedRecommendation.dp_rupiah) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Sisa yang dicicil:</span>
                <span class="font-semibold text-slate-700">
                  {{ fmt(calculateGoldValue(selectedRecommendation.gramase) - selectedRecommendation.dp_rupiah) }}
                </span>
              </div>
              <div class="flex justify-between">
                <span>Tenor cicilan:</span>
                <span class="font-semibold text-slate-700">{{ selectedRecommendation.tenor }} bulan</span>
              </div>
              <div class="flex justify-between pt-1 border-t border-slate-200">
                <span>Angsuran per bulan:</span>
                <span class="font-bold" :class="theme.accentText">{{ fmt(selectedRecommendation.nominal) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Alternative Recommendations -->
        <div v-if="alternativeRecommendations.length > 0" class="rounded-xl bg-white/70 px-4 py-3 shadow-inner">
          <p class="font-semibold text-slate-800 text-xs mb-2">Pilihan Alternatif:</p>
          <div class="space-y-2">
            <details
              v-for="(item, idx) in alternativeRecommendations"
              :key="item.key"
              class="bg-white rounded-lg overflow-hidden hover:shadow-sm transition group"
            >
              <summary class="flex items-center justify-between px-3 py-2 text-xs cursor-pointer list-none">
                <div class="flex items-center gap-3">
                  <span class="flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-semibold" :class="theme.badgeAlt">
                    {{ idx + 2 }}
                  </span>
                  <div>
                    <span class="font-semibold text-slate-800">{{ item.gramase }}g</span>
                    <span class="text-slate-500 mx-1">•</span>
                    <span class="text-slate-700">{{ formatTenor(item.tenor) }}</span>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <div class="text-right">
                    <div class="font-semibold text-slate-800">{{ fmt(item.nominal) }}</div>
                    <div class="text-[10px] text-slate-500">per bulan</div>
                  </div>
                  <svg class="w-4 h-4 text-slate-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </summary>
              <div class="px-3 pb-3 pt-1 border-t border-slate-100 bg-slate-50">
                <div class="space-y-1 text-[10px] text-slate-600">
                  <div class="flex justify-between">
                    <span>Nilai emas ({{ item.gramase }}g):</span>
                    <span class="font-semibold text-slate-700">{{ fmt(calculateGoldValue(item.gramase)) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>DP (10%):</span>
                    <span class="font-semibold text-slate-700">{{ fmt(item.dp_rupiah) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Sisa dicicil:</span>
                    <span class="font-semibold text-slate-700">{{ fmt(calculateGoldValue(item.gramase) - item.dp_rupiah) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Tenor:</span>
                    <span class="font-semibold text-slate-700">{{ item.tenor }} bulan</span>
                  </div>
                  <div class="flex justify-between pt-1 border-t border-slate-200">
                    <span>Total bayar:</span>
                    <span class="font-semibold text-slate-800">{{ fmt(item.total_angsuran) }}</span>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </div>

        <!-- Info Text -->
        <div class="rounded-xl border border-dashed border-slate-300 bg-white/80 px-4 py-3 text-xs text-slate-600">
          💡 Rekomendasi dihitung berdasarkan profil risiko dan kemampuan keuanganmu dengan DP tetap 10%.
        </div>

        <!-- Lanjut Button -->
        <div class="flex justify-end">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
            :class="theme.button"
            @click="goToBukaCicil"
          >
            Lanjut
            <span aria-hidden="true">»</span>
          </button>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { apiFetch } from '@/services/apiClient'

// Income & Expense
const income = ref(0)
const expense = ref(0)
const baseDisposable = computed(() => Math.max((income.value || 0) - (expense.value || 0), 0))
const serverDisposable = ref(null)
const disposableIncome = computed(() => serverDisposable.value ?? baseDisposable.value)

const isLoading = ref(false)
const fetchError = ref('')

// DP percent (fixed from API, default 10%)
const dpPercentInput = ref(10)

// Gold price data
const goldPrice = ref(null)
const isLoadingGoldPrice = ref(false)

// Risk tabs
const riskTabs = [
  { value: 'konservatif', label: 'Konservatif' },
  { value: 'moderat', label: 'Moderat' },
  { value: 'agresif', label: 'Agresif' }
]

const recommendationMap = ref({
  konservatif: [],
  moderat: [],
  agresif: []
})

const riskCaps = ref({
  konservatif: null,
  moderat: null,
  agresif: null
})

const activeRisk = ref('moderat')

const recommendationsForActive = computed(
  () => recommendationMap.value[activeRisk.value] ?? []
)

const selectedRecommendation = computed(() => recommendationsForActive.value[0] ?? null)

const alternativeRecommendations = computed(() => recommendationsForActive.value.slice(1))

const riskCapDisplay = computed(() => riskCaps.value[activeRisk.value] ?? null)

// Functions
const selectRisk = (risk) => {
  activeRisk.value = risk
}

const formatTenor = (months) => {
  if (!months) return '0 Tahun'
  const numeric = Number(months)
  if (!Number.isFinite(numeric)) return '0 Tahun'
  if (numeric % 12 === 0) {
    const years = numeric / 12
    return `${years} Tahun`
  }
  return `${numeric} bln`
}

const riskThemes = {
  konservatif: {
    container: 'bg-[#D7F2EA]',
    toggle: 'bg-[#A2E5CF]',
    buttonActive: 'bg-emerald-500 text-white',
    buttonInactive: 'text-emerald-900 hover:bg-emerald-100',
    accentText: 'text-emerald-600',
    button: 'bg-emerald-500 hover:bg-emerald-600',
    borderCard: 'border-emerald-300',
    borderLight: 'border-emerald-100',
    badge: 'bg-emerald-100 text-emerald-700',
    badgeAlt: 'bg-emerald-100 text-emerald-600'
  },
  moderat: {
    container: 'bg-[#FFEEC9]',
    toggle: 'bg-[#FFD778]',
    buttonActive: 'bg-amber-400 text-slate-800',
    buttonInactive: 'text-amber-900 hover:bg-amber-100',
    accentText: 'text-amber-600',
    button: 'bg-amber-400 text-slate-900 hover:bg-amber-500',
    borderCard: 'border-amber-300',
    borderLight: 'border-amber-100',
    badge: 'bg-amber-100 text-amber-700',
    badgeAlt: 'bg-amber-100 text-amber-600'
  },
  agresif: {
    container: 'bg-[#FBD5D0]',
    toggle: 'bg-[#F6AFA6]',
    buttonActive: 'bg-rose-500 text-white',
    buttonInactive: 'text-rose-900 hover:bg-rose-100',
    accentText: 'text-rose-600',
    button: 'bg-rose-500 hover:bg-rose-600',
    borderCard: 'border-rose-300',
    borderLight: 'border-rose-100',
    badge: 'bg-rose-100 text-rose-700',
    badgeAlt: 'bg-rose-100 text-rose-600'
  }
}

const theme = computed(() => riskThemes[activeRisk.value] ?? riskThemes.moderat)

const riskButtonClass = (risk) =>
  activeRisk.value === risk ? `${theme.value.buttonActive} shadow-sm` : theme.value.buttonInactive

const fmt = (n) => {
  if (!n || typeof n !== 'number') return 'Rp 0'
  return n.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })
}

// Fetch gold price
const fetchGoldPrice = async () => {
  isLoadingGoldPrice.value = true
  try {
    const response = await apiFetch('/api/emas?page=1&pageSize=1', {
      method: 'GET'
    })
    if (!response.ok) {
      throw new Error('Failed to fetch gold price')
    }
    const result = await response.json()
    if (result.data && result.data.length > 0) {
      goldPrice.value = Math.round(parseFloat(result.data[0].harga_pergram_idr))
    }
  } catch (error) {
    console.error('Error fetching gold price:', error)
  } finally {
    isLoadingGoldPrice.value = false
  }
}

// Calculate total gold value from gramase
const calculateGoldValue = (gramase) => {
  if (!goldPrice.value || !gramase) return 0
  return goldPrice.value * gramase
}

// Get risk percentage
const getRiskPercentage = (risk) => {
  const percentages = {
    konservatif: 40,
    moderat: 60,
    agresif: 80
  }
  return percentages[risk] || 0
}

// Get risk capacity explanation
const getRiskCapacityExplanation = (risk) => {
  const explanations = {
    konservatif: 'Profil konservatif (risiko rendah) - cocok untuk yang ingin bermain aman',
    moderat: 'Profil moderat (risiko sedang) - keseimbangan antara aman dan agresif',
    agresif: 'Profil agresif (risiko tinggi) - untuk yang ingin cicilan maksimal'
  }
  return explanations[risk] || ''
}

const csrfToken = ref(null)
const ensureCsrfToken = async () => {
  if (csrfToken.value) return csrfToken.value
  try {
    const res = await apiFetch('/csrf-token', {
      method: 'GET'
    })
    if (!res.ok) throw new Error(`CSRF token request failed (${res.status})`)
    const data = await res.json().catch(() => ({}))
    const token = data.csrfToken || data.token || data['csrf-token'] || null
    csrfToken.value = token
    return token
  } catch (error) {
    console.error('CSRF token error:', error)
    csrfToken.value = null
    return null
  }
}

const fetchRecommendations = async () => {
  if ((income.value ?? 0) <= 0) {
    recommendationMap.value = { konservatif: [], moderat: [], agresif: [] }
    fetchError.value = 'Masukkan penghasilan dan pengeluaran untuk mendapatkan rekomendasi.'
    return
  }

  fetchError.value = ''
  isLoading.value = true

  try {
    const token = await ensureCsrfToken()
    if (!token) {
      throw new Error('Gagal mendapatkan CSRF token')
    }

    const response = await apiFetch('/api/rekomendasi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': token
      },
      body: JSON.stringify({
        penghasilan: Number(income.value) || 0,
        pengeluaran: Number(expense.value) || 0
      })
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(text || `HTTP ${response.status}`)
    }

    const data = await response.json()
    recommendationMap.value = {
      konservatif: data?.rekomendasi?.konservatif ?? [],
      moderat: data?.rekomendasi?.moderat ?? [],
      agresif: data?.rekomendasi?.agresif ?? []
    }

    riskCaps.value = data?.risk_caps ?? {}
    serverDisposable.value = data?.input?.disposable ?? null
    dpPercentInput.value = data?.dp_pct ?? 10
  } catch (error) {
    console.error('Rekomendasi fetch error:', error)
    fetchError.value = error.message || 'Gagal memuat rekomendasi.'
    recommendationMap.value = {
      konservatif: [],
      moderat: [],
      agresif: []
    }
  } finally {
    isLoading.value = false
  }
}

let fetchTimer
watch(
  [income, expense],
  () => {
    clearTimeout(fetchTimer)
    fetchTimer = setTimeout(fetchRecommendations, 400)
  },
  { immediate: true }
)

ensureCsrfToken().then(fetchRecommendations)

// Fetch gold price on mount
onMounted(() => {
  fetchGoldPrice()
})

const emit = defineEmits(['navigate-section'])
const goToBukaCicil = () => emit('navigate-section', 'Buka Cicil Emas')
</script>
