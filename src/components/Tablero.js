import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { ref, onValue } from 'firebase/database';
import { db } from "../firebase";
import { useAuth } from '../context/authContext';
import { epochToDateTime } from '../context/dateTime';

import Nav from '../partials/Nav';
import Notify from './Notificacion';



function Tablero() {

  const { user } = useAuth();
  const uidUser = user?.uid;
  const dbPath = 'UsersData/' + 'NOnpj85jxhdS3SZw7dTXdLyLqz82' + "/readings";
  const dbRef = ref(db, dbPath);

  const [lastData, setLastData] = useState({});
  const [lastTenData, setLastTenData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Estado para almacenar la fecha seleccionada



  useEffect(() => {
    if (uidUser) {
      onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        if (data !== null) {
          const sortedData = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);
          setLastData(sortedData[0] || {});
          setLastTenData(sortedData.slice(0, 10)); // Seleccionar los últimos 8 datos
        }
      });
    }
  }, [uidUser]);

  const categories = lastTenData.map(item => epochToDateTime(item.timestamp)); // Obtener las fechas de los datos
  const seriesData1 = lastTenData.map(item => parseFloat(item.sensor1Value)); // Obtener los valores de los datos
  const seriesData2 = lastTenData.map(item => parseFloat(item.sensor2Value)); // Obtener los valores de los datos
  const seriesData3 = lastTenData.map(item => parseFloat(item.sensor3Value));


  const graphStyle = {
    flex: '1',
  };

  const sensor1AreaChart = {
    chart: {
      type: 'areaspline'
    },
    title: {
      text: ' '
    },
    xAxis: {
      // categories: categories,
      title: {
        text: 'Últimos 10 datos'
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Valores de humedad en porcentaje'
      }
    },
    tooltip: {
      valueSuffix: ''
    },
    plotOptions: {
      areaspline: {
        fillOpacity: 0.5
      }
    },
    series: [
      {
        name: 'Sensor 1',
        data: seriesData1,
        color: '#20AD8D'
      },

    ]
  };
  const sensor2AreaChart = {
    chart: {
      type: 'areaspline'
    },
    title: {
      text: ' '
    },
    xAxis: {
      // categories: categories,
      title: {
        text: 'Últimos 10 datos'
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Valores de humedad en porcentaje'
      }
    },
    tooltip: {
      valueSuffix: ''
    },
    plotOptions: {
      areaspline: {
        fillOpacity: 0.5
      }
    },
    series: [

      {
        name: 'Sensor 2',
        data: seriesData2,
        color: '#396ABF'
      },
    ]
  };

  const sensor3AreaChart = {
    chart: {
      type: 'areaspline'
    },
    title: {
      text: ' '
    },
    xAxis: {
      // categories: categories,
      title: {
        text: 'Últimos 10 datos'
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Valores de humedad en porcentaje'
      }
    },
    tooltip: {
      valueSuffix: ''
    },
    plotOptions: {
      areaspline: {
        fillOpacity: 0.5
      }
    },
    series: [
      {
        name: 'Sensor 3',
        data: seriesData3,
        color: '#7839BF' 
      }
    ]
  };




  return (
    <div>
      <Nav />
      <Notify />
      <div className="container bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4 mt-3">

        <div>
          <p className="horaactual">
            <span className="reading text-xl mb-4 text-uppercase">
              <strong> última atualización {epochToDateTime(lastData.timestamp || 0)}</strong>
            </span></p>
            <div className="container2">
          <div class="row">
            <div class="col-sm-4">
              <div class="card border-light  mb-3" >
                <div class="card-header">
                  <h5>Área 1</h5>
                </div>
                <div style={graphStyle}>
                  <HighchartsReact highcharts={Highcharts} options={sensor1AreaChart} />
                </div>
                <div class="card-footer bg-transparent border-light">
                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="card border-light  mb-3" >
                <div class="card-header">
                  <h5>Área 2</h5>
                </div>
                <div style={graphStyle}>
                  <HighchartsReact highcharts={Highcharts} options={sensor2AreaChart} />
                </div>
                <div class="card-footer bg-transparent border-light">

                </div>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="card border-light  mb-3" >
                <div class="card-header">
                  <h5>Área 3</h5>
                </div>
                <div style={graphStyle}>
                  <HighchartsReact highcharts={Highcharts} options={sensor3AreaChart} />
                </div>
                <div class="card-footer bg-transparent border-light">
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
      
      </div>
  );
}

export default Tablero;
