import { ref, onValue } from 'firebase/database';
import { db } from "../firebase";
import { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { epochToDateTime } from '../context/dateTime';
import Nav from "../partials/Nav";
import Footer from '../partials/footer';
import Notify from './Notificacion';

export default function SensorList() {

  const { user } = useAuth();
  const uidUser = user?.uid;
  //const dbPath = 'UsersData/' + uidUser + "/readings";
  const dbPath = 'UsersData/' + 'NOnpj85jxhdS3SZw7dTXdLyLqz82' + "/readings";
  const dbRef = ref(db, dbPath);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const paginationToShow = 3; // Número de botones de paginación para mostrar

  useEffect(() => {
    if (uidUser) {
      onValue(dbRef, (snapshot) => {
        setLoading(true);
        const data = snapshot.val();
        if (data !== null) {
          const sortedData = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);
          setData(sortedData);
        }
        setLoading(false);
      });
    }
  }, [uidUser])

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  }

  const renderPaginationButtons = () => {
    const totalPages = Math.ceil(data.length / itemsPerPage);
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

  return (
    <div>
      <Nav />
      <Notify />
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <div className="container bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4 mt-3">
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
                  <td scope="row" className='filas'>{epochToDateTime(reading.timestamp)}</td>
                  <td scope="row" className='filas'>{reading.sensor1Value}</td>
                  <td scope="row" className='filas'>{reading.sensor2Value}</td>
                  <td scope="row" className='filas'>{reading.sensor3Value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            {renderPaginationButtons()}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
