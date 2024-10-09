import axios from 'axios';

const BASE_URL = 'https://substantive.pythonanywhere.com';

const AUTH_KEY = '590e3e17b6a26a8fcda726e2a91520e476e2c894';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${AUTH_KEY}`,
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

export const getProductBenchmarks = async () => {
  const response = await apiClient.get<{ product_benchmarks: ProductBenchmark[] }>('/product_benchmarks');
  return response.data;
};


