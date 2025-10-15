import { createRouter, createWebHistory } from 'vue-router'

// pages
import Home from '../pages/Home.vue'
import HistoriHargaEmas from '../pages/HistoriHargaEmas.vue'
import PrediksiHargaEmas from '../pages/PrediksiHargaEmas.vue'
import KalkulatorCicilEmas from '../pages/KalkulatorCicilEmas.vue'
import BukaCicilEmas from '../pages/BukaCicilEmas.vue'
import Login from '../pages/Login.vue'
import Admin from '../pages/Admin.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/histori-harga-emas', component: HistoriHargaEmas },
  { path: '/prediksi-harga-emas', component: PrediksiHargaEmas },
  { path: '/kalkulator-cicil-emas', component: KalkulatorCicilEmas },
  { path: '/buka-cicil-emas', component: BukaCicilEmas },
  { path: '/login', component: Login },
  {
    path: '/admin',
    component: Admin,
    meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

// Navigation guard untuk proteksi halaman admin
router.beforeEach(async (to, _from, next) => {
  // Untuk cookie-based auth, kita cek apakah ada user di localStorage
  const adminUser = localStorage.getItem('admin_user')

  if (to.meta?.requiresAuth && !adminUser) {
    // Redirect ke login jika belum login
    next('/login')
  } else {
    next()
  }
})

export default router
