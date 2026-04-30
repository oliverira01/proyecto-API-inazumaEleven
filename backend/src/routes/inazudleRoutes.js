import express from 'express';
import { getDailyChallenge, submitGuess, searchPlayers } from '../controllers/inazudleController.js';

const router = express.Router();

router.get('/daily',   getDailyChallenge);
router.post('/guess',  submitGuess);
router.get('/search',  searchPlayers);

export default router;