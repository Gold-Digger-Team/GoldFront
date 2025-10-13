<template>
  <section
    class="relative flex h-full w-full flex-1 flex-col overflow-hidden rounded-[28px] border-[5px] border-[#1BC0B7] bg-white px-6 pb-6 pt-16 shadow-[0_18px_48px_rgba(16,24,40,0.08)]"
  >
    <header class="absolute left-1/2 top-0 translate-y-0 -translate-x-1/2">
      <div class="rounded-b-[24px] bg-gradient-to-r from-yellow-400 to-amber-400 px-6 py-2 text-lg font-semibold text-white">
        Prediksi Harga Emas
      </div>
    </header>

    <div class="flex flex-wrap items-center justify-between gap-3 text-[--color-text]">
      <p class="text-sm text-slate-600">
        Proyeksi harga emas berdasarkan skenario ekonomi dan tren historis.
      </p>
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
      <apexchart type="line" height="240" :options="chartOptions" :series="chartSeries"></apexchart>
    </div>

    <div class="mt-4 grid gap-3 sm:grid-cols-2">
      <div
        v-for="projection in projectionSummary"
        :key="projection.name"
        class="rounded-2xl bg-[#F1F5F9] px-4 py-3 text-slate-700 shadow-sm"
      >
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {{ projection.name }}
        </p>
        <p class="mt-1.5 text-xl font-semibold">{{ formatCurrency(projection.latest) }}</p>
        <p class="mt-1 text-xs text-slate-500">
          Perubahan {{ formatChange(projection.growth) }} 
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'

const timeframeConfig = {
  '3Y': {
    label: '3Y',
    categories: ['2025', '2026', '2027'],
    series: [
      { name: 'Skenario A', data: [1_680_000, 1_820_000, 1_980_000] },
      { name: 'Skenario B', data: [1_760_000, 1_940_000, 2_150_000] }
    ]
  },
  '5Y': {
    label: '5Y',
    categories: ['2025', '2026', '2027', '2028', '2029'],
    series: [
      { name: 'Skenario A', data: [1_600_000, 1_750_000, 1_920_000, 2_110_000, 2_320_000] },
      { name: 'Skenario B', data: [1_700_000, 1_900_000, 2_120_000, 2_360_000, 2_620_000] }
    ]
  },
  '10Y': {
    label: '10Y',
    categories: [
      '2025',
      '2026',
      '2027',
      '2028',
      '2029',
      '2030',
      '2031',
      '2032',
      '2033',
      '2034'
    ],
    series: [
      {
        name: 'Skenario A',
        data: [1_550_000, 1_680_000, 1_840_000, 2_020_000, 2_230_000, 2_460_000, 2_710_000, 2_980_000, 3_260_000, 3_560_000]
      },
      {
        name: 'Skenario B',
        data: [1_650_000, 1_820_000, 2_020_000, 2_250_000, 2_510_000, 2_800_000, 3_120_000, 3_470_000, 3_850_000, 4_260_000]
      }
    ]
  }
}

const baseOptions = {
  chart: {
    toolbar: { show: false },
    zoom: { enabled: false },
    fontFamily: 'inherit',
    width: '100%'
  },
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 3 },
  colors: ['#FFB70F', '#1DA69D'],
  xaxis: {
    categories: [],
    axisTicks: { show: false },
    labels: { style: { colors: '#475569', fontWeight: 600 } }
  },
  yaxis: {
    labels: {
      formatter: (value) => `${(value / 1_000_000).toFixed(0)} Jt`,
      style: { colors: '#64748b' }
    }
  },
  grid: {
    borderColor: '#E2E8F0',
    strokeDashArray: 6
  },
  legend: {
    position: 'top',
    horizontalAlign: 'center',
    fontWeight: 600,
    markers: {
      width: 12,
      height: 12,
      radius: 12
    }
  },
  tooltip: {
    shared: true,
    intersect: false,
    y: {
      formatter: (value) =>
        new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          maximumFractionDigits: 0
        }).format(value)
    }
  }
}

const timeframeList = computed(() =>
  Object.entries(timeframeConfig).map(([key, config]) => ({ key, label: config.label }))
)

const selectedRange = ref(timeframeList.value[1]?.key ?? '5Y')

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

const chartSeries = computed(() => timeframeConfig[selectedRange.value].series)

const projectionSummary = computed(() => {
  const activeSeries = timeframeConfig[selectedRange.value].series
  return activeSeries.map((series) => {
    const data = series.data
    const first = data[0]
    const last = data[data.length - 1]

    return {
      name: series.name,
      latest: last,
      growth: first === 0 ? 0 : (last - first) / first
    }
  })
})

const formatCurrency = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value)

const formatChange = (value) => `${value > 0 ? '+' : ''}${(value * 100).toFixed(1)}%`
</script>
