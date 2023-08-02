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
                    const sortedData = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);
                    setLastTenData(sortedData.slice(0, 10)); // Seleccionar los últimos 10 datos
                }
                setTodos(false)
            });
        } else {
            setTodos(false)
        }
    }, [uidUser]);


    return (
        // <ResponsiveContainer>
            <LineChart width={530} height={250} data={lastTenData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sensor3Value" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sensor1Value" stroke="#8884d8" />
                <Line type="monotone" dataKey="sensor2Value" stroke="#82ca9d" />
                <Line type="monotone" dataKey="sensor3Value" stroke="#82459d" />
            </LineChart>
        // </ResponsiveContainer>


    )
}

export default Pastel
