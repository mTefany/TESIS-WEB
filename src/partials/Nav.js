import { Link } from "react-router-dom";

function Nav() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <Link className="navbar-brand navtex" to="/">
              Home
            </Link>
          </a>
          <div className="nav justify-content-cente">
            <Link className="nav-link" to="/tarjeta">
              Tarjetas
            </Link>
            <Link className="nav-link" to="/tablero">
              Tablero
            </Link>
            <Link className="nav-link" to="/sensores">
              Sensores
            </Link>
          </div>

          <div className="d-flex">
            <span id="user-details" className="nav-link">
              e-mail
            </span>
            <Link className="navbar-brand" to="/login">
              Logout
            </Link>
            {/* <img className="salirimg" src="img/salir.png" alt="Salir de la pagina"></a> */}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Nav;
