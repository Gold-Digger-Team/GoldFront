<template>
  <section
    class="relative flex min-h-[600px] flex-col overflow-hidden rounded-[28px] border-[5px] border-[#1BC0B7] bg-white px-6 pb-8 pt-16 shadow-[0_18px_48px_rgba(16,24,40,0.08)]"
  >
    <header class="absolute left-1/2 top-0 translate-y-0 -translate-x-1/2">
      <div class="rounded-b-[24px] bg-gradient-to-r from-yellow-400 to-amber-400 px-6 py-2 text-lg font-semibold text-white">
        Buka Cicil Emas
      </div>
    </header>

    <div class="mt-4 grid gap-6 grid-cols-1 lg:grid-cols-[1fr_1.2fr]">
      <!-- LEFT SIDE -->
      <div class="flex flex-col gap-6">
        <!-- Pilih Denominasi Emas -->
        <section class="rounded-[20px] bg-[#FFF4DA] px-6 py-6 shadow-inner">
          <h3 class="text-lg font-semibold text-slate-800">Pilih Denominasi Emas</h3>
          <p class="mt-1 text-xs text-slate-600">
            tentukan berat dan jumlah keping emas yang ingin dibeli
          </p>

          <div class="mt-4 flex items-center gap-3">
            <div class="rounded-xl border border-white bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow">
              Total Berat : {{ formatNumber(totalGram) }} gr
            </div>
            <button
              type="button"
              @click="openDenominationModal"
              class="rounded-full bg-teal-500 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              Tambah Denominasi
            </button>
          </div>

          <!-- List Denominasi -->
          <div class="mt-6 rounded-xl border border-white bg-white px-4 py-4 shadow min-h-[100px]">
            <div v-if="selectedItems.length === 0" class="text-center text-sm text-slate-500">
              Belum ada denominasi dipilih. Klik tombol diatas untuk menambahkan
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="item in selectedItems"
                :key="item.weight"
                class="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
              >
                <span class="text-sm font-semibold text-slate-700">{{ item.weight }} gr × {{ item.qty }} keping</span>
                <button
                  type="button"
                  @click="clearQuantity(item.weight)"
                  class="text-rose-500 hover:text-rose-700 text-sm font-semibold"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>

          <!-- Total Display -->
          <div class="mt-4 grid grid-cols-2 gap-3">
            <div class="rounded-xl border border-white bg-white px-4 py-3 shadow">
              <p class="text-xs font-semibold text-slate-600">Total Keping</p>
              <p class="mt-1 text-lg font-bold text-slate-800">{{ totalQty }} pcs</p>
            </div>
            <div class="rounded-xl border border-white bg-white px-4 py-3 shadow">
              <p class="text-xs font-semibold text-slate-600">Total Harga Emas</p>
              <p
                class="mt-1 font-bold text-amber-600 tabular-nums"
                :class="formattedTotalPriceClass"
              >
                {{ formattedTotalPrice }}
              </p>
            </div>
          </div>
        </section>

        <!-- Tenor & DP -->
        <section class="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
          <h3 class="text-base font-semibold text-slate-900">Tenor & DP</h3>
          <div class="mt-4">
            <label class="block text-sm font-semibold text-slate-700">
              Tenor Investasi
              <select
                v-model.number="tenor"
                class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
              >
                <option v-for="option in tenorOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </label>
          </div>

          <div class="mt-5">
            <label class="block text-sm font-semibold text-slate-700">
              DP ({{ dpPct }}%)
              <div class="mt-3 space-y-2">
                <input
                  v-model.number="dpPct"
                  type="range"
                  :min="dpBounds.min"
                  :max="dpBounds.max"
                  step="1"
                  class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  :disabled="!totalPrice"
                />
                <div class="flex items-center justify-between text-xs text-slate-500">
                  <span>{{ dpBounds.min }}%</span>
                  <span class="font-semibold text-teal-600">{{ fmt(dpNominal) }}</span>
                  <span>{{ dpBounds.max }}%</span>
                </div>
              </div>
            </label>
            <div class="mt-2 text-xs text-slate-500">
              Minimal DP {{ dpBounds.min }}% ({{ fmt(dpMinNominal) }}) dan maksimal {{ dpBounds.max }}% ({{ fmt(dpMaxNominal) }})
              dari total harga emas.
            </div>
          </div>
        </section>
      </div>

      <!-- RIGHT SIDE: Ringkasan Pengajuan -->
      <section class="rounded-[22px] border border-slate-200 bg-slate-100 px-6 py-6 shadow-inner">
        <h3 class="text-lg font-semibold text-slate-800">Ringkasan Pengajuan</h3>

        <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
          <label class="block text-sm font-semibold text-slate-700">
            Nama
            <input
              v-model="form.nama"
              type="text"
              required
              class="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
              placeholder="Nama lengkap"
            />
          </label>

          <label class="block text-sm font-semibold text-slate-700">
            Email
            <input
              v-model="form.email"
              type="email"
              required
              class="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
              placeholder="email@example.com"
            />
          </label>

          <label class="block text-sm font-semibold text-slate-700">
            Nomor Telepon
            <input
              v-model="form.telepon"
              type="tel"
              required
              class="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
              placeholder="08xxxxxxxxxx"
            />
          </label>

          <div class="mt-4 rounded-xl border border-dashed border-slate-300 bg-white/70 px-4 py-3 shadow-inner">
            <div class="flex items-center justify-between gap-3 text-sm">
              <span class="font-semibold text-slate-700">Verifikasi</span>
              <button
                type="button"
                class="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-teal-500 hover:text-teal-600"
                @click="generateCaptcha"
              >
                Muat ulang
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v6h6M20 20v-6h-6M5 19A9 9 0 0119 5" />
                </svg>
              </button>
            </div>
            <div class="mt-3 inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-emerald-100 via-emerald-200 to-teal-300 px-5 py-2">
              <span class="font-mono text-lg font-bold tracking-[0.35em] text-emerald-900 select-none">
                {{ captchaCode }}
              </span>
              <svg class="h-6 w-6 text-emerald-600" viewBox="0 0 24 24" fill="none">
                <path stroke-width="1.5" stroke="currentColor" d="M21 12a9 9 0 1 1-9-9m0 0v4m0-4h-4" />
              </svg>
            </div>
            <input
              v-model.trim="captchaInput"
              type="text"
              class="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm uppercase tracking-widest focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
              placeholder="Masukkan kode di atas"
            />
            <p v-if="captchaError" class="mt-2 text-xs font-semibold text-rose-600">{{ captchaError }}</p>
          </div>

          <!-- Summary Cards -->
          <div class="mt-6 space-y-3 rounded-xl bg-white/80 p-4 shadow-inner">
            <div class="flex items-center justify-between text-sm">
              <span class="font-semibold text-slate-700">Total Berat Emas</span>
              <span class="font-bold text-slate-800">{{ formatNumber(totalGram) }} gr</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="font-semibold text-slate-700">Total Keping</span>
              <span class="font-bold text-slate-800">{{ totalQty }} pcs</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="font-semibold text-slate-700">Nominal DP</span>
              <span class="font-bold text-slate-800">{{ fmt(dpNominal) }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="font-semibold text-slate-700">Angsuran per Bulan</span>
              <span class="font-bold text-teal-600">{{ fmt(angsuranBulanan) }}</span>
            </div>
            <div class="flex items-center justify-between border-t border-slate-300 pt-3 text-sm">
              <span class="font-semibold text-slate-700">Total Angsuran ({{ tenor }} bln)</span>
              <span class="font-bold text-slate-800">{{ fmt(totalAngsuran) }}</span>
            </div>
          </div>

          <button
            type="submit"
            class="mt-6 w-full rounded-full bg-amber-400 px-6 py-3 text-base font-semibold text-slate-900 shadow transition hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting" class="inline-flex items-center gap-2">
              <svg class="h-4 w-4 animate-spin text-slate-900" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Mengirim...
            </span>
            <span v-else>Ajukan</span>
          </button>

          <transition name="fade">
            <div
              v-if="submitMessage"
              class="mt-4 rounded-xl border px-4 py-3 text-sm font-semibold"
              :class="submitStatus === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                : 'border-rose-200 bg-rose-50 text-rose-600'"
            >
              {{ submitMessage }}
            </div>
          </transition>
        </form>
      </section>
    </div>

    <!-- Modal Tambah Denominasi -->
    <teleport to="body">
      <div
        v-if="showDenominationModal"
        class="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4"
        @click.self="closeDenominationModal"
      >
        <div class="w-full max-w-xl rounded-[24px] bg-white p-6 shadow-2xl">
          <header class="flex items-start justify-between gap-4">
            <div>
              <h3 class="text-lg font-semibold text-slate-900">Tambah Denominasi</h3>
              <p class="text-xs text-slate-500">
                Pilih kombinasi berat emas, sesuaikan jumlah dengan tombol plus atau minus.
              </p>
            </div>
            <button
              type="button"
              class="rounded-full border border-slate-200 bg-white p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Tutup popup"
              @click="closeDenominationModal"
            >
              <span class="flex h-6 w-6 items-center justify-center text-lg">&times;</span>
            </button>
          </header>

          <ul class="mt-5 space-y-4">
            <li
              v-for="(option, idx) in goldOptions"
              :key="option.weight"
              class="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-[#fffdf6] px-4 py-3 shadow-sm"
            >
              <div class="flex items-center gap-3">
                <svg
                  class="h-12 w-10 shrink-0"
                  viewBox="0 0 48 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient
                      :id="`gold-grad-${idx}`"
                      x1="4"
                      y1="6"
                      x2="44"
                      y2="58"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#FCD34D" />
                      <stop offset="1" stop-color="#F59E0B" />
                    </linearGradient>
                  </defs>
                  <rect
                    x="4"
                    y="6"
                    width="40"
                    height="52"
                    rx="10"
                    :fill="`url(#gold-grad-${idx})`"
                    stroke="#F59E0B"
                    stroke-width="2"
                  />
                  <path
                    d="M24 20c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6Z"
                    fill="#FDE68A"
                  />
                  <path
                    d="M24 26c7.732 0 14 6.268 14 14v6c0 1.105-.895 2-2 2H12c-1.105 0-2-.895-2-2v-6c0-7.732 6.268-14 14-14Z"
                    fill="#FCD34D"
                  />
                </svg>
                <div>
                  <p class="text-sm font-semibold text-slate-800">{{ option.weight }} gram</p>
                  <p class="text-xs font-medium text-emerald-600">{{ fmt(option.price) }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <button
                  type="button"
                  class="grid h-8 w-8 place-items-center rounded-full border border-slate-200 text-lg text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                  :disabled="quantities[option.weight] <= 0"
                  @click="updateQuantity(option.weight, -1)"
                >
                  &minus;
                </button>
                <input
                  :value="quantities[option.weight]"
                  type="number"
                  min="0"
                  class="h-9 w-16 rounded-xl border border-slate-200 bg-white text-center text-sm font-semibold text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                  @input="onQuantityInput(option.weight, $event.target.value)"
                />
                <button
                  type="button"
                  class="grid h-8 w-8 place-items-center rounded-full border border-teal-500 bg-teal-500 text-lg font-semibold text-white transition hover:bg-teal-600"
                  @click="updateQuantity(option.weight, 1)"
                >
                  +
                </button>
              </div>
            </li>
          </ul>

          <footer class="mt-6 flex flex-col gap-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p class="font-semibold text-slate-700">Total Harga Emas</p>
              <p class="text-emerald-600">{{ fmt(totalPrice) }}</p>
            </div>
            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
              @click="closeDenominationModal"
            >
              Selesai
            </button>
          </footer>
        </div>
      </div>
    </teleport>
  </section>
</template>

<script setup>
import { computed, reactive, ref, watch, onMounted } from 'vue'

// State for gold price from API
const goldPricePerGram = ref(0)
const isLoadingPrice = ref(true)

// Define weight options (in grams)
const weightOptions = [5, 10, 25, 50, 100]

// Reactive computed goldOptions based on API price
const goldOptions = computed(() =>
  weightOptions.map(weight => ({
    weight,
    price: goldPricePerGram.value * weight
  }))
)

const quantities = reactive(
  weightOptions.reduce((map, weight) => {
    map[weight] = 0
    return map
  }, {})
)

const tenorOptions = [
  { label: '1 Tahun (12 bulan)', value: 12 },
  { label: '2 Tahun (24 bulan)', value: 24 },
  { label: '3 Tahun (36 bulan)', value: 36 },
  { label: '4 Tahun (48 bulan)', value: 48 },
  { label: '5 Tahun (60 bulan)', value: 60 }
]

const tenor = ref(tenorOptions[0].value)
const dpPct = ref(10)
const showDenominationModal = ref(false)

const marginRate = 10

// API Response State
const apiPreview = ref(null)
const csrfToken = ref(null)
const priceCsrfToken = ref(null)
const isLoadingPreview = ref(false)
const isSubmitting = ref(false)
const submitMessage = ref('')
const submitStatus = ref('')

// Form
const form = reactive({
  nama: '',
  email: '',
  telepon: ''
})

const captchaCode = ref('')
const captchaInput = ref('')
const captchaError = ref('')

// Fetch gold price from API
async function fetchGoldPrice() {
  isLoadingPrice.value = true
  try {
    if (!priceCsrfToken.value) {
      const tokenRes = await fetch('http://192.168.23.22:3001/get-csrf', {
        method: 'GET',
        credentials: 'include'
      })
      if (!tokenRes.ok) {
        throw new Error(`Failed to fetch CSRF token: ${tokenRes.status}`)
      }
      const tokenData = await tokenRes.json().catch(() => ({}))
      priceCsrfToken.value =
        tokenData?.csrfToken ||
        tokenData?.token ||
        tokenData?.['csrf-token'] ||
        tokenRes.headers.get('X-CSRF-Token')
      if (!priceCsrfToken.value) {
        throw new Error('Token CSRF tidak ditemukan')
      }
    }

    const response = await fetch('http://192.168.23.22:3001/api/emas/today', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'X-CSRF-Token': priceCsrfToken.value
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch gold price: ${response.status}`)
    }

    const data = await response.json()
    const priceString = data?.harga_pergram_idr
    goldPricePerGram.value = priceString ? parseFloat(priceString) : 0
  } catch (error) {
    console.error('Error fetching gold price:', error)
    // Fallback to a default price if API fails
    goldPricePerGram.value = 2429850
  } finally {
    isLoadingPrice.value = false
  }
}

// Fetch price on component mount
onMounted(() => {
  fetchGoldPrice()
  generateCaptcha()
})

// Computed
const totalPrice = computed(() =>
  goldOptions.value.reduce((sum, option) => sum + option.price * (quantities[option.weight] || 0), 0)
)

const totalGram = computed(() =>
  goldOptions.value.reduce((sum, option) => sum + option.weight * (quantities[option.weight] || 0), 0)
)

const totalQty = computed(() =>
  goldOptions.value.reduce((sum, option) => sum + (quantities[option.weight] || 0), 0)
)

const dpBounds = computed(() => ({
  min: 10,
  max: 40
}))

const dpMinNominal = computed(() => (totalPrice.value * dpBounds.value.min) / 100)
const dpMaxNominal = computed(() => (totalPrice.value * dpBounds.value.max) / 100)

const dpNominal = computed(() => {
  if (!totalPrice.value) return 0
  return (totalPrice.value * dpPct.value) / 100
})

const principal = computed(() => Math.max(totalPrice.value - dpNominal.value, 0))

const tenorMonths = computed(() => Math.max(tenor.value, 1))
const marginPerMonth = computed(() => principal.value * (marginRate / 100))

// Use API data if available, otherwise use calculated values
const angsuranBulanan = computed(() => {
  if (apiPreview.value?.angsuran_bulanan) {
    return apiPreview.value.angsuran_bulanan
  }
  return principal.value && tenorMonths.value ? principal.value / tenorMonths.value + marginPerMonth.value : 0
})

const totalAngsuran = computed(() => {
  if (apiPreview.value?.total_angsuran) {
    return apiPreview.value.total_angsuran
  }
  return angsuranBulanan.value * tenorMonths.value
})

const selectedItems = computed(() =>
  goldOptions.value
    .map((option) => ({
      weight: option.weight,
      qty: quantities[option.weight] || 0,
      subtotal: option.price * (quantities[option.weight] || 0)
    }))
    .filter((item) => item.qty > 0)
)

const itemsSummary = computed(() =>
  selectedItems.value.map((item) => `${item.weight}g x${item.qty}`).join('; ')
)

const formattedTotalPrice = computed(() => fmt(totalPrice.value))
const formattedTotalPriceClass = computed(() => {
  const len = formattedTotalPrice.value?.length ?? 0
  if (len > 18) return 'text-base leading-tight'
  if (len > 14) return 'text-lg leading-tight'
  return 'text-xl leading-tight'
})

// Functions
async function getCsrfToken() {
  try {
    const response = await fetch('http://192.168.23.22:3001/csrf-token', {
      method: 'GET',
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error(`CSRF request failed with status ${response.status}`)
    }

    const data = await response.json()
    const token = data?.csrfToken || data?.token || data?.['csrf-token'] || response.headers.get('X-CSRF-Token')

    if (!token) {
      throw new Error('CSRF token tidak ditemukan')
    }

    csrfToken.value = token
    return token
  } catch (error) {
    console.error('Failed to get CSRF token:', error)
    throw error
  }
}

async function fetchPreview() {
  // Only fetch if we have items selected
  if (selectedItems.value.length === 0) {
    apiPreview.value = null
    return
  }

  try {
    isLoadingPreview.value = true

    // Get CSRF token if not available
    if (!csrfToken.value) {
      await getCsrfToken()
    }

    // Prepare request body
    const requestBody = {
      items: selectedItems.value.map(item => ({
        gramase: item.weight,
        qty: item.qty
      })),
      tenor: tenor.value,
      dp_pct: dpPct.value
    }

    const response = await fetch('http://192.168.23.22:3001/api/forms/preview', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken.value
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      throw new Error(`Preview API failed with status ${response.status}`)
    }

    const data = await response.json()
    apiPreview.value = data
  } catch (error) {
    console.error('Failed to fetch preview:', error)
    apiPreview.value = null
  } finally {
    isLoadingPreview.value = false
  }
}

// Watch for changes and fetch preview
let previewTimeout = null
watch([() => selectedItems.value.length, tenor, dpPct, () => JSON.stringify(selectedItems.value)], () => {
  // Debounce API calls
  if (previewTimeout) {
    clearTimeout(previewTimeout)
  }
  previewTimeout = setTimeout(() => {
    fetchPreview()
  }, 500)
})

function updateQuantity(weight, delta) {
  const current = quantities[weight] || 0
  const next = Math.max(0, current + delta)
  quantities[weight] = next
}

function onQuantityInput(weight, value) {
  const numeric = Number(value)
  quantities[weight] = Number.isNaN(numeric) || numeric < 0 ? 0 : Math.floor(numeric)
}

function clearQuantity(weight) {
  quantities[weight] = 0
}

function openDenominationModal() {
  showDenominationModal.value = true
}

function closeDenominationModal() {
  showDenominationModal.value = false
}

const fmt = (n) => {
  if (!n || typeof n !== 'number') return 'Rp 0'
  return n.toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  })
}

const formatNumber = (n) =>
  new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: n % 1 !== 0 ? 1 : 0,
    maximumFractionDigits: 1
  }).format(n)

const generateCaptcha = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 5; i += 1) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  captchaCode.value = code
  captchaInput.value = ''
  captchaError.value = ''
}

const handleSubmit = async () => {
  if (isSubmitting.value) return

  submitMessage.value = ''
  submitStatus.value = ''
  captchaError.value = ''

  if (selectedItems.value.length === 0) {
    submitStatus.value = 'error'
    submitMessage.value = 'Silakan tambahkan denominasi emas terlebih dahulu.'
    setTimeout(() => (submitMessage.value = ''), 4000)
    return
  }

  if (!form.nama || !form.email || !form.telepon) {
    submitStatus.value = 'error'
    submitMessage.value = 'Mohon lengkapi data pemohon sebelum mengajukan.'
    setTimeout(() => (submitMessage.value = ''), 4000)
    return
  }

  if (!captchaInput.value || captchaInput.value.toUpperCase() !== captchaCode.value) {
    captchaError.value = 'Kode keamanan tidak sesuai.'
    submitStatus.value = 'error'
    submitMessage.value = 'Verifikasi captcha gagal. Coba lagi.'
    generateCaptcha()
    setTimeout(() => (submitMessage.value = ''), 4000)
    return
  }

  try {
    isSubmitting.value = true

    if (!csrfToken.value) {
      await getCsrfToken()
    }

    const payload = {
      nama: form.nama,
      email: form.email,
      no_telepon: form.telepon,
      tenor: tenor.value,
      dp_pct: dpPct.value,
      items: selectedItems.value.map((item) => ({
        gramase: item.weight,
        qty: item.qty
      }))
    }

    const res = await fetch('http://192.168.23.22:3001/api/forms', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken.value
      },
      body: JSON.stringify(payload)
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      throw new Error(data?.message || `Pengajuan gagal dengan status ${res.status}`)
    }

    submitStatus.value = 'success'
    submitMessage.value = data?.message || 'Pengajuan berhasil dikirim! Tim kami akan menghubungi Anda.'

    // Reset form & selections
    weightOptions.forEach((weight) => {
      quantities[weight] = 0
    })
    form.nama = ''
    form.email = ''
    form.telepon = ''
    dpPct.value = 10
    apiPreview.value = null
    captchaInput.value = ''
  } catch (error) {
    console.error('Submit form failed:', error)
    submitStatus.value = 'error'
    submitMessage.value = error.message || 'Pengajuan gagal dikirim.'
  } finally {
    isSubmitting.value = false
    generateCaptcha()
    setTimeout(() => (submitMessage.value = ''), 4500)
  }
}
</script>

<style scoped>
/* Custom slider styling */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

/* Webkit browsers (Chrome, Safari, Edge) */
input[type="range"]::-webkit-slider-track {
  background: #e2e8f0;
  height: 0.5rem;
  border-radius: 0.5rem;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 1.5rem;
  width: 1.5rem;
  background: #14b8a6;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  margin-top: -0.5rem;
  transition: all 0.2s ease;
}

input[type="range"]::-webkit-slider-thumb:hover {
  background: #0d9488;
  box-shadow: 0 4px 12px rgba(20, 184, 166, 0.4);
  transform: scale(1.1);
}

input[type="range"]:disabled::-webkit-slider-thumb {
  background: #cbd5e1;
  cursor: not-allowed;
}

/* Firefox */
input[type="range"]::-moz-range-track {
  background: #e2e8f0;
  height: 0.5rem;
  border-radius: 0.5rem;
}

input[type="range"]::-moz-range-thumb {
  height: 1.5rem;
  width: 1.5rem;
  background: #14b8a6;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

input[type="range"]::-moz-range-thumb:hover {
  background: #0d9488;
  box-shadow: 0 4px 12px rgba(20, 184, 166, 0.4);
  transform: scale(1.1);
}

input[type="range"]:disabled::-moz-range-thumb {
  background: #cbd5e1;
  cursor: not-allowed;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
