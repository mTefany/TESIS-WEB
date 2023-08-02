import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Link } from "react-router-dom";
import Nav from "../partials/Nav";
import Footer from "../partials/footer";
import Area from "../hook/Area";
import Tarjeta from "../hook/tarjetas";

import Barras from '../hook/Barras'
import Notify from "./Notificacion";

const Home = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) return <h1>Loading</h1>;
  return (
    <div>
      <Nav />
      <Notify />
      <div className="container bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4 mt-3">
        <h4 className=" mb-4 text-uppercase">
          Bienvenido {user.displayName || user.email}
        </h4>
        <Tarjeta />

        <div className='row' id="cards-div">
          <div class=" mb-3">
            <div className="card-body">
              <Link className="nav-link" to="/tablero">
                <Area />
              </Link>

            </div>
            <div />

            <div class=" mb-3">
              <div className="card-body">
                <Link className="nav-link" to="/tablero">
                  <Barras />
                </Link>
                {/* gráfico de Highcharts */}
                <Prueba/>
              </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      );
};

      export default Home;
