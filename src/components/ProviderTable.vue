<template>
  <div class="sm:max-w-xl max-w-fit mx-auto overflow-x-auto">
    <table class="min-w-full bg-white border-2 border-solid border-green-100 shadow-md mb-6">
      <thead class="bg-green-100 uppercase sm:text-sm text-[10px]">
        <tr>
          <th class="sm:py-3 sm:px-6 py-1 px-1">Payment (€)</th>
          <th class="sm:py-3 sm:px-6 py-1 px-1">Benchmark (€)</th>
          <th class="sm:py-3 sm:px-6 py-1 px-1">Difference (€)</th>
          <th 
          class="sm:py-3 sm:px-6 py-1 px-1 cursor-pointer" 
          @click="changeSort('date')">
            Date
            <span v-if="currentSort === 'date'">
              {{ sortDirection === 'asc' ? '▲' : '▼' }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody class="text-gray-700 sm:text-sm text-[10px]">
        <tr 
        v-for="(transaction, index) in sortedTransactions" :key="transaction.date + transaction.provider_name + index"
        class="border-b border-gray-200 hover:bg-gray-100">
          <td class="sm:py-3 sm:px-6 py-1 px-1">{{ transaction.payment.toFixed(2) }}</td>
          <td class="sm:py-3 sm:px-6 py-1 px-1">{{ transaction.benchmark.toFixed(2) }}</td>
          <td class="sm:py-3 sm:px-6 py-1 px-1" :class="{ 'text-success': transaction.payment > transaction.benchmark, 'text-danger': transaction.payment < transaction.benchmark }">
            {{ (transaction.payment - transaction.benchmark).toFixed(2) }}
          </td>
          <td class="py-3 px-6">{{ transaction.date }}</td>
        </tr>
        <tr class="bg-gray-100 border-t border-gray-100 font-semibold">
          <td colspan="2" class="py-3 px-6 text-right"><strong>Total Difference</strong></td>
          <td class="sm:py-3 sm:px-6 py-1 px-1" :class="{ 'text-success': totalDifference > 0, 'text-danger': totalDifference < 0 }">
            €{{ totalDifference.toFixed(2) }}
          </td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
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