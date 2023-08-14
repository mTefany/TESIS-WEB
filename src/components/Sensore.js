import { ref, onValue } from 'firebase/database'
import { db } from "../firebase";
import { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { epochToDateTime } from '../context/dateTime';
import Nav from "../partials/Nav";
import Footer from '../partials/footer';
import Notify from './Notificacion';

export default function SensorList() {

  const { user } = useAuth(); // Obtenemos el uid del contexto de autenticación
  const uidUser = user?.uid;
  //const dbPath = 'UsersData/' + uidUser + "/readings";
  const dbPath = 'UsersData/' + 'NOnpj85jxhdS3SZw7dTXdLyLqz82' + "/readings";
  const dbRef = ref(db, dbPath);

  const [data, setData] = useState([]);
  const [datas, setTodos] = useState([]);

  useEffect(() => {
    if (uidUser) {
      onValue(dbRef, (snapshot) => {
        setTodos([]);
        const data = snapshot.val();
        if (data !== null) {
          // Convert data object into an array and sort by timestamp in descending order
          const sortedData = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);
          setData(sortedData);
          // setData(Object.values(data)); // Convert data object into an array
          // console.log(data)
        }
        setTodos(false)
      });
    } else {
      setTodos(false)
    }
  }, [uidUser])


  return (
    <div>
      <Nav />
      <Notify />
      {datas ? (
        <div>Cargando...</div> // Muestra un mensaje de carga mientras se obtienen los datos
      ) : (
        <table className="container table table-hover bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4 mt-3">
          <thead>
            <tr>
              <th scope="col" className='text-uppercase'>Fecha</th>
              <th scope="col" className='text-uppercase'> Area 1</th>
              <th scope="col" className='text-uppercase'>Area 2</th>
              <th scope="col" className='text-uppercase'>Area 3</th>
            </tr>
          </thead>
          <tbody>
            {data.map((reading, index) => (
              <tr key={index}>
                <td scope="row" className='filas'>{epochToDateTime(reading.timestamp)}</td>
                <td scope="row"className='filas'>{reading.sensor1Value}</td>
                <td scope="row"className='filas'>{reading.sensor2Value}</td>
                <td scope="row"className='filas'>{reading.sensor3Value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Footer />
      
    </div>
  );
}
