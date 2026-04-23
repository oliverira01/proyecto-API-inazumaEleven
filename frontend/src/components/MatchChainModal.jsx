import { useEffect, useState } from 'react';
import { getMatchChainTeams, getMatchChainDrops } from '../api/matchChainsApi';
import { getImageUrl } from '../hooks/imageUrl';

function TeamDrops({ chainTeamId }) {
  const [drops, setDrops] = useState([]);

  useEffect(() => {
    getMatchChainDrops(chainTeamId)
      .then(({ data }) => setDrops(Array.isArray(data) ? data : []))
      .catch(() => setDrops([]));
  }, [chainTeamId]);

  if (drops.length === 0) return null;

  return (
    <div className="chain-drops">
      {drops.map((drop, i) => (
        <span key={i} className="chain-drop-badge">{drop.name}</span>
      ))}
    </div>
  );
}

function MatchChainModal({ chain, onClose }) {
  const [teams, setTeams]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMatchChainTeams(chain.id)
      .then(({ data }) => setTeams(Array.isArray(data) ? data : []))
      .catch(() => setTeams([]))
      .finally(() => setLoading(false));

    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [chain.id]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container chain-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="chain-modal-header-img">
          {chain.image_url ? (
            <img
              className="chain-modal-banner"
              src={getImageUrl(chain.image_url)}
              alt={chain.name}
            />
          ) : (
            <div className="chain-modal-banner placeholder">🔗</div>
          )}
          <div className="chain-modal-title-block">
            <h2 className="chain-modal-title">{chain.name}</h2>
          </div>
          <button className="modal-close chain-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">

          {/* Descripción */}
          {chain.description && (
            <div className="modal-description">
              <p>{chain.description}</p>
            </div>
          )}

          {/* Desbloqueo */}
          {chain.unlock_condition && (
            <div className="chain-info-block">
              <span className="modal-competitive-label">Cómo desbloquear</span>
              <p className="chain-info-text">{chain.unlock_condition}</p>
            </div>
          )}

          {/* Equipos */}
          <div className="modal-competitive-label">Equipos</div>
          {loading && <p className="status-msg">Cargando equipos...</p>}
          {!loading && teams.length === 0 && (
            <p className="status-msg">No hay equipos registrados.</p>
          )}
          {!loading && teams.length > 0 && (
            <div className="chain-teams-list">
              {teams.map((team, i) => (
                <div key={team.chain_team_id} className="chain-team-row">
                  <div className="chain-team-order">{i + 1}</div>
                  <div className="chain-team-info">
                    <span className="chain-team-name">{team.name}</span>
                    {team.formation && (
                      <span className="chain-team-formation">{team.formation}</span>
                    )}
                  </div>
                  <TeamDrops chainTeamId={team.chain_team_id} />
                </div>
              ))}
            </div>
          )}

          {/* Recompensa final */}
          {(chain.reward_text || chain.reward_image_url) && (
            <div className="chain-reward">
              <span className="modal-competitive-label">Recompensa final</span>
              {chain.reward_text && (
                <p className="chain-info-text">{chain.reward_text}</p>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default MatchChainModal;