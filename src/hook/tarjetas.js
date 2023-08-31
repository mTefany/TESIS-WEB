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
    const nombre = (user?.firestoreData?.nombre) ?? "";
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

    function getColorForValue(value) {
        const numericValue = parseFloat(value);

        if (numericValue >= 0 && numericValue <= 19) {
            return "#FCB3A3"; // No color
        } else if (numericValue >= 20 && numericValue <= 30) {
            return "#FCF5A3";
        } else if (numericValue >= 31 && numericValue <= 49) {
            return "#A3DFFC";
        } else if (numericValue >= 50 && numericValue <= 60) {
            return "#ffffff";
        } else if (numericValue >= 61 && numericValue <= 80) {
            return "#A3DFFC";
        } else if (numericValue >= 81 && numericValue <= 100) {
            return "#FCB3A3";
        } else {
            return ""; // Maneja otros casos según sea necesario
        }
    }

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
    const options = {
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
                name: 'Área 1',
                data: seriesData1
            },
            {
                type: 'column',
                name: 'Área 2',
                data: seriesData2
            },
            {
                type: 'column',
                name: 'Área 3',
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
                },
                center: [75, 65],
                size: 100,
                innerSize: '70%',
                showInLegend: false,
                dataLabels: {
                    enabled: false
                }
            },

        ]
    };
    return (
        <div>


            <div className="card">
                <div className="card-body tarjetaflex text-center ">
                    <div className="card-header">
                        <h5>Bienvenido/a {nombre} </h5>
                    </div><br />
                    <h5>Última Actualización {epochToDateTime(lastData.timestamp || 0)}</h5>
                </div>
            </div>
            <div className="container2">
                <div className="row">
                    <div className="col-sm-4">
                        <div className="card">
                            <div className="row g-0" style={{ backgroundColor: getColorForValue(lastData.sensor1Value) }}>
                                <div className="col-md-6 iconoagua">
                                    <img className='imageniconohumedad img-fluid' src={humedad} alt="" />
                                </div>
                                <div className="col-md-6" >
                                    <div className="card-body reading">
                                        <h5 className="card-title"><span className="reading">{lastData.sensor1Value} %</span></h5>

                                        <h6 className="card-text centered-text">Humedad Área 1</h6>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="card">
                            <div className="row g-0" style={{ backgroundColor: getColorForValue(lastData.sensor2Value) }}>
                                <div className="col-md-6">
                                    <img className='imageniconohumedad img-fluid' src={humedad} alt="" />
                                </div>
                                <div className="col-md-6">
                                    <div className="card-body reading">
                                        <h5 className="card-title "><span >{lastData.sensor2Value} %</span></h5>
                                        <h6 className="card-text centered-text">Humedad Área 2</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="card">
                            <div className="row g-0" style={{ backgroundColor: getColorForValue(lastData.sensor3Value) }}>
                                <div className="col-md-6">
                                    <img className='imageniconohumedad img-fluid' src={humedad} alt="" />
                                </div>
                                <div className="col-md-6">
                                    <div className="card-body reading">
                                        <h5 className="card-title"><span className="reading">{lastData.sensor3Value} %</span></h5>
                                        <h6 className="card-text centered-text">Humedad Área 3</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className="container graficainicio">
                <div className="row">
                    <div className="col-lg-6 col-md-6" >
                        <div className="card border-light  mb-3" id="sensor2-chart">
                            <div className="card-header">
                                <h5>Promedio Total de Humedad Relativa en Áreas</h5>
                            </div>
                            <div style={graphStyle}>
                                <HighchartsReact highcharts={Highcharts} options={options} />
                            </div>
                            <div className="card-footer bg-transparent border-light">Promedio total de la humedad relativa durante los últimos 10 valores.</div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                        <div className="card border-light  mb-3" id="sensor1-chart" >
                            <div className="card-header">
                                <h5>Valor Actual de Humedad Relativa en Áreas</h5>
                            </div>
                            <div style={graphStyle}>
                                <HighchartsReact highcharts={Highcharts} options={ultimosdatos} />
                            </div>
                            <div className="card-footer bg-transparent border-light">
                                Humedad relativa:
                                Área 1: ({lastData.sensor1Value}% )
                                <i className="material-icons iconocuadro1"> <span className="material-symbols-outlined">check_box_outline_blank</span> </i>
                                ,Área 2:  ({lastData.sensor2Value}% )
                                <i className="material-icons iconocuadro2"> <span className="material-symbols-outlined">check_box_outline_blank</span> </i>
                                ,Área 3: ({lastData.sensor3Value}% )
                                <i className="material-icons iconocuadro3"> <span className="material-symbols-outlined">check_box_outline_blank</span> </i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
