<template>
  <section
    class="relative flex h-full w-full flex-1 flex-col overflow-hidden rounded-[28px] border-[5px] border-[#1BC0B7] bg-white px-6 pb-6 pt-16 shadow-[0_18px_48px_rgba(16,24,40,0.08)]"
  >
    <header class="absolute left-1/2 top-0 translate-y-0 -translate-x-1/2">
      <div class="rounded-b-[24px] bg-gradient-to-r from-yellow-400 to-amber-400 px-6 py-2 text-lg font-semibold text-white">
        Histori Harga Emas
      </div>
    </header>

    <div class="flex flex-wrap items-end justify-between gap-3 text-[--color-text]">
      <div class="flex flex-wrap items-end gap-3">
        <h2 class="text-3xl font-semibold">{{ formatCurrency(latestPrice) }}</h2>
        <span
          class="rounded-full px-3 py-1 text-xs font-medium"
          :class="headlineChange >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'"
        >
          {{ formatChange(headlineChange) }} vs awal periode
        </span>
      </div>

      <div class="inline-flex gap-1.5 rounded-full bg-[#BCE7E3] p-1 text-xs font-medium text-slate-600">
        <button
          v-for="timeframe in timeframeList"
          :key="timeframe.key"
          type="button"
          class="rounded-full px-3 py-1.5 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1BC0B7]"
          :class="
            timeframe.key === selectedRange
              ? 'bg-[#788C92] text-white shadow'
              : 'text-slate-700 hover:bg-white/70'
          "
          @click="selectedRange = timeframe.key"
        >
          {{ timeframe.label }}
        </button>
      </div>
    </div>

    <div class="mt-4 w-full" style="height: 240px;">
      <apexchart type="area" height="240" :options="chartOptions" :series="chartSeries"></apexchart>
    </div>

    <div class="mt-4 grid gap-3 sm:grid-cols-3">
      <div class="rounded-2xl bg-[#E6F7F5] px-4 py-3 text-slate-700 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Rata-rata</p>
        <p class="mt-1.5 text-xl font-semibold">{{ formatCurrency(stats.avg) }}</p>
      </div>
      <div class="rounded-2xl bg-[#FEF3C7] px-4 py-3 text-slate-700 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Tertinggi</p>
        <p class="mt-1.5 text-xl font-semibold">{{ formatCurrency(stats.max) }}</p>
      </div>
      <div class="rounded-2xl bg-[#F1F5F9] px-4 py-3 text-slate-700 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Terendah</p>
        <p class="mt-1.5 text-xl font-semibold">{{ formatCurrency(stats.min) }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'

const timeframeConfig = {
  '5Y': {
    label: '5Y',
    categories: ['2021', '2022', '2023', '2024', '2025'],
    seriesData: [1_100_000, 1_400_000, 1_900_000, 2_800_000, 3_400_000]
  },
  '1Y': {
    label: '1Y',
    categories: ["Nov '23", "Jan '24", "Mar '24", "May '24", "Jul '24", "Sep '24", "Nov '24"],
    seriesData: [1_520_000, 1_640_000, 1_720_000, 1_810_000, 1_880_000, 1_930_000, 1_980_000]
  },
  '1M': {
    label: '1M',
    categories: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
    seriesData: [1_940_000, 1_955_000, 1_968_000, 1_982_000]
  }
}

const baseOptions = {
  chart: {
    toolbar: { show: false },
    animations: { enabled: true },
    zoom: { enabled: false },
    fontFamily: 'inherit',
    width: '100%'
  },
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 3 },
  colors: ['#FFB70F'],
  xaxis: {
    categories: [],
    axisTicks: { show: false },
    labels: {
      style: { colors: '#475569', fontWeight: 600 }
    }
  },
  yaxis: {
    labels: {
      formatter: (v) => `${(v / 1_000_000).toFixed(0)} Jt`,
      style: { colors: '#64748b' }
    }
  },
  grid: {
    borderColor: '#C8F2EE',
    strokeDashArray: 6
  },
  fill: {
    type: 'gradient',
    gradient: {
      opacityFrom: 0.45,
      opacityTo: 0.05
    }
  },
  tooltip: {
    y: {
      formatter: (v) =>
        new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          maximumFractionDigits: 0
        }).format(v)
    }
  }
}

const timeframeList = computed(() =>
  Object.entries(timeframeConfig).map(([key, config]) => ({
    key,
    label: config.label
  }))
)

const selectedRange = ref(timeframeList.value[0]?.key ?? '5Y')

const chartOptions = computed(() => {
  const active = timeframeConfig[selectedRange.value]

  return {
    ...baseOptions,
    xaxis: {
      ...baseOptions.xaxis,
      categories: active.categories
    }
  }
})

const chartSeries = computed(() => [
  {
    name: 'Harga Emas',
    data: timeframeConfig[selectedRange.value].seriesData
  }
])

const latestPrice = computed(() => {
  const data = timeframeConfig[selectedRange.value].seriesData
  return data[data.length - 1]
})

const headlineChange = computed(() => {
  const data = timeframeConfig[selectedRange.value].seriesData
  const first = data[0]
  const last = data[data.length - 1]
  return first === 0 ? 0 : (last - first) / first
})

const stats = computed(() => {
  const data = timeframeConfig[selectedRange.value].seriesData
  const min = Math.min(...data)
  const max = Math.max(...data)
  const avg = data.reduce((acc, val) => acc + val, 0) / data.length

  return { min, max, avg }
})

const formatCurrency = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value)

const formatChange = (value) => `${value > 0 ? '+' : ''}${(value * 100).toFixed(1)}%`
</script>
