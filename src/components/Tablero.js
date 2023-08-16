import React, { useState, useEffect }  from 'react';

import { ref, onValue } from 'firebase/database';
import { db } from "../firebase";
import { useAuth } from '../context/authContext';
import { epochToDateTime } from '../context/dateTime';

import Nav from '../partials/Nav';
import Notify from './Notificacion';

import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from 'recharts';


function Tablero() {

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


  return (
    <div>
      <Nav />
      <Notify />
      <div className="container bg-white rounded shadow-md px-4 pt-4 pb-4 mb-4 mt-3">
        <h4 className="text-xl mb-4 text-uppercase">
          Tablero de Control Detallado por Área.
        </h4>
        <p className="horaactual">
          <span className="reading text-xl mb-4 text-uppercase">
          <strong> última atualización {epochToDateTime(lastData.timestamp || 0)}</strong>
          </span></p>
        
        <div className="row">
          {/* Contenedor de Pastel y Radial */}
          <div className='col-md-12'>
            <div className="d-md-flex gap-4">
              <div style={graphStyle}>
                <div style={{ flex: 1 }}>
                  <h6 className='text-center mb-3'>Valores de humedad en el área 1 </h6>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={lastTenData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5
                      }}
                    >
                      <CartesianGrid strokeDasharray="4 1 2" />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(epoch) => epochToDateTime(epoch)}
                      />
                      <YAxis />
                      <Tooltip />
                      <Area dataKey="sensor1Value" fill="#923D32" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div style={graphStyle}>
                <div style={{ flex: 1 }}>
                  <h6 className='text-center mb-3'>Valores de humedad en el área 2 </h6>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={lastTenData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5
                      }}
                    >
                      <CartesianGrid strokeDasharray="4 1 2" />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(epoch) => epochToDateTime(epoch)}
                      />
                      <YAxis />
                      <Tooltip />
                      <Area dataKey="sensor2Value" fill="#9ACD32" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div style={graphStyle}>
                <div style={{ flex: 1 }}>
                  <h6 className='text-center mb-3'>Valores de humedad en el área 3 </h6>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={lastTenData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5
                      }}
                    >
                      <CartesianGrid strokeDasharray="4 1 2" />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(epoch) => epochToDateTime(epoch)}
                      />
                      <YAxis />
                      <Tooltip />
                      <Area dataKey="sensor3Value" fill="#C2C976" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div >
  );
}

export default Tablero;
