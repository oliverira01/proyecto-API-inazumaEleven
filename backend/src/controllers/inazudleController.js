import { getDailyPlayer, guessPlayer, searchPlayersByName } from '../repositories/inazudleRepository.js';

export const getDailyChallenge = async (req, res) => {
  try {
    const player = await getDailyPlayer();
    if (!player) return res.status(404).json({ error: 'No hay jugadores en la BD' });
    // Solo devolvemos el id para que el frontend no pueda hacer trampa
    res.json({ entry_id: player.entry_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el reto diario' });
  }
};

export const submitGuess = async (req, res) => {
  try {
    const { guessedPlayerId } = req.body;
    const today = new Date().toISOString().split('T')[0];

    const [challenge] = await (await import('../config/db.js')).default.query(
      'SELECT player_id FROM daily_challenges WHERE date = ?', [today]
    );

    if (!challenge.length) return res.status(404).json({ error: 'No hay reto hoy' });

    const target  = await guessPlayer(challenge[0].player_id);
    const guessed = await guessPlayer(guessedPlayerId);

    if (!guessed) return res.status(404).json({ error: 'Jugador no encontrado' });

    const result = {
      guessed: {
        id:       guessed.id,
        name:     guessed.name,
        image_url: guessed.image_url,
        position: guessed.position,
        element:  guessed.element,
        game:     guessed.game,
        team:     guessed.team_name,
        sex:      guessed.sex,
      },
      comparison: {
        position: compareAttr(guessed.position, target.position),
        element:  compareAttr(guessed.element,  target.element),
        game:     compareAttr(guessed.game,     target.game),
        team:     compareAttr(guessed.team_name, target.team_name),
        sex:      compareAttr(guessed.sex,       target.sex),
      },
      isCorrect: guessed.id === target.id,
    };

    if (result.isCorrect) {
      result.target = {
        id:       target.id,
        name:     target.name,
        image_url: target.image_url,
      };
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al procesar el intento' });
  }
};

export const searchPlayers = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.json([]);
    const players = await searchPlayersByName(name);
    res.json(players);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al buscar jugadores' });
  }
};

const compareAttr = (guessed, target) => {
  if (guessed === target) return 'hit';
  return 'miss';
};