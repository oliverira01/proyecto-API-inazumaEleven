import { findAllPlayers, findPlayerById } from '../repositories/playersRepository.js';

export const getPlayers = async (req, res) => {
  try {
    const { game, name, team } = req.query;
    const players = await findAllPlayers({ game, name, team });
    res.json(players);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener jugadores' });
  }
};

export const getPlayerById = async (req, res) => {
  try {
    const player = await findPlayerById(req.params.id);
    if (!player.length) {
      return res.status(404).json({ error: 'Jugador no encontrado' });
    }
    res.json(player);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el jugador' });
  }
};