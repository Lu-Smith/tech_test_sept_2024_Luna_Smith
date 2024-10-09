declare module 'api' {
  export const getProductBenchmarks: () => Promise<any>;
  export const getExchangeRates: () => Promise<any>;

  const apiData: {
    getProductBenchmarks: typeof getProductBenchmarks;
    getExchangeRates: typeof getExchangeRates;
  };
  export default apiData;
}