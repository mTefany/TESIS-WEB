import React from 'react';

import { ref, onValue } from 'firebase/database';
import { db } from "../firebase";
import { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { epochToDateTime } from '../context/dateTime';
import Nav from "../partials/Nav";
import Footer from '../partials/footer';
import { saveAs } from "file-saver";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Colores from '../hook/colores'
import membrete from '../image/membrete.jpeg'
// import { useAlert } from '../context/alertContext';


export default function SensorList() {

  const { user } = useAuth();
  // const { alerts } = useAlert();
  const uidUser = user?.uid;
  //const dbPath = 'UsersData/' + uidUser + "/readings";
  const dbPath = 'UsersData/' + 'NOnpj85jxhdS3SZw7dTXdLyLqz82' + "/readings";
  const dbRef = ref(db, dbPath);


  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);

  const [lastData, setLastData] = useState({});
  const [lastTenData, setLastTenData] = useState([]);
  const [selectedTimestamp, setSelectedTimestamp] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayHeaderDateTime, setDisplayHeaderDateTime] = useState('');


  const itemsPerPage = 15;
  const paginationToShow = 3; // Número de botones de paginación para mostrar

  useEffect(() => {
    if (uidUser) {
      onValue(dbRef, (snapshot) => {
        setLoading(true);
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
        setLoading(false);
      });
    }
  }, [uidUser, selectedTimestamp]);

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

    // Agregar membrete con dibujo y logo
    const pageWidth = pdf.internal.pageSize.getWidth(); // Ancho de la página

    const imgWidth = pageWidth; // Ancho de la imagen igual al ancho de la página


    const img = new Image();
    img.src = membrete;
    pdf.addImage(img, 'JPEG', 0, 0, imgWidth, 30); // Agregar imagen a toda la página


    // Agregar encabezado de la página
    pdf.text("Reporte de Datos por Área", 30, 35); // Ajustar posición vertical del título


    // Agregar tabla
    pdf.autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: 40
    });


    // Agregar tabla de alertas
    const tableHeadersAlerta = ["Fecha", "Área", "Mensaje"];
    const tableDataAlerta = [];
    currentData.forEach(reading => {
      const alertsForReading = checkSensorValues(reading);
      alertsForReading.forEach(alert => {
        tableDataAlerta.push([
          epochToDateTime(alert.timestamp),
          alert.area,
          alert.mensaje
        ]);
      });
    });

    if (tableDataAlerta.length > 0) {
      pdf.addPage();
      pdf.addImage(img, 'JPEG', 0, 0, imgWidth, 30); // Agregar imagen a toda la página

      // Agregar encabezado de página

      pdf.text("Reporte de Alertas en las Áreas donde se ubican los sensores.", 30, 35);

      pdf.autoTable({
        head: [tableHeadersAlerta],
        body: tableDataAlerta,
        startY: 40
      });
    }

    pdf.save('Datos-sensores.pdf');
  };


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = lastTenData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  }

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
    } else if (numericValue >= 61 && numericValue <= 70) {
      return "#A3DFFC";
    } else if (numericValue >= 71 && numericValue <= 80) {
      return "#FCF5A3";
    } else if (numericValue >= 81 && numericValue <= 100) {
      return "#FCB3A3";
    } else {
      return ""; // Maneja otros casos según sea necesario
    }
  }

  const checkSensorValues = (reading) => {
    const newAlerts = [];

    const checkSensor = (area, sensorValue) => {
      // Lógica de verificación de valores de sensores
      let mensaje = '';

      if (sensorValue > 49 && sensorValue < 61) {
      }
      else if (sensorValue > 60 && sensorValue < 70) {
        mensaje = `Poco exceso de humedad en el suelo`;
      } else if (sensorValue > 69 && sensorValue < 81) {
        mensaje = `Exceso de humedad en el suelo`;
      } else if (sensorValue > 80 && sensorValue < 101) {
        mensaje = `La humedad supera los límites`;
      } else if (sensorValue < 50 && sensorValue > 39) {
        mensaje = `El suelo está comenzando a secarse`;
      } else if (sensorValue < 40 && sensorValue > 29) {
        mensaje = `El suelo se encuentra seco`;
      } else if (sensorValue < 30 && sensorValue > 10) {
        mensaje = `El suelo cuenta con exceso de sequía`;
      } else if (sensorValue < 11 && sensorValue > -1) {
        mensaje = `El sensor se encuentra desconectado`;
      }


      if (mensaje.length > 0) {
        newAlerts.push({ mensaje, area, timestamp: reading.timestamp }); // Incluye el timestamp en las alertas
      }
    };

    checkSensor('Área 1', reading.sensor1Value);
    checkSensor('Área 2', reading.sensor2Value);
    checkSensor('Área 3', reading.sensor3Value);

    return newAlerts; // Devolver el array de alertas
  };


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

  const handleDownloadExcel = () => {
    // Crear un arreglo con los datos en formato de hoja de cálculo
    const sheetData = [
      ["Fecha", "Sensor 1", "Sensor 2", "Sensor 3"], // Encabezado
      ...lastTenData.map(item => [
        epochToDateTime(item.timestamp),
        item.sensor1Value,
        item.sensor2Value,
        item.sensor3Value,
      ]),
    ];

    // Crear un objeto de hoja de cálculo
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    // Crear un libro de Excel y agregar la hoja de cálculo
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sensor Data");

    // Convertir el libro de Excel a un objeto Blob
    const excelBlob = new Blob([s2ab(XLSX.write(workbook, { bookType: "xlsx", type: "binary" }))], {
      type: "application/octet-stream"
    });

    // Guardar el archivo Excel en el navegador
    saveAs(excelBlob, "sensor_data.xlsx");
  };

  // Función para convertir cadena binaria a ArrayBuffer
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  };

  const currentDataWithAlerts = currentData.filter(reading => {
    const alerts = checkSensorValues(reading);
    return alerts.length > 0; // Filtrar solo los datos con alertas
  });



  return (
    <div >
      <Nav />
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <div className="superior">
          <div className="container bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4 mt-3">
            <div className="card">
              <div className="card-body tarjetaflex text-center ">
                <h5>Datos obtenidos desde {displayHeaderDateTime}</h5>
              </div>
            </div>
            <div className="container3"></div>
            <div className="container3">
              <div className="row">
                <div className="col-sm-6 ">
                  <div >
                    <div className="card-body inicio">
                      <div className="input-group">
                        <span className="input-group-text">Inicio</span>
                        <input
                          className="datetime-input form-control"
                          type="datetime-local"
                          onChange={(e) => setStartDate(new Date(e.target.value).getTime() / 1000)}
                        />
                      </div>

                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div>
                    <div className="card-body fin">
                      <div className="input-group">
                        <span className="input-group-text">Fin</span>
                        <input
                          className="datetime-input form-control"
                          type="datetime-local"
                          onChange={(e) => setEndDate(new Date(e.target.value).getTime() / 1000)}
                        />
                      </div>

                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="card-body">
                  <div className="button-container">
                    <center>
                      <button
                        type="button"
                        className="btn btn-sm col-sm-2 descargardato"
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
                        <div className="input-group ">
                          Consultar
                          <i className="material-icons pdf">search</i>
                        </div>
                      </button>
                      <button type="button" className="btn btn-sm descargardato " onClick={handleDownloadExcel} >
                        <div className="input-group ">
                          Descargar Excel
                          <i className="material-icons pdf">download</i>
                        </div>
                      </button>
                      <button type="button" className="btn btn-sm col-sm-2 descargardato" onClick={handleDownloadPDF}>
                        <div className="input-group ">
                          Descargar
                          <i className="material-icons pdf">picture_as_pdf</i>
                        </div>

                      </button>
                    </center>
                  </div>
                </div>
              </div>
            </div>
            <div className="container3 ">
              <Colores />
            </div>
            <div className="row">
              <div className="container3"></div>
              <div className="container3"></div>
              <div className="container3"></div>
              <div className="col-sm-6 mb-3 mb-sm-0">
                <div className="card-header">
                  <h5>Valores de cada área en una determinada fecha</h5>
                </div>
                <div className='card-body'>
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th scope="col" className='text-uppercase'>Fecha</th>
                        <th scope="col" className='text-uppercase'>Area 1</th>
                        <th scope="col" className='text-uppercase'>Area 2</th>
                        <th scope="col" className='text-uppercase'>Area 3</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentData.map((reading, index) => (
                        <tr key={index}>
                          <td scope="row" className='filas'> {epochToDateTime(reading.timestamp)} </td>
                          <td scope="row" className="filas" style={{ backgroundColor: getColorForValue(reading.sensor1Value) }}>
                            {reading.sensor1Value} %
                          </td>
                          <td scope="row" className="filas" style={{ backgroundColor: getColorForValue(reading.sensor2Value) }}>
                            {reading.sensor2Value} %
                          </td>
                          <td scope="row" className="filas" style={{ backgroundColor: getColorForValue(reading.sensor3Value) }}>
                            {reading.sensor3Value} %
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="pagination">
                    {renderPaginationButtons()}
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="card-header">
                  <h5>Alertas mostradas</h5>
                </div>
                <div className='card-body'>
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Área</th>
                        <th>Mensaje</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentDataWithAlerts.map((reading, index) => {
                        const alertsForReading = checkSensorValues(reading); // Obtener alertas para esta lectura

                        if (alertsForReading.length > 0) {
                          return (
                            <React.Fragment key={index}>
                              {alertsForReading.map((alert, alertIndex) => (
                                <tr key={`${index}-${alertIndex}`}>
                                  {alertIndex === 0 && (
                                    <td rowSpan={alertsForReading.length}>
                                      {epochToDateTime(reading.timestamp)}
                                    </td>
                                  )}
                                  <td>{alert.area}</td>
                                  <td>{alert.mensaje}</td>
                                </tr>
                              ))}
                            </React.Fragment>
                          );
                        }
                        return null; // 
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="container4"> </div>
      <Footer />
    </div >
  );
}
