<template>
  <footer class="mt-16 text-white">
    <section
      class="relative overflow-hidden shadow-2xl"
      aria-labelledby="byond-footer-heading"
    >
      <!-- Background Image with Overlay -->
      <div class="relative">
        <img
          :src="bg"
          alt="Suasana tim BYOND"
          class="h-[400px] w-full object-cover brightness-90"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/60 to-slate-900/80"></div>

        <!-- BYOND Content Overlay -->
        <div class="absolute inset-0 z-10 flex items-center justify-center px-6">
          <div class="flex max-w-xl flex-col items-center gap-6 text-center">
            <div class="rounded-[22px] bg-white/95 p-4 shadow-xl shadow-black/20 backdrop-blur">
              <img :src="logo" alt="BYOND by BSI" class="h-20 w-20 md:h-24 md:w-24 object-contain" />
            </div>
            <p id="byond-footer-heading" class="text-2xl font-bold md:text-3xl text-white drop-shadow-lg">#Semua Jadi Mudah</p>
            <div class="flex flex-wrap items-center justify-center gap-4">
              <a href="#" aria-label="Get it on Google Play">
                <img :src="badgePlay" class="h-10 md:h-11" alt="Unduh di Google Play" />
              </a>
              <a href="#" aria-label="Download on the App Store">
                <img :src="badgeApp" class="h-10 md:h-11" alt="Unduh di App Store" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- BSI Info Section (seamlessly connected) -->
      <div class="bg-gradient-to-b from-[#4a6268] via-[#5a7278] to-[#6a8288] py-10 text-white">
        <div class="mx-auto max-w-6xl px-6">
          <div class="grid gap-8 md:grid-cols-3">
            <div class="space-y-4">
              <img :src="logoWhite" class="h-12" alt="Bank Syariah Indonesia" />
              <div class="text-sm leading-relaxed">
                <div class="font-semibold text-base text-white">PT. Bank Syariah Indonesia</div>
                <p class="mt-2 text-white/85 text-xs">
                  Terdaftar dan diawasi oleh Otoritas Jasa Keuangan serta peserta penjaminan Lembaga Penjamin Simpanan.
                </p>
              </div>
              <div class="pt-2">
                <div class="text-xs font-semibold text-white/90 mb-3">
                  Media Sosial
                </div>
                <div class="flex items-center gap-2">
                  <a class="grid h-9 w-9 place-items-center rounded-lg bg-white/20 hover:bg-white/30 transition" href="#" aria-label="Instagram">
                    <img :src="ig" class="h-4" alt="Instagram" />
                  </a>
                  <a class="grid h-9 w-9 place-items-center rounded-lg bg-white/20 hover:bg-white/30 transition" href="#" aria-label="YouTube">
                    <img :src="yt" class="h-4" alt="YouTube" />
                  </a>
                  <a class="grid h-9 w-9 place-items-center rounded-lg bg-white/20 hover:bg-white/30 transition" href="#" aria-label="X">
                    <img :src="xLogo" class="h-4" alt="X" />
                  </a>
                </div>
              </div>
            </div>

            <div class="text-white">
              <div class="text-xs font-semibold text-white/90 mb-3">
                BSI Call Center
              </div>
              <div class="mt-2 text-5xl font-extrabold md:text-6xl">14040</div>
              <div class="mt-3 text-xs text-white/80">Hubungi Kami</div>
              <div class="text-sm font-medium text-white">+62 815 84114040</div>
            </div>

            <div class="text-white">
              <div class="text-xs font-semibold text-white/90 mb-3">
                Kantor Pusat BSI
              </div>
              <p class="mt-2 text-xs leading-relaxed text-white/85">
                Jl. Gatot Subroto No.27, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12930, Indonesia
              </p>
            </div>
          </div>

          <div class="mt-8 border-t border-white/30"></div>
          <div class="py-4 text-center text-xs text-white/80">
            Copyright &copy; 2025 Bank Syariah Indonesia. All rights reserved.
          </div>
        </div>
      </div>
    </section>
  </footer>
</template>

<script setup>
import bg from '../assets/bg-byond.png'
import logo from '../assets/byond.png'
import badgePlay from '../assets/Google Play.png'
import badgeApp from '../assets/App Store.png'
import logoWhite from '../assets/BSI White Logo.png'
import ig from '../assets/ig.svg'
import xLogo from '../assets/X.svg'
import yt from '../assets/yt.svg'
</script>
