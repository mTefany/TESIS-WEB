import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

function EditarUsuario() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const db = getFirestore();
  const usuarioRef = doc(db, "usuarios", userId);
  const [cargo, setCargo] = useState("");
  const [rol, setRol] = useState("");
  const [user, setUser] = useState({});
  
  const handleGuardarCambios = async () => {
    try {
      await updateDoc(usuarioRef, {
        cargo: cargo,
        rol: rol,
      });

      navigate("/usuarios");
    } catch (error) {
      console.error("Error al editar usuario:", error);
    }
  };

  useEffect(() => {
    getDoc(usuarioRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setCargo(userData.cargo);
          setRol(userData.rol);

          setUser(userData);
        }
      })
      .catch((error) => {
        console.error("Error obteniendo datos de usuario:", error);
      });
  }, []);

  const handleCancelar = async () => {
    navigate("/usuarios");
  };

  return (
    <div className="EditarUsuarioContainer">
      <div className="form-container">
        <h3 className="form-title">Editar usuario</h3>
        <p className="center">
          <label className="form-label" >Email:</label> {user?.email}
        </p>
        <div className="form-group">
          <label className="form-label">Cargo:</label>
          <input type="text" value={cargo} onChange={(e) => setCargo(e.target.value)} className="form-control" />
        </div>
        <div className="form-group">
          <label className="form-label">Rol:</label>
          <select className="form-select" name="rol" id="rol" onChange={(e) => setRol(e.target.value)} value={rol}>
            <option defaultValue={''}>Seleccione el rol</option>
            <option value="usuario">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <div className="d-grid gap-2">
          <button onClick={handleGuardarCambios} className="btn btn-success">Guardar</button>
          <button onClick={handleCancelar}  className="btn btn-secondary">Cancelar</button>
        </div>
      </div>

    </div>
  );
}

export default EditarUsuario;