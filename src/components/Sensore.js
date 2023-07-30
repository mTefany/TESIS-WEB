import { ref, onValue } from 'firebase/database'
import { db } from "../firebase.config";
import { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { epochToDateTime } from '../context/dateTime';
import Nav from "./Nav";

export default function SensorList() {

  const { user } = useAuth(); // Obtenemos el uid del contexto de autenticación
  const uidUser = user.uid;
  const dbPath = 'UsersData/' + uidUser + "/readings";
  const dbRef = ref(db, dbPath);

  const [data, setData] = useState([]);
  const [datas, setTodos] = useState([]);


  

  useEffect(() => {
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
    });

  }, [])


  return (
    <div >
      <Nav/>
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Sensor 1</th>
            <th>Sensor 2</th>
            <th>Sensor 3</th>
          </tr>
        </thead>
        <tbody>
          {data.map((reading, index) => (
            <tr key={index}>
              <td>{epochToDateTime(reading.timestamp)}</td>
              <td></td>
              <td>{reading.sensor1Value}</td>
              <td>{reading.sensor2Value}</td>
              <td>{reading.sensor3Value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
