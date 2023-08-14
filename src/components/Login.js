import { useState } from "react";
import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import logo from "../image/logo.jpeg";
import Alert from "./Alert";
import 'material-icons/iconfont/material-icons.css';

function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const { login, loginWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState();

  //actualizar el estado
  const handleChange = ({ target: { name, value } }) => {
    setUser({ ...user, [name]: value });
    //console.log(name, value);
  };
  //mostrar lo que tiene
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(user.email, user.password);
      navigate("/");
      // console.log(user);
    } catch (error) {
      console.log(error.code);
      if (error.code === "auth/wrong-password") {
        setError("Contraseña invalida.");
      } else {
        if (error.code === "auth/user-not-found") {
          setError("Usuario no registrado.");
        }
      }
    }
  };

  const handleGoogleSignin = async () => {
    try {
      await loginWithGoogle();
      navigate("/");
    } catch {
      console.log(error.code);
      setError(error.message);
    }
  };

  const handleResetPassword = async () => {
    if (!user.email) return setError("Por favor ingresa tu email");
    try {
      await resetPassword(user.email);
      setError("Hemos enviado un email para que restablezcas tu contraseña");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="containerform">
      <div className="form-container">
        {error && <Alert message={error} />}
        <div className="text-center">
          <img src={logo} alt="Logo" width="250x" />
        </div>
        <h3 className="form-title">Formulario de ingreso</h3>
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Su email@gmail.com.ec"
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="***********"
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <a
              href="#"
              className="forgot-password"
              onClick={handleResetPassword}
            >
              Olvidaste tu contraseña?
            </a>
          </div>
          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary">
              Iniciar sesión
            </button>
          </div>

          {/* <div className="text-center">
            <p className="btn-sm">
              Si no tienes una cuenta!
              <div className="  card-group">
                <div className=" card ">
                  <Link to="/register" className="opcionregistro">
                    <i class="material-icons">note_add</i>
                  </Link>
                </div>
                <div className=" card opcionregistro">
                  <a href="#" onClick={handleGoogleSignin}>
                    <i className="material-icons">mail</i></a>
                </div>
              </div>
            </p>
          </div> */}
        </form>
      </div>
    </div>
  );
}

export default Login;
