import { useEffect, useState } from 'react';
import { getItems } from '../api/itemsApi';

const TYPES = ['consumible', 'equipacion', 'otro'];

const TYPE_LABEL = {
  consumible: 'Consumibles',
  equipacion: 'Equipación',
  otro:       'Otros',
};

const TYPE_COLOR = {
  consumible: '#f59e0b',
  equipacion: '#3b82f6',
  otro:       '#a855f7',
};

function ItemRow({ item }) {
  return (
    <div className="item-row">
      <div className="item-row-name">{item.name}</div>
      <div className="item-row-desc">{item.description ?? '—'}</div>
      <div className="item-row-footer">
        {item.buy_price > 0 && (
            <span className="item-price buy">
                Compra: {item.buy_price}
            </span>
        )}
        {item.sell_price > 0 && (
            <span className="item-price sell">
                Venta: {item.sell_price}
            </span>
        )}
        {item.obtain_method && (
          <span className="item-obtain">{item.obtain_method}</span>
        )}
      </div>
    </div>
  );
}

function ItemColumn({ type, items }) {
  const color = TYPE_COLOR[type];
  const label = TYPE_LABEL[type];

  return (
    <div className="item-column" style={{ borderColor: color }}>
      <h2 className="item-column-title" style={{ color, borderColor: color }}>
        {label}
      </h2>
      <div className="item-column-list">
        {items.length === 0 ? (
          <p className="item-empty">No hay items</p>
        ) : (
          items.map(item => (
            <ItemRow key={item.item_entry_id} item={item} />
          ))
        )}
      </div>
    </div>
  );
}

function ItemsPage() {
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const [game, setGame]     = useState('IE1');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchItems();
  }, [game, search]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await getItems({ game, name: search });
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Error al cargar los items');
    } finally {
      setLoading(false);
    }
  };
  console.log(items.map(i => i.type));

  const byType = (type) => items.filter(i => i.type === type);

  return (
    <div className="home-page">

      <div className="items-filters">
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
            placeholder="Buscar item..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading && <p className="status-msg">Cargando items...</p>}
      {error   && <p className="status-msg error">{error}</p>}

      {!loading && !error && (
        <div className="items-grid">
          {TYPES.map(type => (
            <ItemColumn
              key={type}
              type={type}
              items={byType(type)}
            />
          ))}
        </div>
      )}

    </div>
  );
}

export default ItemsPage;