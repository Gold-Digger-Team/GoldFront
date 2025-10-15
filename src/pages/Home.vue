<template>
  <div class="bg-white text-slate-800">
    <!-- ================== NAVBAR (BCA STYLE) ================== -->
    <header class="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-8 py-3">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" aria-label="Beranda" class="inline-block">
            <img src="/assets/bsi-logo.png" class="h-10 w-auto" alt="Bank Syariah Indonesia" />
          </router-link>
        </div>

        <!-- Navigation Menu -->
        <nav class="flex items-center gap-8">
          <a href="https://www.bankbsi.co.id/" target="_blank" rel="noopener noreferrer" class="text-sm font-medium text-slate-700 hover:text-teal-600 transition-colors duration-200">
            Halaman Utama
          </a>
          <a href="https://www.bankbsi.co.id/news-update" target="_blank" rel="noopener noreferrer" class="text-sm font-medium text-slate-700 hover:text-teal-600 transition-colors duration-200">
            Berita & Pembaruan
          </a>
          <a href="https://www.bankbsi.co.id/company-information" target="_blank" rel="noopener noreferrer" class="text-sm font-medium text-slate-700 hover:text-teal-600 transition-colors duration-200">
            Informasi Perusahaan
          </a>
          <a href="https://ir.bankbsi.co.id/" target="_blank" rel="noopener noreferrer" class="text-sm font-medium text-slate-700 hover:text-teal-600 transition-colors duration-200">
            Hubungan Investor
          </a>
        </nav>

        <!-- CTA Button -->
        <div class="flex items-center gap-4">
          <button class="rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition-colors duration-200 shadow-sm">
            Buka Rekening
          </button>
        </div>
      </div>
    </header>

    <!-- ================== MAIN CONTENT ================== -->
    <main class="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <!-- === Hero Carousel (BSI Gold) === -->
      <BSIGoldHero />

      <!-- === 3 Info Cards === -->
      <section class="grid gap-4 md:grid-cols-3">
        <InfoCard
          type="price"
          title="Harga Emas Saat Ini"
          :value="priceCardText"
        />
        <InfoCard
          type="projection"
          title="Proyeksi 3 Tahun Ke Depan"
          :value="projectionText"
          :subtitle="projectionGrowthText"
        />
        <InfoCard
          type="growth"
          title="Year-on-year Growth"
          :value="yoyText"
          :subtitle="yoySubtitle"
          :trend="yoyTrend"
        />
      </section>

      <!-- === Sidebar (Navbar Fitur) + Chart (SEBELAH-SEBELAHAN) === -->
      <section class="w-full space-y-6 md:grid md:grid-cols-[320px_1fr] md:items-start md:gap-6 md:space-y-0">
        <div class="flex w-full items-stretch">
          <SidebarMenu
            v-model="activeMenu"
            :items="menuItems"
            class="flex-1"
          />
        </div>

        <div
          v-if="activeSection"
          :id="activeSection.slug"
          class="flex w-full items-stretch"
        >
          <KeepAlive>
            <component
              :is="activeSection.component"
              :key="activeSection.name"
              class="flex w-full flex-1"
              @navigate-section="handleNavigateSection"
            />
          </KeepAlive>
        </div>
      </section>

    </main>

    <!-- ================== FOOTER ================== -->
    <AppFooter />

  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { apiFetch } from '@/services/apiClient'
import BSIGoldHero from '../components/BSIGoldHero.vue'
import InfoCard from '../components/sections/InfoCard.vue'
import SidebarMenu from '../components/sections/SidebarMenu.vue'
import AppFooter from '../components/AppFooter.vue'
import HargaEmas from './HargaEmas.vue'
import PrediksiKeuntungan from './PrediksiKeuntungan.vue'
import KalkulatorCicilEmas from './KalkulatorCicilEmas.vue'
import BukaCicilEmas from './BukaCicilEmas.vue'

