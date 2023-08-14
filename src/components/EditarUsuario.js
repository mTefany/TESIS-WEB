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

  return (
    <div>
      <h2>Editar Usuario</h2>
      <p>
        <strong>Email:</strong> {user?.email}
      </p>
      <div>
        <label>Cargo:</label>
        <input type="text" value={cargo} onChange={(e) => setCargo(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Rol:</label>
        <select className="form-select" name="rol" id="rol" onChange={(e) => setRol(e.target.value)}value={rol}>
          <option defaultValue={''}>Seleccione el rol</option>
          <option value="usuario">Usuario</option>
          <option value="admin">Administrador</option>
        </select>
      </div>
      <button onClick={handleGuardarCambios}>Guardar Cambios</button>
    </div>
  );
}

export default EditarUsuario;