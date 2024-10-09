<template>
  <h1 class="text-3xl font-bold underline">Hello world</h1>
  <p>...</p>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { getProductBenchmarks, getExchangeRates } from './data/api.ts';

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
