import express from 'express';
import {
  getMatchChains,
  getMatchChainById,
  getMatchChainTeams,
  getMatchChainDrops
} from '../controllers/matchChainsController.js';

const router = express.Router();

router.get('/',                          getMatchChains);
router.get('/:id',                       getMatchChainById);
router.get('/:id/teams',                 getMatchChainTeams);
router.get('/teams/:chainTeamId/drops',  getMatchChainDrops);

export default router;