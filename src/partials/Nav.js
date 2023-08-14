import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import logo from '../image/logohome.png'
import 'material-icons/iconfont/material-icons.css';

function Nav() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) return <h1>Loading</h1>;

  return (
    <div>
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img src={logo} alt="Logo" width="250" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span><i className="material-icons">menu</i></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <NavItem to="/" label="Inicio" />
              <NavItem to="/tablero" label="Tablero" />
              <NavItem to="/sensores" label="Sensores" />
              <NavItem to="/usuarios" label="Usuarios" />
            </ul>
          </div>

          <div className="d-flex">
            <span id="user-details" className="nav-link">
              {user.email}
            </span>
            <Link className="nav-link" to="/login" onClick={handleLogout}>
              <i className="material-icons">logout</i>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

// Componente para los elementos de navegación
function NavItem({ to, label }) {
  return (
    <li className="nav-item">
      <Link className="nav-link" to={to}>
        {label}
      </Link>
    </li>
  );
}

export default Nav;
