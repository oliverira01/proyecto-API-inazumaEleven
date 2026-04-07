import { useEffect, useState } from "react";

const API_URL = "http://localhost:3001/api/teams";

const TeamModal = ({ team, onClose }) => {

  const [players, setPlayers] = useState([]);
  
  const getFormationLines = () => {
  if (!team.formation) return [4,4,2];

  return team.formation
    .split("-")
    .map(n => parseInt(n));
};

  useEffect(() => {

    const fetchPlayers = async () => {
      const res = await fetch(
        `${API_URL}/${team.id}/players?game=${team.game}`
      );

      const data = await res.json();
      setPlayers(data);
    };

    fetchPlayers();
  }, [team]);

  // Limitar a los primeros 11 jugadores del equipo
    const limitedPlayers = players.slice(0, 11);

    const goalkeepers = limitedPlayers.filter(p => p.position === "POR");
    const defenders   = limitedPlayers.filter(p => p.position === "DF");
    const midfielders = limitedPlayers.filter(p => p.position === "MC");
    const forwards    = limitedPlayers.filter(p => p.position === "DL");

const formationLines = getFormationLines();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="modal-header">

          <img
            src={team.image_url}
            alt={team.name}
            className="modal-avatar"
          />

          <div className="modal-header-center">
            <div className="modal-name">{team.name}</div>
            <div className="modal-team">{team.game}</div>
          </div>

          <button className="modal-close" onClick={onClose}>
            ✕
          </button>

        </div>

        <div className="modal-body">

          {team.description && (
            <div className="modal-description">
              {team.description}
            </div>
          )}

          {team.in_match_chain && (
            <div className="modal-competitive">
              <div className="modal-competitive-label">
                Match Chain
              </div>
              <div className="modal-competitive-text">
                {team.in_match_chain}
              </div>
            </div>
          )}

          {team.formation && (
            <div>
              <div className="modal-competitive-label">
                Formación
              </div>

              <img
                src={`/formations/${team.formation}.png`}
                alt={team.formation}
                style={{ width: "100%" }}
              />
            </div>
          )}

          <div>
            <div className="modal-competitive-label">
                Formación
            </div>

            <div className="team-field">

            {/* Delanteros */}
            <div className="field-row">
                {forwards.map(p => (
                <div key={p.id} className="field-player">
                    <img src={p.image_url} alt={p.name}/>
                    <span>{p.name}</span>
                </div>
                ))}
            </div>

            {/* Centrocampistas */}
            <div className="field-row">
                {midfielders.map(p => (
                <div key={p.id} className="field-player">
                    <img src={p.image_url} alt={p.name}/>
                    <span>{p.name}</span>
                </div>
                ))}
            </div>

            {/* Defensas */}
            <div className="field-row">
                {defenders.map(p => (
                <div key={p.id} className="field-player">
                    <img src={p.image_url} alt={p.name}/>
                    <span>{p.name}</span>
                </div>
                ))}
            </div>

            {/* Portero */}
            <div className="field-row">
                {goalkeepers.map(p => (
                <div key={p.id} className="field-player">
                    <img src={p.image_url} alt={p.name}/>
                    <span>{p.name}</span>
                </div>
                ))}
            </div>
    </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TeamModal;