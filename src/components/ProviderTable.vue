<template>
  <table class="table table-striped">
    <thead>
      <tr>
        <th>Payment (€)</th>
        <th>Benchmark (€)</th>
        <th>Difference (€)</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="transaction in transactions" :key="transaction.date + transaction.provider_name">
        <td>{{ transaction.payment.toFixed(2) }}</td>
        <td>{{ transaction.benchmark.toFixed(2) }}</td>
        <td :class="{ 'text-success': transaction.payment > transaction.benchmark, 'text-danger': transaction.payment < transaction.benchmark }">
          {{ (transaction.payment - transaction.benchmark).toFixed(2) }}
        </td>
        <td>{{ transaction.date }}</td>
      </tr>
      <tr>
        <td colspan="2"><strong>Total Difference</strong></td>
        <td :class="{ 'text-success': totalDifference > 0, 'text-danger': totalDifference < 0 }">
        €{{ totalDifference.toFixed(2) }}
        </td>
        <td></td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Transaction {
  provider_name: string;
  payment: number;
  benchmark: number;
  date: string;
}

const props = defineProps<{ transactions: Transaction[] }>();

const totalDifference = computed(() => {
  return props.transactions.reduce((acc, transaction) => {
    return acc + (transaction.payment - transaction.benchmark);
  }, 0);
});
</script>