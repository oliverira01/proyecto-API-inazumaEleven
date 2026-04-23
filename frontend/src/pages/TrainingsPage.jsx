import { useEffect, useState } from 'react';
import { getTrainings } from '../api/trainingsApi';
import { getImageUrl } from '../hooks/imageUrl';

const MAP_BY_GAME = {
  IE1: '/images/mapas/ie1/mapa_ie1.png',
  IE2: '/images/mapas/ie2/mapa_ie2.png',
  IE3: '/images/mapas/ie3/mapa_ie3.png',
};

const TYPE_COLOR = {
  pe:      '#f97316',
  pt:      '#22c55e',
  tiro:    '#dc2626',
  fisico:  '#3b82f6',
  control: '#a855f7',
  defensa: '#06b6d4',
  rapidez: '#f59e0b',
  aguante: '#84cc16',
  valor:   '#ec4899',
};

const TYPE_LABEL = {
  pe:      'PE',
  pt:      'PT',
  tiro:    'Tiro',
  fisico:  'Físico',
  control: 'Control',
  defensa: 'Defensa',
  rapidez: 'Rapidez',
  aguante: 'Aguante',
  valor:   'Valor',
};

function TrainingModal({ training, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const color = TYPE_COLOR[training.type] ?? '#fff';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container training-modal" onClick={e => e.stopPropagation()}>
        {training.image_url ? (
          <img
            className="training-modal-image"
            src={getImageUrl(training.image_url)}
            alt={training.name}
          />
        ) : (
          <div className="training-modal-image placeholder">💪</div>
        )}
        <div className="modal-body">
          <h2 className="modal-name">{training.name}</h2>
          <div className="training-modal-type">
            <span className="modal-competitive-label">Stat que mejora</span>
            <span className="training-type-badge" style={{ background: color }}>
              {TYPE_LABEL[training.type] ?? training.type}
            </span>
          </div>
        </div>
        <button className="modal-close" onClick={onClose}>✕</button>
      </div>
    </div>
  );
}

function TrainingsPage() {
  const [trainings, setTrainings]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [game, setGame]                 = useState('IE1');
  const [selectedTraining, setSelectedTraining] = useState(null);

  useEffect(() => {
    fetchTrainings();
  }, [game]);

  const fetchTrainings = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await getTrainings({ game });
      setTrainings(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Error al cargar los entrenamientos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">

      <div className="trainings-filters">
        <div className="game-tabs">
          {['IE1', 'IE2', 'IE3'].map(g => (
            <button
              key={g}
              className={game === g ? 'active' : ''}
              onClick={() => setGame(g)}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="status-msg">Cargando entrenamientos...</p>}
      {error   && <p className="status-msg error">{error}</p>}

      {!loading && !error && (
        <div className="trainings-map-container">
          <img
            className="trainings-map"
            src={getImageUrl(MAP_BY_GAME[game])}
            alt={`Mapa ${game}`}
          />
          {trainings.map(training => (
            training.map_x != null && training.map_y != null && (
              <button
                key={training.id}
                className="training-map-point"
                style={{
                  left: `${training.map_x}%`,
                  top: `${training.map_y}%`,
                  background: 'transparent',
                  border: `2px solid ${TYPE_COLOR[training.type] ?? '#fff'}`,
                }}
                onClick={() => setSelectedTraining(training)}
                title={training.name}
              >
                <span className="training-map-label">{training.name}</span>
              </button>
            )
          ))}
        </div>
      )}

      {selectedTraining && (
        <TrainingModal
          training={selectedTraining}
          onClose={() => setSelectedTraining(null)}
        />
      )}

    </div>
  );
}

export default TrainingsPage;