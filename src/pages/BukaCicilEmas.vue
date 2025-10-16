<template>
  <section
    class="cicil-emas relative flex min-h-[600px] flex-col overflow-hidden rounded-[28px] border-[5px] border-[#1BC0B7] bg-white px-6 pb-8 pt-16 shadow-[0_18px_48px_rgba(16,24,40,0.08)]"
  >
    <header class="absolute left-1/2 top-0 translate-y-0 -translate-x-1/2">
      <div class="rounded-b-[24px] bg-gradient-to-r from-yellow-400 to-amber-400 px-6 py-2 text-lg font-semibold text-white">
        Buka Cicil Emas
      </div>
    </header>

    <div class="mt-4 grid gap-6 grid-cols-1 lg:grid-cols-[1fr_1.2fr]">
      <!-- LEFT -->
      <div class="flex flex-col gap-6">
        <section class="rounded-[20px] bg-[#FFF4DA] px-6 py-6 shadow-inner">
          <h3 class="text-lg font-semibold text-slate-800">Pilih Denominasi Emas</h3>
          <p class="mt-1 text-xs text-slate-600">tentukan berat dan jumlah keping emas yang ingin dibeli</p>

          <div class="mt-4 flex items-center gap-3">
            <div class="rounded-xl border border-white bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow">
              Total Berat : {{ formatNumber(totalGram) }} gr
            </div>
            <button type="button" @click="openDenominationModal"
              class="rounded-full bg-teal-500 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400">
              Tambah Denominasi
            </button>
          </div>

          <div class="mt-6 rounded-xl border border-white bg-white px-4 py-4 shadow min-h-[100px]">
            <div v-if="selectedItems.length === 0" class="text-center text-sm text-slate-500">
              Belum ada denominasi dipilih. Klik tombol diatas untuk menambahkan
            </div>
            <div v-else class="space-y-2">
              <div v-for="item in selectedItems" :key="item.weight"
                   class="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <span class="text-sm font-semibold text-slate-700">{{ item.weight }} gr × {{ item.qty }} keping</span>
                <button type="button" @click="clearQuantity(item.weight)"
                        class="text-rose-500 hover:text-rose-700 text-sm font-semibold">Hapus</button>
              </div>
            </div>
          </div>

          <div class="mt-4 grid grid-cols-2 gap-3">
            <div class="rounded-xl border border-white bg-white px-4 py-3 shadow">
              <p class="text-xs font-semibold text-slate-600">Total Keping</p>
              <p class="mt-1 text-lg font-bold text-slate-800">{{ totalQty }} pcs</p>
            </div>
            <div class="rounded-xl border border-white bg-white px-4 py-3 shadow overflow-hidden">
              <p class="text-xs font-semibold text-slate-600">Total Harga Emas</p>
              <p class="mt-1 font-bold text-amber-600 tabular-nums break-words" :class="formattedTotalPriceClass">
                {{ formattedTotalPrice }}
              </p>
            </div>
          </div>
        </section>

        <section class="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
          <h3 class="text-base font-semibold text-slate-900">Tenor & DP</h3>
          <div class="mt-4">
            <label class="block text-sm font-semibold text-slate-700">
              Tenor Investasi
              <select v-model.number="tenor"
                class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200">
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
                <input v-model.number="dpPct" type="range" :min="dpBounds.min" :max="dpBounds.max" step="1"
                  class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  :disabled="!totalPrice" @input="onDpChange" />
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

      <!-- RIGHT -->
      <section class="rounded-[22px] border border-slate-200 bg-slate-100 px-6 py-6 shadow-inner">
        <h3 class="text-lg font-semibold text-slate-800">Ringkasan Pengajuan</h3>

        <form @submit.prevent="handleSubmit" class="mt-4 space-y-4" novalidate>
          <!-- Nama -->
          <label class="block text-sm font-semibold text-slate-700">
            Nama
            <input
              :value="form.nama"
              @input="onNameInput"
              type="text" required maxlength="100" autocomplete="name"
              class="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
              placeholder="Nama lengkap" />
          </label>

          <!-- Email -->
          <label class="block text-sm font-semibold text-slate-700">
            Email
            <input
              :value="form.email"
              @input="onEmailInput"
              type="email" required maxlength="120" inputmode="email" autocomplete="email"
              autocapitalize="off" spellcheck="false"
              class="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
              placeholder="email@example.com" />
          </label>

          <!-- Telepon (masking + only digit) -->
          <label class="block text-sm font-semibold text-slate-700">
            Nomor Telepon
            <input
              :value="teleponDisplay"
              @input="onPhoneInput"
              @keydown="onPhoneKeydown"
              @paste.prevent="onPhonePaste"
              @wheel.prevent
              type="tel" required inputmode="numeric" autocomplete="tel"
              maxlength="18"  
              class="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
              placeholder="08xx-xxxx-xxxx" />
          </label>

          <!-- Captcha (canvas) -->
          <div class="mt-4 rounded-xl border border-dashed border-slate-300 bg-white/70 px-4 py-3 shadow-inner">
            <div class="flex items-center justify-between gap-3 text-sm">
              <span class="font-semibold text-slate-700">Verifikasi</span>
              <button type="button"
                class="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-teal-500 hover:text-teal-600"
                @click="generateCaptcha">
                Muat ulang
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v6h6M20 20v-6h-6M5 19A9 9 0 0119 5" />
                </svg>
              </button>
            </div>
            <div class="mt-3 inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-emerald-100 via-emerald-200 to-teal-300 px-5 py-3">
              <canvas ref="captchaCanvasRef" width="220" height="60" class="rounded-lg border border-emerald-300 bg-emerald-50"></canvas>
              <svg class="h-6 w-6 text-emerald-700" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path stroke-width="1.5" stroke="currentColor" d="M21 12a9 9 0 1 1-9-9m0 0v4m0-4h-4" />
              </svg>
            </div>
            <input v-model.trim="captchaInput" type="text" maxlength="8" inputmode="latin"
              @paste.prevent
              class="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm uppercase tracking-widest focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
              placeholder="Masukkan kode di atas" />
            <p v-if="captchaError" class="mt-2 text-xs font-semibold text-rose-600" aria-live="polite">{{ captchaError }}</p>
          </div>

          <!-- Summary -->
          <div class="mt-6 space-y-3 rounded-xl bg-white/80 p-4 shadow-inner">
            <div class="flex items-center justify-between text-sm"><span class="font-semibold text-slate-700">Total Berat Emas</span><span class="font-bold text-slate-800">{{ formatNumber(totalGram) }} gr</span></div>
            <div class="flex items-center justify-between text-sm"><span class="font-semibold text-slate-700">Total Keping</span><span class="font-bold text-slate-800">{{ totalQty }} pcs</span></div>
            <div class="flex items-center justify-between text-sm"><span class="font-semibold text-slate-700">Nominal DP</span><span class="font-bold text-slate-800">{{ fmt(dpNominal) }}</span></div>
            <div class="flex items-center justify-between text-sm"><span class="font-semibold text-slate-700">Angsuran per Bulan</span><span class="font-bold text-teal-600">{{ fmt(angsuranBulanan) }}</span></div>
            <div class="flex items-center justify-between border-t border-slate-300 pt-3 text-sm"><span class="font-semibold text-slate-700">Total Angsuran ({{ tenor }} bln)</span><span class="font-bold text-slate-800">{{ fmt(totalAngsuran) }}</span></div>
          </div>

          <button type="submit"
            class="mt-6 w-full rounded-full bg-amber-400 px-6 py-3 text-base font-semibold text-slate-900 shadow transition hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isSubmitting">
            <span v-if="isSubmitting" class="inline-flex items-center gap-2">
              <svg class="h-4 w-4 animate-spin text-slate-900" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Mengirim...
            </span>
            <span v-else>Ajukan</span>
          </button>

          <transition name="fade">
            <div v-if="submitMessage"
              class="mt-4 rounded-xl border px-4 py-3 text-sm font-semibold"
              :class="submitStatus === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-600' : 'border-rose-200 bg-rose-50 text-rose-600'"
              aria-live="polite">
              {{ submitMessage }}
            </div>
          </transition>
        </form>
      </section>
    </div>

    <!-- Modal -->
    <teleport to="body">
      <div v-if="showDenominationModal"
        class="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4"
        @click.self="closeDenominationModal">
        <div class="w-full max-w-xl rounded-[24px] bg-white p-6 shadow-2xl">
          <header class="flex items-start justify-between gap-4">
            <div>
              <h3 class="text-lg font-semibold text-slate-900">Tambah Denominasi</h3>
              <p class="text-xs text-slate-500">Pilih kombinasi berat emas, sesuaikan jumlah dengan tombol plus atau minus.</p>
            </div>
            <button type="button"
              class="rounded-full border border-slate-200 bg-white p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Tutup popup" @click="closeDenominationModal">
              <span class="flex h-6 w-6 items-center justify-center text-lg">&times;</span>
            </button>
          </header>

          <ul class="mt-5 space-y-4">
            <li v-for="(option, idx) in goldOptions" :key="option.weight"
              class="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-[#fffdf6] px-4 py-3 shadow-sm">
              <div class="flex items-center gap-3">
                <svg class="h-12 w-10 shrink-0" viewBox="0 0 48 64" fill="none" aria-hidden="true">
                  <defs><linearGradient :id="`gold-grad-${idx}`" x1="4" y1="6" x2="44" y2="58" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#FCD34D" /><stop offset="1" stop-color="#F59E0B" /></linearGradient></defs>
                  <rect x="4" y="6" width="40" height="52" rx="10" :fill="`url(#gold-grad-${idx})`" stroke="#F59E0B" stroke-width="2" />
                  <path d="M24 20c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6Z" fill="#FDE68A" />
                  <path d="M24 26c7.732 0 14 6.268 14 14v6c0 1.105-.895 2-2 2H12c-1.105 0-2-.895-2-2v-6c0-7.732 6.268-14 14-14Z" fill="#FCD34D" />
                </svg>
                <div>
                  <p class="text-sm font-semibold text-slate-800">{{ option.weight }} gram</p>
                  <p class="text-xs font-medium text-emerald-600">{{ fmt(option.price) }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <button type="button"
                  class="grid h-8 w-8 place-items-center rounded-full border border-slate-200 text-lg text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                  :disabled="quantities[option.weight] <= 0" @click="updateQuantity(option.weight, -1)">&minus;</button>

                <input :value="quantities[option.weight]" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="3"
                  class="h-9 w-16 rounded-xl border border-slate-200 bg-white text-center text-sm font-semibold text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                  @keydown="onQtyKeydown"
                  @input="onQuantityInput(option.weight, $event.target.value)" />

                <button type="button"
                  class="grid h-8 w-8 place-items-center rounded-full border border-teal-500 bg-teal-500 text-lg font-semibold text-white transition hover:bg-teal-600"
                  @click="updateQuantity(option.weight, 1)">+</button>
              </div>
            </li>
          </ul>

          <footer class="mt-6 flex flex-col gap-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p class="font-semibold text-slate-700">Total Harga Emas</p>
              <p class="text-emerald-600">{{ fmt(totalPrice) }}</p>
            </div>
            <button type="button"
              class="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
              @click="closeDenominationModal">Selesai</button>
          </footer>
        </div>
      </div>
    </teleport>
  </section>
</template>

<script setup>
import { computed, reactive, ref, watch, onMounted, nextTick } from 'vue'
import { apiFetch } from '@/services/apiClient'

/* ============ Sanitizer helpers ============ */
const safeNormalize = (s, form = 'NFKC') => { try { return typeof s === 'string' && s.normalize ? s.normalize(form) : (s || '') } catch { return s || '' } }
const stripControls = (s) => String(s ?? '').replace(/[\u0000-\u001F\u007F]/g, '')

const NAME_ALLOW = /[^A-Za-z\s.'-]/g
const sanitizeName = (s) => stripControls(safeNormalize(s)).replace(NAME_ALLOW, '').replace(/\s+/g, ' ').trim()
const sanitizeEmail = (s) => stripControls(safeNormalize(s)).replace(/\s+/g, '').toLowerCase()
const digitsOnly = (s) => (String(s ?? '')).replace(/\D/g, '')
const sanitizePhone = (s) => digitsOnly(safeNormalize(s))

/* ============ Harga emas & options ============ */
const goldPricePerGram = ref(0)
const isLoadingPrice = ref(true)
const weightOptions = [5, 10, 25, 50, 100]
const goldOptions = computed(() => weightOptions.map(weight => ({ weight, price: goldPricePerGram.value * weight })))
const quantities = reactive(weightOptions.reduce((map, weight) => (map[weight] = 0, map), {}))

/* ============ Tenor & DP ============ */
const tenorOptions = [
  { label: '1 Tahun (12 bulan)', value: 12 },
  { label: '2 Tahun (24 bulan)', value: 24 },
  { label: '3 Tahun (36 bulan)', value: 36 },
  { label: '4 Tahun (48 bulan)', value: 48 },
  { label: '5 Tahun (60 bulan)', value: 60 }
]
const tenor = ref(tenorOptions[0].value)
const dpPct = ref(10)
const dpBounds = computed(() => ({ min: 10, max: 40 }))
const onDpChange = () => { if (dpPct.value < dpBounds.value.min) dpPct.value = dpBounds.value.min; if (dpPct.value > dpBounds.value.max) dpPct.value = dpBounds.value.max }

/* ============ API/submit state ============ */
const showDenominationModal = ref(false)
const marginRate = 10
const apiPreview = ref(null)
const csrfToken = ref(null)
const priceCsrfToken = ref(null)
const isLoadingPreview = ref(false)
const isSubmitting = ref(false)
const submitMessage = ref('')
const submitStatus = ref('')

/* ============ Form ============ */
const form = reactive({ nama: '', email: '', telepon: '' }) // telepon = digits only
const teleponDisplay = ref('') // masked display (08xx-xxxx-xxxx)

/* ============ Captcha (canvas) ============ */
const captchaCanvasRef = ref(null)
const captchaCode = ref('')
const captchaInput = ref('')
const captchaError = ref('')
const CAPTCHA_TTL_MS = 60_000
let captchaExpiresAt = 0

function drawCaptchaCanvas (code) {
  if (typeof window === 'undefined') return
  const el = captchaCanvasRef.value; if (!el) return
  const ctx = el.getContext('2d'); if (!ctx) return
  const { width, height } = el
  // background
  ctx.clearRect(0,0,width,height)
  const grad = ctx.createLinearGradient(0,0,width,height)
  grad.addColorStop(0,'#d1fae5'); grad.addColorStop(1,'#99f6e4')
  ctx.fillStyle = grad; ctx.fillRect(0,0,width,height)
  // noise lines
  ctx.strokeStyle = '#10b981'; ctx.globalAlpha = 0.35; ctx.setLineDash([4,3])
  for (let i=0;i<10;i++){ ctx.beginPath(); ctx.moveTo(Math.random()*width, 0); ctx.lineTo(Math.random()*width, height); ctx.stroke() }
  ctx.setLineDash([]); ctx.globalAlpha = 1
  // text
  ctx.save()
  ctx.translate(10, 12)
  ctx.transform(1, Math.random()*0.2-0.1, Math.random()*0.2-0.1, 1, 0, 0)
  ctx.font = 'bold 28px monospace'
  ctx.fillStyle = '#064e3b'
  ctx.fillText(code.split('').join(' '), 18, 36)
  ctx.restore()
}

function generateCaptcha () {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i=0;i<5;i++) code += chars[(Math.random()*chars.length)|0]
  captchaCode.value = code
  captchaInput.value = ''
  captchaError.value = ''
  captchaExpiresAt = Date.now() + CAPTCHA_TTL_MS
  drawCaptchaCanvas(code)
}

/* ============ Fetch Harga Emas ============ */
async function fetchGoldPrice() {
  isLoadingPrice.value = true
  try {
    if (!priceCsrfToken.value) {
      const tokenRes = await apiFetch('/csrf-token', { method: 'GET' })
      const tokenData = await tokenRes.json().catch(() => ({}))
      priceCsrfToken.value = tokenData?.csrfToken || tokenData?.token || tokenData?.['csrf-token'] || tokenRes.headers.get('X-CSRF-Token')
    }
    const response = await apiFetch('/api/emas/today', { method: 'GET', headers: { 'X-CSRF-Token': priceCsrfToken.value || '' } })
    const data = await response.json()
    const parsed = data?.harga_pergram_idr ? parseFloat(String(data.harga_pergram_idr).replace(/[^\d.]/g, '')) : 0
    goldPricePerGram.value = Number.isFinite(parsed) && parsed > 0 ? parsed : 2429850
  } catch { goldPricePerGram.value = 2429850 } finally { isLoadingPrice.value = false }
}

onMounted(async () => {
  await nextTick()
  fetchGoldPrice()
  generateCaptcha()
})

/* ============ Computed Totals ============ */
const totalPrice = computed(() => goldOptions.value.reduce((sum, o) => sum + o.price * (quantities[o.weight] || 0), 0))
const totalGram  = computed(() => goldOptions.value.reduce((sum, o) => sum + o.weight * (quantities[o.weight] || 0), 0))
const totalQty   = computed(() => goldOptions.value.reduce((sum, o) => sum + (quantities[o.weight] || 0), 0))

const dpMinNominal = computed(() => (totalPrice.value * dpBounds.value.min) / 100)
const dpMaxNominal = computed(() => (totalPrice.value * dpBounds.value.max) / 100)
const dpNominal    = computed(() => totalPrice.value ? (totalPrice.value * dpPct.value) / 100 : 0)
const principal    = computed(() => Math.max(totalPrice.value - dpNominal.value, 0))
const tenorMonths  = computed(() => Math.max(tenor.value, 1))
const marginPerMonth  = computed(() => principal.value * (marginRate / 100))
const angsuranBulanan = computed(() => apiPreview.value?.angsuran_bulanan ?? (principal.value && tenorMonths.value ? principal.value / tenorMonths.value + marginPerMonth.value : 0))
const totalAngsuran   = computed(() => apiPreview.value?.total_angsuran ?? (angsuranBulanan.value * tenorMonths.value))

const selectedItems = computed(() => goldOptions.value
  .map(o => ({ weight: o.weight, qty: quantities[o.weight] || 0, subtotal: o.price * (quantities[o.weight] || 0) }))
  .filter(i => i.qty > 0))

const itemsSummary = computed(() => selectedItems.value.map(i => `${i.weight}g x${i.qty}`).join('; '))
const formattedTotalPrice = computed(() => fmt(totalPrice.value))
const formattedTotalPriceClass = computed(() => {
  const len = formattedTotalPrice.value?.length ?? 0
  if (len > 20) return 'text-xs leading-tight'
  if (len > 16) return 'text-sm leading-tight'
  if (len > 14) return 'text-base leading-tight'
  return 'text-lg leading-tight'
})

/* ============ Preview (debounce) ============ */
async function getCsrfToken() {
  const res = await apiFetch('/csrf-token', { method: 'GET' })
  const data = await res.json().catch(() => ({}))
  const token = data?.csrfToken || data?.token || data?.['csrf-token'] || res.headers.get('X-CSRF-Token')
  csrfToken.value = token
  return token
}
async function fetchPreview() {
  if (!selectedItems.value.length) { apiPreview.value = null; return }
  try {
    isLoadingPreview.value = true
    if (!csrfToken.value) await getCsrfToken()
    const body = {
      items: selectedItems.value.map(i => ({ gramase: i.weight, qty: Math.max(1, Math.floor(i.qty)) })),
      tenor: Math.min(60, Math.max(12, Math.floor(tenor.value))),
      dp_pct: Math.min(dpBounds.value.max, Math.max(dpBounds.value.min, Math.floor(dpPct.value)))
    }
    const res = await apiFetch('/api/forms/preview', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken.value }, body: JSON.stringify(body)
    })
    if (!res.ok) throw new Error(`Preview API failed with status ${res.status}`)
    apiPreview.value = await res.json()
  } catch (e) { console.error(e); apiPreview.value = null } finally { isLoadingPreview.value = false }
}
let previewTimeout = null
watch([() => selectedItems.value.length, tenor, dpPct, () => JSON.stringify(selectedItems.value)], () => {
  if (previewTimeout) clearTimeout(previewTimeout)
  previewTimeout = setTimeout(fetchPreview, 500)
})

