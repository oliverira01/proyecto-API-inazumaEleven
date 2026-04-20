import pool from '../config/db.js';

export const findAllMatchChains = async ({ game, name } = {}) => {
  let query = `
    SELECT
      mc.id, mc.name, mc.game, mc.image_url, mc.description,
      mc.unlock_condition, mc.reward_image_url, mc.reward_text
    FROM match_chains mc
    WHERE 1=1
  `;
  const params = [];

  if (game) { query += ' AND mc.game = ?';      params.push(game); }
  if (name) { query += ' AND mc.name LIKE ?';   params.push(`%${name}%`); }

  query += ' ORDER BY mc.name';

  const [rows] = await pool.query(query, params);
  return rows;
};

export const findMatchChainById = async (id) => {
  const [rows] = await pool.query(`
    SELECT
      mc.id, mc.name, mc.game, mc.image_url, mc.description,
      mc.unlock_condition, mc.reward_image_url, mc.reward_text
    FROM match_chains mc
    WHERE mc.id = ?
  `, [id]);
  return rows[0] ?? null;
};

export const findMatchChainTeams = async (chainId) => {
  const [rows] = await pool.query(`
    SELECT
      mct.id AS chain_team_id, mct.order_index,
      t.id AS team_id, t.name, t.game, t.formation,
      t.image_url, t.description
    FROM match_chain_teams mct
    JOIN teams t ON t.id = mct.team_id
    WHERE mct.chain_id = ?
    ORDER BY mct.order_index
  `, [chainId]);
  return rows;
};

export const findMatchChainDrops = async (chainTeamId) => {
  const [rows] = await pool.query(`
    SELECT
      i.name, ige.type, ige.buy_price, ige.sell_price
    FROM match_chain_drops mcd
    JOIN item_game_entries ige ON ige.id = mcd.item_entry_id
    JOIN items i ON i.id = ige.item_id
    WHERE mcd.chain_team_id = ?
  `, [chainTeamId]);
  return rows;
};