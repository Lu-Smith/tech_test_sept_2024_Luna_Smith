<template>
  <div>
    <h2>Payment vs. Benchmark Assessment</h2>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Provider Name</th>
          <th>Payment (€)</th>
          <th>Benchmark (€)</th>
          <th>Difference (€)</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="transaction in transactions" :key="transaction.provider_name + transaction.date">
          <td>{{ transaction.provider_name }}</td>
          <td>{{ transaction.payment.toFixed(2) }}</td>
          <td>{{ transaction.benchmark.toFixed(2) }}</td>
          <td :class="{ 'text-success': transaction.payment > transaction.benchmark, 'text-danger': transaction.payment < transaction.benchmark }">
            {{ (transaction.payment - transaction.benchmark).toFixed(2) }}
          </td>
          <td>{{ transaction.date }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
interface Currency {
  id: number;
  name: string;
  symbol: string;
}

interface Transaction {
  provider_name: string;
  payment: number;
  benchmark: number;
  date: string;
}

const props = defineProps<{ transactions: Transaction[] }>();
</script>