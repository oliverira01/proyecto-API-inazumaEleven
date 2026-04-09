import pool from '../config/db.js';

export const findAllTechniques = async ({ game, name, element, affinity } = {}) => {
  let query = `
    SELECT
      t.id, t.name, t.description, t.element, t.type, t.image_url, t.sound_url,
      tge.id AS game_entry_id, tge.game, tge.pt_cost, tge.base_power, tge.level_up_formula, tge.obtain_method,
      tge.affinity
    FROM techniques t
    LEFT JOIN technique_game_entries tge ON tge.technique_id = t.id
    WHERE 1=1
  `;
  const params = [];

  if (game) {
    query += ' AND tge.game = ?';
    params.push(game);
  }
  if (name) {
    query += ' AND t.name LIKE ?';
    params.push(`%${name}%`);
  }
  if (element) {
    query += ' AND t.element = ?';
    params.push(element);
  }
  if (affinity) {
    query += ' AND tge.affinity = ?';
    params.push(affinity);
  }

  query += ' ORDER BY t.name';

  const [rows] = await pool.query(query, params);
  return rows;
};

export const findTechniqueById = async (id) => {
  const [rows] = await pool.query(`
    SELECT
      t.id, t.name, t.description, t.element, t.type, t.image_url, t.sound_url,
      tge.id AS game_entry_id, tge.game, tge.pt_cost, tge.base_power, tge.level_up_formula, tge.obtain_method,
      tge.affinity
    FROM techniques t
    LEFT JOIN technique_game_entries tge ON tge.technique_id = t.id
    WHERE t.id = ?
  `, [id]);

  return rows[0] ?? null;
};

export const findTechniqueGameEntries = async (techniqueId) => {
  const [rows] = await pool.query(`
    SELECT *
    FROM technique_game_entries
    WHERE technique_id = ?
  `, [techniqueId]);

  return rows;
};

export const createTechnique = async (techData) => {
  const { name, description, element, type, image_url, sound_url } = techData;

  const [result] = await pool.query(`
    INSERT INTO techniques (name, description, element, type, image_url, sound_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [name, description, element, type, image_url, sound_url]);

  return result.insertId;
};

export const createTechniqueGameEntry = async (techEntryData) => {
  const { technique_id, game, pt_cost, base_power, level_up_formula, obtain_method, affinity } = techEntryData;

  const [result] = await pool.query(`
    INSERT INTO technique_game_entries (technique_id, game, pt_cost, base_power, level_up_formula, obtain_method, affinity)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [technique_id, game, pt_cost, base_power, level_up_formula, obtain_method, affinity]);

  return result.insertId;
};