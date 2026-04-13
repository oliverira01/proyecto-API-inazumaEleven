import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api';

export const getTechniques = (filters = {}) => {
  return axios.get(`${BASE_URL}/techniques`, { params: filters });
};

export const getTechniqueById = (techEntryId) => {
  return axios.get(`${BASE_URL}/techniques/${techEntryId}`);
};

export const getTechniquePowerLevels = (techEntryId) => {
  return axios.get(`${BASE_URL}/techniques/${techEntryId}/levels`);
};

export const getTechniquePlayers = (techEntryId) => {
  return axios.get(`${BASE_URL}/techniques/${techEntryId}/players`);
};