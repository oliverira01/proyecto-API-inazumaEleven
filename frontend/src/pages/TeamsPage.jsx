import React, { useEffect, useState } from "react";
import TeamCard from "../components/TeamCard";
import TeamModal from "../components/TeamModal";

const API_URL = "http://localhost:3001/api/teams";

const TeamsPage = () => {

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState("");
  const [search, setSearch] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);

  const openTeamModal = (team) => {
    setSelectedTeam(team);
  };

  const closeTeamModal = () => {
    setSelectedTeam(null);
  };

  const fetchTeams = async () => {
    setLoading(true);

    try {
      let url = `${API_URL}?`;

      if (game) url += `game=${game}&`;
      if (search) url += `name=${search}`;

      const res = await fetch(url);
      const data = await res.json();

      setTeams(data);

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTeams();
  }, [game, search]);

  const handleSearch = () => {
    fetchTeams();
  };

  return (
    <div className="home-page">

  <div className="teams-filters">

    <div className="game-tabs">
      <button
        className={!game ? "active" : ""}
        onClick={() => setGame("")}
      >
        Todos
      </button>
      <button
        className={game === "IE1" ? "active" : ""}
        onClick={() => setGame("IE1")}
      >
        IE1
      </button>
      <button
        className={game === "IE2" ? "active" : ""}
        onClick={() => setGame("IE2")}
      >
        IE2
      </button>
      <button
        className={game === "IE3" ? "active" : ""}
        onClick={() => setGame("IE3")}
      >
        IE3
      </button>
    </div>

    <div className="filters-panel">
      <div className="search-bar-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Buscar equipo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>

  </div>

      {loading ? (
        <div className="status-msg">Cargando equipos...</div>
      ) : teams.length === 0 ? (
        <div className="status-msg">No se encontraron equipos</div>
      ) : (
        <div className="players-grid">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onClick={openTeamModal}
            />
          ))}
        </div>
      )}
      {selectedTeam && (
        <TeamModal
          team={selectedTeam}
          onClose={closeTeamModal}
        />
      )}
    </div>
  );
};

export default TeamsPage;