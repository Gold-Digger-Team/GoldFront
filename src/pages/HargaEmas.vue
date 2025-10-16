<template>
  <section
    class="relative flex min-h-[600px] w-full flex-1 flex-col overflow-hidden rounded-[28px] border-[5px] border-[#1BC0B7] bg-white px-6 pb-6 pt-16 shadow-[0_18px_48px_rgba(16,24,40,0.08)]"
  >
    <header class="absolute left-1/2 top-0 translate-y-0 -translate-x-1/2">
      <div class="rounded-b-[24px] bg-gradient-to-r from-yellow-400 to-amber-400 px-6 py-2 text-lg font-semibold text-white">
        Proyeksi Harga Emas
      </div>
    </header>

    <div class="flex flex-1 flex-col">
      <!-- Price Display -->
      <div class="mb-4 text-center">
        <h2 class="text-4xl font-bold text-slate-900">{{ formatCurrency(currentPrice) }}</h2>
        <p v-if="isLoadingData" class="mt-2 text-xs text-slate-500">
          <span class="inline-block animate-pulse">⏳ Memuat data harga emas...</span>
        </p>
        <p v-else-if="apiData.length > 0" class="mt-2 text-xs text-emerald-600 font-semibold">
          ✓ {{ apiData.length }} data historis dimuat
        </p>
      </div>

      <!-- Chart -->
      <div class="mt-2 w-full flex-1" style="min-height: 320px;">
        <apexchart
          type="area"
          height="320"
          :options="chartOptions"
          :series="chartSeries"
        ></apexchart>
      </div>

      <!-- Price Info Table -->
      <div v-if="chartMode === 'historis'" class="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table class="w-full text-sm">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-4 py-3 text-left font-semibold text-slate-700">Periode</th>
              <th class="px-4 py-3 text-right font-semibold text-slate-700">Harga</th>
              <th class="px-4 py-3 text-right font-semibold text-slate-700">Perubahan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="(info, idx) in priceInfoTable" :key="idx" class="hover:bg-slate-50 transition">
              <td class="px-4 py-3 font-medium text-slate-700">{{ info.period }}</td>
              <td class="px-4 py-3 text-right font-semibold text-slate-900">{{ info.price }}</td>
              <td class="px-4 py-3 text-right">
                <span
                  class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
                  :class="info.changePercent >= 0
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-rose-50 text-rose-700'"
                >
                  <span v-if="info.changePercent >= 0">↑</span>
                  <span v-else>↓</span>
                  {{ Math.abs(info.changePercent).toFixed(1) }}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Projection Info -->
      <div v-else class="mt-6">
        <div class="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <h4 class="text-sm font-semibold text-amber-900">📈 Proyeksi Tahunan</h4>
          <p class="mt-2 text-xs text-amber-700">Perkiraan harga emas berdasarkan model prediksi internal.</p>
          <div class="mt-3 space-y-2">
            <div v-for="proj in annualProjections" :key="proj.year" class="flex items-center justify-between gap-3 text-xs">
              <span class="font-semibold text-amber-700">{{ proj.year }}</span>
              <span class="font-bold text-amber-900">{{ proj.price }}</span>
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold min-w-[60px] justify-center"
                    :class="proj.growthPercent >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                <svg v-if="proj.growthPercent >= 0" class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 15l7-7 7 7"></path>
                </svg>
                <svg v-else class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7"></path>
                </svg>
                {{ proj.growthPercent >= 0 ? '+' : '' }}{{ proj.growthPercent.toFixed(1) }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Controls -->
      <div class="mt-4 flex flex-wrap items-center justify-between gap-4">
        <!-- Timeframe Buttons -->
        <div class="inline-flex gap-1.5 rounded-full bg-[#BCE7E3] p-1 text-xs font-medium text-slate-600">
          <button
            v-for="tf in timeframeList"
            :key="tf.key"
            type="button"
            class="rounded-full px-4 py-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1BC0B7]"
            :class="
              tf.key === selectedTimeframe
                ? 'bg-[#788C92] text-white shadow'
                : 'text-slate-700 hover:bg-white/70'
            "
            :disabled="chartMode === 'proyeksi'"
            @click="selectedTimeframe = tf.key"
          >
            {{ tf.label }}
          </button>
        </div>

        <!-- Mode Toggle -->
        <div class="inline-flex gap-2 rounded-full bg-[#BCE7E3] p-1 text-sm font-semibold">
          <button
            type="button"
            class="rounded-full px-5 py-2 transition"
            :class="chartMode === 'historis'
              ? 'bg-[#1BC0B7] text-white shadow'
              : 'text-slate-700 hover:bg-white/70'"
            @click="chartMode = 'historis'"
          >
            Historis
          </button>
          <button
            type="button"
            class="rounded-full px-5 py-2 transition"
            :class="chartMode === 'proyeksi'
              ? 'bg-[#1BC0B7] text-white shadow'
              : 'text-slate-700 hover:bg-white/70'"
            @click="chartMode = 'proyeksi'"
          >
            Proyeksi
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { apiFetch } from '@/services/apiClient'

// Track displayed years for projection mode
const displayedYears = new Map()

const chartMode = ref('historis')

// Watch untuk reset displayedYears ketika mode berubah
watch(chartMode, () => {
  displayedYears.clear()
  console.log('🔄 Chart mode changed to:', chartMode.value, '- Cleared displayed years')
})

// API data state
const apiData = ref([])
const isLoadingData = ref(true)
const dataError = ref(null)

// Prediction API data state
const predictionData = ref([])
const isLoadingPrediction = ref(false)
const predictionError = ref(null)

const seriesColors = ['#F9B10A']
const JT = 1_000_000
const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
const timeframeDurations = {
  '1Y': 12,
  '3Y': 36,
  '5Y': 60,
  ALL: null
}

const timeframeList = Object.entries(timeframeDurations).map(([key]) => ({
  key,
  label: key
}))

const selectedTimeframe = ref('ALL')

const toRupiah = (jutaan) => Math.round(jutaan * JT)
const formatMonthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
const toTimestamp = (key) => new Date(`${key}-01T00:00:00`).getTime()
const addMonths = (date, count) => new Date(date.getFullYear(), date.getMonth() + count, 1)
const monthsBetween = (start, end) =>
  (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())

const buildMonthlyTimeline = (points) => {
  const categories = [formatMonthKey(points[0].date)]
  const values = [points[0].value]

  for (let i = 0; i < points.length - 1; i += 1) {
    const start = points[i]
    const end = points[i + 1]
    const totalMonths = Math.max(0, monthsBetween(start.date, end.date))

    if (totalMonths === 0) {
      categories.push(formatMonthKey(end.date))
      values.push(end.value)
      continue
    }

    const step = (end.value - start.value) / totalMonths

    for (let month = 1; month <= totalMonths; month += 1) {
      const cursor = addMonths(start.date, month)
      categories.push(formatMonthKey(cursor))
      values.push(Math.round(start.value + step * month))
    }
  }

  return { categories, values }
}

const toSeriesData = (categories, values) =>
  categories.map((key, index) => ({
    x: toTimestamp(key),
    y: values[index]
  }))

const formatAxisLabel = (value) => {
  const date = new Date(Number(value))
  if (Number.isNaN(date.getTime())) {
    console.log('⚠️ Invalid date for value:', value)
    return ''
  }

  const month = date.getMonth()
  const year = date.getFullYear()

  if (chartMode.value === 'proyeksi') {
    // Tampilkan label tahun pertama kali muncul atau di bulan Januari
    if (!displayedYears.has(year)) {
      displayedYears.set(year, true)
      console.log('✅ Proyeksi - First occurrence of year:', year, 'at month:', month)
      return year.toString()
    }
    // Atau tampilkan di mid-year (Juli)
    if (month === 6) {
      console.log('✅ Proyeksi - Mid year label:', `Mid ${year}`)
      return `Mid ${year}`
    }
    console.log('⏭️ Proyeksi - Skipping month:', month, 'year:', year)
    return ''
  }

  const duration = timeframeDurations[selectedTimeframe.value]

  // For 1 year, show every 2 months
  if (duration === 12) {
    if (month % 2 === 0) {
      return `${monthLabels[month]}\n${year}`
    }
    return ''
  }

  // For 3 years, show quarterly
  if (duration === 36) {
    if (month % 3 === 0) {
      return `${monthLabels[month]}\n${year}`
    }
    return ''
  }

  // For 5 years, show half-yearly
  if (duration === 60) {
    if (month % 6 === 0) {
      return `${monthLabels[month]}\n${year}`
    }
    return ''
  }

  // For ALL, show yearly
  if (!duration) {
    if (month === 0) {
      return year.toString()
    }
    return ''
  }

  return ''
}

const formatTooltipLabel = (value) => {
  const date = new Date(Number(value))
  if (Number.isNaN(date.getTime())) return ''

  // Show full date for daily data
  return `${date.getDate()} ${monthLabels[date.getMonth()]} ${date.getFullYear()}`
}

// Fetch gold price data from API with pagination
async function fetchGoldPriceData() {
  isLoadingData.value = true
  dataError.value = null

  try {
    let allData = []
    let currentPage = 1
    let totalPages = 1

    // Fetch all pages
    while (currentPage <= totalPages) {
      const response = await apiFetch(`/api/emas?page=${currentPage}&pageSize=100`, {
        method: 'GET'
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch gold price data: ${response.status}`)
      }

      const result = await response.json()

      // Add data from current page
      if (result.data && result.data.length > 0) {
        allData = [...allData, ...result.data]
      }

      // Update pagination info
      if (result.meta) {
        totalPages = result.meta.totalPages
        console.log(`Fetching page ${currentPage} of ${totalPages}...`)
      }

      currentPage++
    }

    apiData.value = allData
    console.log('✅ Gold price data loaded:', apiData.value.length, 'records')
  } catch (error) {
    console.error('❌ Error fetching gold price data:', error)
    dataError.value = error.message
  } finally {
    isLoadingData.value = false
  }
}

// Convert API data directly to chart format (no interpolation needed for daily data)
const historicalSeriesFull = computed(() => {
  if (!apiData.value || apiData.value.length === 0) {
    // Fallback data if API fails - use monthly timeline
    const fallbackPoints = [
      { date: new Date(2010, 0, 1), value: toRupiah(0.42) },
      { date: new Date(2011, 0, 1), value: toRupiah(0.48) },
      { date: new Date(2012, 6, 1), value: toRupiah(0.56) },
      { date: new Date(2014, 0, 1), value: toRupiah(0.65) },
      { date: new Date(2015, 6, 1), value: toRupiah(0.72) },
      { date: new Date(2017, 0, 1), value: toRupiah(0.84) },
      { date: new Date(2019, 0, 1), value: toRupiah(1.05) },
      { date: new Date(2020, 5, 1), value: toRupiah(1.42) },
      { date: new Date(2021, 11, 1), value: toRupiah(1.61) },
      { date: new Date(2022, 11, 1), value: toRupiah(1.78) },
      { date: new Date(2023, 11, 1), value: toRupiah(1.94) },
      { date: new Date(2024, 5, 1), value: toRupiah(2.08) },
      { date: new Date(2025, 8, 1), value: toRupiah(2.30) }
    ]
    const timeline = buildMonthlyTimeline(fallbackPoints)
    return toSeriesData(timeline.categories, timeline.values)
  }

  // Sort by date ascending (oldest first)
  const sortedData = [...apiData.value].sort((a, b) =>
    new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime()
  )

  // Convert API data directly to series format (daily data, no interpolation)
  return sortedData.map(item => ({
    x: new Date(item.tanggal).getTime(),
    y: Math.round(parseFloat(item.harga_pergram_idr))
  }))
})

// Get last historical point for projections
const historisControlPoints = computed(() => {
  if (!apiData.value || apiData.value.length === 0) {
    return [{ date: new Date(2025, 8, 1), value: toRupiah(2.30) }]
  }

  const sortedData = [...apiData.value].sort((a, b) =>
    new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime()
  )

  // Return last point for projection baseline
  const lastItem = sortedData[sortedData.length - 1]
  return [{
    date: new Date(lastItem.tanggal),
    value: Math.round(parseFloat(lastItem.harga_pergram_idr))
  }]
})

// Fetch prediction data from API
async function fetchPredictionData() {
  isLoadingPrediction.value = true
  predictionError.value = null

  try {
    const response = await apiFetch('/api/simulasi/get-all-prediksi', {
      method: 'GET'
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch prediction data: ${response.status}`)
    }

    const result = await response.json()

    if (result.data && Array.isArray(result.data)) {
      predictionData.value = result.data
      console.log('✅ Prediction data loaded:', predictionData.value.length, 'records')
    }
  } catch (error) {
    console.error('❌ Error fetching prediction data:', error)
    predictionError.value = error.message
  } finally {
    isLoadingPrediction.value = false
  }
}

// Fetch data on component mount
onMounted(async () => {
  console.log('🚀 HargaEmas Component Mounted')
  console.log('🔍 Initial chartMode:', chartMode.value)

  await fetchGoldPriceData()
  await fetchPredictionData()

  console.log('✅ Data loading completed')
  console.log('📊 API Data Count:', apiData.value.length)
  console.log('📈 Prediction Data Count:', predictionData.value.length)
})

// Get the last historical price for projection baseline
const lastHistoricalPrice = computed(() => {
  const lastPoint = historisControlPoints.value[0]
  return lastPoint?.value || toRupiah(2.30)
})

const lastHistoricalDate = computed(() => {
  const lastPoint = historisControlPoints.value[0]
  return lastPoint?.date || new Date(2025, 8, 1)
})

// Calculate projection based on API data or fallback to calculation
const projectionControlPoints = computed(() => {
  const startDate = lastHistoricalDate.value
  const startPoint = { date: new Date(startDate), value: lastHistoricalPrice.value }

  if (predictionData.value && predictionData.value.length > 0) {
    const sortedPredictions = [...predictionData.value].sort((a, b) => a.tahun_ke - b.tahun_ke)

    return [
      startPoint,
      ...sortedPredictions.map((pred) => ({
        date: new Date(startDate.getFullYear() + pred.tahun_ke, 0, 1),
        value: Math.round(pred.harga_prediksi)
      }))
    ]
  }

  const basePrice = lastHistoricalPrice.value / JT

  return [
    startPoint,
    { date: new Date(startDate.getFullYear() + 1, 0, 1), value: toRupiah(basePrice * 1.13) },
    { date: new Date(startDate.getFullYear() + 2, 0, 1), value: toRupiah(basePrice * 1.28) },
    { date: new Date(startDate.getFullYear() + 3, 0, 1), value: toRupiah(basePrice * 1.41) },
    { date: new Date(startDate.getFullYear() + 4, 8, 1), value: toRupiah(basePrice * 1.65) },
    { date: new Date(startDate.getFullYear() + 5, 11, 1), value: toRupiah(basePrice * 2.17) }
  ]
})

const projectionTimeline = computed(() => {
  const timeline = buildMonthlyTimeline(projectionControlPoints.value)
  console.log('📊 Projection Timeline Categories:', timeline.categories)
  console.log('📊 First 5 categories:', timeline.categories.slice(0, 5))
  console.log('📊 Last 5 categories:', timeline.categories.slice(-5))
  return timeline
})

const projectionSeries = computed(() =>
  toSeriesData(
    projectionTimeline.value.categories,
    projectionTimeline.value.values
  )
)

const lastHistoricalPoint = computed(() =>
  historicalSeriesFull.value[historicalSeriesFull.value.length - 1]
)

const trimmedProjectionFuture = computed(() =>
  projectionSeries.value.filter((point) => point.x > lastHistoricalPoint.value.x)
)

const highlightProjectionTimestamp = computed(() => {
  const futurePoints = trimmedProjectionFuture.value
  if (futurePoints.length > 0) {
    return futurePoints[futurePoints.length - 1].x
  }
  return lastHistoricalPoint.value?.x ?? null
})

const getHistoricalSlice = (months) => {
  if (!months) return historicalSeriesFull.value

  const fullData = historicalSeriesFull.value
  if (fullData.length === 0) return []

  // Get the latest date
  const latestTimestamp = fullData[fullData.length - 1].x
  const latestDate = new Date(latestTimestamp)

  // Calculate cutoff date (N months ago)
  const cutoffDate = new Date(latestDate)
  cutoffDate.setMonth(cutoffDate.getMonth() - months)
  const cutoffTimestamp = cutoffDate.getTime()

  // Filter data from cutoff date onwards
  return fullData.filter(point => point.x >= cutoffTimestamp)
}

const baseChartOptions = {
  chart: {
    toolbar: { show: false },
    animations: { enabled: true },
    zoom: { enabled: false },
    fontFamily: 'inherit',
    width: '100%',
    background: 'transparent'
  },
  colors: seriesColors,
  dataLabels: { enabled: false },
  stroke: {
    curve: 'smooth',
    width: 4,
    lineCap: 'round'
  },
  markers: {
    size: 0,
    hover: { size: 7 }
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 0.9,
      gradientToColors: ['#FFCF4A'],
      inverseColors: false,
      opacityFrom: 0.28,
      opacityTo: 0.05,
      stops: [0, 100]
    }
  },
  xaxis: {
    type: 'datetime',
    axisTicks: { show: true },
    axisBorder: { show: true, color: '#94a3b8' },
    labels: {
      style: { colors: '#334155', fontWeight: 600, fontSize: '11px' },
      offsetY: 4,
      formatter: formatAxisLabel,
      datetimeUTC: false,
      rotate: -45,
      rotateAlways: false,
      hideOverlappingLabels: true,
      trim: false
    },
    title: {
      text: 'Periode (Tanggal)',
      style: { colors: '#475569', fontWeight: 600, fontSize: '11px' },
      offsetY: 8
    },
    tooltip: {
      enabled: false
    }
  },
  yaxis: {
    tickAmount: 6,
    labels: {
      formatter: (v) => {
        if (v >= JT) {
          return `Rp ${(v / JT).toFixed(1)} Jt`
        }
        return `Rp ${Math.round(v / 1000)}k`
      },
      style: { colors: '#475569', fontSize: '12px', fontWeight: 600 }
    }
  },
  grid: {
    borderColor: '#cbd5e1',
    strokeDashArray: 3,
    yaxis: { lines: { show: true } },
    xaxis: { lines: { show: true } },
    padding: { left: 16, right: 16, top: 10, bottom: 10 }
  },
  tooltip: {
    shared: true,
    intersect: false,
    theme: 'light',
    style: {
      fontSize: '13px',
      fontFamily: 'inherit'
    },
    x: {
      formatter: formatTooltipLabel
    },
    y: {
      formatter: (v) =>
        new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          maximumFractionDigits: 0
        }).format(v),
      title: {
        formatter: (seriesName) => seriesName + ':'
      }
    },
    marker: {
      show: true
    }
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    fontWeight: 600,
    markers: { width: 12, height: 12, radius: 12 }
  }
}

