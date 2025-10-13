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
router.beforeEach((to, _from, next) => {
  const isAuthenticated = localStorage.getItem('admin_auth')

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect ke login jika belum login
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    // Redirect ke admin jika sudah login
    next('/admin')
  } else {
    next()
  }
})

export default router
