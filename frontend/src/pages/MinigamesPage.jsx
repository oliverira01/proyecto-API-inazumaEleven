import { useNavigate } from 'react-router-dom';

const MINIGAMES = [
  {
    id:    'inazudle',
    icon:  '🔍',
    title: 'Inazudle',
    desc:  'Adivina el jugador',
    route: '/minijuegos/inazudle',
    color: '#f59e0b',
  },
  {
    id:    'frontier',
    icon:  '⚽',
    title: 'Fútbol Frontier',
    desc:  'Escoge tu equipo y planta cara en la gran final del Fútbol Frontier.',
    route: '/minijuegos/frontier',
    color: '#22c55e',
    soon:  true,
  },
  {
    id:    'imagen',
    icon:  '🖼️',
    title: 'Adivina la técnica',
    desc:  'Identifica la supertécnica por su imagen. La calidad sube con cada fallo.',
    route: '/minijuegos/imagen',
    color: '#3b82f6',
    soon:  true,
  },
  {
    id:    'sonido',
    icon:  '🔊',
    title: 'Adivina el sonido',
    desc:  'Reconoce la supertécnica solo por su sonido.',
    route: '/minijuegos/sonido',
    color: '#a855f7',
    soon:  true,
  },
];

function MinigameCard({ game, onClick }) {
  return (
    <div
      className={`minigame-card ${game.soon ? 'minigame-card-soon' : ''}`}
      style={{ '--game-color': game.color }}
      onClick={!game.soon ? onClick : undefined}
    >
      <div className="minigame-card-icon">{game.icon}</div>
      <div className="minigame-card-body">
        <div className="minigame-card-top">
          <h3 className="minigame-card-title">{game.title}</h3>
          {game.soon && (
            <span className="minigame-soon-badge">Próximamente</span>
          )}
        </div>
        <p className="minigame-card-desc">{game.desc}</p>
      </div>
      {!game.soon && (
        <div className="minigame-card-arrow">→</div>
      )}
    </div>
  );
}

function MinigamesPage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="minigames-header">
        <h1 className="minigames-title">Minijuegos</h1>
        <p className="minigames-subtitle">
          Pon a prueba tu conocimiento de la trilogía original
        </p>
      </div>

      <div className="minigames-grid">
        {MINIGAMES.map(game => (
          <MinigameCard
            key={game.id}
            game={game}
            onClick={() => navigate(game.route)}
          />
        ))}
      </div>
    </div>
  );
}

export default MinigamesPage;