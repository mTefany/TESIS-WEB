import { ref, onValue } from 'firebase/database'
import { db } from "../firebase.config";
import { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import Nav from "../partials/Nav";
import Footer from '../partials/footer';
import {epochToDateTime} from '../context/dateTime'

export default function Tarjeta() {

    const { user } = useAuth(); // Obtenemos el uid del contexto de autenticación
    const uidUser = user?.uid;
    const dbPath = 'UsersData/' + uidUser + "/readings";
    const dbRef = ref(db, dbPath);

    const [data, setData] = useState([]);
    const [datas, setTodos] = useState([]);

    useEffect(() => {
        if (uidUser) {
            onValue(dbRef, (snapshot) => {
                setTodos([]);
                const data = snapshot.val();
                if (data !== null) {
                    const sortedData = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);
                    setData(sortedData);
                }
                setTodos(false)
            });
        } else {
            setTodos(false)
        }
    }, [uidUser])


    return (
        <div>
            <Nav />
            <div className="cards">
            <p><span className="reading"> Ultima atualizacion {data.length > 0 ? epochToDateTime(data[0].timestamp)  : 0} </span></p>
                <div className="card">
                    <center>
                        <p><i className="fas fa-tint" style={{ color: '#059e8a' }}></i> Humedad Zona 1</p>
                        <p><span className="reading">{data.length > 0 ? data[0].sensor1Value : 0} %</span></p>
                    </center>
                    {/* <img className="zonas" src="img/Zona1.jpeg" alt="Zona 1" /> */}
                </div>
                <div className="card">
                    <center>
                        <p><i className="fas fa-tint" style={{ color: '#00add6' }}></i> Humedad Zona 2</p>
                        <p><span className="reading">{data.length > 0 ? data[0].sensor2Value : 0} %</span></p>
                    </center>
                    {/* <img className="zonas" src="img/Zona2.jpeg" alt="Zona 2" /> */}
                </div>
                <div className="card">
                    <center>
                        <p><i className="fas fa-tint" style={{ color: '#e1e437' }}></i> Humedad Zona 3</p>
                        <p><span className="reading">{data.length > 0 ? data[0].sensor3Value : 0} %</span></p>
                    </center>
                    {/* <img className="zonas" src="img/Zona3.jpeg" alt="Zona 3" /> */}
                </div>
            </div>

            <Footer />
        </div>
    );
}