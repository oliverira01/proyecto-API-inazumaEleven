import {
  getDailyTechnique,
  searchTechniquesByName,
  verifyTechniqueGuess
} from '../repositories/techniqueGameRepository.js';
import pool from '../config/db.js';

export const getDailyTechniqueChallenge = async (req, res) => {
  try {
    const technique = await getDailyTechnique();
    if (!technique) return res.status(404).json({ error: 'No hay técnicas con imagen' });
    res.json({ id: technique.id, image_url: technique.image_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener la técnica del día' });
  }
};

export const submitTechniqueGuess = async (req, res) => {
  try {
    const { guessedId } = req.body;
    const result = await verifyTechniqueGuess(guessedId);
    if (!result) return res.status(404).json({ error: 'No hay reto hoy' });

    if (result.isCorrect) {
      const [rows] = await pool.query(`
        SELECT t.id, t.name, t.image_url, t.element, t.type,
               tge.game, tge.obtain_method
        FROM techniques t
        LEFT JOIN technique_game_entries tge ON tge.technique_id = t.id
        WHERE t.id = ? LIMIT 1
      `, [result.technique_id]);
      return res.json({ isCorrect: true, technique: rows[0] });
    }

    res.json({ isCorrect: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al procesar el intento' });
  }
};

export const searchTechniques = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.json([]);
    const techniques = await searchTechniquesByName(name);
    res.json(techniques);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al buscar técnicas' });
  }
};