/* ============ Qty handlers ============ */
function updateQuantity (weight, delta) { const cur = quantities[weight] || 0; quantities[weight] = Math.max(0, cur + delta) }
function onQuantityInput (weight, v)     { const n = Number(digitsOnly(v)); quantities[weight] = Number.isNaN(n) || n < 0 ? 0 : Math.floor(n) }
function onQtyKeydown (e) {
  const allow = ['Backspace','Delete','Tab','ArrowLeft','ArrowRight','Home','End']
  if (e.ctrlKey || e.metaKey) return
  if (allow.includes(e.key)) return
  if (!/^\d$/.test(e.key)) e.preventDefault()
}

/* ============ Phone mask helpers ============ */
function formatPhoneIDMask (digits) {
  // input: digits only (max 15); output masked: 08xx-xxxx-xxxx (dinamis)
  const d = digits.slice(0, 15)
  if (d.length <= 4) return d
  if (d.length <= 8)  return `${d.slice(0,4)}-${d.slice(4)}`
  return `${d.slice(0,4)}-${d.slice(4,8)}-${d.slice(8)}`
}

/* ============ Form handlers ============ */
function onNameInput(e) {
  form.nama = sanitizeName(e?.target?.value ?? '')
}
function onEmailInput(e) {
  const raw = sanitizeEmail(e?.target?.value ?? '')
  form.email = raw.replace(/[^a-z0-9@._%+\-]/g, '')
}
function onPhoneInput(e) {
  const val = e?.target?.value ?? ''
  let digits = sanitizePhone(val)
  // normalisasi ke lokal: 62... -> 0...
  if (digits.startsWith('62')) digits = '0' + digits.slice(2)
  if (digits.startsWith('620')) digits = '0' + digits.slice(3)
  form.telepon = digits.slice(0, 15)          // simpan murni digit
  teleponDisplay.value = formatPhoneIDMask(form.telepon) // tampilkan masked
}
function onPhoneKeydown(e) {
  const allow = ['Backspace','Delete','Tab','ArrowLeft','ArrowRight','Home','End']
  if (e.ctrlKey || e.metaKey) return
  if (allow.includes(e.key)) return
  if (!/^\d$/.test(e.key)) { e.preventDefault(); return }
  if ((form.telepon?.length ?? 0) >= 15) e.preventDefault()
}
function onPhonePaste(e) {
  const data = e.clipboardData?.getData('text') ?? ''
  let digits = sanitizePhone(data)
  if (digits.startsWith('62')) digits = '0' + digits.slice(2)
  if (digits.startsWith('620')) digits = '0' + digits.slice(3)
  form.telepon = (form.telepon + digits).slice(0, 15)
  teleponDisplay.value = formatPhoneIDMask(form.telepon)
}

