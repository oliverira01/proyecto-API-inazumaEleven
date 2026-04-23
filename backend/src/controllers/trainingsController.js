import { findAllTrainings } from '../repositories/trainingsRepository.js';

export const getTrainings = async (req, res) => {
  try {
    const { game } = req.query;
    const trainings = await findAllTrainings({ game });
    res.json(trainings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener entrenamientos' });
  }
};