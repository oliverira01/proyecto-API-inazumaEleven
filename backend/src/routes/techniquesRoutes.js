// routes/techniquesRoutes.js
import express from 'express';
import {  getAllTechniques, getTechniqueById, getTechniquesByElements, getTechniquesByAffinity } from '../controllers/techniquesController.js';

const router = express.Router();

router.get('/', getAllTechniques);
router.get('/:id', getTechniqueById);
router.get('/element/:element', getTechniquesByElements);
router.get('/affinity/:affinity', getTechniquesByAffinity);

export default router;