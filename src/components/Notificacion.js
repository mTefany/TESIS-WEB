import toast, { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import { useAuth } from '../context/authContext';
import 'material-icons/iconfont/material-icons.css';

export default function Notify() {

    const { user } = useAuth(); // Obtenemos el uid del contexto de autenticación
    const uidUser = user?.uid;
    //const dbPath = 'UsersData/' + uidUser + "/readings";
    const dbPath = 'UsersData/' + 'NOnpj85jxhdS3SZw7dTXdLyLqz82' + "/readings";
    const dbRef = ref(db, dbPath);

    const sensor1Value = "0";
    const sensor2Value = "0";
    const sensor3Value = "0";

    const [data, setData] = useState([]);
    // const [datas, setTodos] = useState([]);

    useEffect(() => {
        if (uidUser) {
            onValue(dbRef, (snapshot) => {
                // setTodos([]);
                const data = snapshot.val();
                if (data !== null) {
                    // Convert data object into an array and sort by timestamp in descending order
                    const sortedData = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);
                    const lastData = sortedData[0]
                    const sensor1Value = lastData.sensor1Value;
                    const sensor2Value = lastData.sensor2Value;
                    const sensor3Value = lastData.sensor3Value;
                    console.log(sensor1Value+ " "+ sensor2Value + " "+ sensor3Value)
                    setData(lastData);
                    checkSensorValues(sensor1Value, sensor2Value,sensor3Value);
                } else {
                    setData(null);
                }
            });
        } else {
            setData(null);
        }
    }, [uidUser]);

    const checkSensorValues = (sensor1Value, sensor2Value, sensor3Value) => {
        // Aquí verificamos si los valores del sensor son mayores que 50
        // Puedes adaptar esta lógica según la estructura de tu objeto de datos

           

            if (sensor1Value > 49 && sensor1Value < 56) {
                console.log("Sensor 1 está bien"+ sensor1Value);
            } else {
                console.log("Sensor 1 esta mal"+sensor1Value)
                notify();
            }

            if (sensor2Value >= 49 && sensor2Value <= 56) {
                console.log("Sensor 2 está bien"+ sensor2Value);
            } else {
                console.log("Sensor 2 esta mal"+sensor2Value)
                notify2();
            }

            if (sensor3Value >= 49 && sensor3Value <= 56) {
                console.log("Sensor 3 está bien"+ sensor3Value);
            } else {
                console.log("Sensor 3 esta fuera de rango"+sensor3Value)
                notify3();
            }
        
    };



    const notify = () => toast.custom((t) => (
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

                            Sensor 1 No esta  no esta funcionando
                        </p>
                    </div>
                </div>
            </div>
            <div className="border-l border-gray-200 ">
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="btn boton-alerta"
                >
                    Close
                </button>
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
    )
    const notify2 = () => toast.custom((t) => (
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

                            Sensor 2 No esta  no esta funcionando
                        </p>
                    </div>
                </div>
            </div>
            <div className="border-l border-gray-200 ">
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="btn boton-alerta"
                >
                    Close
                </button>
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
    )
    const notify3 = () => toast.custom((t) => (
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

                            Area 3 cuenta con el sueño muy seco

                        </p>
                    </div>
                </div>
            </div>
            <div className="border-l border-gray-200 ">
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="btn boton-alerta"
                >
                    Close
                </button>
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
    )


    return (
        <div>

            <Toaster
                position="top-center"
                reverseOrder={true}
            />
        </div>
    );
}