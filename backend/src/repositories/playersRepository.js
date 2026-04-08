import pool from '../config/db.js';

export const findAllPlayers = async ({ game, name, team } = {}) => {
  let query = `
    SELECT 
      p.id, p.name, p.sex, p.description, p.image_url, p.competitive_notes,
      pge.id AS entry_id, pge.position, pge.element, pge.recruit_level,
      t.name AS team_name
    FROM players p
    JOIN player_game_entries pge ON pge.player_id = p.id
    LEFT JOIN teams t ON t.id = pge.team_id
    WHERE 1=1
  `;
  const params = [];

  if (game) { query += ' AND pge.game = ?';  params.push(game); }
  if (name) { query += ' AND p.name LIKE ?'; params.push(`%${name}%`); }
  if (team) { query += ' AND t.name LIKE ?'; params.push(`%${team}%`); }

  query += ' ORDER BY p.name';

  const [rows] = await pool.query(query, params);
  return rows;
};

export const findPlayerById = async (id) => {
  const [rows] = await pool.query(`
    SELECT 
      p.id, p.name, p.sex, p.description, p.image_url, p.competitive_notes,
      pge.id AS entry_id, pge.game, pge.position, pge.element, pge.recruit_level,
      t.name AS team_name
    FROM players p
    JOIN player_game_entries pge ON pge.player_id = p.id
    LEFT JOIN teams t ON t.id = pge.team_id
    WHERE p.id = ?
  `, [id]);
  return rows;
};

export const findPlayerStats = async (entryId) => {
  const [rows] = await pool.query(`
    SELECT level, pe, pt, tiro, fisico, control, defensa, rapidez, aguante, valor, libertad
    FROM player_stats
    WHERE entry_id = ?
    ORDER BY level DESC
  `, [entryId]);
  return rows;
};

export const findPlayerTechniques = async (entryId) => {
  const [rows] = await pool.query(`
    SELECT
      t.id, t.name, t.description, t.image_url, t.element, t.type,
      tge.id AS tech_entry_id, tge.game, tge.pt_cost, tge.base_power,
      tge.level_up_formula, tge.obtain_method
    FROM player_techniques pt
    JOIN technique_game_entries tge ON tge.id = pt.tech_entry_id
    JOIN techniques t ON t.id = tge.technique_id
    WHERE pt.entry_id = ?
    ORDER BY t.name
  `, [entryId]);
  return rows;
};

export const findTechniqueLevelPower = async (techEntryId) => {
  const [rows] = await pool.query(`
    SELECT level, power
    FROM technique_level_power
    WHERE tech_entry_id = ?
    ORDER BY power ASC
  `, [techEntryId]);
  return rows;
};