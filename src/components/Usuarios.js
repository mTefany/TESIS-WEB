import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import Nav from '../partials/Nav';
import { firestore } from '../firebase'
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
        const confirmed = window.confirm("¿Estás seguro de que quieres eliminar este usuario?");

        if (confirmed) {
            try {
                const usuarioRef = doc(usuariosCollection, uid);
                await deleteDoc(usuarioRef);

                const nuevosUsuarios = usuarios.filter((usuario) => usuario.uid !== uid);
                setUsuarios(nuevosUsuarios);
            } catch (error) {
                console.error("Error al eliminar el usuario:", error);
            }
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
            <div className="superior">
                <div className="container">
                    <div className="container">
                        <div className="d-flex justify-content-end mb-3">
                            <Link className="btn btn-outline-secondary" to="/register">
                                Agregar Nuevo Usuario
                            </Link>
                        </div>
                    </div>
                    <div>
                        <div className="card-body">
                            <div className="table-responsive">
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
                                                    <div >
                                                        <div className="row g-0 ">
                                                            <div className="col-md-6">
                                                                <button onClick={() => handleEditarUsuario(usuario.uid)} className='border'>
                                                                    <i className="material-icons  btn-editar" >edit</i>
                                                                </button>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <button onClick={() => handleEliminarUsuario(usuario.uid)} className='border'>
                                                                    <i className="material-icons  btn-eliminar">delete</i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Usuarios;