/* ============ Modal ============ */
function clearQuantity (w) { quantities[w] = 0 }
function openDenominationModal () { showDenominationModal.value = true }
function closeDenominationModal () { showDenominationModal.value = false }

/* ============ Util format ============ */
const fmt = (n) => (!n || typeof n !== 'number' || !Number.isFinite(n) ? 'Rp 0'
  : n.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }))
const formatNumber = (n) => new Intl.NumberFormat('id-ID', { minimumFractionDigits: n % 1 !== 0 ? 1 : 0, maximumFractionDigits: 1 }).format(n)

/* ============ Submit ============ */
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const phoneRe = /^0\d{9,14}$/  // digits only (kita pakai form.telepon yang sudah digits)
const handleSubmit = async () => {
  if (isSubmitting.value) return
  submitMessage.value = ''; submitStatus.value = ''; captchaError.value = ''

  if (selectedItems.value.length === 0) {
    submitStatus.value = 'error'; submitMessage.value = 'Silakan tambahkan denominasi emas terlebih dahulu.'
    setTimeout(() => (submitMessage.value = ''), 4000); return
  }
  if (!sanitizeName(form.nama)) { submitStatus.value = 'error'; submitMessage.value = 'Nama tidak valid.'; setTimeout(() => (submitMessage.value = ''), 4000); return }
  if (!emailRe.test(form.email)) { submitStatus.value = 'error'; submitMessage.value = 'Email tidak valid.'; setTimeout(() => (submitMessage.value = ''), 4000); return }
  if (!phoneRe.test(form.telepon)) { submitStatus.value = 'error'; submitMessage.value = 'Nomor telepon Indonesia harus diawali 0 dan 10–15 digit.'; setTimeout(() => (submitMessage.value = ''), 4000); return }

  if (Date.now() > captchaExpiresAt || (captchaInput.value || '').toUpperCase() !== captchaCode.value) {
    captchaError.value = 'Captcha salah atau kedaluwarsa.'; submitStatus.value = 'error'; submitMessage.value = 'Verifikasi captcha gagal. Coba lagi.'
    generateCaptcha(); setTimeout(() => (submitMessage.value = ''), 4000); return
  }

  try {
    isSubmitting.value = true
    if (!csrfToken.value) await getCsrfToken()
    const payload = {
      nama: sanitizeName(form.nama),
      email: sanitizeEmail(form.email),
      no_telepon: sanitizePhone(form.telepon),
      tenor: Math.min(60, Math.max(12, Math.floor(tenor.value))),
      dp_pct: Math.min(dpBounds.value.max, Math.max(dpBounds.value.min, Math.floor(dpPct.value))),
      items: selectedItems.value.map(i => ({ gramase: i.weight, qty: Math.max(1, Math.floor(i.qty)) }))
    }
    const res = await apiFetch('/api/forms', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken.value }, body: JSON.stringify(payload)
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data?.message || `Pengajuan gagal dengan status ${res.status}`)
    submitStatus.value = 'success'; submitMessage.value = data?.message || 'Pengajuan berhasil dikirim! Tim kami akan menghubungi Anda.'
    // reset
    weightOptions.forEach(w => { quantities[w] = 0 })
    form.nama = ''; form.email = ''; form.telepon = ''; teleponDisplay.value = ''
    dpPct.value = 10; apiPreview.value = null; captchaInput.value = ''
  } catch (e) {
    submitStatus.value = 'error'; submitMessage.value = e.message || 'Pengajuan gagal dikirim.'
  } finally {
    isSubmitting.value = false; generateCaptcha(); setTimeout(() => (submitMessage.value = ''), 4500)
  }
}
</script>

