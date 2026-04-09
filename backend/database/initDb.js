import sqlite3 from "sqlite3";
import { open } from "sqlite";

const dbPromise = open({
  filename: "./database/inazuma.db",
  driver: sqlite3.Database,
});

const db = await dbPromise;

// Activar llaves foráneas y modo WAL
await db.exec(`
PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;
`);

// ============================================================
// EQUIPOS
// ============================================================
await db.exec(`
CREATE TABLE IF NOT EXISTS teams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  game TEXT NOT NULL CHECK (game IN ('IE1','IE2','IE3')),
  formation TEXT,
  image_url TEXT,
  in_match_chain INTEGER NOT NULL DEFAULT 0,
  UNIQUE(name, game)
);
`);

// ============================================================
// JUGADORES
// ============================================================
await db.exec(`
CREATE TABLE IF NOT EXISTS players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  sex TEXT CHECK(sex IN ('Masculino','Femenino')),
  description TEXT,
  image_url TEXT,
  competitive_notes TEXT
);
`);

// ============================================================
// ENTRADA DE JUGADOR POR JUEGO
// ============================================================
await db.exec(`
CREATE TABLE IF NOT EXISTS player_game_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL,
  game TEXT NOT NULL CHECK(game IN ('IE1','IE2','IE3')),
  team_id INTEGER,
  recruit_level INTEGER NOT NULL DEFAULT 1,
  position TEXT NOT NULL CHECK(position IN ('DL','MC','DF','POR')),
  element TEXT NOT NULL CHECK(element IN ('Fuego','Bosque','Aire','Montaña')),
  UNIQUE(player_id, game),
  FOREIGN KEY(player_id) REFERENCES players(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY(team_id) REFERENCES teams(id) ON DELETE SET NULL ON UPDATE CASCADE
);
`);

// ============================================================
// ESTADÍSTICAS POR NIVEL
// ============================================================
await db.exec(`
CREATE TABLE IF NOT EXISTS player_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entry_id INTEGER NOT NULL,
  level INTEGER NOT NULL,
  pe INTEGER NOT NULL DEFAULT 0,
  pt INTEGER NOT NULL DEFAULT 0,
  tiro INTEGER NOT NULL DEFAULT 0,
  fisico INTEGER NOT NULL DEFAULT 0,
  control INTEGER NOT NULL DEFAULT 0,
  defensa INTEGER NOT NULL DEFAULT 0,
  rapidez INTEGER NOT NULL DEFAULT 0,
  aguante INTEGER NOT NULL DEFAULT 0,
  valor INTEGER NOT NULL DEFAULT 0,
  libertad INTEGER NOT NULL DEFAULT 0,
  UNIQUE(entry_id, level),
  FOREIGN KEY(entry_id) REFERENCES player_game_entries(id) ON DELETE CASCADE ON UPDATE CASCADE
);
`);

// ============================================================
// SUPERTÉCNICAS
// ============================================================
await db.exec(`
CREATE TABLE IF NOT EXISTS techniques (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  element TEXT CHECK(element IN ('Fuego','Bosque','Aire','Montaña')),
  type TEXT CHECK(type IN ('Tiro','Bloqueo','Parada','Regate','Talento')),
  image_url TEXT,
  sound_url TEXT
);
`);

// ============================================================
// ENTRADA DE TÉCNICA POR JUEGO
// ============================================================
await db.exec(`
CREATE TABLE IF NOT EXISTS technique_game_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  technique_id INTEGER NOT NULL,
  game TEXT NOT NULL CHECK(game IN ('IE1','IE2','IE3')),
  pt_cost INTEGER NOT NULL DEFAULT 0,
  base_power INTEGER,
  level_up_formula TEXT,
  obtain_method TEXT,
  UNIQUE(technique_id, game),
  FOREIGN KEY(technique_id) REFERENCES techniques(id) ON DELETE CASCADE ON UPDATE CASCADE
);
`);

// ============================================================
// POTENCIA DE TÉCNICA POR NIVEL
// ============================================================
await db.exec(`
CREATE TABLE IF NOT EXISTS technique_level_power (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tech_entry_id INTEGER NOT NULL,
  level TEXT NOT NULL,
  power INTEGER NOT NULL,
  UNIQUE(tech_entry_id, level),
  FOREIGN KEY(tech_entry_id) REFERENCES technique_game_entries(id) ON DELETE CASCADE ON UPDATE CASCADE
);
`);

// ============================================================
// PIVOT: técnicas de jugadores
// ============================================================
await db.exec(`
CREATE TABLE IF NOT EXISTS player_techniques (
  entry_id INTEGER NOT NULL,
  tech_entry_id INTEGER NOT NULL,
  PRIMARY KEY(entry_id, tech_entry_id),
  FOREIGN KEY(entry_id) REFERENCES player_game_entries(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY(tech_entry_id) REFERENCES technique_game_entries(id) ON DELETE CASCADE ON UPDATE CASCADE
);
`);

