import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api';

export const getDailyTechniqueChallenge = () =>
  axios.get(`${BASE_URL}/technique-game/daily`);

export const submitTechniqueGuess = (guessedId) =>
  axios.post(`${BASE_URL}/technique-game/guess`, { guessedId });

export const searchTechniques = (name) =>
  axios.get(`${BASE_URL}/technique-game/search`, { params: { name } });