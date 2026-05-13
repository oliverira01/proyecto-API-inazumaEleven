import pool from '../config/db.js';

export const findAllTournaments = async () => {
  const [rows] = await pool.query(`
    SELECT id, name, rank_number, min_level, required_player_count,
           description, extra_conditions, image_url, location
    FROM tournaments
    ORDER BY rank_number
  `);
  return rows;
};

export const findTournamentById = async (id) => {
  const [rows] = await pool.query(`
    SELECT id, name, rank_number, min_level, required_player_count,
           description, extra_conditions, image_url, location
    FROM tournaments
    WHERE id = ?
  `, [id]);
  return rows[0] ?? null;
};

export const findTournamentRequiredPlayers = async (tournamentId) => {
  const [rows] = await pool.query(`
    SELECT p.name, pge.position, pge.element, p.image_url
    FROM tournament_required_players trp
    JOIN player_game_entries pge ON pge.id = trp.entry_id
    JOIN players p ON p.id = pge.player_id
    WHERE trp.tournament_id = ?
    ORDER BY p.name
  `, [tournamentId]);
  return rows;
};

export const findTournamentTeams = async (tournamentId) => {
  const [rows] = await pool.query(`
    SELECT tt.id AS tournament_team_id, tt.order_index, tt.team_level,
           tt.shield_url, t.name AS team_name
    FROM tournament_teams tt
    JOIN teams t ON t.id = tt.team_id
    WHERE tt.tournament_id = ?
    ORDER BY tt.order_index
  `, [tournamentId]);
  return rows;
};

export const findTournamentTeamDrops = async (tournamentTeamId) => {
  const [rows] = await pool.query(`
    SELECT
      i.name  AS item_name,
      tc.name AS technique_name,
      tge.type AS technique_type
    FROM tournament_match_drops tmd
    LEFT JOIN item_game_entries ige ON ige.id = tmd.item_entry_id
    LEFT JOIN items i ON i.id = ige.item_id
    LEFT JOIN technique_game_entries tge ON tge.id = tmd.technique_entry_id
    LEFT JOIN techniques tc ON tc.id = tge.technique_id
    WHERE tmd.tournament_team_id = ?
  `, [tournamentTeamId]);
  return rows;
};

export const findTournamentRewards = async (tournamentId) => {
  const [rows] = await pool.query(`
    SELECT
      i.name  AS item_name,
      tc.name AS technique_name,
      tge.type AS technique_type
    FROM tournament_rewards tr
    LEFT JOIN item_game_entries ige ON ige.id = tr.item_entry_id
    LEFT JOIN items i ON i.id = ige.item_id
    LEFT JOIN technique_game_entries tge ON tge.id = tr.technique_entry_id
    LEFT JOIN techniques tc ON tc.id = tge.technique_id
    WHERE tr.tournament_id = ?
  `, [tournamentId]);
  return rows;
};