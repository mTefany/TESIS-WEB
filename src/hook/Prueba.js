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

  const categories = lastTenData.map(item => epochToDateTime(item.timestamp)); // Obtener las fechas de los datos
  const seriesData1 = lastTenData.map(item => parseFloat(item.sensor1Value)); // Obtener los valores de los datos
  const seriesData2 = lastTenData.map(item => parseFloat(item.sensor2Value)); // Obtener los valores de los datos
  const seriesData3 = lastTenData.map(item => parseFloat(item.sensor3Value));




  // Configuración del gráfico
  const options = {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Humedad en la Finca Catagua'
    },
    xAxis: {
      categories: categories,
      title: {
        text: 'Fechas'
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Valores'
      }
    },
    series: [
      {
        name: 'Area 1',
        data: seriesData1
      },
      {
        name: 'Area 2',
        data: seriesData2
      }, {
        name: 'Area 3',
        data: seriesData3
      }
    ]
  };

  return (
    <div style={{ flex: 1 }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default Prueba;