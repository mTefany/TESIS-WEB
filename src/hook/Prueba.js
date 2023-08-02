import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { useAuth } from '../context/authContext';
import { epochToDateTime } from '../context/dateTime';
import { ref, onValue } from 'firebase/database'
import { db } from "../firebase";

const Prueba = () => {
    const { user } = useAuth(); // Obtenemos el uid del contexto de autenticación
    const uidUser = user?.uid;
    const dbPath = 'UsersData/' + uidUser + "/readings";
    const dbRef = ref(db, dbPath);

    const [data, setData] = useState([]);
    const [datas, setTodos] = useState([]);
    const [lastTenData, setLastTenData] = useState([]);

    useEffect(() => {
        if (uidUser) {
            onValue(dbRef, (snapshot) => {
                setTodos([]);
                const data = snapshot.val();
                if (data !== null) {
                    const sortedData = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);
                    // console.log(sortedData)
                    // setData(sortedData);
                    setLastTenData(sortedData.slice(0, 5)); // Seleccionar los últimos 10 datos
                }

                setTodos(false)

                Highcharts.setOptions({
                    // Configuración global de Highcharts, si es necesario
                });
                console.log(data)
            });
        } else {
            setTodos(false)
        }
      // Configuración de Highcharts
    }, [uidUser]);
  

    // Configuración del gráfico
    const options = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Ejemplo de gráfico de líneas'
      },
      series: [
        {
          name: 'sensor1Value',
          data:[24, 23, 1]
        },
        {
          name: 'sensor2Value',
          data:[2, 4, 5]
        },{
          name: 'sensorValue',
          data:[5, 6, 4]
        }
      ]
    };
  
    return (
      <div>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    );
  };
  
  export default Prueba;