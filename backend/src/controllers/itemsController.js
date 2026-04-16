import { findAllItems, findItemById } from '../repositories/itemsRepository.js';

export const getItems = async (req, res) => {
  try {
    const { game, name, type } = req.query;
    const items = await findAllItems({ game, name, type });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener items' });
  }
};

export const getItemById = async (req, res) => {
  try {
    const item = await findItemById(req.params.itemEntryId);
    if (!item) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el item' });
  }
};