import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import PlayersPage from './pages/PlayersPage';
import TeamsPage from "./pages/TeamsPage";
import TechniquesPage from './pages/TechniquesPage';
import ItemsPage from './pages/ItemsPage';
import MatchChainsPage from './pages/MatchChainsPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/"                  element={<LandingPage />} />
        <Route path="/jugadores"         element={<PlayersPage />} />
        <Route path="/equipos"           element={<TeamsPage />} />
        <Route path="/tecnicas"          element={<TechniquesPage />} />
        <Route path="/items"             element={<ItemsPage />} />
        <Route path="/cadenas"           element={<MatchChainsPage />} />
        <Route path="/entrenamientos"    element={<div className="status-msg">Próximamente</div>} />
        <Route path="/tiendas"           element={<div className="status-msg">Próximamente</div>} />
        <Route path="/torneos"           element={<div className="status-msg">Próximamente</div>} />
        <Route path="/minijuegos"        element={<div className="status-msg">Próximamente</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;