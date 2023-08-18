import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import Nav from '../partials/Nav';
import { auth, firestore } from '../firebase'
import Footer from '../partials/footer'

function Usuarios() {
    const navigate = useNavigate();
    const usuariosCollection = collection(firestore, "usuarios");

    const [usuarios, setUsuarios] = useState([]);

    const handleEditarUsuario = (id) => {
        // Lógica para editar el usuario con el ID proporcionado
        // Puedes abrir un formulario de edición o navegar a otra página, por ejemplo
        navigate(`/editar-usuario/${id}`);
    };

    const handleEliminarUsuario = async (uid) => {
        try {
            const usuarioRef = doc(usuariosCollection, uid);
            await deleteDoc(usuarioRef);

            const nuevosUsuarios = usuarios.filter((usuario) => usuario.uid !== uid);
            setUsuarios(nuevosUsuarios);
        } catch (error) {
            console.error("Error al eliminar el usuario:", error);
        }
    };

    useEffect(() => {
        getDocs(usuariosCollection)
            .then((querySnapshot) => {
                let _usuarios = [];

                querySnapshot.forEach((doc) => {
                    const userData = doc.data();
                    _usuarios.push({
                        cargo: userData.cargo,
                        nombre: userData.nombre,
                        rol: userData.rol,
                        email: userData.email,
                        uid: userData.uid,
                    });
                });

                setUsuarios(_usuarios);
            })
            .catch((error) => {
                console.error("Error obteniendo datos de usuarios:", error);
            });
    }, []);

    return (

        <div className="page-container">
            <Nav />
            <div className="usuarios-container">
                <div className="container">
                    <button className="botonnuevo">
                        <Link className="btn btn-outline-secondary" to="/register">
                            Agregar Nuevo Usuario
                        </Link>

                    </button>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col" className='text-uppercase'>Nombre</th>
                                <th scope="col" className='text-uppercase'>Correo</th>
                                <th scope="col" className='text-uppercase'>Cargo</th>
                                <th scope="col" className='text-uppercase'>Rol</th>
                                <th scope="col" className='text-uppercase'>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((usuario, index) => (
                                <tr key={index}>
                                    <td scope="row" className='filas'>{usuario.nombre}</td>
                                    <td scope="row" className='filas'>{usuario.email}</td>
                                    <td scope="row" className='filas'>{usuario.cargo}</td>
                                    <td scope="row" className='filas'>{usuario.rol}</td>
                                    <td scope="row" className='filas'>
                                        <button onClick={() => handleEditarUsuario(usuario.uid)} className="editar-button">Editar</button>
                                        <button onClick={() => handleEliminarUsuario(usuario.uid)} className="eliminar-button">Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Usuarios;
