import React from 'react';

import { ref, onValue } from 'firebase/database'
import { db } from "../firebase";
import { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { epochToDateTime } from '../context/dateTime';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts'

const Barras = () => {
    const { user } = useAuth(); // Obtenemos el uid del contexto de autenticación
    const uidUser = user?.uid;
    const dbPath = 'UsersData/' + uidUser + "/readings";
    const dbRef = ref(db, dbPath);

    const [data, setData] = useState([]);
    const [datas, setTodos] = useState([]);


    const [lastTenData, setLastTenData] = useState([]);


    useEffect(() => {
        if (uidUser) {
            onValue(dbRef, (snapshot) => {
                setTodos([]);
                const data = snapshot.val();
                if (data !== null) {
                    const sortedData = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);
                    // console.log(sortedData)
                    // setData(sortedData);
                    
                    setLastTenData(sortedData.slice(0, 10)); // Seleccionar los últimos 10 datos
                    
                }

                setTodos(false)
            });
        } else {
            setTodos(false)
        }
    }, [uidUser]);


    return (

        <div style={{flex:1}}>
            <h6 className='text-center mb-3'>Valores de área 1, área 2 y área 3</h6>
            <ResponsiveContainer width="100%"  height={300} >
            <BarChart
                data={lastTenData}
                width={500}
                height={100}
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
                    tickFormatter={(epoch) => epochToDateTime(epoch)} // Utilizar epochToDateTime para formatear el eje X
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sensor1Value" fill="#006400" />
                <Bar dataKey="sensor2Value" fill="#9ACD32" />
                <Bar dataKey="sensor3Value" fill="#CD853F" />
            </BarChart>
        </ResponsiveContainer>
        </div>
    )
}

export default Barras
