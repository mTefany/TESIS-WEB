import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "./Alert";
import logo from '../image/logo.jpeg'
import { Link } from "react-router-dom";

import { firestore, auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { collection, doc, setDoc } from "firebase/firestore";

function Register() {
  const usuariosCollection = collection(firestore, "usuarios");

  const [user, setUser] = useState({
    rol: '',
    cargo: '',
    email: '',
    password: '',
    nombre: '',
  });

  const navigate = useNavigate();
  const [error, setError] = useState();
  const [showPassword, setShowPassword] = useState(false);


  //actualizar el estado 
  const handleChange = ({ target: { name, value } }) => {
    setUser({ ...user, [name]: value })
    //console.log(name, value);
  }

  //mostrar lo que tiene
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!user.rol.trim()) {
      setError('Por favor ingresa tu rol')
      return
    }
    if (!user.cargo.trim()) {
      setError('Por favor ingresa tu cargo')
      return
    }
    if (!user.email.trim()) {
      setError('Por favor ingresa tu email')
      return
    }
    if (!user.password.trim()) {
      setError('Por favor ingresa tu contraseña')
      return
    }
    if (!user.nombre.trim()) {
      setError("Por favor ingrese su Nombre")
      return;
    }

    try {
      const infoUsuario = await createUserWithEmailAndPassword(auth, user.email, user.password);
      const docuRef = doc(usuariosCollection, infoUsuario.user.uid);
      setDoc(docuRef, {
        rol: user.rol,
        nombre: user.nombre,
        cargo: user.cargo,
        email: user.email,
        password: user.password,
        uid: infoUsuario.user.uid
      });

      navigate('/usuarios')
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        setError("Correo invalido.")
        return
      }
      if (error.code === "auth/email-already-in-use") {
        setError("Este correo ya esta registrado.")
        return
      }
      if (error.code === "auth/weak-password") {
        setError('La contraseña debe tener\n al menos 6 caracteres.')
        return
      }
      setError('Error al crear el usuario.')
    }
  };

  return (
    <div className="containerform">
      <div className="form-container">
        <Link to="/usuarios" className="float-end">
          <button type="button" className="btn-close" aria-label="Close"></button>
        </Link>
        {error && <Alert message={error} />}
        <div className="text-center">
          <img src={logo} alt="Logo" width="250x" />
        </div>
        <h3 className="form-title">Nuevo usuario</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <select className="form-select" aria-label="Default select example" name="rol" onChange={handleChange}>
              <option defaultValue={''}>Seleccione el rol</option>
              <option value="usuario">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="text" className="form-label">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              onChange={handleChange}
              className="form-control"
            />
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

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Nuevo usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register;