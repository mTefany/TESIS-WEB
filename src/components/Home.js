import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Link } from "react-router-dom";
import Nav from "../partials/Nav";
import Footer from "../partials/footer";
import Tarjeta from "../hook/tarjetas";
import Notify from "./Notificacion";
import BarraBasica from "../hook/barraBasica";
import Prueba from "../hook/Prueba";
import LinePastelBarra from "../hook/LineBarraPastel";
import Linea from "../hook/Linea";

const Home = () => {
  const { user, loading } = useAuth();
  const graphStyle = {
    flex: '1',
  };




  if (loading) return <h1>Loading</h1>;
  return (
    <div >
      <Nav />
      <Notify />
      <div className="container bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4 mt-3">
        <h4 className=" mb-4 text-uppercase">
          Bienvenido {user.displayName || user.email}
        </h4>
        <Tarjeta />
        <div className="row container">
          {/* Contenedor de Area y Barras */}
          <div className='col-md-16'>
            <div className="d-md-flex gap-4">
              <div style={graphStyle}>
                <LinePastelBarra />
              </div>
              <div style={graphStyle}>
                <Linea />
              </div>
            </div>
          </div>
        </div>
        <div className="row container">
          {/* Contenedor de Area y Barras */}
          <div className='col-md-16'>
            <div className="d-md-flex gap-4">
              <div style={graphStyle}>
                <BarraBasica />
              </div>
              <div style={graphStyle}>
                <Prueba />
              </div>
            </div>
          </div>
        </div>
       </div>
    <Footer />
    </div >
  );
};

export default Home;
