<template>
  <section
    class="relative flex h-full w-full flex-1 flex-col overflow-hidden rounded-[28px] border-[5px] border-[#1BC0B7] bg-white px-6 pb-6 pt-16 shadow-[0_18px_48px_rgba(16,24,40,0.08)]"
  >
    <header class="absolute left-1/2 top-0 translate-y-0 -translate-x-1/2">
      <div class="rounded-b-[24px] bg-gradient-to-r from-yellow-400 to-amber-400 px-6 py-2 text-lg font-semibold text-white">
        Proyeksi Harga Emas
      </div>
    </header>

    <div class="flex flex-wrap items-center justify-between gap-3 text-[--color-text]">
      <div class="flex items-center gap-2">
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
          <svg class="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div>
          <p class="text-sm font-semibold text-slate-700">{{ totalHistoricalData }} data historis dimuat</p>
          <p class="text-xs text-slate-500">Proyeksi menggunakan model prediksi ML</p>
        </div>
      </div>
      <div class="inline-flex gap-1.5 rounded-full bg-[#BCE7E3] p-1 text-xs font-medium text-slate-600">
        <button
          v-for="timeframe in timeframeList"
          :key="timeframe.key"
          type="button"
          :disabled="!timeframe.available"
          class="rounded-full px-3 py-1.5 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1BC0B7]"
          :class="[
            timeframe.key === selectedRange
              ? 'bg-[#788C92] text-white shadow'
              : timeframe.available
                ? 'text-slate-700 hover:bg-white/70 cursor-pointer'
                : 'text-slate-400 cursor-not-allowed opacity-50 bg-slate-200',
          ]"
          :title="!timeframe.available ? 'Timeframe belum tersedia' : ''"
          @click="timeframe.available && (selectedRange = timeframe.key)"
        >
          {{ timeframe.label }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="mt-6 flex flex-col items-center justify-center py-12">
      <svg class="h-10 w-10 animate-spin text-[#1BC0B7]" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="mt-3 text-sm text-slate-600">Memuat data proyeksi...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="mt-6 flex flex-col items-center justify-center py-12">
      <div class="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <p class="mt-3 text-sm font-semibold text-slate-700">Gagal memuat data</p>
      <p class="mt-1 text-xs text-slate-500">{{ error }}</p>
      <button @click="fetchPrediction" class="mt-4 px-4 py-2 bg-[#1BC0B7] text-white rounded-lg text-sm font-semibold hover:bg-[#159a92] transition">
        Coba Lagi
      </button>
    </div>

    <!-- Chart -->
    <div v-else class="mt-4 w-full" style="height: 280px;">
      <apexchart type="line" height="280" :options="chartOptions" :series="chartSeries"></apexchart>
    </div>

    <!-- Projection Summary Card -->
    <div v-if="!loading && !error && projectionSummary" class="mt-4">
      <div class="rounded-2xl bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 px-5 py-5 border-2 border-yellow-400/30 shadow-md">
        <div class="flex items-center gap-3 mb-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg">
            <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-xs font-bold uppercase tracking-wide text-amber-700">Proyeksi Harga Akhir Tahun</p>
            <p class="text-3xl font-extrabold text-slate-800 mt-0.5">{{ formatCurrency(projectionSummary.latest) }}</p>
          </div>
          <div class="text-right">
            <span class="inline-block px-3 py-1.5 rounded-full text-sm font-bold shadow-sm" :class="projectionSummary.growth >= 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'">
              {{ formatChange(projectionSummary.growth) }}
            </span>
            <p class="text-xs text-slate-600 mt-1">Pertumbuhan</p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-yellow-200">
          <div class="text-center">
            <p class="text-xs text-slate-600 font-semibold mb-1">Harga Awal</p>
            <p class="text-base font-bold text-slate-800">{{ formatCurrency(projectionSummary.first) }}</p>
          </div>
          <div class="text-center">
            <p class="text-xs text-slate-600 font-semibold mb-1">Rata-rata</p>
            <p class="text-base font-bold text-slate-800">{{ formatCurrency(projectionSummary.average) }}</p>
          </div>
          <div class="text-center">
            <p class="text-xs text-slate-600 font-semibold mb-1">Harga Tertinggi</p>
            <p class="text-base font-bold text-slate-800">{{ formatCurrency(projectionSummary.highest) }}</p>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-yellow-200">
          <p class="text-xs text-slate-700 leading-relaxed">
            <span class="font-semibold">💡 Insight:</span> {{ projectionSummary.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { predictionApiFetch } from '@/services/apiClient'

const seriesColors = ['#F59E0B']

const loading = ref(true)
const error = ref('')
const predictionData = ref(null)
const totalHistoricalData = ref(1259)

// Timeframe configuration - hanya 1Y yang available
const timeframeConfig = {
  '1Y': {
    label: '1Y',
    available: true,
    categories: [],
    series: []
  },
  '3Y': {
    label: '3Y',
    available: false,
    categories: [],
    series: []
  },
  '5Y': {
    label: '5Y',
    available: false,
    categories: [],
    series: []
  },
  'ALL': {
    label: 'ALL',
    available: false,
    categories: [],
    series: []
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
  stroke: { curve: 'smooth', width: 4 },
  markers: {
    size: 0,
    hover: { size: 7 }
  },
  xaxis: {
    categories: [],
    axisTicks: { show: false },
    axisBorder: { show: true, color: '#E2E8F0' },
    labels: {
      style: { colors: '#334155', fontWeight: 600, fontSize: '11px' },
      offsetY: 4,
      rotate: -45,
      rotateAlways: false
    },
    title: {
      text: 'Periode (Tahun-Bulan)',
      style: { color: '#475569', fontSize: '11px', fontWeight: 600 },
      offsetY: 80
    }
  },
  yaxis: {
    tickAmount: 4,
    labels: {
      formatter: (value) => {
        if (value >= 1_000_000) {
          return `Rp ${(value / 1_000_000).toFixed(1)}Jt`
        }
        return `Rp ${Math.round(value / 1_000)}rb`
      },
      style: { colors: '#475569', fontWeight: 600, fontSize: '11px' }
    },
    title: {
      text: 'Harga per Gram (IDR)',
      style: { color: '#475569', fontSize: '11px', fontWeight: 600 }
    }
  },
  grid: {
    borderColor: '#C8F2EE',
    strokeDashArray: 4,
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: true } },
    padding: { left: 16, right: 16, top: 0, bottom: 0 }
  },
  legend: {
    show: false
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
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'vertical',
      shadeIntensity: 0.25,
      gradientToColors: ['#FCD34D'],
      inverseColors: false,
      opacityFrom: 0.65,
      opacityTo: 0.05,
      stops: [0, 100]
    }
  }
}

const timeframeList = computed(() =>
  Object.entries(timeframeConfig).map(([key, config]) => ({
    key,
    label: config.label,
    available: config.available
  }))
)

const selectedRange = ref('1Y')

// Fetch prediction from API
const fetchPrediction = async () => {
  loading.value = true
  error.value = ''

  try {
    console.log('🔄 Fetching prediction from API...')

    const response = await predictionApiFetch('/predict/gold-price', {
      method: 'GET'
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const data = await response.json()
    console.log('✅ Prediction data received:', data)

    predictionData.value = data

    // Process data untuk chart - ambil hanya 1 skenario (predicted_price atau moderate_price)
    if (data.predictions && Array.isArray(data.predictions)) {
      const categories = data.predictions.map(item => {
        const date = new Date(item.date)
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      })

      const predictionPrices = data.predictions.map(item => item.predicted_price || item.moderate_price || 0)

      timeframeConfig['1Y'].categories = categories
      timeframeConfig['1Y'].series = [
        { name: 'Proyeksi Harga Emas', data: predictionPrices }
      ]

      if (data.metadata?.historical_data_count) {
        totalHistoricalData.value = data.metadata.historical_data_count
      }
    }

  } catch (err) {
    console.error('❌ Error fetching prediction:', err)
    error.value = err.message || 'Gagal memuat data prediksi'

    // Fallback to default data
    const months = []
    const predictionPrices = []

    for (let i = 0; i < 12; i++) {
      const month = new Date()
      month.setMonth(month.getMonth() + i)
      months.push(`${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`)

      const basePrice = 1_300_000 + (i * 50_000)
      predictionPrices.push(basePrice)
    }

    timeframeConfig['1Y'].categories = months
    timeframeConfig['1Y'].series = [
      { name: 'Proyeksi Harga Emas', data: predictionPrices }
    ]
  } finally {
    loading.value = false
  }
}

const chartOptions = computed(() => {
  const active = timeframeConfig[selectedRange.value]

  if (!active.series.length) {
    return baseOptions
  }

  const allValues = active.series.flatMap((serie) => serie.data)
  const min = Math.min(...allValues)
  const max = Math.max(...allValues)
  const padding = Math.max(100_000, Math.round((max - min) * 0.15))
  const highlightIndex = Math.max(active.series[0].data.length - 1, 0)

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
          size: 10,
          fillColor: '#FFFFFF',
          strokeColor: seriesColors[0],
          strokeWidth: 4,
          shape: 'circle'
        }
      ]
    }
  }
})

const chartSeries = computed(() => {
  const series = timeframeConfig[selectedRange.value].series
  return series.length > 0 ? series : []
})

const projectionSummary = computed(() => {
  const activeSeries = timeframeConfig[selectedRange.value].series

  if (!activeSeries.length || !activeSeries[0].data.length) {
    return null
  }

  const data = activeSeries[0].data
  const first = data[0]
  const last = data[data.length - 1]
  const growth = first === 0 ? 0 : (last - first) / first
  const average = data.reduce((sum, val) => sum + val, 0) / data.length
  const highest = Math.max(...data)

  return {
    first,
    latest: last,
    average: Math.round(average),
    highest,
    growth,
    description: `Berdasarkan analisis ${totalHistoricalData.value} data historis, proyeksi menunjukkan tren ${growth >= 0 ? 'kenaikan' : 'penurunan'} harga emas sebesar ${Math.abs(growth * 100).toFixed(1)}% dalam 12 bulan ke depan. Harga tertinggi diperkirakan mencapai ${formatCurrency(highest)}.`
  }
})

const formatCurrency = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value)

const formatChange = (value) => `${value > 0 ? '+' : ''}${(value * 100).toFixed(1)}%`

onMounted(() => {
  fetchPrediction()
})
</script>
