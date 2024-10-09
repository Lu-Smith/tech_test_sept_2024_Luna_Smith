<template>
  <h1 class="text-3xl font-bold underline">Technical Test</h1>
  <p>Check whether my data provider payments are over or under benchmark</p>
  <PaymentBenchmarkAssesment :transactions="transactions" />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { getProductBenchmarks, getExchangeRates } from './data/api.ts';
  import PaymentBenchmarkAssesment from './components/PaymentBenchmarkAssesment.vue';

  interface Currency {
    id: number;
    name: string;
    symbol: string;
  }

  interface Benchmark {
    benchmark: number;
    currency: Currency;
    payment: number;
    provider_name: string;
    product_name: string;
    start_date: string;
    end_date: string;
  }

  interface Transaction {
  provider_name: string;
  payment: number;
  benchmark: number;
  currency: Currency;
  date: string;
}

const transactions = ref<Transaction[]>([]);

onMounted(async () => {
  try {
    const productBenchmarks = await getProductBenchmarks();
    const exchangeRates = await getExchangeRates();

    transactions.value = processProviderData(productBenchmarks.product_benchmarks, exchangeRates.exchange_rates);
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
});

function processProviderData(benchmarks: Benchmark[], rates: any): Transaction[] {
  const transactionList: Transaction[] = [];

  for (const benchmark of benchmarks) {
    const { provider_name, payment, currency, benchmark: benchmarkValue, start_date } = benchmark;

    let convertedPayment = payment;
    let convertedBenchmark = benchmarkValue;
    if (currency.id !== 3) { 
         // ID 3 is EUR
         const exchangeRateEntry = rates.find(rate => 
        rate.from_currency_id === currency.id && rate.to_currency_id === 3
      );

      if (exchangeRateEntry) {
        const exchangeRate = exchangeRateEntry.exchange_rate;
        convertedPayment = payment * exchangeRate;
        convertedBenchmark = benchmarkValue * exchangeRate;
      } else {
        console.warn(`No exchange rate found for currency ID ${currency.id} to EUR`); // Log if no exchange rate is found
      }
    } else {
      convertedPayment = payment;
    }

    transactionList.push({
      provider_name,
      payment: convertedPayment,
      benchmark: convertedBenchmark,
      currency,
      date: start_date,
    });
  }

  return transactionList;
}
</script>
