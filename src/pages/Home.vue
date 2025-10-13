<template>
  <div class="bg-white text-slate-800">
    <!-- ================== NAVBAR (BCA STYLE) ================== -->
    <header class="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-8 py-3">
        <!-- Logo -->
        <div class="flex items-center">
          <img src="/src/assets/BSI (Bank Syariah Indonesia) Logo.png" class="h-10 w-auto" alt="Bank Syariah Indonesia" />
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

        <!-- Navigation Dots -->
        <div class="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          <button
            v-for="(_, index) in banners"
            :key="index"
            @click="currentBannerIndex = index"
            class="h-2 w-2 rounded-full transition-all duration-300"
            :class="currentBannerIndex === index ? 'bg-teal-600 w-8' : 'bg-slate-400 hover:bg-slate-500'"
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
      <section class="grid gap-6 md:grid-cols-3">
        <InfoCard
          type="price"
          title="Harga Emas Saat Ini"
          value="Rp 2.300.000/gram"
        />
        <InfoCard
          type="projection"
          title="Proyeksi 1 Tahun"
          value="Rp 2.700.000/gram"
        />
        <InfoCard
          type="growth"
          title="Year-on-year Growth"
          value="+6.35%"
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
import { computed, onMounted, onUnmounted, ref } from 'vue'
import InfoCard from '../components/sections/InfoCard.vue'
import SidebarMenu from '../components/sections/SidebarMenu.vue'
import AppFooter from '../components/AppFooter.vue'
import BSIGoldHero from '../components/BSIGoldHero.vue'
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

onMounted(() => {
  startBannerSlider()
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
