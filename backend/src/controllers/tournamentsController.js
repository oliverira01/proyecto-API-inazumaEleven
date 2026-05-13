import {
  findAllTournaments,
  findTournamentById,
  findTournamentRequiredPlayers,
  findTournamentTeams,
  findTournamentTeamDrops,
  findTournamentRewards
} from '../repositories/tournamentRepository.js';

export const getTournaments = async (req, res) => {
  try {
    const tournaments = await findAllTournaments();
    res.json(tournaments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener torneos' });
  }
};

export const getTournamentById = async (req, res) => {
  try {
    const tournament = await findTournamentById(req.params.id);
    if (!tournament) return res.status(404).json({ error: 'Torneo no encontrado' });
    res.json(tournament);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el torneo' });
  }
};

export const getTournamentRequiredPlayers = async (req, res) => {
  try {
    const players = await findTournamentRequiredPlayers(req.params.id);
    res.json(players);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener jugadores requeridos' });
  }
};

export const getTournamentTeams = async (req, res) => {
  try {
    const teams = await findTournamentTeams(req.params.id);
    res.json(teams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener equipos del torneo' });
  }
};

export const getTournamentTeamDrops = async (req, res) => {
  try {
    const drops = await findTournamentTeamDrops(req.params.tournamentTeamId);
    res.json(drops);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener drops' });
  }
};

export const getTournamentRewards = async (req, res) => {
  try {
    const rewards = await findTournamentRewards(req.params.id);
    res.json(rewards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener recompensas' });
  }
};