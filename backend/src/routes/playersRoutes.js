import express from 'express';
import { getPlayers, getPlayerById } from '../controllers/playersController.js';

const router = express.Router();

router.get('/',     getPlayers);
router.get('/:id',  getPlayerById);

export default router;