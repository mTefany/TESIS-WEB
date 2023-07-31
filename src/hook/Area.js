import React from 'react';

import { ref, onValue } from 'firebase/database'
import { db } from "../firebase.config";
import { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { epochToDateTime } from '../context/dateTime';
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend ,Bar , Line} from 'recharts'

const Area = () => {
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
                    setLastTenData(sortedData.slice(0, 5)); // Seleccionar los últimos 10 datos
                    console.log(lastTenData)
                }

                setTodos(false)
            });
        } else {
            setTodos(false)
        }
    }, [uidUser]);


    return (

        <ResponsiveContainer width="100%" aspect={2}>
            <ComposedChart width={730} height={250} data={lastTenData}>
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <CartesianGrid stroke="#f5f5f5" />
                <Area type="monotone" dataKey="sensor1Value" fill="#8884d8" stroke="#8884d8" />
                <Bar dataKey="sensor2Value" barSize={20} fill="#413ea0" />
                <Line type="monotone" dataKey="sensor3Value" stroke="#ff7300" />
            </ComposedChart>
        </ResponsiveContainer>
    )
}

export default Area
