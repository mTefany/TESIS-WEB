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

    const [lastTenData, setLastTenData] = useState([]);

    useEffect(() => {
        if (uidUser) {
            onValue(dbRef, (snapshot) => {
                const data = snapshot.val();
                if (data !== null) {
                    const sortedData = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);
                    setLastTenData(sortedData.slice(0, 10)); // Seleccionar los últimos 10 datos
                }
            });
        }
    }, [uidUser]);

    const categories = lastTenData.map(item => epochToDateTime(item.timestamp)); // Obtener las fechas de los datos
    const seriesData1 = lastTenData.map(item => parseFloat(item.sensor1Value)); // Obtener los valores de los datos
    const seriesData2 = lastTenData.map(item => parseFloat(item.sensor2Value)); // Obtener los valores de los datos
    const seriesData3 = lastTenData.map(item => parseFloat(item.sensor3Value)); // Obtener los valores de los datos

    console.log(seriesData1)
    console.log(seriesData2)
    console.log(seriesData3)


    const options = {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Lecturas de Sensores'
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
            pointFormat: 'Valor: <b>{point.y}</b>'
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: [{
            name: 'Area 1',
            data: seriesData1
        },{
            name: 'Area 2',
            data: seriesData2
        },{
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

export default BarraBasica;
