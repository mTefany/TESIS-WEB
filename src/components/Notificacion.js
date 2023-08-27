import toast, { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import { useAuth } from '../context/authContext';
import 'material-icons/iconfont/material-icons.css';

export default function Notify() {
    const { user } = useAuth();
    const uidUser = user?.uid;
    const dbPath = 'UsersData/' + 'NOnpj85jxhdS3SZw7dTXdLyLqz82' + "/readings";
    const dbRef = ref(db, dbPath);


    const [data, setData] = useState([]);


    useEffect(() => {
        if (uidUser) {
            onValue(dbRef, (snapshot) => {
                const data = snapshot.val();
                if (data !== null) {
                    const sortedData = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);
                    const lastData = sortedData[0];
                    setData(lastData);
                    checkSensorValues(lastData);

                } else {
                    setData(null);
                }
            });
        } else {
            setData(null);
        }
    }, [uidUser]);

    const checkSensorValues = ({ sensor1Value, sensor2Value, sensor3Value }) => {
        checkSensor('Área 1', sensor1Value);
        checkSensor('Área 2', sensor2Value);
        checkSensor('Área 3', sensor3Value);
    };

    const checkSensor = (area, sensorValue) => {
        // Lógica de verificación de valores de sensores
        let mensaje = '';

        if (sensorValue > 49 && sensorValue < 61) {
        } 
        else if (sensorValue > 60 && sensorValue < 70) {
            mensaje = `Poco exceso de humedad en el suelo`;
        } else if (sensorValue > 69 && sensorValue < 81) {
            mensaje = `Exceso de humedad en el suelo`;
        } else if (sensorValue > 80 && sensorValue < 101) {
            mensaje = `La humedad supera los límites`;
        } else if (sensorValue < 50 && sensorValue > 39) {
            mensaje = `El suelo está comenzando a secarse`;
        } else if (sensorValue < 40 && sensorValue > 29) {
            mensaje = `El suelo se encuentra seco`;
        } else if (sensorValue < 30 && sensorValue > 10) {
            mensaje = `El suelo cuenta con exceso de sequía`;
        } else if (sensorValue < 11 && sensorValue > -1) {
            mensaje = `El sensor se encuentra desconectado`;
        }

        if (mensaje.length > 0) {
            notify(mensaje, area); // Incluye el timestamp en las alertas
        }


    };



    const notify = (mensaje, area) => {
        const currentTimestamp = new Date().toLocaleString();

        toast.custom((t) => (
            <div
                className={`${t.visible ? 'animate-enter' : 'animate-leave'
                    } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
                <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                            <p className="mt-1 text-sm text-gray-500">
                                <img
                                    className="gota"
                                    src="https://blogquimobasicos.files.wordpress.com/2012/06/gota-de-agua.jpeg"
                                    alt=""></img>


                                Fecha: {currentTimestamp}
                                <br />

                                <center>
                                    {area}
                                    <br />
                                    {mensaje}
                                </center>


                            </p>
                        </div>
                    </div>
                </div>
                <div className="border-l border-gray-200 ">
                    <center>
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="btn boton-alerta"
                        >
                            Close
                        </button>
                    </center>

                </div>
            </div>),
            {
                icon: '💧',
                position: "top-center",
                autoClose: 5000,
                style: {
                    background: "#80DAEB",
                    color: "black",
                }
            }

        );

    }

    return (
        <div>

            <Toaster position="top-center" reverseOrder={true} />
        </div>
    );
}