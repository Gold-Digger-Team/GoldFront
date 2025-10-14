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

const seriesColors = ['#F9B10A', '#5DC1B4']

const timeframeConfig = {
  '3Y': {
    label: '3Y',
    categories: ['2025', '2026', '2027'],
    series: [
      { name: 'Skenario Moderat', data: [2_050_000, 2_380_000, 2_750_000] },
      { name: 'Skenario Optimistis', data: [2_250_000, 2_640_000, 3_080_000] }
    ]
  },
  '5Y': {
    label: '5Y',
    categories: ['2025', '2026', '2027', '2028', '2029'],
    series: [
      { name: 'Skenario Moderat', data: [2_000_000, 2_260_000, 2_540_000, 2_860_000, 3_190_000] },
      { name: 'Skenario Optimistis', data: [2_120_000, 2_450_000, 2_820_000, 3_270_000, 3_780_000] }
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
        name: 'Skenario Moderat',
        data: [1_980_000, 2_230_000, 2_520_000, 2_860_000, 3_240_000, 3_690_000, 4_210_000, 4_780_000, 5_420_000, 6_130_000]
      },
      {
        name: 'Skenario Optimistis',
        data: [2_120_000, 2_420_000, 2_780_000, 3_200_000, 3_690_000, 4_270_000, 4_940_000, 5_700_000, 6_570_000, 7_560_000]
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
  colors: seriesColors,
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 3 },
  markers: {
    size: 0,
    hover: { size: 7 }
  },
  xaxis: {
    categories: [],
    axisTicks: { show: false },
    axisBorder: { show: false },
    labels: {
      style: { colors: '#334155', fontWeight: 600 },
      offsetY: 4
    }
  },
  yaxis: {
    tickAmount: 4,
    labels: {
      formatter: (value) => `${Math.round(value / 1_000_000)} Jt`,
      style: { colors: '#475569', fontWeight: 600 }
    }
  },
  grid: {
    borderColor: '#C8F2EE',
    strokeDashArray: 4,
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: true } },
    padding: { left: 12, right: 12 }
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
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
  const allValues = active.series.flatMap((serie) => serie.data)
  const min = Math.min(...allValues)
  const max = Math.max(...allValues)
  const padding = Math.max(120_000, Math.round((max - min) * 0.12))
  const highlightIndex = Math.max(active.series[0].data.length - 2, 0)

  return {
    ...baseOptions,
    xaxis: {
      ...baseOptions.xaxis,
      categories: active.categories
    },
    yaxis: {
      ...baseOptions.yaxis,
      min: Math.max(0, min - padding),
      max: max + padding
    },
    markers: {
      ...baseOptions.markers,
      discrete: [
        {
          seriesIndex: 0,
          dataPointIndex: highlightIndex,
          size: 9,
          fillColor: '#FFFFFF',
          strokeColor: seriesColors[0],
          strokeWidth: 3
        }
      ]
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
