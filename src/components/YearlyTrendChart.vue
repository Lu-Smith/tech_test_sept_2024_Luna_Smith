<template>
  <div 
  v-if="years.length > 1"
  class="p-4 border border-gray-200 shadow-md rounded-lg bg-white mb-8 sm:max-w-xl max-w-fit mx-auto"> 
    <h4 class="sm:text-xl text-sm font-semibold text-gray-700 mb-4">Yearly Payment Trend <span class="font-normal sm:text-lg text-[10px]">({{ providerName }})</span></h4>
    <canvas ref="chartCanvas" class="w-full"></canvas>
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
const benchmarks = ref<number[]>([]);
const chartRef = ref<Chart | null>(null); 
const chartCanvas = ref<HTMLCanvasElement | null>(null);
const providerName = ref<string>('');

watch(() => props.transactions, () => {
  if (props.transactions.length > 0) {
    providerName.value = props.transactions[0].provider_name; 
  }
  extractYearlyData();
  extractBenchmarkData();
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

// Extract yearly benchmark data
function extractBenchmarkData() {
    const benchmarkData: Record<number, number> = {};

    props.transactions.forEach(transaction => {
        const year = new Date(transaction.date).getFullYear();
        if (!benchmarkData[year]) {
            benchmarkData[year] = 0;
        }
        benchmarkData[year] += transaction.benchmark; 
    });

    // Update the years array based on benchmarks to ensure synchronization
    const benchmarkYears = Object.keys(benchmarkData).map(Number).sort((a, b) => a - b);
    benchmarks.value = benchmarkYears.map(year => benchmarkData[year]);
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
        type: 'bar', 
        data: {
            labels: years.value,
            datasets: [
                {
                    label: 'Yearly Payment Trend (€)',
                    data: payments.value,
                    backgroundColor: 'rgba(68, 179, 92, 0.6)', 
                    borderColor: 'rgba(68, 179, 92, 1)',
                    borderWidth: 1,
                    type: 'bar',
                },
                {
                    label: 'Yearly Benchmark Trend (€)',
                    data: benchmarks.value, 
                    borderColor: 'rgba(54, 162, 235, 1)', 
                    backgroundColor: 'rgba(54, 162, 235, 0)', 
                    borderWidth: 2,
                    fill: false, 
                    tension: 0.1, 
                    type: 'line', 
                    pointRadius: 5, 
                }
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                      font: {
                        size: window.innerWidth < 640 ? 10 : 12, 
                      },
                    },
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Year',
                        font: {
                          size: window.innerWidth < 640 ? 10 : 14, 
                        },
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Amount (€)',
                        font: {
                          size: window.innerWidth < 640 ? 10 : 14, 
                        },
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
  extractBenchmarkData();
  renderChart();
});
</script>
