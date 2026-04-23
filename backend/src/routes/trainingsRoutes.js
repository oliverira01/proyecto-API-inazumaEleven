import express from 'express';
import { getTrainings } from '../controllers/trainingsController.js';

const router = express.Router();

router.get('/', getTrainings);

export default router;