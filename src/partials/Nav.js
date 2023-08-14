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
      <nav className="navbar navbar-expand-lg   ">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img src={logo} alt="Logo" width="250x" />
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
            <span > <i className="material-icons">menu</i> </span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">

            <ul className="navbar-nav ms-auto ">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Inicio
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/tablero">
                  Tablero
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/sensores">
                  Sensores
                </Link>
              </li>
              {user?.firestoreData?.rol === "admin" && (
                <li className="nav-item">
                  <Link className="nav-link" to="/usuarios">
                    Usuarios
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div className="d-flex">
            <span id="user-details" className="nav-link">
              {user?.email}
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

export default Nav;
