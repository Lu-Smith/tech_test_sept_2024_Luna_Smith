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
const differences = ref<number[]>([]);
const benchmarks = ref<number[]>([]);
const chartRef = ref<Chart | null>(null); 
const chartCanvas = ref<HTMLCanvasElement | null>(null);

watch(() => props.transactions, () => {
  extractYearlyData();
  extractDifferenceData()
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

// Extract yearly difference data
function extractDifferenceData() {
  const differenceData: Record<number, number> = {};

  props.transactions.forEach(transaction => {
    const year = new Date(transaction.date).getFullYear();
    if (!differenceData[year]) {
      differenceData[year] = 0;
    }
    // Calculate the difference as payment - benchmark
    differenceData[year] += (transaction.payment - transaction.benchmark);
  });

  // Map the calculated differences to the years array
  differences.value = years.value.map(year => differenceData[year] || 0); // Ensure to return 0 if undefined
}

// Extract yearly benchmark data
function extractBenchmarkData() {
    const benchmarkData: Record<number, number> = {};

    props.transactions.forEach(transaction => {
        const year = new Date(transaction.date).getFullYear();
        if (!benchmarkData[year]) {
            benchmarkData[year] = 0;
        }
        benchmarkData[year] += transaction.benchmark; // Total benchmarks per year
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
        type: 'bar', // Main chart type for payments
        data: {
            labels: years.value,
            datasets: [
                {
                    label: 'Yearly Payment Trend (€)',
                    data: payments.value,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)', // Bar color
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    tension: 0.1,
                    type: 'bar', // Explicitly set this dataset as bar type
                },
                {
                    label: 'Total Difference (€)',
                    data: differences.value,
                    borderColor: 'rgba(255, 99, 132, 1)', // Different color for differences
                    backgroundColor: 'rgba(255, 99, 132, 0)', // No fill for the line
                    borderWidth: 2,
                    fill: false, // Do not fill under the line
                    tension: 0.1, // Smoothness of the line
                    type: 'line', // Explicitly set this dataset as line type
                    pointRadius: 5, // Optional: Make points more visible
                },
                {
                    label: 'Yearly Benchmark Trend (€)',
                    data: benchmarks.value, // Assuming benchmarks.value is defined and contains benchmark data
                    borderColor: 'rgba(54, 162, 235, 1)', // Line color for benchmarks
                    backgroundColor: 'rgba(54, 162, 235, 0)', // No fill for the line
                    borderWidth: 2,
                    fill: false, // No fill under the line
                    tension: 0.1, // Smoothness of the line
                    type: 'line', // Explicitly set this dataset as line type
                    pointRadius: 5, // Optional: Make points more visible
                }
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
                        text: 'Amount (€)',
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
  extractDifferenceData()
  extractBenchmarkData();
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
