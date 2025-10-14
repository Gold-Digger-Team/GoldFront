<template>
  <section
    class="relative flex min-h-[600px] h-full flex-col overflow-hidden rounded-[28px] border-[5px] border-[#1BC0B7] bg-white px-6 pb-8 pt-16 shadow-[0_18px_48px_rgba(16,24,40,0.08)]"
  >
    <header class="absolute left-1/2 top-0 translate-y-0 -translate-x-1/2">
      <div class="rounded-b-[24px] bg-gradient-to-r from-yellow-400 to-amber-400 px-6 py-2 text-lg font-semibold text-white">
        Prediksi Keuntungan
      </div>
    </header>

    <div class="mt-2 grid flex-1 gap-6 grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
      <div class="space-y-6">
        <section class="rounded-[22px] border border-[#ffb70f33] bg-[#fffaf0] p-5">
          <header class="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 class="text-lg font-semibold text-slate-900">Pilih Denominasi Emas</h2>
              <p class="text-xs text-slate-500">
                Tentukan berat dan jumlah keping emas yang ingin dibeli.
              </p>
            </div>
            <div class="flex items-center gap-3">
              <div class="hidden rounded-full bg-white px-3 py-1 text-xs font-semibold text-amber-600 shadow sm:block">
                Total Berat: {{ formatNumber(totalGram) }} gr
              </div>
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
                @click="openDenominationModal"
              >
                Tambah Denominasi
              </button>
            </div>
          </header>

          <div class="mt-4 rounded-2xl border border-dashed border-amber-200 bg-white/80 p-4">
            <template v-if="selectedItems.length">
              <ul class="space-y-3 text-sm">
                <li
                  v-for="item in selectedItems"
                  :key="item.weight"
                  class="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 shadow-sm"
                >
                  <div>
                    <p class="font-semibold text-slate-800">
                      {{ item.weight }} gram × {{ item.qty }} pcs
                    </p>
                    <p class="text-xs text-slate-500">
                      Subtotal:
                      <span class="font-semibold text-emerald-600">{{ fmt(item.subtotal) }}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    class="text-xs font-semibold text-rose-500 transition hover:text-rose-600"
                    @click="clearQuantity(item.weight)"
                  >
                    Hapus
                  </button>
                </li>
              </ul>
            </template>
            <template v-else>
              <div class="grid place-items-center gap-2 py-6 text-center text-xs text-slate-500">
                <p>Belum ada denominasi dipilih. Klik tombol di atas untuk menambahkan.</p>
              </div>
            </template>
          </div>

          <footer class="mt-5 rounded-2xl border border-dashed border-emerald-200 bg-white/80 px-4 py-3 text-sm">
            <div class="flex justify-between">
              <span class="text-slate-600">Total Keping</span>
              <span class="font-semibold text-slate-800">{{ totalQty }} pcs</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-600">Total Harga Emas</span>
              <span class="font-semibold text-emerald-600">{{ fmt(totalPrice) }}</span>
            </div>
          </footer>
        </section>

        <section class="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
          <h3 class="text-base font-semibold text-slate-900">Pengaturan Simulasi</h3>
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

      <aside class="flex h-full flex-col justify-between rounded-[22px] border border-[#1bc0b733] bg-[#f0fffc] p-5">
        <div>
          <h3 class="text-lg font-semibold text-slate-900">Ringkasan Estimasi</h3>
          <p class="mt-1 text-xs text-slate-500">
            Asumsi pertumbuhan harga emas rata-rata {{ (annualGrowthRate * 100).toFixed(1) }}% per tahun.
          </p>

          <dl class="mt-4 space-y-3 rounded-2xl bg-white/90 p-4 shadow-inner text-sm text-slate-700">
            <div class="flex justify-between">
              <dt>Total Harga Emas Saat Ini</dt>
              <dd class="font-semibold">{{ fmt(totalPrice) }}</dd>
            </div>
            <div class="flex justify-between">
              <dt>Harga Prediksi ({{ tenor / 12 }} tahun)</dt>
              <dd class="font-semibold text-emerald-600">{{ fmt(predictedPrice) }}</dd>
            </div>
            <div class="flex justify-between">
              <dt>Nominal DP</dt>
              <dd class="font-semibold">{{ fmt(dpNominal) }}</dd>
            </div>
            <div class="flex justify-between">
              <dt>Angsuran per Bulan</dt>
              <dd class="font-semibold text-emerald-600">{{ fmt(angsuranBulanan) }}</dd>
            </div>
            <div class="flex justify-between">
              <dt>Total Angsuran ({{ tenor }} bln)</dt>
              <dd class="font-semibold">{{ fmt(totalAngsuran) }}</dd>
            </div>
          </dl>
        </div>

        <div class="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-5 text-center">
          <p class="text-xs font-semibold uppercase tracking-wide text-emerald-700">Estimasi Profit</p>
          <p
            class="mt-2 text-3xl font-semibold"
            :class="profitNominal >= 0 ? 'text-emerald-600' : 'text-rose-500'"
          >
            {{ fmt(profitNominal) }}
          </p>
          <p
            class="mt-1 text-sm font-semibold"
            :class="profitNominal >= 0 ? 'text-emerald-500' : 'text-rose-500'"
          >
            {{ profitPercent >= 0 ? '+' : '' }}{{ profitPercent.toFixed(1) }}%
          </p>
          <p class="mt-2 text-[11px] text-slate-500">
            Profit dihitung dari harga prediksi dikurangi DP dan total angsuran.
          </p>
        </div>
      </aside>
    </div>

    <teleport to="body">
      <div
        v-if="showDenominationModal"
        class="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
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
const simulationCsrfToken = ref(null)
const simulationResult = ref(null)
const simulationLoading = ref(false)
const simulationError = ref('')

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
const annualGrowthRate = 0.09

