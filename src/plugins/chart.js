// src/plugins/chart.js
import {
  Chart, LineElement, PointElement, LineController,
  CategoryScale, LinearScale, Tooltip, Filler, Legend,
  BarElement, BarController
} from 'chart.js'
Chart.register(
  LineElement, PointElement, LineController,
  CategoryScale, LinearScale, Tooltip, Filler, Legend,
  BarElement, BarController
)
export default Chart
