import * as techniquesRepo from '../repositories/techniquesRepository.js';

export const getAllTechniques = async (req, res) => {
  try {
    const { game, name } = req.query;
    const techniques = await techniquesRepo.findAllTechniques({ game, name });
    res.json(techniques);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener técnicas' });
  }
};

export const getTechniqueById = async (req, res) => {
  try {
    const { id } = req.params;
    const technique = await techniquesRepo.findTechniqueById(id);
    if (!technique) return res.status(404).json({ message: 'Técnica no encontrada' });
    res.json(technique);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener la técnica' });
  }
};

export const getTechniquesByElement = async (req, res) => {
  try {
    const { element } = req.params;
    const techniques = await techniquesRepo.findAllTechniques({ name: '', game: '', element });
    res.json(techniques);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al filtrar técnicas por elemento' });
  }
};

export const getTechniquesByAffinity = async (req, res) => {
  try {
    const { affinity } = req.params;
    const techniques = await techniquesRepo.findAllTechniques({ affinity });
    res.json(techniques);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al filtrar técnicas por afinidad' });
  }
};