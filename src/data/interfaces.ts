export interface Currency {
  id: number;
  name: string;
  symbol: string;
}

export interface Benchmark {
  benchmark: number;
  currency: Currency;
  payment: number;
  provider_name: string;
  product_name: string;
  start_date: string;
  end_date: string;
}

export interface Transaction {
  provider_name: string;
  payment: number;
  benchmark: number;
  currency: Currency;
  date: string;
}

export interface ExchangeRate {
  from_currency_id: number;
  to_currency_id: number;
  exchange_rate: number;
}