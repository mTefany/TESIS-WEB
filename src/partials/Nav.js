import { Link } from "react-router-dom";

function Nav() {

  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: "#cff5fc" }}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Home</Link>
        <Link className="navbar-brand" to="/sensores">Sensor</Link>
        <Link className="nav-link" to="/tarjeta">Tarjetas</Link>
        <Link className="nav-link" to="/tablero">Tablero</Link>
        <Link className="navbar-brand" to="/login">Logout</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/sensores">Lista de Sensores</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/tarjeta">Tarjetas</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Nav;