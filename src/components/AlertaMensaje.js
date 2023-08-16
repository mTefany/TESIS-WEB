import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import { useAuth } from '../context/authContext';

export default function Alerta() {
    const { user } = useAuth(); // Obtenemos el uid del contexto de autenticación
    const uidUser = user?.uid;
    //const dbPath = 'UsersData/' + uidUser + '/readings';
    const dbPath = 'UsersData/' + 'NOnpj85jxhdS3SZw7dTXdLyLqz82' + "/readings";
    const dbRef = ref(db, dbPath);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState([]);
    const [isAlertShown, setIsAlertShown] = useState(false); // State para controlar si la alerta se ha mostrado
    const [showAlert, setShowAlert] = useState(false);
    const [sensorName, setSensorName] = useState(""); // Utiliza setSensorName para modificar el valor de sensorName
    
    const problemSensors = []; // Variable para almacenar los sensores problemáticos

    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    useEffect(() => {
        if (uidUser) {
            onValue(dbRef, (snapshot) => {
                const data = snapshot.val();
                if (data !== null) {
                    const sortedData = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);
                    setData(sortedData);
                    checkSensorValues(sortedData);
                }
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [uidUser]);

    const checkSensorValues = (readings) => {
        const problemSensors = []; // Variable para almacenar los sensores problemáticos

        const isOutsideRange = readings.some((reading) => {
            const { sensor1Value, sensor2Value, sensor3Value } = reading;
            // Define your threshold ranges here (replace 20 and 30 with your desired values)
            if ((sensor1Value < 10 || sensor1Value > 20)&&(sensor2Value < 10 || sensor2Value > 20)&&(sensor3Value < 10 || sensor3Value > 20) ) {
                problemSensors.push("Sensor 1, Sensor 2 y Sensor 3");
                return true;
            }else{
                if ((sensor1Value < 10 || sensor1Value > 20)&&(sensor2Value < 10 || sensor2Value > 20)) {
                    problemSensors.push("Sensor 1 y Sensor 2");
                    return true;
                }else{
                    if ((sensor1Value < 10 || sensor1Value > 20)&&(sensor3Value < 10 || sensor3Value > 20)) {
                        problemSensors.push("Sensor 1 y Sensor 3");
                        return true;
                    
                    }else{
                        if ((sensor2Value < 10 || sensor2Value > 20)&&(sensor3Value < 10 || sensor3Value > 20)) {
                            problemSensors.push("Sensor 2 y Sensor 3");
                            return true;
                        }else{
                            if ((sensor2Value < 10 || sensor2Value > 20)) {
                                problemSensors.push("Sensor 2");
                                return true;
                            }else{
                                if ((sensor3Value < 10 || sensor3Value > 20)) {
                                    problemSensors.push("Sensor 3");
                                    return true;
                                }else{
                                    problemSensors.push("Sensor 1");
                                    return true;
                                }

                            }

                        }
                    }
                }
            }
            
            return false;
        });

       
    };
    return (
        <div>
         {/* Add your content here if needed */}
         {showAlert && (
                <div
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        color: 'white',
                        padding: '20px',
                        borderRadius: '5px',
                        textAlign: 'center',
                    }}
                >
                    <p>¡Valor fuera del rango en el: {problemSensors.join(', ')}!</p>
                    <button onClick={handleCloseAlert} style={{ marginTop: '10px', cursor: 'pointer' }}>
                        Cerrar
                    </button>
                </div>
            )}
        </div>
    );
}
