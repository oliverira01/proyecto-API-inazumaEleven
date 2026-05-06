import { useEffect, useState, useRef, useMemo } from 'react';
import { getDailyTechniqueChallenge, submitTechniqueGuess, searchTechniques } from '../api/techniqueGameApi';
import { getImageUrl } from '../hooks/imageUrl';

const TODAY = new Date().toISOString().split('T')[0];
const MAX_FAILS = 5;

const loadDayState = () => {
  try {
    const saved = localStorage.getItem(`technique_game_${TODAY}`);
    return saved ? JSON.parse(saved) : null;
  } catch { return null; }
};

const saveDayState = (state) => {
  localStorage.setItem(`technique_game_${TODAY}`, JSON.stringify(state));
};

function Confetti() {
  const colors = ['#f59e0b','#22c55e','#3b82f6','#a855f7','#dc2626','#ec4899'];
  const pieces = useMemo(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id:       i,
      color:    colors[i % colors.length],
      left:     Math.random() * 100,
      delay:    Math.random() * 2,
      duration: 2 + Math.random() * 2,
      size:     6 + Math.random() * 8,
    }))
  , []);

  return (
    <div className="confetti-container">
      {pieces.map(p => (
        <div key={p.id} className="confetti-piece" style={{
          left: `${p.left}%`, background: p.color,
          width: `${p.size}px`, height: `${p.size}px`,
          animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`,
        }} />
      ))}
    </div>
  );
}

function TechniqueImage({ imageUrl, fails, isColor, won, isWin }) {
  const blur   = (!won) ? Math.max(0, 12 - (fails * 2.5)) : 0;
  const pixels = (!won) ? Math.max(0, 16 - (fails * 3))   : 0;

  return (
    <div className="technique-game-image-wrapper">
      <img
        src={getImageUrl(imageUrl)}
        alt="Técnica misteriosa"
        className="technique-game-image"
        style={{
          filter: `
            ${(!isColor && !isWin) ? 'grayscale(100%)' : ''}
            blur(${blur}px)
          `,
          imageRendering: pixels > 0 ? 'pixelated' : 'auto',
          transform: `scale(${1 + pixels * 0.04})`,
          transition: 'filter 0.8s ease, transform 0.8s ease',
        }}
      />
    </div>
  );
}

function TechniqueGamePage() {
  const savedDay = loadDayState();

  const [imageUrl, setImageUrl]         = useState(savedDay?.imageUrl ?? null);
  const [fails, setFails]               = useState(savedDay?.fails ?? 0);
  const [won, setWon]                   = useState(savedDay?.won ?? false);
  const [isColor, setIsColor]           = useState(false);
  const [search, setSearch]             = useState('');
  const [suggestions, setSuggestions]   = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [guesses, setGuesses]           = useState(savedDay?.guesses ?? []);
  const [wonTechnique, setWonTechnique] = useState(savedDay?.wonTechnique ?? null);
  const [wins, setWins]                 = useState(parseInt(localStorage.getItem('technique_game_wins') ?? '0'));
  const [losses, setLosses]             = useState(parseInt(localStorage.getItem('technique_game_losses') ?? '0'));
  const [timeLeft, setTimeLeft]         = useState(0);
  const [loading, setLoading]           = useState(false);

  useEffect(() => {
    if (!savedDay?.imageUrl) {
      getDailyTechniqueChallenge()
        .then(({ data }) => {
          setImageUrl(data.image_url);
          saveDayState({ imageUrl: data.image_url, fails: 0, won: false, guesses: [] });
        })
        .catch(console.error);
    }

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
        const { data } = await searchTechniques(search);
        setSuggestions(Array.isArray(data) ? data : []);
      } catch { setSuggestions([]); }
    }, 200);
    return () => clearTimeout(t);
  }, [search]);

  const handleGuess = async (technique) => {
    if (won || loading) return;
    setSearch('');
    setSuggestions([]);
    setShowSuggestions(false);
    setLoading(true);

    try {
      const { data } = await submitTechniqueGuess(technique.id);
      const newGuess = { name: technique.name, isCorrect: data.isCorrect };
      const newGuesses = [newGuess, ...guesses];
      setGuesses(newGuesses);

      if (data.isCorrect) {
        setWon(true);
        setWonTechnique(data.technique);
        if (!savedDay?.won) {
          const newWins = wins + 1;
          setWins(newWins);
          localStorage.setItem('technique_game_wins', newWins);
        }
        saveDayState({ imageUrl, fails, won: true, guesses: newGuesses, wonTechnique: data.technique });
      } else {
        const newFails = fails + 1;
        setFails(newFails);
        if (newFails >= MAX_FAILS) {
          setWon(true);
          if (!savedDay?.won) {
            const newLosses = losses + 1;
            setLosses(newLosses);
            localStorage.setItem('technique_game_losses', newLosses);
          }
        }
        saveDayState({ imageUrl, fails: newFails, won: newFails >= MAX_FAILS, guesses: newGuesses });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSurrender = () => {
    if (won) return;
    if (!savedDay?.won) {
      const newLosses = losses + 1;
      setLosses(newLosses);
      localStorage.setItem('technique_game_losses', newLosses);
    }
    setWon(true);
    saveDayState({ imageUrl, fails, won: true, guesses });
  };

  const pad = (n) => String(n).padStart(2, '0');
  const h = Math.floor(timeLeft / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);
  const s = timeLeft % 60;

  const isWin = won && guesses[0]?.isCorrect;

  return (
    <div className="home-page inazudle-page">
      {isWin && <Confetti />}

      {/* Marcador */}
      <div className="inazudle-scoreboard">
        <div className="scoreboard-side">
          <span className="scoreboard-label">Dias acertados</span>
          <span className="scoreboard-number losses">{wins}</span>
        </div>
        <div className="scoreboard-center">
          <span className="scoreboard-timer">{pad(h)}:{pad(m)}:{pad(s)}</span>
          <span className="scoreboard-timer-label">Próxima supertécnica</span>
        </div>
        <div className="scoreboard-side">
          <span className="scoreboard-label">Dias fallidos</span>
          <span className="scoreboard-number wins">{losses}</span>
        </div>
      </div>

      <div className="inazudle-title-block">
        <h1 className="inazudle-title">Adivina la Técnica</h1>
        <p className="inazudle-subtitle">
          Identifica la supertécnica por su imagen — {MAX_FAILS - fails} intentos restantes
        </p>
      </div>

      {/* Imagen */}
      {imageUrl && (
        <div className="technique-game-container">
          <TechniqueImage
            imageUrl={imageUrl}
            fails={fails}
            isColor={isColor}
            won={won}
            isWin={isWin}
            />

          <button
            className={`technique-color-btn ${isColor ? 'active' : ''}`}
            onClick={() => setIsColor(v => !v)}
          >
            {isColor ? '⚫ Blanco y negro' : '🎨 Ver en color'}
          </button>

          <div className="technique-fails-bar">
            {Array.from({ length: MAX_FAILS }).map((_, i) => (
              <div
                key={i}
                className={`technique-fail-dot ${i < fails ? 'used' : ''}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      {!won && (
        <div className="inazudle-input-container">
          <div className="inazudle-search-wrapper">
            <input
              type="text"
              className="inazudle-input"
              placeholder="Escribe el nombre de una técnica..."
              value={search}
              onChange={e => { setSearch(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              disabled={won || loading}
              autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="inazudle-suggestions">
                {suggestions.map(t => (
                  <div
                    key={t.id}
                    className="inazudle-suggestion"
                    onMouseDown={() => handleGuess(t)}
                  >
                    {t.image_url ? (
                      <img src={getImageUrl(t.image_url)} alt={t.name} className="suggestion-avatar" />
                    ) : (
                      <div className="suggestion-avatar-placeholder">⚡</div>
                    )}
                    <span>{t.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="inazudle-surrender" onClick={handleSurrender}>
            Rendirse
          </button>
        </div>
      )}

      {/* Resultado */}
      {won && (
        <div className={`inazudle-result ${isWin ? 'win' : 'loss'}`}>
          {isWin
            ? `¡Correcto! Lo adivinaste en ${guesses.length} ${guesses.length === 1 ? 'intento' : 'intentos'}`
            : 'No lo adivinaste. ¡Mañana tienes otra oportunidad!'}
        </div>
      )}

      {/* Intentos */}
      {guesses.length > 0 && (
        <div className="technique-guesses-list">
          {guesses.map((g, i) => (
            <div key={i} className={`technique-guess-row ${g.isCorrect ? 'hit' : 'miss'}`}>
              <span>{g.isCorrect ? '✅' : '❌'}</span>
              <span>{g.name}</span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default TechniqueGamePage;