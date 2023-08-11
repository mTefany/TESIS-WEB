import { useState } from "react";
import { useAuth } from '../context/authContext'
import { Link, useNavigate } from "react-router-dom";
import Alert from "./Alert";
import logo from '../image/logo.jpeg'

function Register() {

  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState();

  //actualizar el estado 
  const handleChange = ({ target: { name, value } }) => {
    setUser({ ...user, [name]: value })
    //console.log(name, value);
  }
  //mostrar lo que tiene
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await signup(user.email, user.password)
      navigate('/')
      // console.log(user);
    } catch (error) {
      console.log(error.code);
      if (error.code === "auth/weak-password") {
        setError('Contraseña invalida.')
      } else {
        if (error.code === "auth/invalid-email") {
          setError("Correo invalido.")
        }else{
          if(error.code === "auth/email-already-in-use"){
            setError("Este correo ya esta registrado.")
          }
        }
      }
    }
  };
  return (
    <div className="containerform">
      <div className="form-container">
        {error && <Alert message={error} />}
        <div className="text-center">
          <img src={logo} alt="Logo" width="250x" />
        </div>
        <h3 className="form-title">Nuevo usuario</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <select class="form-select" aria-label="Default select example">
              <option selected>Seleccione el rol</option>
              <option value="1">Usuario</option>
              <option value="3">Administrador</option>
            </select>
          </div>
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
            <label htmlFor="text" className="form-label">
              Cargo
            </label>
            <input
              type="text"
              name="cargo"
              onChange={handleChange}
              className="form-control"
            />
          </div>
          
          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary">
            <Link className="nav-link" to="/usuarios">
            Nuevo usuario
              </Link>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register;