<style scoped>
/* SCOPED ke wrapper .cicil-emas biar pseudo-element nggak bocor global */
.cicil-emas input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}
.cicil-emas input[type="range"]::-webkit-slider-track {
  background: #e2e8f0;
  height: 0.5rem;
  border-radius: 0.5rem;
}
.cicil-emas input[type="range"]::-webkit-slider-thumb {
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
.cicil-emas input[type="range"]::-webkit-slider-thumb:hover {
  background: #0d9488;
  box-shadow: 0 4px 12px rgba(20, 184, 166, 0.4);
  transform: scale(1.1);
}
.cicil-emas input[type="range"]:disabled::-webkit-slider-thumb {
  background: #cbd5e1;
  cursor: not-allowed;
}
.cicil-emas input[type="range"]::-moz-range-track {
  background: #e2e8f0;
  height: 0.5rem;
  border-radius: 0.5rem;
}
.cicil-emas input[type="range"]::-moz-range-thumb {
  height: 1.5rem;
  width: 1.5rem;
  background: #14b8a6;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}
.cicil-emas input[type="range"]::-moz-range-thumb:hover {
  background: #0d9488;
  box-shadow: 0 4px 12px rgba(20, 184, 166, 0.4);
  transform: scale(1.1);
}
.cicil-emas input[type="range"]:disabled::-moz-range-thumb {
  background: #cbd5e1;
  cursor: not-allowed;
}

.fade-enter-active, .fade-leave-active { transition: opacity .3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
