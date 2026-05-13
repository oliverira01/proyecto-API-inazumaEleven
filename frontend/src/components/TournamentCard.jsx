import { useState, useEffect } from 'react';
import {
  getTournamentRequiredPlayers,
  getTournamentTeams,
  getTournamentTeamDrops,
  getTournamentRewards
} from '../api/tournamentsApi';
import { getImageUrl } from '../hooks/imageUrl';

const TYPE_COLOR = {
  Tiro:    '#dc2626',
  Regate:  '#f59e0b',
  Bloqueo: '#2563eb',
  Parada:  '#16a34a',
  Enlace:  '#a855f7',
};

const TYPE_LABEL = {
  Tiro:    'TIR',
  Regate:  'REG',
  Bloqueo: 'BLO',
  Parada:  'PAR',
  Enlace:  'TAL',
};

const ELEMENT_COLOR = {
  Fuego:   '#dc2626',
  Bosque:  '#16a34a',
  Aire:    '#2563eb',
  Montaña: '#92400e',
};

function DropList({ tournamentTeamId }) {
  const [drops, setDrops] = useState([]);

  useEffect(() => {
    getTournamentTeamDrops(tournamentTeamId)
      .then(({ data }) => setDrops(Array.isArray(data) ? data : []))
      .catch(() => setDrops([]));
  }, [tournamentTeamId]);

  if (drops.length === 0) return null;

  return (
    <div className="tournament-drops">
      {drops.map((drop, i) => (
        <div key={i} className="tournament-drop-item">
          {drop.technique_name ? (
            <span
              className="tournament-drop-technique"
              style={{ color: TYPE_COLOR[drop.technique_type] ?? '#a855f7' }}
            >
              <span
                className="tournament-drop-type-badge"
                style={{ background: TYPE_COLOR[drop.technique_type] ?? '#a855f7' }}
              >
                {TYPE_LABEL[drop.technique_type] ?? '—'}
              </span>
              {drop.technique_name}
            </span>
          ) : (
            <span className="tournament-drop-item-name">
              <span className="tournament-drop-dot">•</span>
              {drop.item_name}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function RewardList({ tournamentId }) {
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    getTournamentRewards(tournamentId)
      .then(({ data }) => setRewards(Array.isArray(data) ? data : []))
      .catch(() => setRewards([]));
  }, [tournamentId]);

  if (rewards.length === 0) return null;

  return (
    <div className="tournament-rewards-list">
      {rewards.map((r, i) => (
        <div key={i} className="tournament-reward-item">
          {r.technique_name ? (
            <span
              className="tournament-drop-technique"
              style={{ color: TYPE_COLOR[r.technique_type] ?? '#a855f7' }}
            >
              <span
                className="tournament-drop-type-badge"
                style={{ background: TYPE_COLOR[r.technique_type] ?? '#a855f7' }}
              >
                {TYPE_LABEL[r.technique_type] ?? '—'}
              </span>
              {r.technique_name}
            </span>
          ) : (
            <span className="tournament-reward-item-name">{r.item_name}</span>
          )}
        </div>
      ))}
    </div>
  );
}

function TournamentCard({ tournament }) {
  const [expanded, setExpanded]         = useState(false);
  const [reqPlayers, setReqPlayers]     = useState([]);
  const [teams, setTeams]               = useState([]);
  const [loadingData, setLoadingData]   = useState(false);
  const [loaded, setLoaded]             = useState(false);

  const handleExpand = async () => {
    setExpanded(prev => !prev);
    if (!loaded) {
      setLoadingData(true);
      try {
        const [playersRes, teamsRes] = await Promise.all([
          getTournamentRequiredPlayers(tournament.id),
          getTournamentTeams(tournament.id),
        ]);
        setReqPlayers(Array.isArray(playersRes.data) ? playersRes.data : []);
        setTeams(Array.isArray(teamsRes.data) ? teamsRes.data : []);
        setLoaded(true);
      } catch {
        setReqPlayers([]);
        setTeams([]);
      } finally {
        setLoadingData(false);
      }
    }
  };

  return (
    <div className="tournament-card">

      {/* Cabecera siempre visible */}
      <div className="tournament-card-header" onClick={handleExpand}>
        <div className="tournament-card-header-left">
          <span className="tournament-rank">Rango {tournament.rank_number}</span>
          {tournament.min_level && (
            <span className="tournament-level">Niv. {tournament.min_level}+</span>
          )}
          {tournament.description && (
            <span className="tournament-cups">{tournament.description}</span>
          )}
        </div>
        <span className="tournament-expand-btn">
          {expanded ? '▲' : '▼'}
        </span>
      </div>

      {/* Jugadores requeridos — siempre visibles si hay datos */}
      {loaded && reqPlayers.length > 0 && (
        <div className="tournament-required">
          <p className="tournament-required-label">
            Necesitas <span>{tournament.required_player_count}</span> de estos jugadores:
          </p>
          <div className="tournament-required-grid">
            {reqPlayers.map((p, i) => (
              <div key={i} className="tournament-required-player">
                {p.image_url && (
                  <img src={getImageUrl(p.image_url)} alt={p.name} />
                )}
                <span
                  className="tournament-required-name"
                  style={{ color: ELEMENT_COLOR[p.element] ?? 'var(--text-primary)' }}
                >
                  {p.name}
                </span>
              </div>
            ))}
          </div>
          {tournament.extra_conditions && (
            <p className="tournament-extra-conditions">{tournament.extra_conditions}</p>
          )}
        </div>
      )}

      {/* Contenido expandible */}
      {expanded && (
        <div className="tournament-card-body">
          {loadingData && <p className="status-msg">Cargando...</p>}

          {!loadingData && (
            <>
              {/* Tabla de equipos */}
              <div className="tournament-teams-table">
                <div className="tournament-teams-header">
                  <span>Escudo</span>
                  <span>Equipo</span>
                  <span>Nivel</span>
                  <span>Recompensas</span>
                </div>
                {teams.map(team => (
                  <div key={team.tournament_team_id} className="tournament-team-row">
                    <div className="tournament-team-shield">
                      {team.shield_url ? (
                        <img src={getImageUrl(team.shield_url)} alt={team.team_name} />
                      ) : (
                        <span>🛡️</span>
                      )}
                    </div>
                    <span className="tournament-team-name">{team.team_name}</span>
                    <span className="tournament-team-level">{team.team_level}</span>
                    <DropList tournamentTeamId={team.tournament_team_id} />
                  </div>
                ))}
              </div>

              {/* Recompensas finales */}
              <div className="tournament-final-rewards">
                <div className="tournament-final-rewards-label">
                  Recompensas finales
                </div>
                <RewardList tournamentId={tournament.id} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default TournamentCard;