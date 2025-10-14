<template>
  <div class="bg-white text-slate-800">
    <!-- ================== NAVBAR (BCA STYLE) ================== -->
    <header class="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-8 py-3">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" aria-label="Beranda" class="inline-block">
            <img src="/src/assets/BSI (Bank Syariah Indonesia) Logo.png" class="h-10 w-auto" alt="Bank Syariah Indonesia" />
          </router-link>
        </div>

        <!-- Navigation Menu -->
        <nav class="flex items-center gap-8">
          <a href="#" class="text-sm font-medium text-slate-700 hover:text-teal-600 transition-colors duration-200">
            Beranda
          </a>
          <a href="#" class="text-sm font-medium text-slate-700 hover:text-teal-600 transition-colors duration-200">
            Produk
          </a>
          <a href="#" class="text-sm font-medium text-slate-700 hover:text-teal-600 transition-colors duration-200">
            Tentang Kami
          </a>
          <a href="#" class="text-sm font-medium text-slate-700 hover:text-teal-600 transition-colors duration-200">
            Kontak
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

    <!-- ================== HERO BANNER (SLIDER AREA) ================== -->
    <section class="relative overflow-hidden bg-slate-50">
      <div class="relative h-[320px] w-full">
        <TransitionGroup name="slide">
          <img
            v-for="(banner, index) in banners"
            v-show="currentBannerIndex === index"
            :key="index"
            :src="banner.src"
            class="absolute inset-0 h-full w-full object-cover object-center"
            :alt="banner.alt"
          />
        </TransitionGroup>

        <!-- Overlay Gradient -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

        <!-- Navigation Arrows -->
        <button
          @click="prevBanner"
          class="absolute left-6 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-800 shadow-xl backdrop-blur transition-all hover:bg-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-teal-500"
          aria-label="Banner sebelumnya"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          @click="nextBanner"
          class="absolute right-6 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-800 shadow-xl backdrop-blur transition-all hover:bg-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-teal-500"
          aria-label="Banner berikutnya"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Navigation Dots -->
        <div class="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          <button
            v-for="(_, index) in banners"
            :key="index"
            @click="currentBannerIndex = index"
            class="transition-all duration-300"
            :class="currentBannerIndex === index
              ? 'h-2.5 w-10 rounded-full bg-white shadow-lg'
              : 'h-2.5 w-2.5 rounded-full bg-white/60 hover:bg-white/90'"
            :aria-label="`Go to banner ${index + 1}`"
          ></button>
        </div>
      </div>
    </section>

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
      />
        <InfoCard
          type="growth"
          title="Year-on-year Growth"
          :value="yoyText"
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
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import BSIGoldHero from '../components/BSIGoldHero.vue'
import InfoCard from '../components/sections/InfoCard.vue'
import SidebarMenu from '../components/sections/SidebarMenu.vue'
import AppFooter from '../components/AppFooter.vue'
import HargaEmas from './HargaEmas.vue'
import PrediksiKeuntungan from './PrediksiKeuntungan.vue'
import KalkulatorCicilEmas from './KalkulatorCicilEmas.vue'
import BukaCicilEmas from './BukaCicilEmas.vue'

// Banner slider setup
const banners = [
  { src: '/src/assets/banner1.svg', alt: 'Banner 1' },
  { src: '/src/assets/banner2.svg', alt: 'Banner 2' }
]
const currentBannerIndex = ref(0)
let bannerInterval = null

// Auto-slide banners every 5 seconds
const startBannerSlider = () => {
  bannerInterval = setInterval(() => {
    currentBannerIndex.value = (currentBannerIndex.value + 1) % banners.length
  }, 5000)
}

const stopBannerSlider = () => {
  if (bannerInterval) {
    clearInterval(bannerInterval)
    bannerInterval = null
  }
}

const nextBanner = () => {
  currentBannerIndex.value = (currentBannerIndex.value + 1) % banners.length
  stopBannerSlider()
  startBannerSlider()
}

const prevBanner = () => {
  currentBannerIndex.value = (currentBannerIndex.value - 1 + banners.length) % banners.length
  stopBannerSlider()
  startBannerSlider()
}

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
  if (yoyValue.value != null) return formatPercent(yoyValue.value)
  return 'Data tidak tersedia'
})

const priceCsrfToken = ref(undefined)
const yoyValue = ref(null)
const yoyLoading = ref(false)
const yoyError = ref('')

const ensurePriceCsrfToken = async () => {
  if (priceCsrfToken.value !== undefined) {
    return priceCsrfToken.value
  }

  const endpoints = ['csrf-token']
  for (const endpoint of endpoints) {
    try {
      const tokenRes = await fetch(`http://192.168.23.22:3001/${endpoint}`, {
        method: 'GET',
        credentials: 'include'
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

    const priceRes = await fetch('http://192.168.23.22:3001/api/emas/today', {
      method: 'GET',
      credentials: 'include',
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
    const res = await fetch('http://192.168.23.22:5001/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok && res.status !== 202) {
      const text = data?.message || (await res.text())
      throw new Error(text || `HTTP ${res.status}`)
    }

    const list = data?.prediction
    const firstPrediction = Array.isArray(list)
      ? list[2]?.predicted_price ?? list[2]
      : data?.prediction ?? data?.value ?? null

    if (typeof firstPrediction === 'number' && !Number.isNaN(firstPrediction)) {
      projectionValue.value = firstPrediction
      projectionError.value = ''
      projectionNote.value = res.status === 202 ? (data?.message || '') : ''
    } else {
      throw new Error('Nilai prediksi tidak ditemukan')
    }
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

    const res = await fetch('http://192.168.23.22:3001/api/emas?page=1&pageSize=400', {
      method: 'GET',
      credentials: 'include',
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
  startBannerSlider()
  fetchGoldPrice()
  fetchProjection()
  fetchHistoricalYoy()
})

onUnmounted(() => {
  stopBannerSlider()
})

</script>

<style scoped>
/* Banner Slider Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.8s ease-in-out;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
