import React from 'react';

import { ref, onValue } from 'firebase/database'
import { db } from "../firebase";
import { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { epochToDateTime } from '../context/dateTime';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts'

const Pastel = () => {
    const { user } = useAuth(); // Obtenemos el uid del contexto de autenticación
    const uidUser = user?.uid;
    const dbPath = 'UsersData/' + uidUser + "/readings";
    const dbRef = ref(db, dbPath);

    const [data, setData] = useState([]);
    const [datas, setTodos] = useState([]);

    const [lastTenData, setLastTenData] = useState([]);

    const COLORS = ['#FFC0CB', '#FFFF00', '#DDA0DD', '#FFA07A', '#F0D58C', '#FFE4E1', '#EEE8AA']

    useEffect(() => {
        if (uidUser) {
            onValue(dbRef, (snapshot) => {
                setTodos([]);
                const data = snapshot.val();
                if (data !== null) {
                    const sortedData = Object.values(data)
                        .filter(item => item.sensor1Value < 60 && item.sensor2Value < 60 && item.sensor3Value < 60)
                        .sort((a, b) => b.timestamp - a.timestamp);
                    setLastTenData(sortedData.slice(0, 5)); // Seleccionar los últimos 10 datos
                    //setLastTenData(sortedData); 
                }
                setTodos(false)
            });
        } else {
            setTodos(false)
        }
    }, [uidUser]);


    return (
        <div style={{flex:1}}>
            <h6 className='text-center mb-3'>Humedad en áreas de la Finca Catagua</h6>
            <ResponsiveContainer width="100%" height={300}> 
            <LineChart 
                data={lastTenData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" 
                tickFormatter={(epoch) => epochToDateTime(epoch)} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sensor1Value" stroke="#FFA500" />
                <Line type="monotone" dataKey="sensor2Value" stroke="#C71585" />
                <Line type="monotone" dataKey="sensor3Value" stroke="#228B22" />
            </LineChart>
        </ResponsiveContainer>
        </div>
        


    )
}

export default Pastel
