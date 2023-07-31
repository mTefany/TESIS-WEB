import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Link } from "react-router-dom";
import Nav from "../partials/Nav";
import Footer from "../partials/footer";
import Area from "../hook/Area";

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
      <div className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4">
        <h1 className="text-x1 mb-4">
          Bienvenido {user.displayName || user.email}
        </h1>
        <Link className="nav-link" to="/tablero">
          <Area />
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
