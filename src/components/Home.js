import { useEffect } from "react";
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
import Pastel from "../hook/Pie";

const Home = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const nombre =(user.firestoreData.nombre);
  const graphStyle = {
    flex: '1',
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  return (
    <div >
      <Nav />
      <Notify />
      <div className="container bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4 mt-3">
        <h4 className=" mb-4 text-uppercase">
          Bienvenido {nombre}
        </h4>
        <Tarjeta />
       </div>
    <Footer />
    </div >
  );
};

export default Home;
