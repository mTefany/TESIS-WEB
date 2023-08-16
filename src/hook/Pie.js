import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { ref, onValue } from 'firebase/database';
import { useAuth } from '../context/authContext';
import { epochToDateTime } from '../context/dateTime';
import { db } from "../firebase";

const Pastel = () => {
  const { user } = useAuth();
  const uidUser = user?.uid;
  const dbPath = 'UsersData/' + 'NOnpj85jxhdS3SZw7dTXdLyLqz82' + "/readings";
  const dbRef = ref(db, dbPath);

  const [lastData, setLastData] = useState({});

  useEffect(() => {
    if (uidUser) {
      onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        if (data !== null) {
          const sortedData = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);
          console.log(sortedData)
          setLastData(sortedData[0] || {});
        }
      });
    }
  }, [uidUser]);

  const options = {
    chart: {
      type: 'pie'
    },
    title: {
      text: 'Humedad en Finca Catagua'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %'
        }
      }
    },
    series: [
      {
        name: 'Humedad',
        data: [
          {
            name: 'Sensor 1',
            y: parseFloat(lastData.sensor1Value || 0)
          },
          {
            name: 'Sensor 2',
            y: parseFloat(lastData.sensor2Value || 0)
          },
          {
            name: 'Sensor 3',
            y: parseFloat(lastData.sensor3Value || 0)
          }
        ],
        colors: ['#FFA500', '#C71585', '#228B22']
      }
    ]
  };

  return (
    <div style={{ flex: 1 }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default Pastel;
