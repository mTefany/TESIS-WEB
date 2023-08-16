import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";


import { ref, onValue } from 'firebase/database'
import { db } from "../firebase";
import { useAuth } from '../context/authContext';
import { epochToDateTime } from '../context/dateTime'
import humedad from '../image/icono-humedad.png'

export default function Tarjeta() {

    const { user } = useAuth();
    const uidUser = user?.uid;
    const dbPath = 'UsersData/' + 'NOnpj85jxhdS3SZw7dTXdLyLqz82' + "/readings";
    const dbRef = ref(db, dbPath);

    const [lastData, setLastData] = useState({});
    const [lastTenData, setLastTenData] = useState([]);

    


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

    const graphStyle = {
        flex: '1',
    };


   

    const categories = lastTenData.map(item => epochToDateTime(item.timestamp)); // Obtener las fechas de los datos
    const seriesData1 = lastTenData.map(item => parseFloat(item.sensor1Value)); // Obtener los valores de los datos
    const seriesData2 = lastTenData.map(item => parseFloat(item.sensor2Value)); // Obtener los valores de los datos
    const seriesData3 = lastTenData.map(item => parseFloat(item.sensor3Value));

    const ultimosdatos = {
        chart: {
            type: 'pie'
        },
        title: {
            text: ' '
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.y} %'
                },
                showInLegend: true
            }
        },
        series: [
            {
                name: 'Humedad',
                data: [
                    {
                        name: 'Área 1',
                        y: parseFloat(lastData.sensor1Value || 0)
                    },
                    {
                        name: 'Área 2',
                        y: parseFloat(lastData.sensor2Value || 0)
                    },
                    {
                        name: 'Área 3',
                        y: parseFloat(lastData.sensor3Value || 0)
                    }
                ],
                colors: ['#20AD8D', '#396ABF', '#7839BF']
            }
        ],
        legend: {
            layout: 'horizontal', // Puedes usar 'horizontal' o 'vertical'
            align: 'center', // Puedes usar 'left', 'center' o 'right'
            verticalAlign: 'bottom', // Puedes usar 'top', 'middle' o 'bottom'
            itemMarginTop: 10, // Espacio entre los elementos de la leyenda
            itemMarginBottom: 10,
            itemStyle: {
                color: 'cyan' // Color del texto de la leyenda
            },
            labelFormatter: function () {
                return '<span style="color: ' + this.color + '">' + this.name + '</span>'; // Colorea los nombres de las categorías con los colores del gráfico
            }
        }
    };


    const totalAverage = (seriesData1.reduce((sum, value) => sum + value, 0) +
        seriesData2.reduce((sum, value) => sum + value, 0) +
        seriesData3.reduce((sum, value) => sum + value, 0)) / (3 * seriesData1.length);
    // Configuración de los gráficos
    const completo = {
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
            column: {
                borderRadius: '25%',
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
                name: 'Promedio Total',
                data: Array(seriesData1.length).fill(totalAverage),
                marker: {
                    lineWidth: 2,
                    lineColor: Highcharts.getOptions().colors[7],
                    fillColor: 'white'
                }
            },
        ]
    };
    return (
        <div>
            <p className="horaactual">
                <span className="reading text-xl mb-4 text-uppercase">
                    <strong> última atualización {epochToDateTime(lastData.timestamp || 0)}</strong>
                </span></p>
            <div className="container2">
                <div class="row">
                    <div class="col-sm-4">
                        <div class="card">
                            <div className="row g-0">
                                <div className="col-md-6 iconoagua">
                                    <img className='imageniconohumedad img-fluid' src={humedad} alt="" />
                                </div>
                                <div className="col-md-6">
                                    <div className="card-body reading">
                                        <h5 className="card-title"><span className="reading">{lastData.sensor1Value} %</span></h5>
                                        <p className="card-text">Humedad área 1</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <div class="card">
                            <div className="row g-0">
                                <div className="col-md-6">
                                    <img className='imageniconohumedad img-fluid' src={humedad} alt="" />
                                </div>
                                <div className="col-md-6">
                                    <div className="card-body reading">
                                        <h5 className="card-title "><span >{lastData.sensor2Value} %</span></h5>
                                        <p className="card-text">Humedad área 2</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <div class="card">
                            <div className="row g-0">
                                <div className="col-md-6">
                                    <img className='imageniconohumedad img-fluid' src={humedad} alt="" />
                                </div>
                                <div className="col-md-6">
                                    <div className="card-body reading">
                                        <h5 className="card-title"><span className="reading">{lastData.sensor3Value} %</span></h5>
                                        <p className="card-text">Humedad área 3</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="container2">
                <div class="row">
                    <div class="col-sm-6">
                        <div class="card border-light  mb-3" >
                            <div class="card-header">
                                <h5>Promedio Total de Humedad en Áreas</h5>
                            </div>
                            <div style={graphStyle}>
                                <HighchartsReact highcharts={Highcharts} options={completo} />
                            </div>
                            <div class="card-footer bg-transparent border-light">Promedio total de la humedad durante los últimos 10 valores.</div>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="card border-light  mb-3" >
                            <div class="card-header">
                                <h5>Valor Actual de Humedad en Áreas</h5>
                            </div>
                            <div style={graphStyle}>
                                <HighchartsReact highcharts={Highcharts} options={ultimosdatos} />
                            </div>
                            <div class="card-footer bg-transparent border-light">
                                Valor actual de sensores: 
                                Área 1: ({lastData.sensor1Value}% )
                                <i className="material-icons iconocuadro1"> <span class="material-symbols-outlined">check_box_outline_blank</span> </i>
                                ,Área 2:  ({lastData.sensor2Value}% )
                                <i className="material-icons iconocuadro2"> <span class="material-symbols-outlined">check_box_outline_blank</span> </i>
                                ,Área 3: ({lastData.sensor3Value}% )
                                <i className="material-icons iconocuadro3"> <span class="material-symbols-outlined">check_box_outline_blank</span> </i>  
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
