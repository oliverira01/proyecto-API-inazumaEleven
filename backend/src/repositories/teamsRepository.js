import pool from '../config/db.js';

export const findAllTeams = async ({ game, name } = {}) => {
  let query = `
    SELECT
      t.id, t.name, t.description, t.game,
      t.formation, t.image_url, t.in_match_chain
    FROM teams t
    WHERE 1=1
  `;
  const params = [];

  if (game) { query += ' AND t.game = ?';       params.push(game); }
  if (name) { query += ' AND t.name LIKE ?';    params.push(`%${name}%`); }

  query += ' ORDER BY t.name';

  const [rows] = await pool.query(query, params);
  return rows;
};

export const findTeamById = async (id) => {
  const [rows] = await pool.query(`
    SELECT
      t.id, t.name, t.description, t.game,
      t.formation, t.image_url, t.in_match_chain
    FROM teams t
    WHERE t.id = ?
  `, [id]);
  return rows[0] ?? null;
};

export const findTeamPlayers = async (teamId, game) => {
  const [rows] = await pool.query(`
    SELECT
      p.id, p.name, p.sex, p.image_url,
      pge.id AS entry_id, pge.position, pge.element, pge.recruit_level
    FROM players p
    JOIN player_game_entries pge ON pge.player_id = p.id
    WHERE pge.team_id = ? AND pge.game = ?
    ORDER BY
      FIELD(pge.position, 'POR', 'DF', 'MC', 'DL')
  `, [teamId, game]);
  return rows;
};