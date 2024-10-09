import axios from 'axios';

const BASE_URL = 'https://substantive.pythonanywhere.com';

const API_KEY = ' 590e3e17b6a26a8fcda726e2a91520e476e2c894';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'auth-key': API_KEY,
  },
});

export interface ProductBenchmark {
  id: number;
  provider_name: string;
  product_name: string;
  start_date: string;
  end_date: string;
  currency: {
    id: number;
    name: string;
    symbol: string;
  };
  payment: number;
  benchmark: number;
}

export interface ExchangeRate {
  exchange_rate: number;
  from_currency_id: number;
  to_currency_id: number;
  year: number;
}

export const getProductBenchmarks = async () => {
  const response = await apiClient.get<{ product_benchmarks: ProductBenchmark[] }>('/product_benchmarks');
  return response.data;
};

export const getExchangeRates = async () => {
  const response = await apiClient.get<{ exchange_rates: ExchangeRate[] }>('/exchange_rates');
  return response.data;
};

export default {
  getProductBenchmarks,
  getExchangeRates,
};


