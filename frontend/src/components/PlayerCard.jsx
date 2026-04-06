function PlayerCard({ player, onClick }) {
  return (
    <div className="player-card" onClick={onClick}>
      {player.image_url ? (
        <img
          className="player-card-image"
          src={player.image_url}
          alt={player.name}
          onError={e => { e.target.style.display = 'none'; }}
        />
      ) : (
        <div className="player-card-image placeholder">⚽</div>
      )}
      <div className="player-card-body">
        <div>
          <p className="player-card-name">{player.name}</p>
          <p className="player-card-team">{player.team_name ?? 'Sin equipo'}</p>
        </div>
        <div className="player-card-badges">
          <span className="badge badge-position">{player.position}</span>
          <span className={`badge badge-${player.element}`}>{player.element}</span>
          <span className={`badge badge-${player.sex}`}>{player.sex}</span>
        </div>
        {player.competitive_notes && (
          <p className="player-card-notes">{player.competitive_notes}</p>
        )}
      </div>
    </div>
  );
}

export default PlayerCard;