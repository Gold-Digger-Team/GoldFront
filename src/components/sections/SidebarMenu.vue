<!-- src/components/sections/SidebarMenu.vue -->
<template>
  <aside
    class="relative flex h-full flex-col overflow-hidden rounded-[26px] bg-gradient-to-b from-[#1b2f47] via-[#155c6a] to-[#07b09f] text-white shadow-[0_16px_40px_rgba(9,31,34,0.22)]"
  >
    <!-- MENU ITEMS -->
    <nav class="px-8 py-10 relative">
      <!-- pill kuning (floating, mengikuti item aktif) -->
      <div
        class="absolute left-8 grid h-12 place-items-center rounded-full bg-gradient-to-r from-[#ffca28] to-[#ffb300] px-6 text-slate-900 font-semibold shadow-[0_12px_24px_rgba(255,179,0,0.35)] transition-all duration-500 ease-out pointer-events-none z-10"
        :style="{
          width: pillWidth + 'px',
          transform: `translateY(${pillOffsetY}px)`
        }"
      >
        <!-- animasi teks out-in -->
        <transition name="fade-slide" mode="out-in">
          <span :key="activeLabel" class="whitespace-nowrap px-1">
            {{ activeLabel }}
          </span>
        </transition>
      </div>

      <!-- element tersembunyi untuk ukur teks -->
      <span ref="measureEl" class="pointer-events-none absolute whitespace-nowrap px-1 opacity-0">
        {{ activeLabel }}
      </span>

      <ul class="space-y-6 relative z-0">
        <li v-for="(name, idx) in items" :key="name" ref="menuItems">
          <button
            type="button"
            :class="[
              'flex w-full items-center gap-3 rounded-full px-5 py-3 text-left text-sm transition focus:outline-none relative',
              name === activeLabel
                ? 'text-transparent font-semibold'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            ]"
            :aria-current="name === activeLabel ? 'page' : undefined"
            @click="onSelect(name, idx)"
          >
            {{ name }}
          </button>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'

const props = defineProps({
  items: { type: Array, required: true },
  modelValue: { type: String, default: '' } // v-model
})
const emit = defineEmits(['update:modelValue', 'select'])

const activeIndex = ref(0)
const activeLabel = computed(() => props.modelValue || props.items?.[0] || '')

const measureEl = ref(null)
const menuItems = ref([])
const pillWidth = ref(220) // lebar awal (akan diukur)
const pillOffsetY = ref(0) // animasi offset vertikal
const basePadding = 44 // padding horizontal total (px) untuk pill

function measure() {
  if (!measureEl.value) return
  const w = measureEl.value.offsetWidth
  pillWidth.value = Math.max(160, Math.min(w + basePadding, 320)) // clamp supaya proporsional
}

function calculatePillPosition() {
  if (!menuItems.value || menuItems.value.length === 0) return

  // Cari index item yang aktif
  const currentIndex = props.items.findIndex(item => item === activeLabel.value)
  if (currentIndex === -1) return

  // Hitung posisi berdasarkan index (tinggi button + gap)
  // tinggi button ≈ 48px (py-3 = 12px * 2 + text), gap = 24px (space-y-6)
  const buttonHeight = 48
  const gap = 24
  pillOffsetY.value = currentIndex * (buttonHeight + gap)
}

function onSelect(name, idx) {
  activeIndex.value = idx
  emit('update:modelValue', name)
  emit('select', { name, hash: `#${slugify(name)}` })
}

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
}

watch(activeLabel, async () => {
  await nextTick()
  measure()
  calculatePillPosition()
})

onMounted(() => {
  measure()
  calculatePillPosition()
})
</script>

<style scoped>
/* animasi teks di dalam pill */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
