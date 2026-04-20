import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api';

export const getMatchChains = (filters = {}) => {
  return axios.get(`${BASE_URL}/match-chains`, { params: filters });
};

export const getMatchChainById = (id) => {
  return axios.get(`${BASE_URL}/match-chains/${id}`);
};

export const getMatchChainTeams = (id) => {
  return axios.get(`${BASE_URL}/match-chains/${id}/teams`);
};

export const getMatchChainDrops = (chainTeamId) => {
  return axios.get(`${BASE_URL}/match-chains/teams/${chainTeamId}/drops`);
};