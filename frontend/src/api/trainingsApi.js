import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api';

export const getTrainings = (filters = {}) => {
  return axios.get(`${BASE_URL}/trainings`, { params: filters });
};