import express from 'express';
import { getPlayers, getPlayerById, getPlayerStats } from '../controllers/playersController.js';

const router = express.Router();

router.get('/', getPlayers);
router.get('/:id', getPlayerById);
router.get('/:entryId/stats', getPlayerStats);

export default router;