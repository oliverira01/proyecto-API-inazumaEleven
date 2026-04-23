import pool from '../config/db.js';

export const findAllTrainings = async ({ game } = {}) => {
  let query = `
    SELECT id, name, type, game, image_url, map_x, map_y
    FROM trainings
    WHERE 1=1
  `;
  const params = [];

  if (game) { query += ' AND game = ?'; params.push(game); }

  query += ' ORDER BY name';

  const [rows] = await pool.query(query, params);
  return rows;
};