<template>
  <div v-if="years.length > 1"> 
    <h4>Yearly Payment Trend</h4>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">

interface Transaction {
  provider_name: string;
  payment: number;
  benchmark: number;
  date: string;
}

const props = defineProps<{ transactions: Transaction[] }>();

</script>

<style scoped>
canvas {
  max-width: 60%;
  max-height: 400px;
  margin: 20px 0;
}
</style>
