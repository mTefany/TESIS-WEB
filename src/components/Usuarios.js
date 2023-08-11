import React, { useState } from 'react';
import Nav from '../partials/Nav';
import { Link } from 'react-router-dom';

function Usuarios() {
    const [usuarios, setUsuarios] = useState([
        { id: 1, correo: 'monitoreo-humedad@iot.pi.ec', cargo: 'Gerente', rol: 'Administrador' },
        { id: 2, correo: 'villamarpilosolisseth@gmail.com', cargo: 'Encargada', rol: 'Usuario' },
        // Agrega más usuarios aquí según sea necesario
    ]);

    const handleEditarUsuario = (id) => {
        // Lógica para editar el usuario con el ID proporcionado
        // Puedes abrir un formulario de edición o navegar a otra página, por ejemplo
    };

    const handleEliminarUsuario = (id) => {
        // Lógica para eliminar el usuario con el ID proporcionado
        // Puedes mostrar un mensaje de confirmación antes de eliminar
    };

    const handleNuevoUsuario = () => {
        // Lógica para agregar un nuevo usuario
        // Puedes abrir un formulario de creación o navegar a otra página, por ejemplo
    };

    return (

        <div >
            <Nav />
            <div className="usuarios-container">
                <div className="container">
                    <button className="botonnuevo">
                        <Link className="btn btn-outline-secondary" to="/register">
                            Agregar Nuevo Usuario
                        </Link>

                    </button>
                    <table className="usuarios-table">
                        <thead>
                            <tr>
                                <th>Correo</th>
                                <th>Cargo</th>
                                <th>Rol</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((usuario) => (
                                <tr key={usuario.id}>
                                    <td>{usuario.correo}</td>
                                    <td>{usuario.cargo}</td>
                                    <td>{usuario.rol}</td>
                                    <td>
                                        <button onClick={() => handleEditarUsuario(usuario.id)} className="editar-button">Editar</button>
                                        <button onClick={() => handleEliminarUsuario(usuario.id)} className="eliminar-button">Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Usuarios;
