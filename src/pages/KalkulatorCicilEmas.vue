<template>
  <section
    class="relative flex min-h-[600px] flex-col overflow-hidden rounded-[28px] border-[5px] border-[#1BC0B7] bg-white px-6 pb-8 pt-16 shadow-[0_18px_48px_rgba(16,24,40,0.08)]"
  >
    <header class="absolute left-1/2 top-0 translate-y-0 -translate-x-1/2">
      <div class="rounded-b-[24px] bg-gradient-to-r from-yellow-400 to-amber-400 px-6 py-2 text-lg font-semibold text-white">
        Rekomendasi Cicil Emas
      </div>
    </header>

    <div class="mt-4 grid gap-6 grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
      <!-- LEFT: Pengukuran Kapasitas -->
      <section class="rounded-[20px] bg-[#FFF4DA] px-6 py-6 shadow-inner min-h-[300px]">
        <h3 class="text-lg font-semibold text-slate-800">Pengukuran Kapasitas</h3>
        <p class="mt-1 text-xs text-slate-600">
          Pemasukan per bulan
        </p>
        <input
          v-model.number="income"
          type="number"
          min="0"
          class="mt-2 w-full rounded-xl border border-white bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
          placeholder="Rp 0"
        />

        <p class="mt-4 text-xs text-slate-600">
          Pengeluaran per bulan
        </p>
        <input
          v-model.number="expense"
          type="number"
          min="0"
          class="mt-2 w-full rounded-xl border border-white bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
          placeholder="Rp 0"
        />

        <p class="mt-4 text-xs font-semibold text-slate-700">
          Sisa Uang Bulanan
        </p>
        <div class="mt-2 rounded-xl border border-white bg-white px-3 py-2 text-sm font-semibold text-teal-600 shadow">
          {{ fmt(disposableIncome) }}
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

        <div class="rounded-xl border border-dashed border-white/50 bg-white/30 px-4 py-3 text-xs text-slate-600">
          Penghasilan: <span class="font-semibold">{{ fmt(income) }}</span>,
          Pengeluaran: <span class="font-semibold">{{ fmt(expense) }}</span>,
          Disposable: <span class="font-semibold">{{ fmt(serverDisposable ?? disposableIncome) }}</span>
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

        <div v-if="riskCapDisplay" class="rounded-xl bg-white/70 px-4 py-2 text-xs text-slate-600 shadow-inner">
          Kapasitas angsuran profil ini: <span class="font-semibold text-slate-800">{{ fmt(riskCapDisplay) }}</span>
        </div>

        <!-- Berat Emas & Tenor -->
        <div class="grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow">
            <p>Berat Emas (gr)</p>
            <p class="mt-1 text-lg text-slate-900">{{ selectedRecommendation?.gramase ?? 0 }} gr</p>
          </div>
          <div class="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow">
            <p>Tenor</p>
            <p class="mt-1 text-lg text-slate-900">{{ formatTenor(selectedRecommendation?.tenor) }}</p>
          </div>
        </div>

        <!-- Angsuran per bulan -->
        <div class="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow">
          <p>Angsuran per bulan</p>
          <p class="mt-1 text-lg" :class="theme.accentText">{{ fmt(selectedRecommendation?.nominal ?? 0) }}</p>
        </div>

        <!-- DP% | Nominal -->
        <div class="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow">
          <p>DP% | Nominal</p>
          <div class="mt-2 flex items-center gap-3">
            <input
              v-model.number="dpPercentInput"
              type="number"
              step="0.1"
              class="w-20 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
            />
            <input
              v-model.number="dpInput"
              type="number"
              step="100000"
              class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
              placeholder="Rp 0"
            />
          </div>
        </div>

        <!-- Info Text -->
        <div class="rounded-xl border border-dashed border-slate-300 bg-white/80 px-4 py-3 text-xs text-slate-600">
          Rekomendasi dihitung berdasarkan profil risiko dan kemampuan keuanganmu. Sesuaikan nominal DP untuk menurunkan angsuran jika dibutuhkan.
        </div>

        <div v-if="alternativeRecommendations.length > 1" class="rounded-xl bg-white/70 px-4 py-3 text-xs text-slate-600 shadow-inner">
          <p class="font-semibold text-slate-800">Pilihan lain:</p>
          <ul class="mt-1 space-y-1 text-slate-600">
            <li
              v-for="(item, idx) in alternativeRecommendations"
              :key="item.key"
              class="text-xs"
            >
              {{ idx + 1 }}. {{ item.gramase }}g &middot; {{ formatTenor(item.tenor) }} &middot; {{ fmt(item.nominal) }}
            </li>
          </ul>
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
import { computed, ref, watch } from 'vue'

const API_BASE = 'http://localhost:3001'

// Income & Expense
const income = ref(7_000_000)
const expense = ref(4_000_000)
const baseDisposable = computed(() => Math.max((income.value || 0) - (expense.value || 0), 0))
const serverDisposable = ref(null)
const disposableIncome = computed(() => serverDisposable.value ?? baseDisposable.value)

const isLoading = ref(false)
const fetchError = ref('')

// DP inputs (static, no validation)
const dpInput = ref(0)
const dpPercentInput = ref(0)

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
    button: 'bg-emerald-500 hover:bg-emerald-600'
  },
  moderat: {
    container: 'bg-[#FFEEC9]',
    toggle: 'bg-[#FFD778]',
    buttonActive: 'bg-amber-400 text-slate-800',
    buttonInactive: 'text-amber-900 hover:bg-amber-100',
    accentText: 'text-amber-600',
    button: 'bg-amber-400 text-slate-900 hover:bg-amber-500'
  },
  agresif: {
    container: 'bg-[#FBD5D0]',
    toggle: 'bg-[#F6AFA6]',
    buttonActive: 'bg-rose-500 text-white',
    buttonInactive: 'text-rose-900 hover:bg-rose-100',
    accentText: 'text-rose-600',
    button: 'bg-rose-500 hover:bg-rose-600'
  }
}

const theme = computed(() => riskThemes[activeRisk.value] ?? riskThemes.moderat)

const riskButtonClass = (risk) =>
  activeRisk.value === risk ? `${theme.value.buttonActive} shadow-sm` : theme.value.buttonInactive

const fmt = (n) => {
  if (!n || typeof n !== 'number') return 'Rp 0'
  return n.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })
}

const csrfToken = ref(null)
const ensureCsrfToken = async () => {
  if (csrfToken.value) return csrfToken.value
  try {
    const res = await fetch(`${API_BASE}/csrf-token`, {
      method: 'GET',
      credentials: 'include'
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

    const response = await fetch(`${API_BASE}/api/rekomendasi`, {
      method: 'POST',
      credentials: 'include',
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
    dpPercentInput.value = data?.dp_pct ?? dpPercentInput.value

    if (selectedRecommendation.value?.dp_rupiah) {
      dpInput.value = selectedRecommendation.value.dp_rupiah
    } else {
      dpInput.value = data?.rekomendasi?.[activeRisk.value]?.[0]?.dp_rupiah ?? 0
    }
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

watch(selectedRecommendation, (rec) => {
  if (rec?.dp_rupiah != null) {
    dpInput.value = rec.dp_rupiah
  }
})

ensureCsrfToken().then(fetchRecommendations)

const emit = defineEmits(['navigate-section'])
const goToBukaCicil = () => emit('navigate-section', 'Buka Cicil Emas')
</script>
