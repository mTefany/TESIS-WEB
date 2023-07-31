import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import logo from '../image/logohome.png'



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
      <nav className="navbar navbar-expand-lg  navbar-dark bg-primary">
        <div className="container-fluid f-flex justify-content-around align-items-center">
          <a className="navbar-brand" href="/">
            <Link className="navbar-brand navtex text-uppercase" to="/">
            <img src={logo} alt="Logo" width="250x" />
            </Link>
          </a>
          <div className="nav justify-content-cente">
            <Link className="nav-link text-uppercase text-reset fw-bold" to="/">
              Home
            </Link>
            <Link className="nav-link text-uppercase text-reset fw-bold" to="/tarjeta">
              Tarjetas
            </Link>
            <Link className="nav-link text-uppercase text-reset fw-bold" to="/tablero">
              Tablero
            </Link>
            <Link className="nav-link text-uppercase text-reset fw-bold" to="/sensores">
              Sensores
            </Link>
          </div>

          <div className="d-flex">
            <span id="user-details" className="nav-link text-uppercase text-reset fw-bold">
              {user.email}
            </span>
            <Link className="navbar-brand text-uppercase fw-bold" to="/login">
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
