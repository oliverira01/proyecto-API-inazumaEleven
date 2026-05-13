import { useEffect, useState } from 'react';
import { getMatchChains } from '../api/matchChainsApi';
import MatchChainCard from '../components/MatchChainCard';
import MatchChainModal from '../components/MatchChainModal';

const VERSIONS_BY_GAME = {
  IE2: [
    { value: 'TF', label: 'Tormenta de Fuego' },
    { value: 'VE', label: 'Ventisca Eterna' },
  ],
  IE3: [
    { value: 'FE', label: 'Fuego Explosivo' },
    { value: 'RC', label: 'Rayo Celeste' },
    { value: 'AO', label: 'Amenaza del Ogro' },
  ],
};

function MatchChainsPage() {
  const [chains, setChains]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [game, setGame]                 = useState('IE1');
  const [search, setSearch]             = useState('');
  const [gameVersion, setGameVersion]   = useState('');
  const [selectedChain, setSelectedChain] = useState(null);

  useEffect(() => {
    fetchChains();
  }, [game, search, gameVersion]);

  const fetchChains = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await getMatchChains({
        game,
        name: search,
        gameVersion: gameVersion || undefined,
      });
      setChains(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Error al cargar las cadenas de partidos');
    } finally {
      setLoading(false);
    }
  };

  const handleGameChange = (g) => {
    setGame(g);
    const versions = VERSIONS_BY_GAME[g];
    setGameVersion(versions ? versions[0].value : '');
  };

  const versions = VERSIONS_BY_GAME[game];

  return (
    <div className="home-page">

      <div className="chains-filters">
        <div className="game-tabs">
          {['IE1', 'IE2', 'IE3'].map(g => (
            <button
              key={g}
              className={game === g ? 'active' : ''}
              onClick={() => handleGameChange(g)}
            >
              {g}
            </button>
          ))}
        </div>

        {versions && (
          <div className="ie3-version-tabs">
            {versions.map(v => (
              <button
                key={v.value}
                className={gameVersion === v.value ? 'active' : ''}
                onClick={() => setGameVersion(v.value)}
              >
                {v.label}
              </button>
            ))}
          </div>
        )}

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