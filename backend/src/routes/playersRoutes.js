import express from 'express';
import { getPlayers, getPlayerById, getPlayerStats, getPlayerTechniques, getTechniqueLevelPower } from '../controllers/playersController.js';

const router = express.Router();

router.get('/', getPlayers);
router.get('/:id', getPlayerById);
router.get('/:entryId/stats', getPlayerStats);
router.get('/:entryId/techniques',getPlayerTechniques);
router.get('/techniques/:techEntryId/power', getTechniqueLevelPower);

export default router;