const activeView = computed(() => {
  if (chartMode.value === 'historis') {
    const slice = getHistoricalSlice(timeframeDurations[selectedTimeframe.value])
    const values = slice.map((point) => point.y)
    return {
      mode: 'historis',
      series: [
        {
          name: 'Harga Emas',
          data: slice
        }
      ],
      highlightX: slice[slice.length - 1]?.x ?? null,
      min: Math.min(...values),
      max: Math.max(...values),
      showLegend: false
    }
  }

  const projectionWithHistory = [
    ...historicalSeriesFull.value,
    ...trimmedProjectionFuture.value
  ]
  const combinedValues = projectionWithHistory.map((point) => point.y)

  return {
    mode: 'proyeksi',
    series: [
      { name: 'Proyeksi Harga Emas', data: projectionWithHistory }
    ],
    highlightX: highlightProjectionTimestamp.value,
    min: Math.min(...combinedValues),
    max: Math.max(...combinedValues),
    showLegend: true
  }
})

const chartSeries = computed(() => activeView.value.series)

const chartOptions = computed(() => {
  const { mode, series, highlightX, min, max, showLegend } = activeView.value
  const primaryData = series[0]?.data ?? []
  const highlightIndex = primaryData.findIndex((point) => point.x === highlightX)
  const padding = Math.max(120_000, Math.round((max - min) * 0.12))

  console.log('📈 Chart Options - Mode:', mode)
  console.log('📈 Chart Options - Primary Data Length:', primaryData.length)
  console.log('📈 Chart Options - First Data Point:', primaryData[0])
  console.log('📈 Chart Options - Last Data Point:', primaryData[primaryData.length - 1])
  console.log('📈 Chart Options - Highlight Index:', highlightIndex)

  // Build annotations for key points
  const annotations = {
    points: []
  }

  if (mode === 'historis' && highlightIndex >= 0) {
    annotations.points.push({
      x: highlightX,
      y: primaryData[highlightIndex].y,
      marker: {
        size: 6,
        fillColor: '#FFFFFF',
        strokeColor: seriesColors[0],
        strokeWidth: 3
      },
      label: {
        text: formatCurrency(primaryData[highlightIndex].y),
        borderColor: seriesColors[0],
        borderWidth: 2,
        style: {
          color: '#fff',
          background: seriesColors[0],
          fontSize: '11px',
          fontWeight: 600,
          padding: {
            left: 8,
            right: 8,
            top: 4,
            bottom: 4
          }
        },
        offsetY: -10
      }
    })
  }

  console.log('🔧 Building chartOptions for mode:', mode)

  // Custom tooltip untuk mode proyeksi dengan persentase dan warna
  const customTooltip = mode === 'proyeksi' ? {
    shared: true,
    intersect: false,
    theme: 'light',
    style: {
      fontSize: '13px',
      fontFamily: 'inherit'
    },
    x: {
      formatter: formatTooltipLabel
    },
    custom: function({ series, seriesIndex, dataPointIndex, w }) {
      const value = series[seriesIndex][dataPointIndex]
      const date = w.globals.seriesX[seriesIndex][dataPointIndex]
      const dateLabel = formatTooltipLabel(date)

      const formattedPrice = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
      }).format(value)

      // Hitung persentase dari harga pertama (historis terakhir)
      const firstValue = lastHistoricalPrice.value
      const growthPercent = firstValue > 0 ? ((value - firstValue) / firstValue) * 100 : 0

      let percentHtml = ''
      if (growthPercent !== 0) {
        const sign = growthPercent > 0 ? '+' : ''
        const percentText = `${sign}${growthPercent.toFixed(1)}%`
        const color = growthPercent > 0 ? '#16a34a' : '#dc2626' // green-600 : red-600
        const bgColor = growthPercent > 0 ? '#dcfce7' : '#fee2e2' // green-100 : red-100
        const arrow = growthPercent > 0 ? '↑' : '↓'

        percentHtml = `<span style="display: inline-block; margin-left: 8px; padding: 2px 8px; border-radius: 6px; background-color: ${bgColor}; color: ${color}; font-weight: 700; font-size: 12px;">${arrow} ${percentText}</span>`
      }

      return `
        <div style="padding: 10px 12px; background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px; font-weight: 600;">${dateLabel}</div>
          <div style="display: flex; align-items: center; gap: 4px;">
            <span style="font-weight: 700; color: #334155; font-size: 14px;">${formattedPrice}</span>
            ${percentHtml}
          </div>
        </div>
      `
    },
    marker: {
      show: true
    }
  } : baseChartOptions.tooltip

  return {
    ...baseChartOptions,
    xaxis: {
      ...baseChartOptions.xaxis,
      ...(mode === 'proyeksi' && {
        labels: {
          ...baseChartOptions.xaxis.labels,
          show: true,
          formatter: formatAxisLabel,
          rotate: -45,
          rotateAlways: true,
          hideOverlappingLabels: false,
          trim: false
        }
      })
    },
    yaxis: {
      ...baseChartOptions.yaxis,
      min: Math.max(0, min - padding),
      max: max + padding
    },
    tooltip: customTooltip,
    markers: {
      ...baseChartOptions.markers,
      discrete:
        highlightIndex >= 0 && mode === 'proyeksi'
          ? [
              {
                seriesIndex: 0,
                dataPointIndex: highlightIndex,
                size: 8,
                fillColor: '#FFFFFF',
                strokeColor: seriesColors[0],
                strokeWidth: 3
              }
            ]
          : []
    },
    fill: {
      ...baseChartOptions.fill,
      gradient: {
        ...baseChartOptions.fill.gradient,
        opacityFrom: mode === 'historis' ? 0.26 : 0.32,
        opacityTo: mode === 'historis' ? 0.06 : 0.12
      }
    },
    legend: {
      ...baseChartOptions.legend,
      show: showLegend
    },
    annotations
  }
})

