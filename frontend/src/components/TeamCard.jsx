import { getImageUrl } from '../hooks/imageUrl';

const TeamCard = ({ team, onClick }) => {
  return (
    <div className="player-card" onClick={() => onClick(team)}>
      
      <div className="player-card-body">
        <div className="player-card-top">
          <div className="player-card-info">
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
          </div>
          {team.image_url ? (
            <img
              src={getImageUrl(team.image_url)}
              alt={team.name}
              className="team-card-image"
              onError={e => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="team-card-image placeholder">⚽</div>
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