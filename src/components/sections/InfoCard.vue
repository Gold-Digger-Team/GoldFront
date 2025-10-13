<!-- src/components/sections/InfoCard.vue -->
<template>
  <article
    class="relative overflow-hidden rounded-[20px] p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
    :class="bgGradient"
  >
    <!-- Icon Background Circle -->
    <div
      class="absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-10"
      :class="iconBgColor"
    ></div>

    <!-- Content Wrapper with Flexbox -->
    <div class="flex items-center gap-4">
      <!-- Icon -->
      <div
        class="flex-shrink-0 rounded-full p-3"
        :class="iconBgColor"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="h-8 w-8"
          :class="iconColor"
          v-html="iconPath"
        />
      </div>

      <!-- Text Content -->
      <div class="flex-1">
        <!-- Title -->
        <h3 class="mb-1 text-xs font-semibold uppercase tracking-wide" :class="titleColor">
          {{ title }}
        </h3>

        <!-- Value -->
        <p class="text-xl font-bold leading-tight" :class="valueColor">
          {{ value }}
        </p>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  value: String,
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['price', 'projection', 'growth', 'default'].includes(value)
  }
})

// Icon paths as SVG path strings
const iconPath = computed(() => {
  const icons = {
    price: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />',
    projection: '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />',
    growth: '<path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />',
    default: '<path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />'
  }

  return icons[props.type] || icons.default
})

// Styling based on card type
const bgGradient = computed(() => {
  const gradients = {
    price: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 border-2 border-amber-200',
    projection: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 border-2 border-teal-200',
    growth: 'bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 border-2 border-emerald-200',
    default: 'bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200'
  }
  return gradients[props.type] || gradients.default
})

const iconBgColor = computed(() => {
  const colors = {
    price: 'bg-amber-100',
    projection: 'bg-teal-100',
    growth: 'bg-emerald-100',
    default: 'bg-slate-100'
  }
  return colors[props.type] || colors.default
})

const iconColor = computed(() => {
  const colors = {
    price: 'text-amber-600',
    projection: 'text-teal-600',
    growth: 'text-emerald-600',
    default: 'text-slate-600'
  }
  return colors[props.type] || colors.default
})

const titleColor = computed(() => {
  const colors = {
    price: 'text-amber-700',
    projection: 'text-teal-700',
    growth: 'text-emerald-700',
    default: 'text-slate-700'
  }
  return colors[props.type] || colors.default
})

const valueColor = computed(() => {
  const colors = {
    price: 'text-amber-900',
    projection: 'text-teal-900',
    growth: 'text-emerald-900',
    default: 'text-slate-900'
  }
  return colors[props.type] || colors.default
})
</script>
