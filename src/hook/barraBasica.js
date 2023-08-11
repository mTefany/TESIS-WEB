import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { useAuth } from '../context/authContext';
import { epochToDateTime } from '../context/dateTime';
import { ref, onValue } from 'firebase/database'
import { db } from "../firebase";

const BarraBasica = () => {
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
  
    const options={
      chart: {
          type: 'bar'
      },
      title: {
          text: 'Historic World Population by Region',
          align: 'left'
      },
      xAxis: {
          categories: ['Africa', 'America', 'Asia', 'Europe'],
          title: {
              text: null
          },
          gridLineWidth: 1,
          lineWidth: 0
      },
      yAxis: {
          min: 0,
          title: {
              text: 'Population (millions)',
              align: 'high'
          },
          labels: {
              overflow: 'justify'
          },
          gridLineWidth: 0
      },
      tooltip: {
          valueSuffix: ' millions'
      },
      plotOptions: {
          bar: {
              borderRadius: '50%',
              dataLabels: {
                  enabled: true
              },
              groupPadding: 0.1
          }
      },
      legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'top',
          x: -40,
          y: 80,
          floating: true,
          borderWidth: 1,
          shadow: true
      },
      credits: {
          enabled: false
      },
      series: [{
          name: 'Year 1990',
          data: [631, 727, 3202, 721]
      }, {
          name: 'Year 2000',
          data: [814, 841, 3714, 726]
      }, {
          name: 'Year 2018',
          data: [1276, 1007, 4561, 746]
      }
    ]
  };
  
  
    return (
      <div style={{flex:1}}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    );
  };
  
  export default BarraBasica;