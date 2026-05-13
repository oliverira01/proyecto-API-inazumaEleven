import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api';

export const getTournaments = () =>
  axios.get(`${BASE_URL}/tournaments`);

export const getTournamentRequiredPlayers = (id) =>
  axios.get(`${BASE_URL}/tournaments/${id}/required-players`);

export const getTournamentTeams = (id) =>
  axios.get(`${BASE_URL}/tournaments/${id}/teams`);

export const getTournamentTeamDrops = (tournamentTeamId) =>
  axios.get(`${BASE_URL}/tournaments/teams/${tournamentTeamId}/drops`);

export const getTournamentRewards = (id) =>
  axios.get(`${BASE_URL}/tournaments/${id}/rewards`);