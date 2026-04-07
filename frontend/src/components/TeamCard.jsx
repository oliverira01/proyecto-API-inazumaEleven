import React from "react";

const TeamCard = ({ team, onClick }) => {
  return (
    <div className="player-card" onClick={() => onClick(team)}>
      {team.image_url ? (
        <img
          src={team.image_url}
          alt={team.name}
          className="player-card-image"
        />
      ) : (
        <div className="player-card-image placeholder">⚽</div>
      )}

      <div className="player-card-body">
        <div className="player-card-name">{team.name}</div>

        <div className="player-card-team">
          Juego: <strong>{team.game}</strong>
        </div>

        <div className="player-card-badges">
          {team.formation && (
            <span className="badge badge-position">
              {team.formation}
            </span>
          )}
        </div>

        {team.description && (
          <div className="player-card-notes">
            {team.description}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamCard;