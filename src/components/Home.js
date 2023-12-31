import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Nav from "../partials/Nav";
import Footer from "../partials/footer";
import Tarjeta from "../hook/tarjetas";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const userLocal = localStorage.getItem("user__app") || null;
    const userJson = userLocal ? JSON.parse(userLocal) : null;

    if (!user && !userJson) {
      navigate("/login");
    }
  }, [user]);

  return (
    <div >
      <Nav />
      {/* <Notify /> */}
      <div className="superior">
        <div className="container bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4 mt-3">
          <Tarjeta />
        </div>
        <div className="container4"></div>
      </div>
      <Footer />
    </div >
  );
};

export default Home;
