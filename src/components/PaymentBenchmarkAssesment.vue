<template>
  <h2 class="font-bold my-6">Payment vs. Benchmark Assessment</h2>
  <div v-for="(group, providerName) in groupedTransactions" :key="providerName">
    <h3 class="p-2">Provider: <span class="font-bold">{{ providerName }}</span></h3>
    <ProviderTable :transactions="group" />
    <YearlyTrendChart :transactions="group" />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import ProviderTable from './ProviderTable.vue';
  import YearlyTrendChart from './YearlyTrendChart.vue';

  interface Transaction {
    provider_name: string;
    payment: number;
    benchmark: number;
    date: string;
  }

  const props = defineProps<{ transactions: Transaction[] }>();

  const groupedTransactions = computed(() => {
    const groups: Record<string, Transaction[]> = {};

    props.transactions.forEach(transaction => {
      if (!groups[transaction.provider_name]) {
        groups[transaction.provider_name] = [];
      }
      groups[transaction.provider_name].push(transaction);
    });

    return groups;
  });
</script>