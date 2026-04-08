import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api';

export const getPlayers = (filters = {}) => {
  return axios.get(`${BASE_URL}/players`, { params: filters });
};

export const getPlayerById = (id) => {
  return axios.get(`${BASE_URL}/players/${id}`);
};

export const getPlayerStats = (entryId) => {
  return axios.get(`${BASE_URL}/players/${entryId}/stats`);
};

export const getPlayerTechniques = (entryId) => {
  return axios.get(`${BASE_URL}/players/${entryId}/techniques`);
};

export const getTechniqueLevelPower = (techEntryId) => {
  return axios.get(`${BASE_URL}/players/techniques/${techEntryId}/power`);
};