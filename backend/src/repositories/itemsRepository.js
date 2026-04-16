import pool from '../config/db.js';

export const findAllItems = async ({ game, name, type } = {}) => {
  let query = `
    SELECT
      i.id, i.name,
      ige.id AS item_entry_id, ige.game, ige.type,
      ige.description, ige.obtain_method,
      ige.buy_price, ige.sell_price
    FROM items i
    JOIN item_game_entries ige ON ige.item_id = i.id
    WHERE 1=1
  `;
  const params = [];

  if (game) { query += ' AND ige.game = ?';      params.push(game); }
  if (name) { query += ' AND i.name LIKE ?';     params.push(`%${name}%`); }
  if (type) { query += ' AND ige.type = ?';      params.push(type); }

  query += ' ORDER BY i.name';

  const [rows] = await pool.query(query, params);
  return rows;
};

export const findItemById = async (itemEntryId) => {
  const [rows] = await pool.query(`
    SELECT
      i.id, i.name,
      ige.id AS item_entry_id, ige.game, ige.type,
      ige.description, ige.obtain_method,
      ige.buy_price, ige.sell_price
    FROM items i
    JOIN item_game_entries ige ON ige.item_id = i.id
    WHERE ige.id = ?
  `, [itemEntryId]);
  return rows[0] ?? null;
};