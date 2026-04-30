import { useEffect, useState, useRef } from 'react';
import { getDailyChallenge, submitGuess, searchPlayers } from '../api/inazudleApi';
import { getImageUrl } from '../hooks/imageUrl';

const ATTRS = [
  { key: 'game',     label: 'Juego' },
  { key: 'position', label: 'Posición' },
  { key: 'element',  label: 'Elemento' },
  { key: 'team',     label: 'Equipo' },
  { key: 'sex',      label: 'Género' },
];

const TODAY = new Date().toISOString().split('T')[0];

const loadDayState = () => {
  try {
    const saved = localStorage.getItem(`inazudle_day_${TODAY}`);
    return saved ? JSON.parse(saved) : null;
  } catch { return null; }
};

const saveDayState = (state) => {
  localStorage.setItem(`inazudle_day_${TODAY}`, JSON.stringify(state));
};

const savedDay = loadDayState();

function Confetti() {
  const colors = ['#f59e0b','#22c55e','#3b82f6','#a855f7','#dc2626','#ec4899'];
  const pieces = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    size: 6 + Math.random() * 8,
  }));

  return (
    <div className="confetti-container">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left:            `${p.left}%`,
            background:      p.color,
            width:           `${p.size}px`,
            height:          `${p.size}px`,
            animationDelay:  `${p.delay}s`,
            animationDuration:`${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

function Scoreboard({ wins, losses, timeLeft }) {
  const pad = (n) => String(n).padStart(2, '0');
  const h = Math.floor(timeLeft / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);
  const s = timeLeft % 60;

  return (
    <div className="inazudle-scoreboard">
      <div className="scoreboard-side">
        <span className="scoreboard-label">Días acertados</span>
        <span className="scoreboard-number losses">{wins}</span>
      </div>
      <div className="scoreboard-center">
        <span className="scoreboard-timer">{pad(h)}:{pad(m)}:{pad(s)}</span>
        <span className="scoreboard-timer-label">Próximo jugador</span>
      </div>
      <div className="scoreboard-side">
        <span className="scoreboard-label">Días fallados</span>
        <span className="scoreboard-number wins">{losses}</span>

        
      </div>
    </div>
  );
}

function GuessRow({ guess }) {
  return (
    <div className="guess-row">
      <div className="guess-player-info">
        {guess.guessed.image_url ? (
          <img src={getImageUrl(guess.guessed.image_url)} alt={guess.guessed.name} className="guess-avatar" />
        ) : (
          <div className="guess-avatar-placeholder">⚽</div>
        )}
        <span className="guess-name">{guess.guessed.name}</span>
      </div>
      {ATTRS.map(attr => (
        <div
          key={attr.key}
          className={`guess-attr ${guess.comparison[attr.key] === 'hit' ? 'hit' : 'miss'}`}
        >
          <span className="guess-attr-label">{attr.label}</span>
          <span className="guess-attr-value">
            {attr.key === 'team'
              ? guess.guessed.team
              : guess.guessed[attr.key]}
          </span>
        </div>
      ))}
    </div>
  );
}

function InazudlePage() {
  const [entryId, setEntryId]       = useState(null);
  const [search, setSearch]         = useState('');
  const [suggestions, setSuggestions] = useState([]);
const [guesses, setGuesses] = useState(savedDay?.guesses ?? []);
const [won, setWon]         = useState(savedDay?.won ?? false);
  const [loading, setLoading]       = useState(false);
  const [wins, setWins]             = useState(
    parseInt(localStorage.getItem('inazudle_wins') ?? '0')
  );
  const [losses, setLosses]         = useState(
    parseInt(localStorage.getItem('inazudle_losses') ?? '0')
  );
  const [timeLeft, setTimeLeft]     = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    getDailyChallenge()
      .then(({ data }) => setEntryId(data.entry_id))
      .catch(console.error);

    const calcTime = () => {
      const now  = new Date();
      const next = new Date();
      next.setHours(24, 0, 0, 0);
      setTimeLeft(Math.floor((next - now) / 1000));
    };
    calcTime();
    const interval = setInterval(calcTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!search) { setSuggestions([]); return; }
    const t = setTimeout(async () => {
      try {
        const { data } = await searchPlayers(search);
        setSuggestions(Array.isArray(data) ? data : []);
      } catch { setSuggestions([]); }
    }, 200);
    return () => clearTimeout(t);
  }, [search]);

  const handleGuess = async (player) => {
  if (won || loading) return;
  setSearch('');
  setSuggestions([]);
  setShowSuggestions(false);
  setLoading(true);

  try {
    const { data } = await submitGuess(player.id);
    const newGuesses = [data, ...guesses];
    setGuesses(newGuesses);

    if (data.isCorrect) {
      setWon(true);
      // Solo suma si no había ganado ya hoy
      if (!savedDay?.won) {
        const newWins = wins + 1;
        setWins(newWins);
        localStorage.setItem('inazudle_wins', newWins);
      }
      saveDayState({ guesses: newGuesses, won: true, result: 'win' });
    } else {
      saveDayState({ guesses: newGuesses, won: false });
    }
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

const handleSurrender = () => {
  if (won) return;
  // Solo suma si no había perdido ya hoy
  if (!savedDay?.won) {
    const newLosses = losses + 1;
    setLosses(newLosses);
    localStorage.setItem('inazudle_losses', newLosses);
  }
  setWon(true);
  saveDayState({ guesses, won: true, result: 'loss' });
};

  return (
    <div className="home-page inazudle-page">
      {won && guesses[0]?.isCorrect && <Confetti />}

      <Scoreboard wins={wins} losses={losses} timeLeft={timeLeft} />

      <div className="inazudle-title-block">
        <h1 className="inazudle-title">Inazudle</h1>
        <p className="inazudle-subtitle">Adivina el jugador del día</p>
      </div>

      {!won && (
        <div className="inazudle-input-container">
          <div className="inazudle-search-wrapper">
            <input
              ref={inputRef}
              type="text"
              className="inazudle-input"
              placeholder="Escribe el nombre de un jugador..."
              value={search}
              onChange={e => { setSearch(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              disabled={won || loading}
              autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="inazudle-suggestions">
                {suggestions.map(p => (
                  <div
                    key={p.id}
                    className="inazudle-suggestion"
                    onMouseDown={() => handleGuess(p)}
                  >
                    {p.image_url ? (
                      <img src={getImageUrl(p.image_url)} alt={p.name} className="suggestion-avatar" />
                    ) : (
                      <div className="suggestion-avatar-placeholder">⚽</div>
                    )}
                    <span>{p.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            className="inazudle-surrender"
            onClick={handleSurrender}
          >
            Rendirse
          </button>
        </div>
      )}

      {won && (
        <div className={`inazudle-result ${guesses[0]?.isCorrect ? 'win' : 'loss'}`}>
          {guesses[0]?.isCorrect
            ? `¡Correcto! Lo adivinaste en ${guesses.length} ${guesses.length === 1 ? 'intento' : 'intentos'}`
            : 'No lo adivinaste. ¡Mañana tienes otra oportunidad!'}
        </div>
      )}

      {guesses.length > 0 && (
        <div className="inazudle-table">
          <div className="inazudle-table-header">
            <div className="guess-player-info-header">Jugador</div>
            {ATTRS.map(attr => (
              <div key={attr.key} className="guess-attr-header">{attr.label}</div>
            ))}
          </div>
          {guesses.map((guess, i) => (
            <GuessRow key={i} guess={guess} />
          ))}
        </div>
      )}
    </div>
  );
}

export default InazudlePage;