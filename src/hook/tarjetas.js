import { ref, onValue } from 'firebase/database'
import { db } from "../firebase";
import { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import Footer from '../partials/footer';
import { epochToDateTime } from '../context/dateTime'
import humedad from '../image/humedad.png'

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
        <div className='containertarjeta'>
            <div className="cards container mt-3">
                <p><span className="reading text-xl mb-4 text-uppercase"> Ultima atualizacion {data.length > 0 ? epochToDateTime(data[0].timestamp) : 0} </span></p>
                <div className='row' id="cards-div">
                    <div class="col-sm-4">
                        <div className="card card1">
                            <center>
                                <p>  
                                <i className="material-icons" style={{ color: '#ffffff' }}>egg</i>Humedad Area 1
                                </p>
                                <p><span className="reading">{data.length > 0 ? data[0].sensor1Value : 0} %</span></p>
                            </center>
                            {/* <img className="zonas" src="img/Zona1.jpeg" alt="Zona 1" /> */}
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <div className="card card2">
                            <center>
                                <p>
                                <i className="material-icons" style={{ color: '#ffffff' }}>egg</i>Humedad Area 2
                                </p>
                                <p><span className="reading">{data.length > 0 ? data[0].sensor2Value : 0} %</span></p>
                            </center>
                            {/* <img className="zonas" src="img/Zona2.jpeg" alt="Zona 2" /> */}
                        </div>
                        </div>
                        <div class="col-sm-4">
                        <div className="card card3">
                            <center>
                                <p>
                                <i className="material-icons" style={{ color: '#ffffff' }}>egg</i>Humedad Area 1
                                </p>
                                <p><span className="reading">{data.length > 0 ? data[0].sensor3Value : 0} %</span></p>
                            </center>
                            {/* <img className="zonas" src="img/Zona3.jpeg" alt="Zona 3" /> */}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}