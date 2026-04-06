import { NavLink } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/jugadores',      label: 'Jugadores' },
  { to: '/equipos',        label: 'Equipos' },
  { to: '/tecnicas',       label: 'Técnicas' },
  { to: '/items',          label: 'Items' },
  { to: '/cadenas',        label: 'Cadenas' },
  { to: '/entrenamientos', label: 'Entrenamientos' },
  { to: '/tiendas',        label: 'Tiendas' },
  { to: '/torneos',        label: 'Torneos' },
  { to: '/minijuegos',     label: 'Minijuegos' },
];

function Header() {
  return (
    <header className="header">
      <NavLink to="/" className="header-logo">
        Inazuma Eleven
      </NavLink>
      <nav className="header-nav">
        {NAV_LINKS.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link-active' : 'nav-link'
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export default Header;