const priceCsrfToken = ref(null)

// Fetch gold price from API
async function fetchGoldPrice() {
  isLoadingPrice.value = true
  try {
    if (!priceCsrfToken.value) {
      const tokenRes = await fetch('http://localhost:3001/get-csrf', {
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

    const response = await fetch('http://localhost:3001/api/emas/today', {
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
  fetchSimulation()
})

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

const dpNominalBase = computed(() => {
  if (!totalPrice.value) return 0
  return (totalPrice.value * dpPct.value) / 100
})

const dpNominal = computed(() =>
  typeof simulationResult.value?.result?.dp_rp === 'number'
    ? simulationResult.value.result.dp_rp
    : dpNominalBase.value
)

const principal = computed(() => Math.max(totalPrice.value - dpNominalBase.value, 0))

const tenorYears = computed(() => tenor.value / 12)

const predictedPriceFallback = computed(() =>
  totalPrice.value ? totalPrice.value * Math.pow(1 + annualGrowthRate, tenorYears.value) : 0
)

const predictedPrice = computed(() =>
  typeof simulationResult.value?.result?.harga_prediksi === 'number'
    ? simulationResult.value.result.harga_prediksi
    : predictedPriceFallback.value
)

const tenorMonths = computed(() => Math.max(tenor.value, 1))
const marginPerMonth = computed(() => principal.value * (marginRate / 100))

const angsuranBulananFallback = computed(() =>
  principal.value && tenorMonths.value ? principal.value / tenorMonths.value + marginPerMonth.value : 0
)

const angsuranBulanan = computed(() =>
  typeof simulationResult.value?.result?.nominal_angsuran === 'number'
    ? simulationResult.value.result.nominal_angsuran
    : angsuranBulananFallback.value
)

const totalAngsuranFallback = computed(() => angsuranBulananFallback.value * tenorMonths.value)
const totalAngsuran = computed(() =>
  typeof simulationResult.value?.result?.total_angsuran === 'number'
    ? simulationResult.value.result.total_angsuran
    : totalAngsuranFallback.value
)

const profitNominal = computed(() =>
  typeof simulationResult.value?.result?.profit_rp === 'number'
    ? simulationResult.value.result.profit_rp
    : predictedPrice.value - dpNominal.value - totalAngsuran.value
)

const profitPercent = computed(() =>
  typeof simulationResult.value?.result?.profit_pct === 'number'
    ? simulationResult.value.result.profit_pct
    : (() => {
        const outflow = dpNominal.value + totalAngsuran.value
        return outflow ? (profitNominal.value / outflow) * 100 : 0
      })()
)

const selectedItems = computed(() =>
  goldOptions.value
    .map((option) => ({
      weight: option.weight,
      qty: quantities[option.weight] || 0,
      subtotal: option.price * (quantities[option.weight] || 0)
    }))
    .filter((item) => item.qty > 0)
)

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

const fmt = (n) =>
  n.toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  })

const formatNumber = (n) =>
  new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: n % 1 !== 0 ? 1 : 0,
    maximumFractionDigits: 1
  }).format(n)

const ensureSimulationCsrf = async () => {
  if (simulationCsrfToken.value) return simulationCsrfToken.value
  const res = await fetch('http://localhost:3001/csrf-token', {
    method: 'GET',
    credentials: 'include'
  })
  if (!res.ok) {
    throw new Error(`CSRF request failed: ${res.status}`)
  }
  const data = await res.json().catch(() => ({}))
  const token =
    data?.csrfToken || data?.token || data?.['csrf-token'] || res.headers.get('X-CSRF-Token')
  if (!token) {
    throw new Error('Token CSRF tidak ditemukan')
  }
  simulationCsrfToken.value = token
  return token
}

const fetchSimulation = async () => {
  simulationError.value = ''

  if (!totalGram.value || !dpNominalBase.value) {
    simulationResult.value = null
    return
  }

  try {
    simulationLoading.value = true
    const token = await ensureSimulationCsrf()

    const payload = {
      gramase: totalGram.value,
      tenor: tenor.value,
      dp_pct: dpNominalBase.value
    }

    const res = await fetch('http://localhost:3001/api/simulasi/simulasi-cilem', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': token
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(text || `Simulasi gagal (${res.status})`)
    }

    const data = await res.json().catch(() => ({}))
    simulationResult.value = data
  } catch (error) {
    console.error('Simulasi cil-em failed:', error)
    simulationError.value = String(error.message || error)
    simulationResult.value = null
  } finally {
    simulationLoading.value = false
  }
}

let simulationDebounce = null
watch(
  [() => totalGram.value, () => tenor.value, () => dpNominalBase.value],
  () => {
    if (simulationDebounce) clearTimeout(simulationDebounce)
    simulationDebounce = setTimeout(() => {
      fetchSimulation()
    }, 400)
  }
)
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
</style>
