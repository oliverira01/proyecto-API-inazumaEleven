import pool from '../config/db.js';

export const getDailyPlayer = async () => {
  const today = new Date().toISOString().split('T')[0];

  const [existing] = await pool.query(
    'SELECT player_id FROM daily_challenges WHERE date = ?',
    [today]
  );

  if (existing.length > 0) {
    return getPlayerForInazudle(existing[0].player_id);
  }

  const [players] = await pool.query('SELECT id FROM players');
  if (players.length === 0) return null;

  const randomPlayer = players[Math.floor(Math.random() * players.length)];

  await pool.query(
    'INSERT INTO daily_challenges (date, player_id) VALUES (?, ?)',
    [today, randomPlayer.id]
  );

  return getPlayerForInazudle(randomPlayer.id);
};

const getPlayerForInazudle = async (playerId) => {
  const [rows] = await pool.query(`
    SELECT
      p.id, p.name, p.image_url, p.sex,
      pge.id AS entry_id, pge.game, pge.position, pge.element,
      t.name AS team_name
    FROM players p
    JOIN player_game_entries pge ON pge.player_id = p.id
    LEFT JOIN teams t ON t.id = pge.team_id
    WHERE p.id = ?
    LIMIT 1
  `, [playerId]);
  return rows[0] ?? null;
};

export const guessPlayer = async (guessedPlayerId) => {
  const [rows] = await pool.query(`
    SELECT
      p.id, p.name, p.image_url, p.sex,
      pge.id AS entry_id, pge.game, pge.position, pge.element,
      t.name AS team_name
    FROM players p
    JOIN player_game_entries pge ON pge.player_id = p.id
    LEFT JOIN teams t ON t.id = pge.team_id
    WHERE p.id = ?
    LIMIT 1
  `, [guessedPlayerId]);
  return rows[0] ?? null;
};

export const searchPlayersByName = async (name) => {
  const [rows] = await pool.query(`
    SELECT DISTINCT
      p.id, p.name, p.image_url
    FROM players p
    WHERE p.name LIKE ?
    LIMIT 10
  `, [`%${name}%`]);
  return rows;
};