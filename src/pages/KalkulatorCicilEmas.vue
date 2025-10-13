<template>
  <section
    class="relative flex h-full flex-col overflow-hidden rounded-[28px] border-[5px] border-[#1BC0B7] bg-white px-6 pb-8 pt-16 shadow-[0_18px_48px_rgba(16,24,40,0.08)]"
  >
    <header class="absolute left-1/2 top-0 translate-y-0 -translate-x-1/2">
      <div class="rounded-b-[24px] bg-gradient-to-r from-yellow-400 to-amber-400 px-6 py-2 text-lg font-semibold text-white">
        Rekomendasi Cicil Emas
      </div>
    </header>

    <form class="mt-4 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]" @submit.prevent>
      <div class="space-y-5 rounded-[20px] bg-slate-50/80 p-5">
        <div class="grid gap-4 md:grid-cols-2">
          <div class="rounded-xl border border-white/60 bg-white px-4 py-3 shadow-sm">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Harga per Gram</p>
            <p class="mt-1 text-lg font-semibold text-slate-900">{{ fmtNumber(pricePerGram) }}</p>
          </div>
          <div class="rounded-xl border border-white/60 bg-white px-4 py-3 shadow-sm">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Margin Flat / Bulan</p>
            <p class="mt-1 text-lg font-semibold text-slate-900">{{ marginRate }}%</p>
          </div>

          <label class="block text-sm font-semibold text-[#0f172a]">
            Berat (gram)
            <select
              v-model.number="gram"
              class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
            >
              <option v-for="option in gramOptions" :key="option" :value="option">
                {{ option }} gram
              </option>
            </select>
          </label>

          <label class="block text-sm font-semibold text-[#0f172a]">
            Tenor
            <select
              v-model.number="tenor"
              class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
            >
              <option
                v-for="option in tenorOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </label>
        </div>

        <div>
          <div class="flex items-center justify-between text-sm font-semibold text-[#0f172a]">
            <span>DP</span>
            <span>{{ dpPct }}% · {{ fmt(dpNominal) }}</span>
          </div>
          <input
            v-model.number="dpPct"
            type="range"
            min="10"
            max="40"
            step="1"
            class="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#0fb29a]"
          />
          <div class="mt-1 flex justify-between text-xs font-medium text-slate-500">
            <span>10%</span>
            <span>40%</span>
          </div>
        </div>

        <div class="rounded-xl border border-dashed border-teal-500/50 bg-white/80 px-4 py-3 text-xs text-slate-500">
          Rumus flat: Angsuran = (Pokok / Tenor) + (Pokok × (margin% / 100)). Total margin = Pokok × (margin% / 100) × Tenor.
        </div>
      </div>

      <aside class="space-y-4 rounded-[20px] border border-[#ffb70f40] bg-[#fff9e8] p-5">
        <div>
          <h3 class="text-lg font-semibold text-[#0f172a]">Ringkasan Simulasi</h3>
          <p class="text-sm text-[#667085]">
            Hitung estimasi cicilan emas berdasarkan berat dan tenor yang kamu pilih.
          </p>
        </div>
        <div class="rounded-2xl bg-white/90 p-4 shadow-inner">
          <div class="flex justify-between text-sm text-[#0f172a]">
            <span>Total Harga</span><span class="font-semibold">{{ fmt(totalHarga) }}</span>
          </div>
          <div class="flex justify-between text-sm text-[#0f172a]">
            <span>Nominal DP</span><span class="font-semibold">{{ fmt(dpNominal) }}</span>
          </div>
          <div class="flex justify-between text-sm text-[#0f172a]">
            <span>Pokok Dibiayai</span><span class="font-semibold">{{ fmt(pokok) }}</span>
          </div>
          <div class="flex justify-between text-sm text-[#0f172a]">
            <span>Total Margin</span><span class="font-semibold">{{ fmt(totalMargin) }}</span>
          </div>
          <div class="my-3 border-t border-slate-200"></div>
          <div class="flex items-center justify-between text-base font-semibold text-[#0f172a]">
            <span>Angsuran per Bulan</span><span class="text-lg text-[#0fb29a]">{{ fmt(angsuranBulanan) }}</span>
          </div>
        </div>
      </aside>
    </form>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const pricePerGram = 2_300_000
const marginRate = 10

const gramOptions = [5, 10, 25, 50, 100]
const tenorOptions = [
  { label: '1 Tahun (12 bln)', value: 12 },
  { label: '2 Tahun (24 bln)', value: 24 },
  { label: '3 Tahun (36 bln)', value: 36 },
  { label: '4 Tahun (48 bln)', value: 48 },
  { label: '5 Tahun (60 bln)', value: 60 }
]

const gram = ref(gramOptions[0])
const tenor = ref(tenorOptions[0].value)
const dpPct = ref(10)

watch(dpPct, (value) => {
  if (value === undefined || value === null) return
  if (value < 10) dpPct.value = 10
  else if (value > 40) dpPct.value = 40
})

const safeGram = computed(() =>
  gramOptions.includes(Number(gram.value)) ? Number(gram.value) : gramOptions[0]
)
const safeTenor = computed(() => {
  const numeric = Number(tenor.value)
  return tenorOptions.some((option) => option.value === numeric) ? numeric : tenorOptions[0].value
})

const totalHarga = computed(() => pricePerGram * safeGram.value)
const dpNominal = computed(() => totalHarga.value * (dpPct.value / 100))
const pokok = computed(() => Math.max(totalHarga.value - dpNominal.value, 0))

const marginPerBulan = computed(() => pokok.value * (marginRate / 100))
const totalMargin = computed(() => marginPerBulan.value * safeTenor.value)
const angsuranBulanan = computed(() => (safeTenor.value ? pokok.value / safeTenor.value : 0) + marginPerBulan.value)

const fmt = (n) =>
  n.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })

const fmtNumber = (n) => n.toLocaleString('id-ID')
</script>
