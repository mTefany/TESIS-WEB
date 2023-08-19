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
import { useAlert } from '../context/alertContext';


export default function SensorList() {

  const { user } = useAuth();
  const { alerts } = useAlert();
  const uidUser = user?.uid;
  //const dbPath = 'UsersData/' + uidUser + "/readings";
  const dbPath = 'UsersData/' + 'NOnpj85jxhdS3SZw7dTXdLyLqz82' + "/readings";
  const dbRef = ref(db, dbPath);


  const [loading, setLoading] = useState(true);
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

    // Agregar encabezado de la página
    pdf.text("Reporte de Datos de los sensores", 10, 10);

    // Agregar tabla
    pdf.autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: 20
    });

    pdf.save('Datos-sensores.pdf');
  };


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = lastTenData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  }

  function getColorForValue(value) {
    if (value >= 50 && value <= 60) {
      return ""; // No color
    } else if (value >= 20 && value <= 49) {
      return "rgba(255, 255, 0, 0.5)";
    } else if (value >= 61 && value <= 80) {
      return "green";
    } else if ((value >= 0 && value <= 19) || (value >= 81 && value <= 100)) {
      return "red";
    } else {
      return ""; // Default color
    }
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




  return (
    <div className="page-container">
      <Nav />
      {loading ? (
        <div>Cargando...</div>
      ) : (

        <div className="container bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4 mt-3">
          <div className="superior">
            <div class="card">
              <div class="card-body text-center text-uppercase">
                Datos obtenidos desde <strong>{displayHeaderDateTime}</strong>
              </div>
            </div>
          </div>

          <div class="input-group superior">
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
                const filteredData = lastTenData.filter(
                  item =>
                    item.timestamp >= startDate && item.timestamp <= endDate
                );
                setLastTenData(filteredData);
              }}
            >
              Confirmar
            </button>
            <button type="button" className="btn btn-sm descargardato " onClick={handleDownloadExcel} >
              Descargar Excel
            </button>
            <button type="button" className="btn btn-sm descargardato " onClick={handleDownloadPDF} >
              Descargar  Pdf
            </button>
          </div>

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
                  <td
                    scope="row"
                    className="filas"
                    style={{ backgroundColor: getColorForValue(reading.sensor2Value) }}
                  >
                    {reading.sensor1Value}
                  </td>
                  <td
                    scope="row"
                    className="filas"
                    style={{ backgroundColor: getColorForValue(reading.sensor3Value) }}
                  >
                    {reading.sensor2Value}
                  </td>
                  <td
                    scope="row"
                    className="filas"
                    style={{ backgroundColor: getColorForValue(reading.sensor3Value) }}
                  >
                    {reading.sensor3Value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            {renderPaginationButtons()}
          </div>
          <div className="page-container">
            {/* ... */}
            {alerts.map((alert, index) => (
              <div key={index}>{alert}</div>
            ))}
            {/* ... */}
          </div>
        </div>

      )}
      <Footer />
    </div>
  );
}
