<template>
  <h1 class="text-3xl font-bold mb-6 bg-gray-100 p-4">Technical Test <span class="text-xl text-green-900">- Luna Smith</span></h1>
  <p class="sm:text-base text-sm ">Check whether the provider payments are over or under benchmark.</p>
  <div class="p-4">
    <PaymentBenchmarkAssesment :transactions="transactions" />
  </div>
  <Footer />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { getProductBenchmarks, getExchangeRates } from './data/api.ts';
  import PaymentBenchmarkAssesment from './components/PaymentBenchmarkAssesment.vue';
  import Footer from './components/Footer.vue';
  import { Transaction, Benchmark, ExchangeRate} from './data/interfaces.ts';  

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

function processProviderData(benchmarks: Benchmark[], rates: ExchangeRate[]): Transaction[] {
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
