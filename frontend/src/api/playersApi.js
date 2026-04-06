import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api';

export const getPlayers = (filters = {}) => {
  return axios.get(`${BASE_URL}/players`, { params: filters });
};

export const getPlayerById = (id) => {
  return axios.get(`${BASE_URL}/players/${id}`);
};