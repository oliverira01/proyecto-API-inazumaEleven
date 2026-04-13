import pool from '../config/db.js';

export const findAllTechniques = async ({ game, name, element, type } = {}) => {
  let query = `
    SELECT
      t.id, t.name, t.description, t.image_url, t.element, t.type,
      tge.id AS tech_entry_id, tge.game, tge.pt_cost, tge.base_power,
      tge.level_up_formula, tge.obtain_method
    FROM techniques t
    JOIN technique_game_entries tge ON tge.technique_id = t.id
    WHERE 1=1
  `;
  const params = [];

  if (game)    { query += ' AND tge.game = ?';      params.push(game); }
  if (name)    { query += ' AND t.name LIKE ?';     params.push(`%${name}%`); }
  if (element) { query += ' AND t.element = ?';     params.push(element); }
  if (type)    { query += ' AND t.type = ?';        params.push(type); }

  query += ' ORDER BY t.name';

  const [rows] = await pool.query(query, params);
  return rows;
};

export const findTechniqueById = async (techEntryId) => {
  const [rows] = await pool.query(`
    SELECT
      t.id, t.name, t.description, t.image_url, t.element, t.type,
      tge.id AS tech_entry_id, tge.game, tge.pt_cost, tge.base_power,
      tge.level_up_formula, tge.obtain_method
    FROM techniques t
    JOIN technique_game_entries tge ON tge.technique_id = t.id
    WHERE tge.id = ?
  `, [techEntryId]);
  return rows[0] ?? null;
};

export const findTechniquePowerLevels = async (techEntryId) => {
  const [rows] = await pool.query(`
    SELECT level, power
    FROM technique_level_power
    WHERE tech_entry_id = ?
    ORDER BY power ASC
  `, [techEntryId]);
  return rows;
};

export const findTechniquePlayers = async (techEntryId) => {
  const [rows] = await pool.query(`
    SELECT
      p.id, p.name, p.image_url,
      pge.id AS entry_id, pge.position, pge.element, pge.game
    FROM player_techniques pt
    JOIN player_game_entries pge ON pge.id = pt.entry_id
    JOIN players p ON p.id = pge.player_id
    WHERE pt.tech_entry_id = ?
    ORDER BY p.name
  `, [techEntryId]);
  return rows;
};