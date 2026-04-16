import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api';

export const getItems = (filters = {}) => {
  return axios.get(`${BASE_URL}/items`, { params: filters });
};

export const getItemById = (itemEntryId) => {
  return axios.get(`${BASE_URL}/items/${itemEntryId}`);
};
