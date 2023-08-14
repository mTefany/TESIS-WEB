import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { ref, onValue } from 'firebase/database';
import { useAuth } from '../context/authContext';
import { epochToDateTime } from '../context/dateTime';
import { db } from "../firebase";

const Linea = () => {
  const { user } = useAuth();
  const uidUser = user?.uid;
  const dbPath = 'UsersData/' + uidUser + '/readings';
  const dbRef = ref(db, dbPath);

  const [lastTenData, setLastTenData] = useState([]);

  useEffect(() => {
    if (uidUser) {
      onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        if (data !== null) {
          const sortedData = Object.values(data)
            .filter(item => item.sensor1Value < 60 && item.sensor2Value < 60 && item.sensor3Value < 60)
            .sort((a, b) => b.timestamp - a.timestamp);
          setLastTenData(sortedData.slice(0, 5));
        }
      });
    }
  }, [uidUser]);

  const categories = lastTenData.map(item => epochToDateTime(item.timestamp));
  const seriesData1 = lastTenData.map(item => parseFloat(item.sensor1Value));
  const seriesData2 = lastTenData.map(item => parseFloat(item.sensor2Value));
  const seriesData3 = lastTenData.map(item => parseFloat(item.sensor3Value));

  const options = {
    chart: {
      type: 'line'
    },
    title: {
      text: 'Humedad en Finca Catagua'
    },
    xAxis: {
      categories: categories
    },
    yAxis: {
      title: {
        text: 'Humedad (%)'
      }
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true
        },
        enableMouseTracking: false
      }
    },
    series: [
      {
        name: 'Sensor 1',
        data: seriesData1,
        color: '#FFA500'
      },
      {
        name: 'Sensor 2',
        data: seriesData2,
        color: '#C71585'
      },
      {
        name: 'Sensor 3',
        data: seriesData3,
        color: '#228B22'
      }
    ]
  };

  return (
    <div style={{ flex: 1 }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default Linea;
