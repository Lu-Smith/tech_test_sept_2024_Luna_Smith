<template>
  <h2>Payment vs. Benchmark Assessment</h2>
  <div v-for="(group, providerName) in groupedTransactions" :key="providerName">
    <h3>Provider: {{ providerName }}</h3>
    <ProviderTable :transactions="group" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ProviderTable from './ProviderTable.vue';

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