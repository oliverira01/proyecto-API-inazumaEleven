import { useEffect, useState } from 'react';
import { getTournaments } from '../api/tournamentsApi';
import TournamentCard from '../components/TournamentCard';

function TournamentsPage() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  useEffect(() => {
    getTournaments()
      .then(({ data }) => setTournaments(Array.isArray(data) ? data : []))
      .catch(() => setError('Error al cargar los torneos'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-page">
      <h1 className="tournaments-title">Torneos</h1>
      <p className="tournaments-subtitle">Exclusivo Inazuma Eleven 3</p>

      {loading && <p className="status-msg">Cargando torneos...</p>}
      {error   && <p className="status-msg error">{error}</p>}
      {!loading && !error && tournaments.length === 0 && (
        <p className="status-msg">No hay torneos registrados.</p>
      )}

      {!loading && !error && (
        <div className="tournaments-list">
          {tournaments.map(t => (
            <TournamentCard key={t.id} tournament={t} />
          ))}
        </div>
      )}
    </div>
  );
}

export default TournamentsPage;