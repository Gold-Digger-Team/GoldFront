<template>
  <section
    class="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0d7377] via-[#14919b] to-[#0d7377] text-white shadow-xl"
  >
    <transition-group name="fade-slide" tag="div" class="relative block h-full min-h-[340px]">
      <article
        v-for="(slide, index) in slides"
        :key="slide.id"
        v-show="index === activeIndex"
        class="absolute inset-0 flex h-full w-full items-center px-8 py-10 md:px-12"
      >
        <div class="flex h-full w-full flex-col-reverse gap-8 md:flex-row md:items-center md:gap-12">
          <!-- Image Section -->
          <figure
            class="w-full overflow-hidden rounded-[20px] bg-gradient-to-br from-white/10 to-white/5 p-1 shadow-2xl md:w-[380px]"
          >
            <div class="overflow-hidden rounded-[16px]">
              <img :src="slide.image" :alt="slide.title" class="h-full w-full object-cover aspect-[4/3]" />
            </div>
          </figure>

          <!-- Content Section -->
          <div class="flex-1 space-y-4 text-left">
            <p class="text-xs font-semibold uppercase tracking-wider text-teal-200">
              {{ slide.subtitle }}
            </p>

            <h2 class="text-3xl font-extrabold leading-[1.2] md:text-4xl">
              {{ slide.title }}
            </h2>

            <ul v-if="slide.highlights?.length" class="space-y-2">
              <li
                v-for="line in slide.highlights"
                :key="line"
                class="flex items-start gap-3 text-sm md:text-base"
              >
                <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400">
                  <svg class="h-3 w-3 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span class="font-medium leading-relaxed">{{ line }}</span>
              </li>
            </ul>

            <p v-if="slide.description" class="text-sm leading-relaxed text-white/90 md:text-base max-w-xl">
              {{ slide.description }}
            </p>
          </div>
        </div>
      </article>
    </transition-group>

    <!-- Navigation Buttons -->
    <button
      type="button"
      class="absolute left-6 top-1/2 z-20 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-white/95 text-xl text-slate-800 shadow-lg backdrop-blur transition-all hover:bg-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
      @click="prev"
      aria-label="Slide sebelumnya"
    >
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <button
      type="button"
      class="absolute right-6 top-1/2 z-20 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-white/95 text-xl text-slate-800 shadow-lg backdrop-blur transition-all hover:bg-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
      @click="next"
      aria-label="Slide berikutnya"
    >
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
      </svg>
    </button>

    <!-- Dots Indicator -->
    <div class="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
      <button
        v-for="(slide, index) in slides"
        :key="slide.id + '-dot'"
        type="button"
        class="transition-all duration-300"
        :class="index === activeIndex
          ? 'h-2 w-8 rounded-full bg-amber-400'
          : 'h-2 w-2 rounded-full bg-white/50 hover:bg-white/80'"
        @click="goTo(index)"
        :aria-label="`Slide ${index + 1}`"
      ></button>
    </div>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const slides = [
  {
    id: 'cicil-emas',
    title: 'Cicil Emas BSI',
    subtitle: 'Produk Unggulan',
    description:
      'Nikmati kemudahan mencicil emas mulai dari 5 gram dengan proses cepat dan aman.',
    cta: 'Informasi Selengkapnya',
    highlights: ['Emas Murni 99,99%', 'Bullion Protect, Emas Terjamin Asli', 'Harga Buyback Kompetitif'],
    image: '/assets/emas.png',
    logos: [{ src: '/assets/bsi-logo.png', alt: 'Bank Syariah Indonesia' }]
  },
  {
    id: 'invest-emas',
    title: 'Investasi Emas Lebih Pasti',
    subtitle: 'Investasi Berkelanjutan',
    description: 'Monitor harga emas real time dan rencanakan pembelian reguler otomatis setiap bulan.',
    cta: 'Lihat Produk',
    highlights: ['Harga live update harian', 'Auto debet bulanan', 'Konsultasi finansial pribadi'],
    image: '/assets/emas.png',
    logos: [{ src: '/assets/bsi-logo.png', alt: 'Bank Syariah Indonesia' }]
  },
  {
    id: 'prioritas',
    title: 'BSI Gold Prioritas',
    subtitle: 'Nasabah Prioritas',
    description:
      'Fasilitas penyimpanan aman, relationship manager pribadi, dan promo emas eksklusif untuk Anda.',
    cta: 'Daftar Prioritas',
    highlights: ['Safe deposit box eksklusif', 'Layanan 24/7', 'Akses promo premium'],
    image: '/assets/Gambar BSI Gold.png',
    logos: [{ src: '/assets/bsi-logo.png', alt: 'Bank Syariah Indonesia' }]
  }
]

const activeIndex = ref(0)
let timer = null

const next = () => {
  activeIndex.value = (activeIndex.value + 1) % slides.length
}
const prev = () => {
  activeIndex.value = (activeIndex.value - 1 + slides.length) % slides.length
}
const goTo = (index) => {
  activeIndex.value = index
  resetInterval()
}

const resetInterval = () => {
  if (timer) clearInterval(timer)
  timer = setInterval(next, 7000)
}

onMounted(() => {
  resetInterval()
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.45s ease, transform 0.45s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(24px);
}
</style>
