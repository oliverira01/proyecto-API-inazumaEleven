import {
  findAllMatchChains,
  findMatchChainById,
  findMatchChainTeams,
  findMatchChainDrops
} from '../repositories/matchChainsRepository.js';

export const getMatchChains = async (req, res) => {
  try {
    const { game, name } = req.query;
    const chains = await findAllMatchChains({ game, name });
    res.json(chains);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener cadenas de partidos' });
  }
};

export const getMatchChainById = async (req, res) => {
  try {
    const chain = await findMatchChainById(req.params.id);
    if (!chain) {
      return res.status(404).json({ error: 'Cadena no encontrada' });
    }
    res.json(chain);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener la cadena' });
  }
};

export const getMatchChainTeams = async (req, res) => {
  try {
    const teams = await findMatchChainTeams(req.params.id);
    res.json(teams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los equipos de la cadena' });
  }
};

export const getMatchChainDrops = async (req, res) => {
  try {
    const drops = await findMatchChainDrops(req.params.chainTeamId);
    res.json(drops);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los drops' });
  }
};