import { useEffect, useState } from 'react';
import { FORMATIONS } from '../data/formations';

const API_URL = 'http://localhost:3001/api/teams';

function FieldPlayer({ player, onDragStart, onDrop }) {
  return (
    <div
      className="field-player"
      draggable
      onDragStart={onDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      {player.image_url ? (
        <img src={player.image_url} alt={player.name} />
      ) : (
        <div className="field-player-placeholder">⚽</div>
      )}
      <span className={`field-player-name badge-${player.element}`}>
        {player.name.split(' ')[0]}
      </span>
    </div>
  );
}

function FormationField({ players, formation, allPlayers, setAllPlayers }) {
  const formationData = FORMATIONS[formation];

  if (!formationData) return null;

  const handleDragStart = (player) => {
    window.draggedPlayer = player;
  };

  const handleDrop = (targetIndex) => {
    const dragged = window.draggedPlayer;
    if (!dragged) return;
    const updated = [...allPlayers];
    const fromIndex = updated.findIndex((p) => p.entry_id === dragged.entry_id);

    // intercambiar
    [updated[fromIndex], updated[targetIndex]] = [updated[targetIndex], updated[fromIndex]];

    setAllPlayers(updated);
    window.draggedPlayer = null;
  };

  return (
    <div className="team-field">
      {formationData.positions.map((pos, i) => {
        const player = allPlayers[i];
        if (!player) return null;

        return (
          <div
            key={player.entry_id}
            className="field-player-wrapper"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transition: 'all 0.3s ease',
              position: 'absolute',
            }}
          >
            <FieldPlayer
              player={player}
              onDragStart={() => handleDragStart(player)}
              onDrop={() => handleDrop(i)}
            />
          </div>
        );
      })}
    </div>
  );
}

function TeamModal({ team, onClose }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allPlayers, setAllPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await fetch(`${API_URL}/${team.id}/players?game=${team.game}`);
        const data = await res.json();
        setPlayers(Array.isArray(data) ? data : []);
        setAllPlayers(Array.isArray(data) ? data : []);
      } catch {
        setPlayers([]);
        setAllPlayers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();

    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [team]);

  const starters = allPlayers.slice(0, 11);
  const bench = allPlayers.slice(11, 16);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header">
          {team.image_url ? (
            <img src={team.image_url} alt={team.name} className="modal-avatar" />
          ) : (
            <div className="modal-avatar-placeholder">🛡️</div>
          )}
          <div className="modal-header-center">
            <div className="modal-top-row">
              <span className="modal-game-badge">{team.game}</span>
              {team.formation && (
                <span className="modal-level">
                  {FORMATIONS[team.formation]?.label ?? team.formation}
                </span>
              )}
            </div>
            <h2 className="modal-name">{team.name}</h2>
            {team.in_match_chain && (
              <span className="badge badge-position">Cadena de partidos</span>
            )}
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">

          {team.description && (
            <div className="modal-description">
              <p>{team.description}</p>
            </div>
          )}

          {/* Campo con formación */}
          <div className="modal-competitive-label">Alineación</div>
          {loading ? (
            <p className="status-msg">Cargando jugadores...</p>
          ) : (
            <FormationField
              players={starters}
              formation={team.formation}
              allPlayers={allPlayers}
              setAllPlayers={setAllPlayers}
            />
          )}

          {/* Banquillo */}
          {!loading && bench.length > 0 && (
            <div>
              <div className="modal-competitive-label">Banquillo</div>
              <div className="field-row">
                {bench.map((p, i) => (
                  <FieldPlayer
                    key={p.entry_id}
                    player={p}
                    onDragStart={() => { window.draggedPlayer = p; }}
                    onDrop={() => {
                      const index = 11 + i;
                      const dragged = window.draggedPlayer;
                      if (!dragged) return;
                      const updated = [...allPlayers];
                      const fromIndex = updated.findIndex(pl => pl.entry_id === dragged.entry_id);
                      [updated[fromIndex], updated[index]] = [updated[index], updated[fromIndex]];
                      setAllPlayers(updated);
                      window.draggedPlayer = null;
                    }}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default TeamModal;