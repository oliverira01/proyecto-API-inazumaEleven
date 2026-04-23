import { useState } from 'react';
import { getImageUrl } from '../hooks/imageUrl';

const MAP_BY_GAME = {
  IE1: '/images/mapas/ie1/mapa_ie1.png',
  IE2: '/images/mapas/ie2/mapa_ie2.png',
  IE3: '/images/mapas/ie3/mapa_ie3.png',
};

function MapCoordinatePicker() {
  const [game, setGame]         = useState('IE1');
  const [coords, setCoords]     = useState(null);
  const [history, setHistory]   = useState([]);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    const rounded = { x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(2)) };
    setCoords(rounded);
    setHistory(prev => [rounded, ...prev].slice(0, 10));
  };

  const copyToClipboard = (x, y) => {
    navigator.clipboard.writeText(`map_x = ${x}, map_y = ${y}`);
  };

  return (
    <div className="home-page">
      <h2 style={{ color: 'var(--accent-gold)', marginBottom: '16px' }}>
        Selector de coordenadas del mapa
      </h2>

      <div className="game-tabs" style={{ justifyContent: 'center', marginBottom: '16px' }}>
        {['IE1', 'IE2', 'IE3'].map(g => (
          <button
            key={g}
            className={game === g ? 'active' : ''}
            onClick={() => { setGame(g); setCoords(null); setHistory([]); }}
          >
            {g}
          </button>
        ))}
      </div>

      <p style={{ color: 'var(--text-secondary)', marginBottom: '12px', textAlign: 'center' }}>
        Haz click en el mapa para obtener las coordenadas del punto
      </p>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>

        {/* Mapa */}
        <div
          style={{ position: 'relative', flex: 1, cursor: 'crosshair' }}
          onClick={handleClick}
        >
          <img
            src={getImageUrl(MAP_BY_GAME[game])}
            alt="Mapa"
            style={{ width: '100%', borderRadius: '12px', display: 'block', border: '2px solid var(--border)' }}
            draggable={false}
          />
          {coords && (
            <div
              style={{
                position: 'absolute',
                left: `${coords.x}%`,
                top:  `${coords.y}%`,
                transform: 'translate(-50%, -50%)',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: '#f59e0b',
                border: '2px solid #fff',
                pointerEvents: 'none',
              }}
            />
          )}
        </div>

        {/* Panel de coordenadas */}
        <div style={{
          width: '260px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>

          {/* Último click */}
          {coords && (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--accent-gold)',
              borderRadius: '10px',
              padding: '14px',
            }}>
              <p style={{ color: 'var(--accent-gold)', fontWeight: 700, marginBottom: '8px' }}>
                Último click
              </p>
              <p style={{ color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: '14px' }}>
                map_x = {coords.x}
              </p>
              <p style={{ color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: '14px' }}>
                map_y = {coords.y}
              </p>
              <button
                onClick={() => copyToClipboard(coords.x, coords.y)}
                style={{
                  marginTop: '10px',
                  width: '100%',
                  padding: '6px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'var(--accent-gold)',
                  color: '#000',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                Copiar
              </button>
              <p style={{ marginTop: '10px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                SQL:
              </p>
              <code style={{
                display: 'block',
                background: 'var(--bg-secondary)',
                padding: '8px',
                borderRadius: '6px',
                fontSize: '11px',
                color: 'var(--text-primary)',
                wordBreak: 'break-all'
              }}>
                UPDATE trainings SET map_x = {coords.x}, map_y = {coords.y} WHERE name = 'NOMBRE' AND game = '{game}';
              </code>
            </div>
          )}

          {/* Historial */}
          {history.length > 0 && (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '14px',
            }}>
              <p style={{ color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '8px', fontSize: '12px' }}>
                Historial (últimos 10)
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {history.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '4px 8px',
                      background: 'var(--bg-secondary)',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                    }}
                    onClick={() => copyToClipboard(c.x, c.y)}
                  >
                    <span>x: {c.x} y: {c.y}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>copiar</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default MapCoordinatePicker;