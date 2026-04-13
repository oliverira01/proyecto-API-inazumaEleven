import { useEffect, useState } from 'react';
import { getTechniques } from '../api/techniquesApi';
import { getImageUrl } from '../hooks/imageUrl';

const TYPES_BY_GAME = {
  IE1: ['Tiro', 'Regate', 'Bloqueo', 'Parada'],
  IE2: ['Tiro', 'Regate', 'Bloqueo', 'Parada', 'Enlace'],
  IE3: ['Tiro', 'Regate', 'Bloqueo', 'Parada', 'Enlace'],
};

const ELEMENTS = ['Fuego', 'Bosque', 'Aire', 'Montaña'];

const ELEMENT_COLOR = {
  Fuego:   '#dc2626',
  Bosque:  '#16a34a',
  Aire:    '#2563eb',
  Montaña: '#92400e',
};

const TYPE_COLOR = {
  Tiro:    '#dc2626',
  Regate:  '#2563eb',
  Bloqueo: '#16a34a',
  Parada:  '#f59e0b',
  Enlace:  '#a855f7',
};

const TYPE_LABEL = {
  Tiro:    'TIR',
  Regate:  'REG',
  Bloqueo: 'BLO',
  Parada:  'PAR',
  Enlace:  'TAL',
};

const TYPE_CLASS = {
  Tiro:    'technique-section-tiro',
  Regate:  'technique-section-regate',
  Bloqueo: 'technique-section-bloqueo',
  Parada:  'technique-section-parada',
  Enlace:  'technique-section-enlace',
};

function TechniqueRow({ technique }) {
  const nameColor = ELEMENT_COLOR[technique.element] ?? '#a855f7';
  const typeBg    = TYPE_COLOR[technique.type]       ?? '#444';
  const typeLabel = TYPE_LABEL[technique.type]       ?? '—';

  return (
    <tr className="technique-table-row">
      <td className="technique-table-img">
        {technique.image_url ? (
          <img src={getImageUrl(technique.image_url)} alt={technique.name} />
        ) : (
          <div className="technique-img-placeholder">⚡</div>
        )}
      </td>
      <td>
        <div className="technique-table-name-cell">
          <span className="technique-table-name" style={{ color: nameColor }}>
            {technique.name}
          </span>
          {technique.type && (
            <span className="technique-type-badge" style={{ background: typeBg }}>
              {typeLabel}
            </span>
          )}
        </div>
        {technique.element && (
          <span className="technique-table-element" style={{ color: nameColor }}>
            {technique.element}
          </span>
        )}
      </td>
      <td className="technique-table-center">{technique.base_power ?? '—'}</td>
      <td className="technique-table-center">{technique.pt_cost}</td>
      <td className="technique-table-obtain">{technique.obtain_method ?? '—'}</td>
    </tr>
  );
}

function TechniqueSection({ title, techniques, typeColor, type }) {
  if (techniques.length === 0) return null;
  const borderClass = TYPE_CLASS[type] ?? '';

  return (
    <div className={`technique-section ${borderClass}`}>
      <h2 className="technique-section-title" style={{ color: typeColor }}>
        {title}
      </h2>
      <table className="technique-table">
        <thead>
          <tr>
            <th></th>
            <th>Nombre</th>
            <th>Potencia base</th>
            <th>Coste PT</th>
            <th>Cómo obtenerla</th>
          </tr>
        </thead>
        <tbody>
          {techniques.map(t => (
            <TechniqueRow key={t.tech_entry_id} technique={t} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TechniquesPage() {
  const [techniques, setTechniques]       = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [game, setGame]                   = useState('IE1');
  const [search, setSearch]               = useState('');
  const [filterType, setFilterType]       = useState('');
  const [filterElement, setFilterElement] = useState('');

  useEffect(() => {
    fetchTechniques();
  }, [game, search, filterType, filterElement]);

  const fetchTechniques = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await getTechniques({
        game,
        name:    search,
        type:    filterType,
        element: filterElement,
      });
      setTechniques(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Error al cargar las técnicas');
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setFilterType('');
    setFilterElement('');
  };

  const activeFilters = [filterType, filterElement].filter(Boolean).length;
  const types         = TYPES_BY_GAME[game];
  const visibleTypes  = filterType ? [filterType] : types;

  return (
    <div className="home-page">

      <div className="techniques-filters">
        <div className="game-tabs">
          {['IE1', 'IE2', 'IE3'].map(g => (
            <button
              key={g}
              className={game === g ? 'active' : ''}
              onClick={() => { setGame(g); setFilterType(''); }}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="filters-panel">
          <div className="search-bar-container">
            <input
              type="text"
              className="search-bar"
              placeholder="Buscar técnica..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="filters-row">
            <select
              className="filter-select"
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
            >
              <option value="">Tipo</option>
              {types.map(t => (
                <option key={t} value={t}>
                  {t === 'Enlace' ? 'Talento' : t}
                </option>
              ))}
            </select>

            <select
              className="filter-select"
              value={filterElement}
              onChange={e => setFilterElement(e.target.value)}
            >
              <option value="">Elemento</option>
              {ELEMENTS.map(e => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>

            {activeFilters > 0 && (
              <button className="filter-reset" onClick={resetFilters}>
                Limpiar ({activeFilters})
              </button>
            )}
          </div>
        </div>
      </div>

      {loading && <p className="status-msg">Cargando técnicas...</p>}
      {error   && <p className="status-msg error">{error}</p>}
      {!loading && !error && techniques.length === 0 && (
        <p className="status-msg">No se encontraron técnicas.</p>
      )}

      {!loading && !error && (
        <div className="techniques-page-content">
          {visibleTypes.map(type => (
            <TechniqueSection
              key={type}
              title={type === 'Enlace' ? 'Talentos' : `${type}s`}
              techniques={techniques.filter(t => t.type === type)}
              typeColor={TYPE_COLOR[type]}
              type={type}
            />
          ))}
        </div>
      )}

    </div>
  );
}

export default TechniquesPage;