<template>
  <table class="table table-striped">
    <thead>
      <tr>
        <th>Payment (€)</th>
        <th>Benchmark (€)</th>
        <th>Difference (€)</th>
        <th @click="changeSort('date')">
          Date
          <span v-if="currentSort === 'date'">
            {{ sortDirection === 'asc' ? '▲' : '▼' }}
          </span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(transaction, index) in sortedTransactions" :key="transaction.date + transaction.provider_name + index">
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
import { ref, computed } from 'vue';

interface Transaction {
  provider_name: string;
  payment: number;
  benchmark: number;
  date: string;
}

const props = defineProps<{ transactions: Transaction[] }>();

// Sort date
const currentSort = ref<'date'>('date'); 
const sortDirection = ref<'asc' | 'desc'>('asc');

// Total
const totalDifference = computed(() => {
  return props.transactions.reduce((acc, transaction) => {
    return acc + (transaction.payment - transaction.benchmark);
  }, 0);
});

// Sort method
function changeSort(column: 'date') {
  if (currentSort.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  }
}

const sortedTransactions = computed(() => {
  const sorted = [...props.transactions]; 

  sorted.sort((a, b) => {
    const comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    return sortDirection.value === 'asc' ? comparison : -comparison;
  });

  return sorted;
});
</script>

<style scoped>
.text-success {
  color: green;
}

.text-danger {
  color: red;
}
</style>