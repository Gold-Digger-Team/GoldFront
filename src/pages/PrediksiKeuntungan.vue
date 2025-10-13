<template>
  <section
    class="relative flex h-full flex-col overflow-hidden rounded-[28px] border-[5px] border-[#1BC0B7] bg-white px-6 pb-6 pt-16 shadow-[0_18px_48px_rgba(16,24,40,0.08)]"
  >
    <header class="absolute left-1/2 top-0 translate-y-0 -translate-x-1/2">
      <div class="rounded-b-[24px] bg-gradient-to-r from-yellow-400 to-amber-400 px-6 py-2 text-lg font-semibold text-white">
        Prediksi Keuntungan
      </div>
    </header>

    <div class="flex flex-col gap-4">
      <div class="w-full" style="height: 280px;">
        <apexchart type="bar" height="280" :options="chartOptions" :series="series" />
      </div>

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div class="rounded-[20px] border border-[#ffb70f40] bg-[#fff9e8] p-4">
          <h3 class="text-base font-semibold text-[#0f172a]">Ringkasan Proyeksi</h3>
          <p class="mt-1 text-xs text-[#667085]">
            Simulasi potensi keuntungan investasi emas Rp 50.000.000 dengan skenario pertumbuhan berbeda.
          </p>

          <div class="mt-3 rounded-[16px] bg-white/70 p-3 shadow-inner">
            <table class="w-full text-sm text-[#0f172a]">
              <tbody class="divide-y divide-slate-200">
                <tr>
                  <td class="py-2 font-medium">1 Tahun</td>
                  <td class="py-2 text-right font-semibold">Rp 5.600.000</td>
                </tr>
                <tr>
                  <td class="py-2 font-medium">3 Tahun</td>
                  <td class="py-2 text-right font-semibold">Rp 18.400.000</td>
                </tr>
                <tr>
                  <td class="py-2 font-medium">5 Tahun</td>
                  <td class="py-2 text-right font-semibold">Rp 32.800.000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="rounded-[20px] bg-slate-50 p-4">
          <h3 class="text-base font-semibold text-[#0f172a]">Catatan</h3>
          <p class="mt-2 text-xs text-[#667085] leading-relaxed">
            Ilustrasi menggunakan asumsi pertumbuhan optimis 10%/tahun dan konservatif 8%/tahun.
            Proyeksi ini bersifat estimasi dan dapat berbeda dengan kondisi pasar aktual.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import VueApexCharts from 'vue3-apexcharts'

const apexchart = VueApexCharts

const categories = ['1 Tahun', '3 Tahun', '5 Tahun']
const series = [
  {
    name: 'Skenario Optimis',
    data: [5600000, 18400000, 32800000]
  },
  {
    name: 'Skenario Konservatif',
    data: [4400000, 15000000, 26000000]
  }
]

const chartOptions = {
  chart: {
    toolbar: { show: false },
    stacked: false
  },
  plotOptions: {
    bar: {
      borderRadius: 12,
      columnWidth: '45%'
    }
  },
  dataLabels: { enabled: false },
  colors: ['#FFB70F', '#1DA69D'],
  xaxis: {
    categories,
    labels: { style: { colors: '#475569', fontWeight: 600 } }
  },
  yaxis: {
    labels: {
      formatter: (value) => `Rp ${(value / 1_000_000).toFixed(0)} Jt`,
      style: { colors: '#64748b' }
    }
  },
  grid: {
    strokeDashArray: 6,
    borderColor: '#BCE7E388'
  },
  tooltip: {
    y: {
      formatter: (value) =>
        new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          maximumFractionDigits: 0
        }).format(value)
    }
  },
  legend: {
    fontWeight: 600,
    markers: {
      width: 12,
      height: 12,
      radius: 12
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 0.25,
      inverseColors: false,
      opacityFrom: 0.95,
      opacityTo: 0.75,
      stops: [0, 90, 100]
    }
  }
}
</script>
