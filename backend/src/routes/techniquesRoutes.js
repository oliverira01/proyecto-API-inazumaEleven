import express from 'express';
import {
  getTechniques,
  getTechniqueById,
  getTechniquePowerLevels,
  getTechniquePlayers
} from '../controllers/techniquesController.js';

const router = express.Router();

router.get('/',                        getTechniques);
router.get('/:techEntryId',            getTechniqueById);
router.get('/:techEntryId/levels',     getTechniquePowerLevels);
router.get('/:techEntryId/players',    getTechniquePlayers);

export default router;