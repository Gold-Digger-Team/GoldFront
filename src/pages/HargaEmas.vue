<template>
  <section
    class="relative flex h-full w-full flex-1 flex-col overflow-hidden rounded-[28px] border-[5px] border-[#1BC0B7] bg-white px-6 pb-6 pt-16 shadow-[0_18px_48px_rgba(16,24,40,0.08)]"
  >
    <header class="absolute left-1/2 top-0 translate-y-0 -translate-x-1/2">
      <div class="rounded-b-[24px] bg-gradient-to-r from-yellow-400 to-amber-400 px-6 py-2 text-lg font-semibold text-white">
        Harga Emas
      </div>
    </header>

    <div class="mb-4 flex justify-center gap-2">
      <button
        type="button"
        class="rounded-lg px-6 py-2.5 text-sm font-semibold transition-all duration-200"
        :class="activeTab === 'histori'
          ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-white shadow-md'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
        @click="activeTab = 'histori'"
      >
        Histori Harga Emas
      </button>
      <button
        type="button"
        class="rounded-lg px-6 py-2.5 text-sm font-semibold transition-all duration-200"
        :class="activeTab === 'prediksi'
          ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-white shadow-md'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
        @click="activeTab = 'prediksi'"
      >
        Prediksi Harga Emas
      </button>
    </div>

    <div v-if="activeTab === 'histori'" class="flex flex-1 flex-col">
      <div class="flex flex-wrap items-end justify-between gap-3 text-[--color-text]">
        <div class="flex flex-wrap items-end gap-3">
          <h2 class="text-3xl font-semibold">{{ formatCurrency(latestPriceHistori) }}</h2>
          <span
            class="rounded-full px-3 py-1 text-xs font-medium"
            :class="headlineChangeHistori >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'"
          >
            {{ formatChange(headlineChangeHistori) }} 
          </span>
        </div>

        <div class="inline-flex gap-1.5 rounded-full bg-[#BCE7E3] p-1 text-xs font-medium text-slate-600">
          <button
            v-for="timeframe in timeframeListHistori"
            :key="timeframe.key"
            type="button"
            class="rounded-full px-3 py-1.5 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1BC0B7]"
            :class="
              timeframe.key === selectedRangeHistori
                ? 'bg-[#788C92] text-white shadow'
                : 'text-slate-700 hover:bg-white/70'
            "
            @click="selectedRangeHistori = timeframe.key"
          >
            {{ timeframe.label }}
          </button>
        </div>
      </div>

      <div class="mt-4 w-full" style="height: 240px;">
        <apexchart type="area" height="240" :options="chartOptionsHistori" :series="chartSeriesHistori"></apexchart>
      </div>

      <div class="mt-4 grid gap-3 sm:grid-cols-3">
        <div class="rounded-2xl bg-[#E6F7F5] px-4 py-3 text-slate-700 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Rata-rata</p>
          <p class="mt-1.5 text-xl font-semibold">{{ formatCurrency(statsHistori.avg) }}</p>
        </div>
        <div class="rounded-2xl bg-[#FEF3C7] px-4 py-3 text-slate-700 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Tertinggi</p>
          <p class="mt-1.5 text-xl font-semibold">{{ formatCurrency(statsHistori.max) }}</p>
        </div>
        <div class="rounded-2xl bg-[#F1F5F9] px-4 py-3 text-slate-700 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Terendah</p>
          <p class="mt-1.5 text-xl font-semibold">{{ formatCurrency(statsHistori.min) }}</p>
        </div>
      </div>
    </div>

    <!-- Prediksi Content -->
    <div v-else class="flex flex-1 flex-col">
      <div class="flex flex-wrap items-center justify-between gap-3 text-[--color-text]">
        <p class="text-sm text-slate-600">
          Proyeksi harga emas berdasarkan skenario ekonomi dan tren historis.
        </p>
        <div class="inline-flex gap-1.5 rounded-full bg-[#BCE7E3] p-1 text-xs font-medium text-slate-600">
          <button
            v-for="timeframe in timeframeListPrediksi"
            :key="timeframe.key"
            type="button"
            class="rounded-full px-3 py-1.5 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1BC0B7]"
            :class="
              timeframe.key === selectedRangePrediksi
                ? 'bg-[#788C92] text-white shadow'
                : 'text-slate-700 hover:bg-white/70'
            "
            @click="selectedRangePrediksi = timeframe.key"
          >
            {{ timeframe.label }}
          </button>
        </div>
      </div>

      <div class="mt-4 w-full" style="height: 240px;">
        <apexchart type="line" height="240" :options="chartOptionsPrediksi" :series="chartSeriesPrediksi"></apexchart>
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
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'

// Tab state
const activeTab = ref('histori')

// ==================== HISTORI DATA ====================
const timeframeConfigHistori = {
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

const baseOptionsHistori = {
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

const timeframeListHistori = computed(() =>
  Object.entries(timeframeConfigHistori).map(([key, config]) => ({
    key,
    label: config.label
  }))
)

const selectedRangeHistori = ref(timeframeListHistori.value[0]?.key ?? '5Y')

const chartOptionsHistori = computed(() => {
  const active = timeframeConfigHistori[selectedRangeHistori.value]

  return {
    ...baseOptionsHistori,
    xaxis: {
      ...baseOptionsHistori.xaxis,
      categories: active.categories
    }
  }
})

const chartSeriesHistori = computed(() => [
  {
    name: 'Harga Emas',
    data: timeframeConfigHistori[selectedRangeHistori.value].seriesData
  }
])

const latestPriceHistori = computed(() => {
  const data = timeframeConfigHistori[selectedRangeHistori.value].seriesData
  return data[data.length - 1]
})

const headlineChangeHistori = computed(() => {
  const data = timeframeConfigHistori[selectedRangeHistori.value].seriesData
  const first = data[0]
  const last = data[data.length - 1]
  return first === 0 ? 0 : (last - first) / first
})

const statsHistori = computed(() => {
  const data = timeframeConfigHistori[selectedRangeHistori.value].seriesData
  const min = Math.min(...data)
  const max = Math.max(...data)
  const avg = data.reduce((acc, val) => acc + val, 0) / data.length

  return { min, max, avg }
})

// ==================== PREDIKSI DATA ====================
const timeframeConfigPrediksi = {
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

const baseOptionsPrediksi = {
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

const timeframeListPrediksi = computed(() =>
  Object.entries(timeframeConfigPrediksi).map(([key, config]) => ({ key, label: config.label }))
)

const selectedRangePrediksi = ref(timeframeListPrediksi.value[1]?.key ?? '5Y')

const chartOptionsPrediksi = computed(() => {
  const active = timeframeConfigPrediksi[selectedRangePrediksi.value]

  return {
    ...baseOptionsPrediksi,
    xaxis: {
      ...baseOptionsPrediksi.xaxis,
      categories: active.categories
    }
  }
})

const chartSeriesPrediksi = computed(() => timeframeConfigPrediksi[selectedRangePrediksi.value].series)

const projectionSummary = computed(() => {
  const activeSeries = timeframeConfigPrediksi[selectedRangePrediksi.value].series
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

// ==================== COMMON FUNCTIONS ====================
const formatCurrency = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value)

const formatChange = (value) => `${value > 0 ? '+' : ''}${(value * 100).toFixed(1)}%`
</script>
