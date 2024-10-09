<template>
  <div v-if="years.length > 1"> 
    <h4>Yearly Payment Trend</h4>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface Transaction {
  provider_name: string;
  payment: number;
  benchmark: number;
  date: string;
}

const props = defineProps<{ transactions: Transaction[] }>();

const years = ref<number[]>([]);
const payments = ref<number[]>([]);
const chartRef = ref<Chart | null>(null); 
const chartCanvas = ref<HTMLCanvasElement | null>(null);

watch(() => props.transactions, () => {
  extractYearlyData();
  renderChart();
}, { immediate: true });

// Extract yearly payment data
function extractYearlyData() {
  const yearlyData: Record<number, number> = {};

  props.transactions.forEach(transaction => {
    const year = new Date(transaction.date).getFullYear();
    if (!yearlyData[year]) {
      yearlyData[year] = 0;
    }
    yearlyData[year] += transaction.payment; 
  });

  years.value = Object.keys(yearlyData).map(Number).sort((a, b) => a - b);
  payments.value = years.value.map(year => yearlyData[year]);
}

// Render the chart
function renderChart() {
  // Destroy the previous chart 
  if (chartRef.value) {
    chartRef.value.destroy();
  }

  const ctx = chartCanvas.value?.getContext('2d');
  if (ctx) {
    chartRef.value = new Chart(ctx, {
      type: 'line',
      data: {
        labels: years.value,
        datasets: [
          {
            label: 'Yearly Payment Trend (€)',
            data: payments.value,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            fill: true,
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Year',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Payment (€)',
            },
            beginAtZero: true,
          },
        },
      },
    });
  }
}

// Clean
onBeforeUnmount(() => {
  if (chartRef.value) {
    chartRef.value.destroy();
  }
});

onMounted(() => {
  extractYearlyData();
  renderChart();
});
</script>

<style scoped>
canvas {
  max-width: 60%;
  max-height: 400px;
  margin: 20px 0;
}
</style>
