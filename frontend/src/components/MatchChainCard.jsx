import { getImageUrl } from '../hooks/imageUrl';

function MatchChainCard({ chain, onClick }) {
  return (
    <div className="chain-card" onClick={onClick}>
      {chain.image_url ? (
        <img
          className="chain-card-image"
          src={getImageUrl(chain.image_url)}
          alt={chain.name}
          onError={e => { e.target.style.display = 'none'; }}
        />
      ) : (
        <div className="chain-card-image placeholder">🔗</div>
      )}
      <div className="chain-card-body">
        <div className="chain-card-top">
          <h3 className="chain-card-name">{chain.name}</h3>
          <span className="modal-game-badge chain-game-badge">{chain.game}</span>
        </div>
        {chain.description && (
          <p className="chain-card-desc">{chain.description}</p>
        )}
        {chain.unlock_condition && (
          <p className="chain-card-unlock">
            <span className="chain-unlock-label">Desbloqueo:</span> {chain.unlock_condition}
          </p>
        )}
      </div>
    </div>
  );
}

export default MatchChainCard;