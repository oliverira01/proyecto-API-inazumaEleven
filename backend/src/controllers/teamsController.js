import { findAllTeams, findTeamById, findTeamPlayers } from '../repositories/teamsRepository.js';

export const getTeams = async (req, res) => {
  try {
    const { game, name } = req.query;
    const teams = await findAllTeams({ game, name });
    res.json(teams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener equipos' });
  }
};

export const getTeamById = async (req, res) => {
  try {
    const team = await findTeamById(req.params.id);
    if (!team) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }
    res.json(team);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el equipo' });
  }
};

export const getTeamPlayers = async (req, res) => {
  try {
    const { game } = req.query;
    if (!game) {
      return res.status(400).json({ error: 'El parámetro game es obligatorio' });
    }
    const players = await findTeamPlayers(req.params.id, game);
    res.json(players);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los jugadores del equipo' });
  }
};