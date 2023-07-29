import { useState } from "react";
import { useAuth } from '../context/authContext'
import { Link, useNavigate } from "react-router-dom";
import Alert from "./Alert";

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
    <div className="w-full max-w-xs m-auto">

      {error && <Alert message={error} />}

     
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-fold mb-2">Email</label>
          <input type="email" name="email" placeholder="Su email@gmail.com.ec" onChange={handleChange} className="shadow apperance-none border rounder w-full py-2 px-3 text-gray-700 leaading-tight focus:outline-none focus:shadow-outline"/>
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 text-sm font-fold mb-2">Password</label>
          <input type="password" name="password" id="password" placeholder="***********" onChange={handleChange} className="shadow apperance-none border rounder w-full py-2 px-3 text-gray-700 leaading-tight focus:outline-none focus:shadow-outline"/>
        </div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">Registro</button>
      </form>
      <Link to='/login' >
        <button className="bg-slate-50 hover:bg-slate-200 text-black shadow-md rounded border-2 border-gray-300 py-2 px-4 w-full">Iniciar sesión</button>
      </Link>
    </div>
  )
}

export default Register;