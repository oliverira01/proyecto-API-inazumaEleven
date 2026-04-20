import { useEffect, useState } from 'react';
import { getMatchChains } from '../api/matchChainsApi';
import MatchChainCard from '../components/MatchChainCard';
import MatchChainModal from '../components/MatchChainModal';

function MatchChainsPage() {
  const [chains, setChains]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [game, setGame]             = useState('IE1');
  const [search, setSearch]         = useState('');
  const [selectedChain, setSelectedChain] = useState(null);

  useEffect(() => {
    fetchChains();
  }, [game, search]);

  const fetchChains = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await getMatchChains({ game, name: search });
      setChains(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Error al cargar las cadenas de partidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">

      <div className="chains-filters">
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

        <div className="search-bar-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Buscar cadena..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading && <p className="status-msg">Cargando cadenas...</p>}
      {error   && <p className="status-msg error">{error}</p>}
      {!loading && !error && chains.length === 0 && (
        <p className="status-msg">No se encontraron cadenas de partidos.</p>
      )}

      {!loading && !error && (
        <div className="chains-grid">
          {chains.map(chain => (
            <MatchChainCard
              key={chain.id}
              chain={chain}
              onClick={() => setSelectedChain(chain)}
            />
          ))}
        </div>
      )}

      {selectedChain && (
        <MatchChainModal
          chain={selectedChain}
          onClose={() => setSelectedChain(null)}
        />
      )}

    </div>
  );
}

export default MatchChainsPage;