import axios from 'axios';

const BASE_URL = 'https://substantive.pythonanywhere.com';

const AUTH_KEY = '590e3e17b6a26a8fcda726e2a91520e476e2c894';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${AUTH_KEY}`,
  },
});