import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api';

export const getDailyChallenge = () => {
  return axios.get(`${BASE_URL}/inazudle/daily`);
};

export const submitGuess = (guessedPlayerId) => {
  return axios.post(`${BASE_URL}/inazudle/guess`, { guessedPlayerId });
};

export const searchPlayers = (name) => {
  return axios.get(`${BASE_URL}/inazudle/search`, { params: { name } });
};