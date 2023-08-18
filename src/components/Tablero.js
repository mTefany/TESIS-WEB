import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";


import { ref, onValue } from 'firebase/database';
import { db } from "../firebase";
import { useAuth } from '../context/authContext';
import { epochToDateTime } from '../context/dateTime';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable'; // Importa el complemento

import Nav from '../partials/Nav';
import Footer from "../partials/footer";



function Tablero() {

  const { user } = useAuth();
  const uidUser = user?.uid;
  const dbPath = 'UsersData/' + 'NOnpj85jxhdS3SZw7dTXdLyLqz82' + "/readings";
  const dbRef = ref(db, dbPath);

  const [lastData, setLastData] = useState({});
  const [lastTenData, setLastTenData] = useState([]);
  const [selectedTimestamp, setSelectedTimestamp] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayHeaderDateTime, setDisplayHeaderDateTime] = useState('');
  const itemsPerPage = 7;
  const paginationToShow = 3; // Número de botones de paginación para mostrar




  useEffect(() => {
    if (uidUser) {
      onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        if (data !== null) {
          const sortedData = Object.values(data)
            .sort((a, b) => b.timestamp - a.timestamp);

          // Obtener los últimos 7 datos por defecto
          const lastSevenData = sortedData.slice(0, 7);

          let displayedData = lastSevenData; // Datos que se mostrarán en la tabla
          let displayHeaderDateTime = ''; // Fecha y hora para mostrar en el encabezado

          // Si hay un filtro de fecha seleccionado, aplicar el filtro
          if (selectedTimestamp.start && selectedTimestamp.end) {
            displayedData = sortedData.filter(
              item =>
                item.timestamp >= selectedTimestamp.start && item.timestamp <= selectedTimestamp.end
            );
            displayHeaderDateTime = `${epochToDateTime(selectedTimestamp.start)} - ${epochToDateTime(selectedTimestamp.end)}`;
          } else {
            // Si no hay filtro, usar la fecha y hora de los últimos 7 datos
            displayHeaderDateTime = `${epochToDateTime(lastSevenData[6]?.timestamp)} - ${epochToDateTime(lastSevenData[0]?.timestamp)}`;
          }

          setLastData(sortedData[0] || {});
          setLastTenData(displayedData);
          setDisplayHeaderDateTime(displayHeaderDateTime);
        }
      });
    }
  }, [uidUser, selectedTimestamp]);


  const captureChartImage = async (chartId) => {
    const chartElement = document.getElementById(chartId);
    const canvas = await html2canvas(chartElement);
    return canvas.toDataURL('image/png');
  };




  const handleDownloadPDF = async () => {
    const pdf = new jsPDF();

    // Agregar encabezado de tabla
    const tableHeaders = ["Fecha", "Área 1", "Área 2", "Área 3"];
    const tableData = lastTenData.map(item => [
      epochToDateTime(item.timestamp),
      item.sensor1Value,
      item.sensor2Value,
      item.sensor3Value
    ]);
    // Agregar encabezado de la página
    pdf.text("Reporte de Datos", 10, 10);

    // Agregar tabla
    pdf.autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: 20
    });

    // Capturar imágenes de los gráficos y la tabla
    const sensor1ChartImage = await captureChartImage('sensor1-chart'); // Usa el ID del div que contiene el gráfico
    const sensor2ChartImage = await captureChartImage('sensor2-chart');
    const sensor3ChartImage = await captureChartImage('sensor3-chart');

    pdf.addPage();
    pdf.text("Gráficos por área", 10, 10);
    // Generar PDF a partir de las imágenes capturadas
    pdf.addImage(sensor1ChartImage, 'PNG', 10, 160, 190, 150);
    pdf.addImage(sensor2ChartImage, 'PNG', 10, 15, 190, 150);
    pdf.addPage();
    pdf.addImage(sensor3ChartImage, 'PNG', 10, 15, 190, 150);


    pdf.save('reporte.pdf');
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = lastTenData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  }

  const renderPaginationButtons = () => {
    const totalPages = Math.ceil(lastTenData.length / itemsPerPage);
    const buttons = [];

    // Lógica para mostrar solo tres botones de paginación y actualizar según la página actual
    if (totalPages <= paginationToShow) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button key={i} className={currentPage === i ? "active" : ""} onClick={() => paginate(i)}>
            {i}
          </button>
        );
      }
    } else {
      const leftBoundary = Math.min(Math.max(currentPage - 1, 1), totalPages - paginationToShow + 1);
      const rightBoundary = Math.min(leftBoundary + paginationToShow - 1, totalPages);

      if (leftBoundary > 1) {
        buttons.push(
          <button key={1} onClick={() => paginate(1)}>
            1
          </button>
        );
        if (leftBoundary > 2) {
          buttons.push(
            <span key="ellipsis-left">...</span>
          );
        }
      }

      for (let i = leftBoundary; i <= rightBoundary; i++) {
        buttons.push(
          <button key={i} className={currentPage === i ? "active" : ""} onClick={() => paginate(i)}>
            {i}
          </button>
        );
      }

      if (rightBoundary < totalPages) {
        if (rightBoundary < totalPages - 1) {
          buttons.push(
            <span key="ellipsis-right">...</span>
          );
        }
        buttons.push(
          <button key={totalPages} onClick={() => paginate(totalPages)}>
            {totalPages}
          </button>
        );
      }
    }

    return buttons;
  }

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
        text: 'Datos de humedad relativa '
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
        text: 'Datos de humedad relativa '
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
        text: 'Datos de humedad relativa '
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

      <div className="container bg-white rounded shadow-md px-12 pt-6 pb-12 mb-4 mt-3">
        <div>
          <p className="horaactual">
            <span className="reading text-xl mb-4 text-uppercase">
              <strong> última atualización {epochToDateTime(lastData.timestamp || 0)}</strong>
            </span></p>
          <div id="pdf-content">
            {/* Add date and time picker here */}
            <div class="input-group">
              <span class="input-group-text">Inicio</span>
              <input
                className="datetime-input form-control"
                type="datetime-local"
                onChange={(e) => setStartDate(new Date(e.target.value).getTime() / 1000)}
              />
              <span class="input-group-text">Fin</span>
              <input
                className="datetime-input form-control"
                type="datetime-local"
                onChange={(e) => setEndDate(new Date(e.target.value).getTime() / 1000)}
              />
              <button
                type="button"
                className="btn btn-sm confirmarfecha"
                onClick={() => {
                  setSelectedTimestamp({ start: startDate, end: endDate });
                  // Actualizar la lista de últimos datos usando la nueva fecha seleccionada
                  const filteredData = lastTenData.filter(
                    item =>
                      item.timestamp >= startDate && item.timestamp <= endDate
                  );
                  setLastTenData(filteredData);
                }}
              >
                Confirmar
              </button>
              <button type="button" className="btn btn-sm descargardato" onClick={handleDownloadPDF}>
                Descargar PDF
              </button>
            </div>


            <div className="container2">
              <div className="row">
                <div className="col-lg-6 col-md-6" >
                  <div className="card border-light  mb-3" id="sensor2-chart">
                    <div className="card-header">
                      <h5>Área 1</h5>
                    </div>
                    <div style={graphStyle}>
                      <HighchartsReact highcharts={Highcharts} options={sensor1AreaChart} />
                    </div>
                    <div className="card-footer bg-transparent border-light">
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="card border-light  mb-3" id="sensor1-chart" >
                    <div className="card-header">
                      <h5>Área 2</h5>
                    </div>
                    <div style={graphStyle}>
                      <HighchartsReact highcharts={Highcharts} options={sensor2AreaChart} />
                    </div>
                    <div className="card-footer bg-transparent border-light">

                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="card border-light  mb-3" id="sensor3-chart"  >
                    <div className="card-header">
                      <h5>Área 3</h5>
                    </div>
                    <div style={graphStyle}>
                      <HighchartsReact highcharts={Highcharts} options={sensor3AreaChart} />
                    </div>
                    <div className="card-footer bg-transparent border-light">
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="card border-light  mb-3" id="data-table">
                    <div className="card-header">
                      <p>Datos obtenidos desde <strong>{displayHeaderDateTime}</strong></p>
                    </div>
                    <div className="table-container">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th scope="col" className='text-uppercase'>Fecha</th>
                            <th scope="col" className='text-uppercase'>Área 1</th>
                            <th scope="col" className='text-uppercase'>Área 2</th>
                            <th scope="col" className='text-uppercase'>Área 3</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentData.map(item => (
                            <tr key={item.timestamp}>
                              <td scope="row" className='filas' >{epochToDateTime(item.timestamp)}</td>
                              <td scope="row" className='filas' >{item.sensor1Value}</td>
                              <td scope="row" className='filas' >{item.sensor2Value}</td>
                              <td scope="row" className='filas' >{item.sensor3Value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="pagination">
                        {renderPaginationButtons()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Tablero;
