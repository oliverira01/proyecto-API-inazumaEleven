import express from 'express';
import {
  getTournaments,
  getTournamentById,
  getTournamentRequiredPlayers,
  getTournamentTeams,
  getTournamentTeamDrops,
  getTournamentRewards
} from '../controllers/tournamentsController.js';

const router = express.Router();

router.get('/',                              getTournaments);
router.get('/:id',                           getTournamentById);
router.get('/:id/required-players',          getTournamentRequiredPlayers);
router.get('/:id/teams',                     getTournamentTeams);
router.get('/teams/:tournamentTeamId/drops', getTournamentTeamDrops);
router.get('/:id/rewards',                   getTournamentRewards);

export default router;