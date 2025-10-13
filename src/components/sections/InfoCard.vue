<!-- src/components/sections/InfoCard.vue -->
<template>
  <article
    class="rounded-xl border-3 p-4 shadow-sm transition-all duration-300 hover:shadow-md"
    :class="cardStyles"
  >
    <!-- Content Wrapper with Flexbox -->
    <div class="flex items-center gap-3">
      <!-- Icon -->
      <div
        class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
        :class="iconBgColor"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2.5"
          stroke="currentColor"
          class="h-5 w-5"
          :class="iconColor"
          v-html="iconPath"
        />
      </div>

      <!-- Text Content -->
      <div class="flex-1 min-w-0">
        <!-- Title -->
        <h3 class="text-xs font-semibold md:text-sm" :class="titleColor">
          {{ title }}
        </h3>

        <!-- Value -->
        <p class="mt-0.5 text-base font-bold md:text-lg truncate" :class="valueColor">
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
    price: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>',
    projection: '<path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>',
    growth: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>',
    default: '<path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />'
  }

  return icons[props.type] || icons.default
})

// Styling based on card type (Yellow, Purple, Gray)
const cardStyles = computed(() => {
  const styles = {
    price: 'bg-yellow-50 border-yellow-400',
    projection: 'bg-purple-50 border-purple-400',
    growth: 'bg-gray-100 border-gray-400',
    default: 'bg-slate-50 border-slate-300'
  }
  return styles[props.type] || styles.default
})

const iconBgColor = computed(() => {
  const colors = {
    price: 'bg-yellow-400',
    projection: 'bg-purple-400',
    growth: 'bg-gray-300',
    default: 'bg-slate-300'
  }
  return colors[props.type] || colors.default
})

const iconColor = computed(() => {
  const colors = {
    price: 'text-yellow-700',
    projection: 'text-purple-700',
    growth: 'text-gray-700',
    default: 'text-slate-700'
  }
  return colors[props.type] || colors.default
})

const titleColor = computed(() => {
  const colors = {
    price: 'text-yellow-700',
    projection: 'text-purple-700',
    growth: 'text-gray-700',
    default: 'text-slate-700'
  }
  return colors[props.type] || colors.default
})

const valueColor = computed(() => {
  const colors = {
    price: 'text-yellow-600',
    projection: 'text-purple-600',
    growth: 'text-gray-600',
    default: 'text-slate-600'
  }
  return colors[props.type] || colors.default
})
</script>
