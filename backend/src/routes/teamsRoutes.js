import express from 'express';
import { getTeams, getTeamById, getTeamPlayers } from '../controllers/teamsController.js';

const router = express.Router();

router.get('/', getTeams);
router.get('/:id',  getTeamById);
router.get('/:id/players', getTeamPlayers);

export default router;