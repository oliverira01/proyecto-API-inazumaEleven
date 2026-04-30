import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import PlayersPage from './pages/PlayersPage';
import TeamsPage from "./pages/TeamsPage";
import TechniquesPage from './pages/TechniquesPage';
import ItemsPage from './pages/ItemsPage';
import MatchChainsPage from './pages/MatchChainsPage';
import TrainingsPage from './pages/TrainingsPage';
import MapCoordinatePicker from './pages/MapCoordinatePicker';
import MinigamesPage from './pages/MinigamesPage';
import InazudlePage from './pages/InazudlePage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/jugadores" element={<PlayersPage />} />
        <Route path="/equipos" element={<TeamsPage />} />
        <Route path="/tecnicas" element={<TechniquesPage />} />
        <Route path="/items" element={<ItemsPage />} />
        <Route path="/cadenas" element={<MatchChainsPage />} />
        <Route path="/entrenamientos" element={<TrainingsPage />} />
        <Route path="/tiendas" element={<div className="status-msg">Próximamente</div>} />
        <Route path="/torneos" element={<div className="status-msg">Próximamente</div>} />
        <Route path="/minijuegos" element={<MinigamesPage />} />
        <Route path="/minijuegos/inazudle" element={<InazudlePage />} />
        <Route path="/minijuegos/frontier" element={<div className="status-msg">Fútbol Frontier — próximamente</div>} />
        <Route path="/minijuegos/imagen" element={<div className="status-msg">Adivina la técnica — próximamente</div>} />
        <Route path="/minijuegos/sonido" element={<div className="status-msg">Adivina el sonido — próximamente</div>} />
        <Route path="/map-picker" element={<MapCoordinatePicker />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;