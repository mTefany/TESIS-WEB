import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import exporting from "highcharts/modules/exporting";

import { useAuth } from '../context/authContext';
import { epochToDateTime } from '../context/dateTime';
import { ref, onValue } from 'firebase/database';
import { db } from "../firebase";

// Inicializar el módulo de exportación para permitir la descarga de imágenes
exporting(Highcharts);

const LinePastelBarra = () => {
  const { user } = useAuth(); // Obtenemos el uid del contexto de autenticación
  const uidUser = user?.uid;
  const dbPath = 'UsersData/' + 'NOnpj85jxhdS3SZw7dTXdLyLqz82' + "/readings";
  const dbRef = ref(db, dbPath);

  const [lastTenData, setLastTenData] = useState([]);

  useEffect(() => {
    if (uidUser) {
      onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        if (data !== null) {
          const sortedData = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);
          setLastTenData(sortedData.slice(0, 8)); // Seleccionar los últimos 8 datos
        }
      });
    }
  }, [uidUser]);

  const categories = lastTenData.map(item => epochToDateTime(item.timestamp)); // Obtener las fechas de los datos
  const seriesData1 = lastTenData.map(item => parseFloat(item.sensor1Value)); // Obtener los valores de los datos
  const seriesData2 = lastTenData.map(item => parseFloat(item.sensor2Value)); // Obtener los valores de los datos
  const seriesData3 = lastTenData.map(item => parseFloat(item.sensor3Value));

  // Configuración de los gráficos
  const options = {
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
    tooltip: {
      valueSuffix: ''
    },
    plotOptions: {
      column: {
        borderRadius: '25%'
      }
    },
    series: [
      {
        type: 'column',
        name: 'Area 1',
        data: seriesData1
      },
      {
        type: 'column',
        name: 'Area 2',
        data: seriesData2
      },
      {
        type: 'column',
        name: 'Area 3',
        data: seriesData3
      },
      {
        type: 'spline',
        name: 'Promedio Area 1',
        data: seriesData1, // Cambiar a los datos de promedio si es necesario
        marker: {
          lineWidth: 2,
          lineColor: Highcharts.getOptions().colors[0],
          fillColor: 'white'
        }
      },
      {
        type: 'pie',
        name: 'Total',
        data: [
          {
            name: 'Area 1',
            y: seriesData1.reduce((sum, value) => sum + value, 0),
            color: Highcharts.getOptions().colors[0],
            dataLabels: {
              enabled: true,
              distance: -50,
              format: '{point.total}',
              style: {
                fontSize: '15px'
              }
            }
          },
          {
            name: 'Area 2',
            y: seriesData2.reduce((sum, value) => sum + value, 0),
            color: Highcharts.getOptions().colors[1]
          },
          {
            name: 'Area 3',
            y: seriesData3.reduce((sum, value) => sum + value, 0),
            color: Highcharts.getOptions().colors[2]
          }
        ],
        center: [75, 65],
        size: 100,
        innerSize: '70%',
        showInLegend: false,
        dataLabels: {
          enabled: false
        }
      }
    ]
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default LinePastelBarra;
