import express from 'express';
import {
  getDailyTechniqueChallenge,
  submitTechniqueGuess,
  searchTechniques
} from '../controllers/techniqueGameController.js';

const router = express.Router();

router.get('/daily',   getDailyTechniqueChallenge);
router.post('/guess',  submitTechniqueGuess);
router.get('/search',  searchTechniques);

export default router;