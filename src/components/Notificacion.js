import toast, { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import { useAuth } from '../context/authContext';
import { useAlert } from '../context/alertContext';
import 'material-icons/iconfont/material-icons.css';

export default function Notify() {
    const { addAlert } = useAlert();
    const { user } = useAuth(); // Obtenemos el uid del contexto de autenticación
    const uidUser = user?.uid;
    //const dbPath = 'UsersData/' + uidUser + "/readings";
    const dbPath = 'UsersData/' + 'NOnpj85jxhdS3SZw7dTXdLyLqz82' + "/readings";
    const dbRef = ref(db, dbPath);

    let mensajeárea1 = " ";
    let mensajeárea2 = " ";
    let mensajeárea3 = " ";

    const [data, setData] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [notificationShown, setNotificationShown] = useState(false);


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
                    console.log(sensor1Value + " " + sensor2Value + " " + sensor3Value)
                    setData(lastData);
                    checkSensorValues(sensor1Value, sensor2Value, sensor3Value);
                    setNotificationShown(true)
                } else {
                    setData(null);
                }
            });
        } else {
            setData(null);
        }
    }, [uidUser]);

    const checkSensorValues = (sensor1Value, sensor2Value, sensor3Value) => {

        if (sensor1Value > 42 && sensor1Value < 49) {
            console.log("Humedad normal")
        } else {
            if (sensor1Value > 50 && sensor1Value < 70) {
                mensajeárea1 = "Poco exceso de humedad en el Área 1"
                addAlert(mensajeárea1)
                notify()
            }
            else {
                if (sensor1Value > 69 && sensor1Value < 81) {
                    mensajeárea1 = "Exceso de humedad en el Área 1"
                    addAlert(mensajeárea1)
                    notify()
                } else {
                    if (sensor1Value > 80 && sensor1Value < 101) {
                        mensajeárea1 = "La humedad en el Área 1 supera los límites"
                        addAlert(mensajeárea1)
                        notify()
                    } else {
                        if (sensor1Value < 50 && sensor1Value > 39) {
                            mensajeárea1 = "El suelo del Área 1 esta comenzando a secarse"
                            addAlert(mensajeárea1)
                            addAlert()
                        } else {
                            if (sensor1Value < 40 && sensor1Value > 29) {
                                mensajeárea1 = "EL suelo del Área 1 se encuentra seco"
                                addAlert(mensajeárea1)
                                notify()
                            } else {
                                if (sensor1Value < 30 && sensor1Value > 10) {
                                    mensajeárea1 = "El seuelo del Área 1 se encuentra con exceso de sequía"
                                    addAlert(mensajeárea1)
                                    notify()
                                } else {
                                    if (sensor1Value < 11 && sensor1Value > -1) {
                                        mensajeárea1 = "El sensor del Área 1 se encuentra desconectado"
                                        addAlert(mensajeárea1)
                                        notify()
                                    }
                                }
                            }

                        }

                    }
                }
            }
        }
        if (sensor2Value > 49 && sensor2Value < 52) {
            console.log("Humedad normal")
        } else {
            if (sensor2Value > 52 && sensor2Value < 70) {
                mensajeárea2 = "Poco exceso de humedad en el Área 2"
                addAlert(mensajeárea2)
                notify2()
            }
            else {
                if (sensor2Value > 69 && sensor2Value < 81) {
                    mensajeárea2 = "Exceso de humedad en el Área 2"
                    addAlert(mensajeárea2)
                    notify2()
                } else {
                    if (sensor2Value > 80 && sensor2Value < 101) {
                        mensajeárea2 = "La humedad en el Área 2 supera los límites"
                        addAlert(mensajeárea2)
                        notify2()
                    } else {
                        if (sensor2Value < 50 && sensor2Value > 39) {
                            mensajeárea2 = "El suelo esta comenzando a secarse en el Área 2"
                            addAlert(mensajeárea2)
                            notify2()
                        } else {
                            if (sensor2Value < 40 && sensor2Value > 29) {
                                mensajeárea2 = "El suelo del Área 2 se encuentra seco"
                                addAlert(mensajeárea2)
                                notify2()
                            } else {
                                if (sensor2Value < 30 && sensor2Value > 10) {
                                    mensajeárea2 = "El suelo del Área 2 se encuentra con exceso de sequía"
                                    addAlert(mensajeárea2)
                                    notify2()
                                } else {
                                    if (sensor2Value < 11 && sensor2Value > -1) {
                                        mensajeárea2 = "El sensor del Área 2 se encuentra desconectado"
                                        addAlert(mensajeárea2)
                                        notify2()
                                    }
                                }
                            }

                        }

                    }
                }
            }
        }

        if (sensor3Value > 49 && sensor3Value < 61) {
            console.log("Humedad normal")
        } else {
            if (sensor3Value > 60 && sensor3Value < 70) {
                mensajeárea3 = "Poco exceso de humedad en el Área 3"
                addAlert(mensajeárea3)
                notify3()
            }
            else {
                if (sensor3Value > 69 && sensor3Value < 81) {
                    mensajeárea3 = "Exceso de humedad en el Área 3"
                    addAlert(mensajeárea3)
                    notify3()
                } else {
                    if (sensor3Value > 80 && sensor3Value < 101) {
                        mensajeárea3 = "La humedad en el Área 3 supera los límites"
                        addAlert(mensajeárea3)
                        notify3()
                    } else {
                        if (sensor3Value < 50 && sensor3Value > 39) {
                            mensajeárea3 = "El suelo esta comenzando a secarse en el Área 3"
                            addAlert(mensajeárea3)
                            notify3()
                        } else {
                            if (sensor3Value < 40 && sensor3Value > 29) {
                                mensajeárea3 = "El suelo del Área 3 se encuentra seco"
                                addAlert(mensajeárea3)
                                notify3()
                            } else {
                                if (sensor3Value < 30 && sensor3Value > 10) {
                                    mensajeárea3 = "El suelo del Área 3 se encuentra con exceso de sequía"
                                    addAlert(mensajeárea3)
                                    notify3()
                                } else {
                                    if (sensor3Value < 11 && sensor3Value > -1) {
                                        mensajeárea3 = "El sensor del Área 3 se encuentra desconectado"
                                        addAlert(mensajeárea3)
                                        notify3()
                                    }
                                }
                            }

                        }

                    }
                }
            }
        }

    };



    const notify = (message) => {
        if (notificationShown) {
            const currentTimestamp = new Date().toLocaleString();
            setAlerts((prevAlerts) => [...prevAlerts, { message, timestamp: currentTimestamp }]);
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
                                        {mensajeárea1}

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

            )
            setNotificationShown(false);
        }

    }
    const notify2 = (message) => {
        if(notificationShown){
            const currentTimestamp = new Date().toLocaleString();
            setAlerts((prevAlerts) => [...prevAlerts, { message, timestamp: currentTimestamp }]);
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
                                        {mensajeárea2}
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
            )
            setNotificationShown(false)
        }
       
    }
    const notify3 = (message) => {
        if(notificationShown){
            const currentTimestamp = new Date().toLocaleString();
            setAlerts((prevAlerts) => [...prevAlerts, { message, timestamp: currentTimestamp }]);
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
                                        {mensajeárea3}
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
            )
            setNotificationShown(false)
        }
        
    }

    return (
        <div>

            <Toaster
                position="top-center"
                reverseOrder={true}
            />
        </div>
    );
}