import { useEffect, useState } from 'react';
import { getPlayers } from '../api/playersApi';
import PlayerCard from '../components/PlayerCard';
import PlayerModal from '../components/PlayerModal';

function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [game, setGame] = useState('IE1');
  const [search, setSearch] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    fetchPlayers();
  }, [game]);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await getPlayers({ game, name: search });
      setPlayers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Error al cargar los jugadores');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPlayers();
  };

  return (
    <div className="home-page">
      <div className="filters">
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
        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            placeholder="Buscar jugador..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit">Buscar</button>
        </form>
      </div>

      {loading && <p className="status-msg">Cargando jugadores...</p>}
      {error   && <p className="status-msg error">{error}</p>}
      {!loading && !error && players.length === 0 && (
        <p className="status-msg">No se encontraron jugadores.</p>
      )}

      {!loading && !error && (
        <div className="players-grid">
          {players.map(player => (
            <PlayerCard
              key={player.entry_id}
              player={player}
              onClick={() => setSelectedPlayer(player)}
            />
          ))}
        </div>
      )}

      {selectedPlayer && (
        <PlayerModal
          player={selectedPlayer}
          game={game}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
}

export default PlayersPage;