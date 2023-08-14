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
    //const dbPath = 'UsersData/' + uidUser + "/readings";
    const dbPath = 'UsersData/' + 'NOnpj85jxhdS3SZw7dTXdLyLqz82' + "/readings";
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
                    setLastTenData(sortedData.slice(0, 8)); // Seleccionar los últimos 10 datos
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
        text: 'Humedad en la Finca Catagua'
      },
      series: [
        {
          name: 'Area 1',
          data:[51, 50, 49, 50, 51, 52, 53, 53, 52]
        },
        {
          name: 'Area 2',
          data:[45, 48, 50, 53, 58, 59, 56, 52, 51]
        },{
          name: 'Area 3',
          data:[46, 48, 51, 57, 53, 54, 52, 50, 51]
        }
      ]
    };
  
    return (
      <div style={{flex:1}}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    );
  };
  
  export default Prueba;