const sections = [
  { name: 'Harga Emas', slug: 'harga-emas', component: HargaEmas },
  { name: 'Prediksi Keuntungan', slug: 'prediksi-keuntungan', component: PrediksiKeuntungan },
  { name: 'Rekomendasi Cicil Emas', slug: 'kalkulator-cicil-emas', component: KalkulatorCicilEmas },
  { name: 'Buka Cicil Emas', slug: 'buka-cicil-emas', component: BukaCicilEmas }
]

const menuItems = sections.map((section) => section.name)
const activeMenu = ref(menuItems[0])
const activeSection = computed(
  () => sections.find((section) => section.name === activeMenu.value) ?? sections[0]
)

const handleNavigateSection = (sectionName) => {
  const target = sections.find((section) => section.name === sectionName)
  if (!target) return

  activeMenu.value = target.name

  nextTick(() => {
    const element = document.getElementById(target.slug)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

const goldPrice = ref(null)
const goldPriceLoading = ref(false)
const goldPriceError = ref('')

const projectionValue = ref(null)
const projectionLoading = ref(false)
const projectionError = ref('')
const projectionNote = ref('')

const formatCurrency = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value)

const priceCardText = computed(() => {
  if (goldPriceLoading.value) return 'Memuat...'
  if (goldPriceError.value) return 'Gagal memuat'
  if (goldPrice.value != null) return `${formatCurrency(goldPrice.value)}/gram`
  return 'Data tidak tersedia'
})

const projectionText = computed(() => {
  if (projectionLoading.value) return 'Memuat...'
  if (projectionValue.value != null) return `${formatCurrency(projectionValue.value)}/gram`
  if (projectionError.value) return projectionError.value
  return 'Data tidak tersedia'
})

const projectionGrowthText = computed(() => {
  if (projectionLoading.value || goldPriceLoading.value) return ''
  if (!projectionValue.value || !goldPrice.value) return ''

  const growthRp = projectionValue.value - goldPrice.value
  const growthPercent = ((growthRp / goldPrice.value) * 100)

  if (!Number.isFinite(growthRp) || !Number.isFinite(growthPercent)) return ''

  return `${growthPercent > 0 ? '+' : ''}${formatCurrency(growthRp)} (${growthPercent > 0 ? '+' : ''}${growthPercent.toFixed(1)}%)`
})

const projectionMessage = computed(() => projectionNote.value)

const formatPercent = (value) => {
  if (!Number.isFinite(value)) return 'Data tidak tersedia'
  return `${value > 0 ? '+' : ''}${value.toLocaleString('id-ID', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}%`
}

const yoyText = computed(() => {
  if (yoyLoading.value) return 'Memuat...'
  if (yoyError.value) return yoyError.value
  if (Number.isFinite(yoyValue.value)) return formatPercent(yoyValue.value)
  return 'Data tidak tersedia'
})

const yoySubtitle = computed(() => {
  if (yoyLoading.value || yoyError.value || !Number.isFinite(yoyValue.value)) return ''
  return 'dari 1 tahun lalu'
})

const priceCsrfToken = ref(undefined)
const yoyValue = ref(null)
const yoyLoading = ref(false)
const yoyError = ref('')
const yoyTrend = computed(() => {
  if (yoyValue.value == null || Number.isNaN(yoyValue.value)) {
    return 'neutral'
  }
  if (yoyValue.value > 0) {
    return 'positive'
  }
  if (yoyValue.value < 0) {
    return 'negative'
  }
  return 'neutral'
})

const ensurePriceCsrfToken = async () => {
  if (priceCsrfToken.value !== undefined) {
    return priceCsrfToken.value
  }

  const endpoints = ['csrf-token']
  for (const endpoint of endpoints) {
    try {
      const tokenRes = await apiFetch(endpoint, {
        method: 'GET'
      })
      if (!tokenRes.ok) {
        continue
      }
      const tokenData = await tokenRes.json().catch(() => ({}))
      const token =
        tokenData?.csrfToken ||
        tokenData?.token ||
        tokenData?.['csrf-token'] ||
        tokenRes.headers.get('X-CSRF-Token')
      if (token) {
        priceCsrfToken.value = token
        return token
      }
    } catch (error) {
      console.warn(`Gagal mengambil token CSRF via ${endpoint}:`, error)
    }
  }

  priceCsrfToken.value = null
  return priceCsrfToken.value
}

const fetchGoldPrice = async () => {
  goldPriceLoading.value = true
  goldPriceError.value = ''

  try {
    const token = await ensurePriceCsrfToken()

    const priceRes = await apiFetch('/api/emas/today', {
      method: 'GET',
      headers: token
        ? {
            'X-CSRF-Token': token
          }
        : undefined
    })

    if (!priceRes.ok) {
      throw new Error(`Gagal mengambil harga emas: ${priceRes.status}`)
    }

    const priceData = await priceRes.json()
    const hargaString = priceData?.harga_pergram_idr
    goldPrice.value = hargaString ? parseFloat(hargaString) : null
  } catch (error) {
    console.error('Fetch harga emas gagal:', error)
    goldPriceError.value = String(error.message || error)
    goldPrice.value = null
  } finally {
    goldPriceLoading.value = false
  }
}

const fetchProjection = async () => {
  projectionLoading.value = true
  projectionError.value = ''
  projectionNote.value = ''

  try {
    const res = await apiFetch('/api/simulasi/prediksi-emas?tahun_ke=3', {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    })

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      const message = data?.message || `Gagal memuat data proyeksi (${res.status})`
      throw new Error(message)
    }

    const prediction = data?.data ?? data ?? {}
    const rawValue =
      prediction?.harga_prediksi ??
      prediction?.hargaPrediksi ??
      prediction?.harga_prediksi_idr ??
      null

    const parsedValue = rawValue != null ? Number.parseFloat(rawValue) : Number.NaN

    if (!Number.isFinite(parsedValue)) {
      throw new Error('Nilai prediksi tidak ditemukan')
    }

    projectionValue.value = parsedValue
    projectionError.value = ''
  } catch (error) {
    console.error('Fetch proyeksi gagal:', error)
    projectionError.value = String(error.message || error)
    projectionValue.value = null
  } finally {
    projectionLoading.value = false
  }
}

const fetchHistoricalYoy = async () => {
  yoyLoading.value = true
  yoyError.value = ''

  try {
    const token = await ensurePriceCsrfToken()

    const res = await apiFetch('/api/emas?page=1&pageSize=400', {
      method: 'GET',
      headers: token ? { 'X-CSRF-Token': token } : undefined
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(text || `Gagal memuat data historis (${res.status})`)
    }

    const data = await res.json().catch(() => ({}))
    const records = Array.isArray(data?.data) ? data.data : []
    if (records.length < 2) {
      throw new Error('Data historis tidak cukup')
    }

    const sorted = [...records].sort(
      (a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime()
    )
    const latest = sorted[sorted.length - 1]
    const latestPrice = parseFloat(latest?.harga_pergram_idr)
    if (!Number.isFinite(latestPrice)) {
      throw new Error('Data harga terbaru tidak valid')
    }

    const targetDate = new Date(latest.tanggal)
    targetDate.setFullYear(targetDate.getFullYear() - 1)

    let closest = null
    let smallestDiff = Infinity
    sorted.forEach((item) => {
      const diff = Math.abs(new Date(item.tanggal).getTime() - targetDate.getTime())
      if (diff < smallestDiff) {
        smallestDiff = diff
        closest = item
      }
    })

    const previousPrice = parseFloat(closest?.harga_pergram_idr)
    if (!Number.isFinite(previousPrice) || previousPrice === 0) {
      throw new Error('Data harga tahun lalu tidak valid')
    }

    const change = ((latestPrice - previousPrice) / previousPrice) * 100
    yoyValue.value = change
    yoyError.value = ''
  } catch (error) {
    console.error('Fetch YoY historis gagal:', error)
    yoyError.value = 'Data tidak tersedia'
    yoyValue.value = null
  } finally {
    yoyLoading.value = false
  }
}

onMounted(() => {
  fetchGoldPrice()
  fetchProjection()
  fetchHistoricalYoy()
})

</script>

<style scoped>
</style>
