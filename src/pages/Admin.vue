<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <!-- Header -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <img src="/src/assets/BSI (Bank Syariah Indonesia) Logo.png" class="h-10 w-auto" alt="BSI" />
            <div class="border-l border-slate-300 pl-4">
              <h1 class="text-xl font-bold text-slate-800">Admin Dashboard</h1>
              <p class="text-sm text-slate-500">Customer Management</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="text-right">
              <p class="text-sm font-semibold text-slate-700">{{ adminUsername }}</p>
              <p class="text-xs text-slate-500">Administrator</p>
            </div>
            <button @click="handleLogout" class="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-6 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-sm font-medium">Total Customers</p>
              <p class="text-3xl font-bold mt-2">{{ total }}</p>
            </div>
            <div class="bg-white/20 p-3 rounded-xl">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-100 text-sm font-medium">Active Users</p>
              <p class="text-3xl font-bold mt-2">{{ activeCount }}</p>
            </div>
            <div class="bg-white/20 p-3 rounded-xl">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-100 text-sm font-medium">Inactive Users</p>
              <p class="text-3xl font-bold mt-2">{{ inactiveCount }}</p>
            </div>
            <div class="bg-white/20 p-3 rounded-xl">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters & Actions -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
        <div class="flex flex-wrap gap-4 items-end">
          <!-- Search -->
          <div class="flex-1 min-w-[250px]">
            <label class="block text-sm font-semibold text-slate-700 mb-2">Cari Customer</label>
            <div class="relative">
              <input
                v-model="q"
                @input="debouncedFetch()"
                class="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b6a1] focus:border-transparent transition-all"
                placeholder="Cari nama atau email..."
              />
              <svg class="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>

          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Status</label>
            <select v-model="status" @change="goToPage(1)" class="px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b6a1] bg-white min-w-[150px]">
              <option value="">Semua Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <!-- Sort By -->
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Urutkan</label>
            <select v-model="sortBy" @change="goToPage(1)" class="px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b6a1] bg-white min-w-[150px]">
              <option value="createdAt">Tanggal Dibuat</option>
              <option value="name">Nama</option>
              <option value="email">Email</option>
              <option value="status">Status</option>
            </select>
          </div>

          <!-- Sort Direction -->
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Arah</label>
            <select v-model="sortDir" @change="goToPage(1)" class="px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b6a1] bg-white">
              <option value="desc">Menurun</option>
              <option value="asc">Menaik</option>
            </select>
          </div>

          <!-- Per Page -->
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Per Halaman</label>
            <select v-model.number="limit" @change="goToPage(1)" class="px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b6a1] bg-white">
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
            </select>
          </div>

          <!-- Download CSV Button -->
          <button
            @click="downloadCSV"
            class="px-6 py-2.5 bg-gradient-to-r from-[#00b6a1] to-[#009488] text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Download CSV
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">ID</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Nama</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Email</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Tanggal Dibuat</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-200">
              <tr v-for="c in rows" :key="c.id" class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">#{{ c.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">{{ c.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{{ c.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="c.status === 'active'
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'"
                    class="px-3 py-1 rounded-full text-xs font-semibold"
                  >
                    {{ c.status === 'active' ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{{ fmtDate(c.createdAt) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    @click="sendEmail(c)"
                    :disabled="sendingId === c.id"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    {{ sendingId === c.id ? 'Mengirim...' : 'Kirim Email' }}
                  </button>
                </td>
              </tr>
              <tr v-if="!loading && rows.length === 0">
                <td colspan="6" class="px-6 py-12 text-center text-slate-500">
                  <svg class="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                  </svg>
                  <p class="font-semibold">Tidak ada data customer</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="bg-slate-50 px-6 py-4 border-t border-slate-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-slate-600">
              Menampilkan <span class="font-semibold">{{ rows.length }}</span> dari <span class="font-semibold">{{ total }}</span> customer
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="goToPage(page - 1)"
                :disabled="page <= 1 || loading"
                class="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <div class="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700">
                {{ page }} / {{ totalPages }}
              </div>
              <button
                @click="goToPage(page + 1)"
                :disabled="page >= totalPages || loading"
                class="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Status Messages -->
      <div v-if="loading" class="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
        <svg class="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-blue-700 font-medium">Memuat data...</p>
      </div>

      <div v-if="error" class="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
        <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p class="text-red-700 font-medium">{{ error }}</p>
      </div>

      <div v-if="okMsg" class="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
        <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p class="text-green-700 font-medium">{{ okMsg }}</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const page = ref(1);
const limit = ref(10);
const q = ref("");
const status = ref("");
const sortBy = ref("createdAt");
const sortDir = ref("desc");

const rows = ref([]);
const total = ref(0);
const totalPages = ref(1);
const loading = ref(false);
const error = ref("");
const okMsg = ref("");
const sendingId = ref(null);

const adminUsername = ref(localStorage.getItem('admin_username') || 'Admin');

// Computed stats
const activeCount = computed(() => rows.value.filter(r => r.status === 'active').length);
const inactiveCount = computed(() => rows.value.filter(r => r.status === 'inactive').length);

const aborter = ref(null);

function authHeader() {
  const auth = localStorage.getItem('admin_auth');
  return auth ? { Authorization: `Basic ${auth}` } : {};
}

function buildQuery(over = {}) {
  const p = new URLSearchParams({
    page: String(page.value),
    limit: String(limit.value),
    q: q.value,
    status: status.value,
    sortBy: sortBy.value,
    sortDir: sortDir.value,
    ...over,
  });
  return p.toString();
}

async function fetchData() {
  loading.value = true;
  error.value = "";
  okMsg.value = "";

  if (aborter.value) aborter.value.abort();
  aborter.value = new AbortController();

  try {
    const res = await fetch(`/api/admin/customers?${buildQuery()}`, {
      headers: authHeader(),
      signal: aborter.value.signal,
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(t || `HTTP ${res.status}`);
    }
    const json = await res.json();
    rows.value = json.data;
    total.value = json.total;
    totalPages.value = json.totalPages;
  } catch (e) {
    if (e.name !== 'AbortError') {
      error.value = e.message || "Gagal memuat data";
    }
  } finally {
    loading.value = false;
  }
}

function goToPage(p) {
  page.value = Math.max(1, Math.min(p, totalPages.value || 1));
  fetchData();
}

function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return iso;
  }
}

async function sendEmail(c) {
  error.value = "";
  okMsg.value = "";
  sendingId.value = c.id;
  try {
    const res = await fetch(`/api/admin/customers/${c.id}/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader() },
      body: JSON.stringify({}),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.ok === false) {
      throw new Error(data.message || `Gagal mengirim ke ${c.email}`);
    }
    okMsg.value = data.message || `Email berhasil dikirim ke ${c.email}`;

    // Auto hide success message
    setTimeout(() => {
      okMsg.value = "";
    }, 5000);
  } catch (e) {
    error.value = e.message || "Gagal mengirim email";
  } finally {
    sendingId.value = null;
  }
}

function downloadCSV() {
  error.value = "";
  const qs = buildQuery({ page: undefined, limit: undefined });
  const url = `/api/admin/customers/export.csv?${qs}`;

  fetch(url, { headers: authHeader() })
    .then(async (res) => {
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || `HTTP ${res.status}`);
      }
      return res.blob();
    })
    .then((blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `customers-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(link.href);

      okMsg.value = "CSV berhasil diunduh";
      setTimeout(() => {
        okMsg.value = "";
      }, 3000);
    })
    .catch((e) => (error.value = e.message || "Gagal unduh CSV"));
}

let debounceTimer;
function debouncedFetch() {
  page.value = 1;
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(fetchData, 350);
}

function handleLogout() {
  localStorage.removeItem('admin_auth');
  localStorage.removeItem('admin_username');
  router.push('/login');
}

onMounted(() => {
  // Check if user is authenticated
  const auth = localStorage.getItem('admin_auth');
  if (!auth) {
    router.push('/login');
    return;
  }
  fetchData();
});
</script>