// ============================================================
// ITEMS
// ============================================================
await db.exec(`
CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);
`);

await db.exec(`
CREATE TABLE IF NOT EXISTS item_game_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id INTEGER NOT NULL,
  game TEXT NOT NULL CHECK(game IN ('IE1','IE2','IE3')),
  type TEXT NOT NULL CHECK(type IN ('equipacion','consumible','cuaderno','otro')),
  description TEXT,
  obtain_method TEXT,
  buy_price INTEGER,
  sell_price INTEGER,
  UNIQUE(item_id, game),
  FOREIGN KEY(item_id) REFERENCES items(id) ON DELETE CASCADE ON UPDATE CASCADE
);
`);

// ============================================================
// TIENDAS
// ============================================================
await db.exec(`
CREATE TABLE IF NOT EXISTS shops (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('consumibles','equipaciones','tecnicas')),
  game TEXT NOT NULL CHECK(game IN ('IE1','IE2','IE3')),
  image_url TEXT,
  description TEXT
);
`);

await db.exec(`
CREATE TABLE IF NOT EXISTS shop_items (
  shop_id INTEGER NOT NULL,
  item_entry_id INTEGER NOT NULL,
  PRIMARY KEY(shop_id, item_entry_id),
  FOREIGN KEY(shop_id) REFERENCES shops(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY(item_entry_id) REFERENCES item_game_entries(id) ON DELETE CASCADE ON UPDATE CASCADE
);
`);

await db.exec(`
CREATE TABLE IF NOT EXISTS shop_techniques (
  shop_id INTEGER NOT NULL,
  tech_entry_id INTEGER NOT NULL,
  PRIMARY KEY(shop_id, tech_entry_id),
  FOREIGN KEY(shop_id) REFERENCES shops(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY(tech_entry_id) REFERENCES technique_game_entries(id) ON DELETE CASCADE ON UPDATE CASCADE
);
`);

// ============================================================
// CADENAS DE PARTIDOS
// ============================================================
await db.exec(`
CREATE TABLE IF NOT EXISTS match_chains (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  game TEXT NOT NULL CHECK(game IN ('IE1','IE2','IE3')),
  image_url TEXT,
  description TEXT,
  unlock_condition TEXT,
  reward_image_url TEXT,
  reward_text TEXT
);
`);

await db.exec(`
CREATE TABLE IF NOT EXISTS match_chain_teams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chain_id INTEGER NOT NULL,
  team_id INTEGER NOT NULL,
  order_index INTEGER NOT NULL,
  UNIQUE(chain_id, order_index),
  FOREIGN KEY(chain_id) REFERENCES match_chains(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY(team_id) REFERENCES teams(id) ON DELETE CASCADE ON UPDATE CASCADE
);
`);

await db.exec(`
CREATE TABLE IF NOT EXISTS match_chain_drops (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chain_team_id INTEGER NOT NULL,
  item_entry_id INTEGER NOT NULL,
  FOREIGN KEY(chain_team_id) REFERENCES match_chain_teams(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY(item_entry_id) REFERENCES item_game_entries(id) ON DELETE CASCADE ON UPDATE CASCADE
);
`);

// ============================================================
// ENTRENAMIENTOS
// ============================================================
await db.exec(`
CREATE TABLE IF NOT EXISTS trainings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN (
    'pe','pt','tiro','fisico','control','defensa','rapidez','aguante','valor'
  )),
  game TEXT NOT NULL CHECK(game IN ('IE1','IE2','IE3')),
  image_url TEXT
);
`);

// ============================================================
// ÍNDICES
// ============================================================
await db.exec(`
CREATE INDEX idx_pge_game ON player_game_entries(game);
CREATE INDEX idx_pge_team ON player_game_entries(team_id);
CREATE INDEX idx_pge_position ON player_game_entries(position);
CREATE INDEX idx_pge_element ON player_game_entries(element);
CREATE INDEX idx_stats_entry ON player_stats(entry_id);
CREATE INDEX idx_tge_game ON technique_game_entries(game);
CREATE INDEX idx_tlp_entry ON technique_level_power(tech_entry_id);
CREATE INDEX idx_ige_game ON item_game_entries(game);
CREATE INDEX idx_ige_type ON item_game_entries(type);
CREATE INDEX idx_shops_game ON shops(game);
CREATE INDEX idx_chains_game ON match_chains(game);
CREATE INDEX idx_mct_chain ON match_chain_teams(chain_id);
CREATE INDEX idx_mcd_chain_team ON match_chain_drops(chain_team_id);
CREATE INDEX idx_trainings_game ON trainings(game);
`);

console.log("Base de datos inicializada correctamente.");