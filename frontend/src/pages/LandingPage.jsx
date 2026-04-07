import { useNavigate } from 'react-router-dom';

const SECTIONS = [
  { to: '/jugadores', icon: '⚽', label: 'Jugadores', desc: 'Stats, técnicas y builds competitivas' },
  { to: '/equipos', icon: '🛡️', label: 'Equipos', desc: 'Formaciones y alineaciones' },
  { to: '/tecnicas', icon: '⚡', label: 'Técnicas', desc: 'Supertécnicas' },
  { to: '/items', icon: '🎒', label: 'Items', desc: 'Equipación, consumibles y cuadernos' },
  { to: '/cadenas', icon: '🔗', label: 'Cadenas', desc: 'Rutas, drops y recompensas' },
  { to: '/entrenamientos', icon: '💪', label: 'Entrenamientos', desc: 'Localización y stats que mejoran' },
  { to: '/tiendas', icon: '🏪', label: 'Tiendas', desc: 'Precios y catálogo por juego' },
  { to: '/torneos', icon: '🏆', label: 'Torneos', desc: 'Exclusivo IE3' },
  { to: '/minijuegos', icon: '🎮', label: 'Minijuegos', desc: 'Inazudle, Fútbol Frontier y más' },
];

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="landing-hero">
        <h1 className="landing-title">Inazuma Eleven</h1>
        <p className="landing-subtitle">
          La guía completa de la trilogía original — para jugadores casuales y competitivos
        </p>
        <div className="landing-games">
          <span className="game-pill">IE1</span>
          <span className="game-pill">IE2</span>
          <span className="game-pill">IE3</span>
        </div>
      </div>

      <div className="landing-grid">
        {SECTIONS.map(section => (
          <div
            key={section.to}
            className="landing-card"
            onClick={() => navigate(section.to)}
          >
            <span className="landing-card-icon">{section.icon}</span>
            <h3 className="landing-card-title">{section.label}</h3>
            <p className="landing-card-desc">{section.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LandingPage;