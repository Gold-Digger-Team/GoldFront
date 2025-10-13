<template>
  <section
    class="relative flex h-full flex-col overflow-hidden rounded-[28px] border-[5px] border-[#1BC0B7] bg-white px-6 pb-8 pt-16 shadow-[0_18px_48px_rgba(16,24,40,0.08)]"
  >
    <header class="absolute left-1/2 top-0 translate-y-0 -translate-x-1/2">
      <div class="rounded-b-[24px] bg-gradient-to-r from-yellow-400 to-amber-400 px-6 py-2 text-lg font-semibold text-white">
        Buka Cicil Emas
      </div>
    </header>

    <div class="mt-4 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <form class="space-y-4 rounded-[20px] bg-slate-50/80 p-5" @submit.prevent="submit">
        <div class="grid gap-3 md:grid-cols-2">
          <label class="block text-sm font-semibold text-[#0f172a] md:col-span-2">
            Nama Lengkap
            <input
              v-model="form.nama"
              class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
              placeholder="Nama sesuai KTP"
              required
            />
          </label>
          <label class="block text-sm font-semibold text-[#0f172a]">
            Nomor HP
            <input
              v-model="form.hp"
              class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
              placeholder="08xxxxxxxxxx"
              required
            />
          </label>
          <label class="block text-sm font-semibold text-[#0f172a]">
            Berat Emas (gram)
            <select
              v-model.number="form.gram"
              class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
            >
              <option v-for="option in gramOptions" :key="option" :value="option">
                {{ option }} gram
              </option>
            </select>
          </label>
          <label class="block text-sm font-semibold text-[#0f172a]">
            Estimasi Harga (Rp)
            <input
              :value="formatCurrency(totalHarga)"
              class="mt-1 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-semibold text-[#0f172a]"
              readonly
            />
            <p class="mt-1 text-xs text-[#86909c]">
              Menggunakan asumsi harga Rp {{ formatCurrency(PRICE_PER_GRAM, true) }} per gram.
            </p>
          </label>
          <label class="block text-sm font-semibold text-[#0f172a]">
            Tenor
            <select
              v-model="form.tenor"
              class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
            >
              <option value="6">6 bulan</option>
              <option value="12">12 bulan</option>
              <option value="24">24 bulan</option>
            </select>
          </label>
        </div>

        <button
          type="submit"
          class="inline-flex w-full items-center justify-center rounded-full bg-[#0fb29a] px-5 py-3 font-semibold text-white shadow transition hover:bg-[#0c9c86]"
        >
          Ajukan Sekarang
        </button>
      </form>

      <aside class="space-y-4 rounded-[20px] border border-[#ffb70f40] bg-[#fff9e8] p-6">
        <div>
          <h3 class="text-lg font-semibold text-[#0f172a]">Syarat & Ketentuan Singkat</h3>
          <ul class="mt-3 space-y-2 text-sm text-[#0f172a]">
            <li>WNI usia 21-55 tahun atau sudah menikah</li>
            <li>Memiliki KTP dan rekening BSI aktif</li>
            <li>DP minimal 20% dengan tenor hingga 24 bulan</li>
          </ul>
        </div>
        <div class="rounded-xl bg-white/90 px-4 py-3 text-xs text-[#667085]">
          Pastikan data yang kamu masukkan sudah benar. Tim kami akan menghubungi kamu paling lambat 1x24 jam kerja.
        </div>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive } from 'vue'

const PRICE_PER_GRAM = 2_300_000
const gramOptions = [5, 10, 15, 25, 50, 100]

const form = reactive({ nama: '', hp: '', gram: gramOptions[0], tenor: 12 })

const totalHarga = computed(() => form.gram * PRICE_PER_GRAM)

const formatCurrency = (value, withoutPrefix = false) => {
  if (Number.isNaN(value)) return withoutPrefix ? '0' : 'Rp 0'

  if (withoutPrefix) {
    return value.toLocaleString('id-ID')
  }

  return value.toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  })
}

const submit = () => {
  alert(
    `Terima kasih, ${form.nama}! Pengajuan cicil emas ${form.gram} gram (estimasi harga ${formatCurrency(
      totalHarga.value
    )}) dengan tenor ${form.tenor} bulan telah diterima.`
  )
}
</script>
