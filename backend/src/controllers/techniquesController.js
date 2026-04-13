import {
  findAllTechniques,
  findTechniqueById,
  findTechniquePowerLevels,
  findTechniquePlayers
} from '../repositories/techniquesRepository.js';

export const getTechniques = async (req, res) => {
  try {
    const { game, name, element, type } = req.query;
    const techniques = await findAllTechniques({ game, name, element, type });
    res.json(techniques);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener técnicas' });
  }
};

export const getTechniqueById = async (req, res) => {
  try {
    const technique = await findTechniqueById(req.params.techEntryId);
    if (!technique) {
      return res.status(404).json({ error: 'Técnica no encontrada' });
    }
    res.json(technique);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener la técnica' });
  }
};

export const getTechniquePowerLevels = async (req, res) => {
  try {
    const levels = await findTechniquePowerLevels(req.params.techEntryId);
    res.json(levels);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener niveles de potencia' });
  }
};

export const getTechniquePlayers = async (req, res) => {
  try {
    const players = await findTechniquePlayers(req.params.techEntryId);
    res.json(players);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener jugadores de la técnica' });
  }
};