const currentPrice = computed(() => {
  const primaryData = activeView.value.series[0]?.data ?? []
  return primaryData[primaryData.length - 1]?.y ?? 0
})

const formatCurrency = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value)

// Price info table for historical view
const priceInfoTable = computed(() => {
  const slice = getHistoricalSlice(timeframeDurations[selectedTimeframe.value])
  if (!slice || slice.length === 0) return []

  const intervals = []
  const latestPoint = slice[slice.length - 1]
  const latestPrice = latestPoint?.y || 0
  const latestDate = new Date(latestPoint?.x)

  // Helper function to find price closest to a specific date
  const findPriceAtDate = (targetDate) => {
    const targetTimestamp = targetDate.getTime()
    let closest = slice[0]

    for (const point of slice) {
      if (Math.abs(point.x - targetTimestamp) < Math.abs(closest.x - targetTimestamp)) {
        closest = point
      }
      if (point.x >= targetTimestamp) break
    }

    return closest
  }

  // 1 Month ago
  const oneMonthAgo = new Date(latestDate)
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
  const oneMonthPrice = findPriceAtDate(oneMonthAgo)
  if (oneMonthPrice.x < latestPoint.x) {
    intervals.push({
      period: '1 Bulan Lalu',
      price: formatCurrency(oneMonthPrice.y),
      changePercent: ((latestPrice - oneMonthPrice.y) / oneMonthPrice.y) * 100
    })
  }

  // 3 Months ago (if timeframe allows)
  if (timeframeDurations[selectedTimeframe.value] >= 3 || !timeframeDurations[selectedTimeframe.value]) {
    const threeMonthsAgo = new Date(latestDate)
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
    const threeMonthPrice = findPriceAtDate(threeMonthsAgo)
    if (threeMonthPrice.x < latestPoint.x) {
      intervals.push({
        period: '3 Bulan Lalu',
        price: formatCurrency(threeMonthPrice.y),
        changePercent: ((latestPrice - threeMonthPrice.y) / threeMonthPrice.y) * 100
      })
    }
  }

  // 6 Months ago (if timeframe allows)
  if (timeframeDurations[selectedTimeframe.value] >= 6 || !timeframeDurations[selectedTimeframe.value]) {
    const sixMonthsAgo = new Date(latestDate)
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    const sixMonthPrice = findPriceAtDate(sixMonthsAgo)
    if (sixMonthPrice.x < latestPoint.x) {
      intervals.push({
        period: '6 Bulan Lalu',
        price: formatCurrency(sixMonthPrice.y),
        changePercent: ((latestPrice - sixMonthPrice.y) / sixMonthPrice.y) * 100
      })
    }
  }

  // 1 Year ago (if timeframe allows)
  if (timeframeDurations[selectedTimeframe.value] >= 12 || !timeframeDurations[selectedTimeframe.value]) {
    const oneYearAgo = new Date(latestDate)
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
    const oneYearPrice = findPriceAtDate(oneYearAgo)
    if (oneYearPrice.x < latestPoint.x) {
      intervals.push({
        period: '1 Tahun Lalu',
        price: formatCurrency(oneYearPrice.y),
        changePercent: ((latestPrice - oneYearPrice.y) / oneYearPrice.y) * 100
      })
    }
  }

  // Start of period
  const firstPrice = slice[0]?.y || 0
  intervals.push({
    period: 'Awal Periode',
    price: formatCurrency(firstPrice),
    changePercent: ((latestPrice - firstPrice) / firstPrice) * 100
  })

  return intervals
})

// Projection list for display with growth percentage
const annualProjections = computed(() => {
  const points = projectionControlPoints.value
  const basePrice = points[0]?.value || 0

  console.log('📊 Annual Projections - Base Price:', formatCurrency(basePrice))
  console.log('📊 Projection Control Points:', points)

  const projections = points.slice(1).map((point, index) => {
    const prevPrice = index === 0 ? basePrice : points[index].value
    const growthPercent = prevPrice > 0 ? ((point.value - prevPrice) / prevPrice) * 100 : 0

    console.log(`📈 Year ${point.date.getFullYear()}: ${formatCurrency(point.value)} (${growthPercent >= 0 ? '+' : ''}${growthPercent.toFixed(1)}%)`)

    return {
      year: point.date.getFullYear(),
      price: formatCurrency(point.value),
      rawValue: point.value,
      growthPercent: growthPercent
    }
  })

  console.log('✅ Final Annual Projections:', projections)

  return projections
})
</script>
