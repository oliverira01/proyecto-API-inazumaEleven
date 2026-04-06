import { useEffect, useState } from 'react';
import { getPlayerStats } from '../api/playersApi';

const POSITION_LABEL = {
  DL:  'DL',
  MC:  'MC',
  DF:  'DF',
  POR: 'PR',
};

const ELEMENT_STYLES = {
  Fuego:   { color: '#dc2626', bg: '#2d0a0a', border: '#dc2626' },
  Bosque:  { color: '#16a34a', bg: '#0a2d0a', border: '#16a34a' },
  Aire:    { color: '#2563eb', bg: '#0a0a2d', border: '#2563eb' },
  Montaña: { color: '#92400e', bg: '#1a0f00', border: '#92400e' },
};

function StatRow({ label, value }) {
  return (
    <div className="modal-stat-row">
      <span className="modal-stat-label">{label}</span>
      <span className="modal-stat-value">{value ?? '—'}</span>
    </div>
  );
}

function PlayerModal({ player, game, onClose }) {
  const [stats, setStats]     = useState([]);
  const [loading, setLoading] = useState(true);

  const el = ELEMENT_STYLES[player.element] ?? ELEMENT_STYLES.Fuego;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getPlayerStats(player.entry_id);
        setStats(Array.isArray(data) ? data : []);
      } catch {
        setStats([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();

    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [player.entry_id]);

  const topStats = stats[0] ?? null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        style={{ borderColor: el.border }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header" style={{ background: el.bg, borderColor: el.border }}>
          <div className="modal-header-left">
            <img
              className="modal-avatar"
              src={player.image_url ?? '/images/placeholder.png'}
              alt={player.name}
            />
          </div>
          <div className="modal-header-center">
            <div className="modal-top-row">
              <span className="modal-game-badge" style={{ color: el.color, borderColor: el.border }}>
                {game}
              </span>
              <span className="modal-level">
                {topStats ? `Niv. ${topStats.level}` : '—'}
              </span>
              <span className="modal-position-badge" style={{ background: el.color }}>
                {POSITION_LABEL[player.position] ?? player.position}
              </span>
            </div>
            <h2 className="modal-name">{player.name}</h2>
            <p className="modal-team">{player.team_name ?? 'Sin equipo'}</p>
            <div className="modal-badges">
              <span className={`badge badge-${player.element}`}>{player.element}</span>
              <span className={`badge badge-${player.sex}`}>{player.sex}</span>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* PE y PT */}
        {topStats && (
          <div className="modal-energy" style={{ borderColor: el.border }}>
            <div className="modal-energy-item">
              <span className="modal-energy-label pe">PE</span>
              <span className="modal-energy-value pe">{topStats.pe}/{topStats.pe}</span>
            </div>
            <div className="modal-energy-divider" />
            <div className="modal-energy-item">
              <span className="modal-energy-label pt">PT</span>
              <span className="modal-energy-value pt">{topStats.pt}/{topStats.pt}</span>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="modal-body">
          {loading && <p className="status-msg">Cargando stats...</p>}

          {!loading && topStats && (
            <div className="modal-stats-grid">
              <StatRow label="Tiro"     value={topStats.tiro} />
              <StatRow label="Rapidez"  value={topStats.rapidez} />
              <StatRow label="Físico"   value={topStats.fisico} />
              <StatRow label="Aguante"  value={topStats.aguante} />
              <StatRow label="Control"  value={topStats.control} />
              <StatRow label="Valor"    value={topStats.valor} />
              <StatRow label="Defensa"  value={topStats.defensa} />
              <StatRow label="Libertad" value={topStats.libertad} />
            </div>
          )}

          {!loading && stats.length === 0 && (
            <p className="status-msg">No hay stats registradas.</p>
          )}

          {/* Descripción */}
          {player.description && (
            <div className="modal-description" style={{ borderColor: el.border, background: el.bg }}>
              <p>{player.description}</p>
            </div>
          )}

          {/* Notas competitivas */}
          {player.competitive_notes && (
            <div className="modal-competitive">
              <span className="modal-competitive-label">Notas competitivas</span>
              <p className="modal-competitive-text">{player.competitive_notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlayerModal;