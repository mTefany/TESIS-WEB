import React from 'react';

import { ref, onValue } from 'firebase/database'
import { db } from "../firebase";
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

        <ResponsiveContainer width="100%" height={300}>
            <ComposedChart width={230} height={150} data={lastTenData}>
                <XAxis dataKey="timestamp" 
                tickFormatter={(epoch) => epochToDateTime(epoch)} 
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <CartesianGrid stroke="#f5f5f5" />
                {/* <Area type="monotone" dataKey="sensor1Value" fill="#8884d8" stroke="#8884d8" /> */}
                <Bar dataKey="sensor2Value" barSize={20} fill="#915ea9" />
                <Line type="monotone" dataKey="sensor3Value" stroke="#ff9300" />
                <Line type="monotone" dataKey="sensor1Value" stroke="#f15361" />
            </ComposedChart>
        </ResponsiveContainer>
    )
}

export default Area
