import { useEffect, useState } from 'react';
import { getPlayers } from '../api/playersApi';
import PlayerCard from '../components/PlayerCard';
import PlayerModal from '../components/PlayerModal';

const POSITIONS = ['DL', 'MC', 'DF', 'POR'];
const ELEMENTS  = ['Fuego', 'Bosque', 'Aire', 'Montaña'];
const GENDERS   = ['Masculino', 'Femenino'];
const STATS     = ['tiro', 'fisico', 'control', 'defensa', 'rapidez', 'aguante', 'valor', 'libertad'];

function PlayersPage() {
  const [players, setPlayers]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const [game, setGame]         = useState('IE1');
  const [search, setSearch]     = useState('');
  const [position, setPosition] = useState('');
  const [element, setElement]   = useState('');
  const [sex, setSex]           = useState('');
  const [team, setTeam]         = useState('');
  const [statName, setStatName] = useState('');
  const [statMin, setStatMin]   = useState('');

  useEffect(() => {
    fetchPlayers();
  }, [game, search, position, element, sex, team,statName, statMin]);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await getPlayers({
        game,
        name: search,
        position,
        element,
        sex,
        team,
        statName,
        statMin,
      });
      setPlayers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Error al cargar los jugadores');
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setPosition('');
    setElement('');
    setSex('');
    setTeam('');
    setStatName('');
    setStatMin('');
  };

  const activeFilters = [position, element, sex, team, statName].filter(Boolean).length;

  return (
    <div className="home-page">

  <div className="players-filters">

    {/* Tabs de juego */}
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

    {/* Filtros */}
    <div className="filters-panel">

      {/* Búsqueda */}
      <div className="search-bar-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Buscar jugador..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="filters-row">

        {/* Posición */}
        <select
          className="filter-select"
          value={position}
          onChange={e => setPosition(e.target.value)}
        >
          <option value="">Posición</option>
          {POSITIONS.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        {/* Elemento */}
        <select
          className="filter-select"
          value={element}
          onChange={e => setElement(e.target.value)}
        >
          <option value="">Elemento</option>
          {ELEMENTS.map(e => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>

        {/* Género */}
        <select
          className="filter-select"
          value={sex}
          onChange={e => setSex(e.target.value)}
        >
          <option value="">Género</option>
          {GENDERS.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        {/* Equipo */}
        <input
          type="text"
          className="filter-select"
          placeholder="Equipo..."
          value={team}
          onChange={e => setTeam(e.target.value)}
        />

        {/* Estadística */}
        <select
          className="filter-select"
          value={statName}
          onChange={e => setStatName(e.target.value)}
        >
          <option value="">Estadística</option>
          {STATS.map(s => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>

        {/* Valor mínimo de stat */}
        {statName && (
          <input
            type="number"
            className="filter-select filter-stat-min"
            placeholder="Mínimo..."
            value={statMin}
            min={0}
            onChange={e => setStatMin(e.target.value)}
          />
        )}

        {/* Reset filtros */}
        {activeFilters > 0 && (
          <button className="filter-reset" onClick={resetFilters}>
            Limpiar ({activeFilters})
          </button>
        )}

      </div>
    </div>
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