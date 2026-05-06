import pool from '../config/db.js';

export const getDailyTechnique = async () => {
  const today = new Date().toISOString().split('T')[0];

  const [existing] = await pool.query(
    'SELECT technique_id FROM daily_challenges WHERE date = ?',
    [today]
  );

  if (existing.length > 0 && existing[0].technique_id) {
    return getTechniqueForGame(existing[0].technique_id);
  }

  const [techniques] = await pool.query(
    'SELECT id FROM techniques WHERE image_url IS NOT NULL'
  );
  if (techniques.length === 0) return null;

  const random = techniques[Math.floor(Math.random() * techniques.length)];

  if (existing.length > 0) {
    await pool.query(
      'UPDATE daily_challenges SET technique_id = ? WHERE date = ?',
      [random.id, today]
    );
  } else {
    await pool.query(
      'INSERT INTO daily_challenges (date, technique_id) VALUES (?, ?)',
      [today, random.id]
    );
  }

  return getTechniqueForGame(random.id);
};

const getTechniqueForGame = async (techniqueId) => {
  const [rows] = await pool.query(`
    SELECT
      t.id, t.name, t.image_url, t.element, t.type,
      tge.game, tge.pt_cost, tge.base_power, tge.obtain_method
    FROM techniques t
    LEFT JOIN technique_game_entries tge ON tge.technique_id = t.id
    WHERE t.id = ?
    LIMIT 1
  `, [techniqueId]);
  return rows[0] ?? null;
};

export const searchTechniquesByName = async (name) => {
  const [rows] = await pool.query(`
    SELECT DISTINCT id, name, image_url
    FROM techniques
    WHERE name LIKE ?
    LIMIT 10
  `, [`%${name}%`]);
  return rows;
};

export const verifyTechniqueGuess = async (guessedId) => {
  const today = new Date().toISOString().split('T')[0];
  const [rows] = await pool.query(
    'SELECT technique_id FROM daily_challenges WHERE date = ?',
    [today]
  );
  if (!rows.length) return null;
  return {
    isCorrect: rows[0].technique_id === parseInt(guessedId),
    technique_id: rows[0].technique_id,
  };
};