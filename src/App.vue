<template>
  <h1 class="text-3xl font-bold underline">Technical Test</h1>
  <p>Check whether my data provider payments are over or under benchmark</p>
  <PaymentBenchmarkAssesment />
  <YearlyTrendChart />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { getProductBenchmarks, getExchangeRates } from './data/api.ts';
  import PaymentBenchmarkAssesment from './components/PaymentBenchmarkAssesment.vue';
  import YearlyTrendChart from './components/YearlyTrendChart.vue';

  onMounted(async () => {
  try {
    // Fetch data 
    const productBenchmarks = await getProductBenchmarks();
    console.log('Product Benchmarks:', productBenchmarks);

    const exchangeRates = await getExchangeRates();
    console.log('Exchange Rates:', exchangeRates);
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
});
</script>

<style scoped>

</style>
