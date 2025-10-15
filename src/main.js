import { createApp } from 'vue'
import './styles/style.css'
import './plugins/chart.js'
import App from './App.vue'
import router from './router'
import VueApexCharts from 'vue3-apexcharts'
import { warnConsole } from './warnconsole'


const app = createApp(App)
app.use(router)
warnConsole()
app.component('apexchart', VueApexCharts)
app.mount('#app')
