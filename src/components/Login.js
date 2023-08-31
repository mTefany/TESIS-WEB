//importacion de React y de estado del usuario
import React, { useState } from "react";
//importacion para saber el usuario que esta autenticado
import { useAuth } from "../context/authContext";
//Importa una función de enrutamiento para redirigir dentro de la aplicación.
import { useNavigate } from "react-router-dom";
//Importacion de imagenes 
import logo from "../image/logo.jpeg";
//importacion de componentes
import Alert from "./Alert";

//Función de iniciar sesión 
function Login() {
  //Utiliza el useState para mantener un estado local con propiedades email y password.
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  //Estas funciones se obtienen del contexto de autenticación mediante useAuth().
  const { login, resetPassword } = useAuth();
  //Obtiene una función de navegación para cambiar las rutas dentro de la aplicación.
  const navigate = useNavigate();
  //Utiliza useState para mantener el estado de los mensajes de error.
  const [error, setError] = useState();
  //Controla si se muestra la contraseña como texto legible o no.
  const [showPassword, setShowPassword] = useState(false);

  //Esta función maneja los cambios en los campos del formulario y
  //actualiza el estado user con los nuevos valores ingresados.
  const handleChange = ({ target: { name, value } }) => {
    //Guardaa los valores en user.
    setUser({ ...user, [name]: value });
  };

  //Función asincrona para enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    //Se establece un mensaje de error sin nada 
    setError("");
    try {
      //Esto se realiza si la autenticcación es xitosa
      await login(user.email, user.password);
      //Se redirije a la página principal
      navigate("/");
    } catch (error) {
      //Si la autenticación es erronea
      // console.log(error.code);
      //Si la contraseña es incorrecta se guarda este mensaje de error 
      if (error.code === "auth/wrong-password") {
        setError("Contraseña invalida.");
      } else {
        //Si el usuario no es correcto se guarda este mensaje de error 
        if (error.code === "auth/user-not-found") {
          setError("Usuario no registrado.");
        }
      }
    }
  };
  //Esta función maneja el proceso de restablecimiento de contraseña.
  const handleResetPassword = async () => {
    //Si el espacio del correo se encuentra en blanco envia el sisguiente mensaje
    if (!user.email) return setError("Por favor ingresa tu email");
    try {
      //En caso que todo esté bien se llama al método de reseteo de contraseñas
      await resetPassword(user.email);
      //se guarda el mensaje de error 
      setError("Hemos enviado un email para que restablezcas tu contraseña");
    } catch (error) {
      //si hay algun problema durante el procesamiento se guarda el siguiente mensaje de error
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
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="***********"
                value={user.password}
                onChange={handleChange}
                className="form-control"
                autoComplete="off"
              />
              <span
                className="mostrar-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <i className="fas fa-eye-slash"></i>
                ) : (
                  <i className="fas fa-eye"></i>
                )}
              </span>
            </div>
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
        </form>
      </div>
    </div>
  );
}

export default Login;
