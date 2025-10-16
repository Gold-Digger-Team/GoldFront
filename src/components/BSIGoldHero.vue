<template>
  <section class="relative overflow-hidden rounded-2xl shadow-2xl">
    <transition-group name="fade-slide" tag="div" class="relative block min-h-[460px]">
      <!-- Individual Slides -->
      <div
        v-for="(slide, index) in slides"
        v-show="index === activeIndex"
        :key="slide.id"
        class="absolute inset-0 w-full"
      >
        <!-- Image-only slide (for promotional banners) -->
        <div v-if="slide.imageOnly" class="relative h-full w-full min-h-[460px] flex items-center justify-center bg-gradient-to-br from-[#0d7377] via-[#14919b] to-[#0d7377] p-8 sm:p-10 md:p-12 lg:p-16">
          <div class="w-full h-[380px] overflow-hidden rounded-3xl shadow-2xl">
            <img
              :src="slide.image"
              :alt="slide.alt"
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <!-- Content slide with text and image -->
        <article
          v-else
          class="flex h-full min-h-[460px] w-full items-center bg-gradient-to-br from-[#0d7377] via-[#14919b] to-[#0d7377] px-6 py-12 pb-20 sm:px-8 md:px-12 lg:px-16"
        >
          <div class="flex h-full w-full flex-col-reverse items-center gap-8 md:flex-row md:items-center md:gap-10 lg:gap-16">
            <!-- Image Section -->
            <figure
              class="w-full flex-shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 p-1.5 shadow-2xl md:w-[360px] lg:w-[420px]"
            >
              <div class="overflow-hidden rounded-xl bg-white/5">
                <img
                  :src="slide.image"
                  :alt="slide.title"
                  class="h-full w-full object-cover aspect-[4/3] transform transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
              </div>
            </figure>

            <!-- Content Section -->
            <div class="flex-1 space-y-5 text-left text-white pb-4">
              <!-- Subtitle Badge -->
              <div class="inline-flex items-center gap-2 rounded-full bg-teal-500/20 px-4 py-1.5 backdrop-blur-sm">
                <div class="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></div>
                <p class="text-xs font-semibold uppercase tracking-wider text-teal-100">
                  {{ slide.subtitle }}
                </p>
              </div>

              <!-- Title -->
              <h2 class="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                {{ slide.title }}
              </h2>

              <!-- Highlights List -->
              <ul v-if="slide.highlights?.length" class="space-y-3 pt-2">
                <li
                  v-for="line in slide.highlights"
                  :key="line"
                  class="flex items-start gap-3 text-sm md:text-base"
                >
                  <span class="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-400 shadow-lg shadow-amber-400/30">
                    <svg class="h-3.5 w-3.5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span class="flex-1 font-medium leading-relaxed text-white/95">{{ line }}</span>
                </li>
              </ul>

              <!-- Description -->
              <p v-if="slide.description" class="max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
                {{ slide.description }}
              </p>
            </div>
          </div>
        </article>
      </div>
    </transition-group>

    <!-- Navigation Buttons -->
    <button
      type="button"
      class="absolute left-4 top-1/2 z-20 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-white/95 text-slate-800 shadow-xl backdrop-blur-md transition-all duration-200 hover:bg-white hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/60 disabled:opacity-50 disabled:cursor-not-allowed"
      @click="prev"
      aria-label="Slide sebelumnya"
    >
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <button
      type="button"
      class="absolute right-4 top-1/2 z-20 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-white/95 text-slate-800 shadow-xl backdrop-blur-md transition-all duration-200 hover:bg-white hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/60 disabled:opacity-50 disabled:cursor-not-allowed"
      @click="next"
      aria-label="Slide berikutnya"
    >
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>

    <!-- Progress Indicators (Dots) -->
    <div class="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-black/20 px-4 py-2.5 backdrop-blur-md">
      <button
        v-for="(slide, index) in slides"
        :key="slide.id + '-dot'"
        type="button"
        class="group relative transition-all duration-300 ease-out"
        :class="index === activeIndex ? 'w-10' : 'w-2.5'"
        @click="goTo(index)"
        :aria-label="`Pergi ke slide ${index + 1}`"
        :aria-current="index === activeIndex ? 'true' : 'false'"
      >
        <div
          class="h-2.5 w-full rounded-full transition-all duration-300"
          :class="index === activeIndex
            ? 'bg-amber-400 shadow-lg shadow-amber-400/50'
            : 'bg-white/40 group-hover:bg-white/70'"
        ></div>
        <!-- Progress bar for active slide -->
        <div
          v-if="index === activeIndex"
          class="absolute inset-0 overflow-hidden rounded-full"
        >
          <div
            class="h-full bg-amber-300 rounded-full animate-progress"
            :style="{ animationDuration: `${autoplayDuration}ms` }"
          ></div>
        </div>
      </button>
    </div>

  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const slides = [
  // Slide 1: Banner (Image only)
  {
    id: 'cicil-emas',
    imageOnly: false,
    title: 'Cicil Emas BSI',
    subtitle: 'Produk Unggulan',
    description:
      'Nikmati kemudahan mencicil emas mulai dari 5 gram dengan proses cepat dan aman.',
    highlights: ['Emas Murni 99,99%', 'Bullion Protect, Emas Terjamin Asli', 'Harga Buyback Kompetitif'],
    image: '/assets/emas.png'
  },
  // Slide 2: Content
  {
    id: 'banner-1',
    imageOnly: true,
    image: '/assets/banner1.svg',
    alt: 'Promosi Bank Syariah Indonesia 1'
  },
  // Slide 3: Banner (Image only)
  {
    id: 'invest-emas',
    imageOnly: false,
    title: 'Investasi Emas Lebih Pasti',
    subtitle: 'Investasi Berkelanjutan',
    description: 'Monitor harga emas real time dan rencanakan pembelian reguler otomatis setiap bulan.',
    highlights: ['Harga live update harian', 'Auto debet bulanan', 'Konsultasi finansial pribadi'],
    image: '/assets/emas.png'
  },
  // Slide 4: Content
  {
    id: 'banner-2',
    imageOnly: true,
    image: '/assets/banner2.svg',
    alt: 'Promosi Bank Syariah Indonesia 2'
  },
  // Slide 5: Content
  {
    id: 'prioritas',
    imageOnly: false,
    title: 'BSI Gold Prioritas',
    subtitle: 'Nasabah Prioritas',
    description:
      'Fasilitas penyimpanan aman, relationship manager pribadi, dan promo emas eksklusif untuk Anda.',
    highlights: ['Safe deposit box eksklusif', 'Layanan 24/7', 'Akses Lounge Exclusive'],
    image: '/assets/Gambar BSI Gold.png'
  }
]

const activeIndex = ref(0)
const autoplayDuration = 7000 // 7 seconds
let timer = null

const next = () => {
  activeIndex.value = (activeIndex.value + 1) % slides.length
  resetInterval()
}

const prev = () => {
  activeIndex.value = (activeIndex.value - 1 + slides.length) % slides.length
  resetInterval()
}

const goTo = (index) => {
  activeIndex.value = index
  resetInterval()
}

const resetInterval = () => {
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % slides.length
  }, autoplayDuration)
}

onMounted(() => {
  resetInterval()
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
/* Smooth fade-slide transitions */
.fade-slide-enter-active {
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.fade-slide-leave-active {
  transition: opacity 0.4s ease-in, transform 0.4s ease-in;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}

/* Progress bar animation */
@keyframes progress {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}

.animate-progress {
  animation: progress linear;
  animation-fill-mode: forwards;
}

/* Pulse animation for badge dot */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Smooth hover transitions */
button {
  -webkit-tap-highlight-color: transparent;
}

/* Accessibility: Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
