import React from 'react';

import { ref, onValue } from 'firebase/database'
import { db } from "../firebase";
import { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { epochToDateTime } from '../context/dateTime';
import { RadialBar, RadialBarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts'

const Radial = () => {
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
                    setLastTenData(sortedData.slice(0, 5)); // Seleccionar los últimos 10 datos
                }
                setTodos(false)
            });
        } else {
            setTodos(false)
        }
    }, [uidUser]);


    return (
        // <ResponsiveContainer>
        <RadialBarChart
            width={730}
            height={250}
            innerRadius="10%"
            outerRadius="80%"
            data={lastTenData}
            startAngle={180}
            endAngle={0}
        >
            <RadialBar minAngle={15} label={{ fill: '#FFA07A', position: 'insideStart' }} background clockWise={true} dataKey='sensor1Value' fill='#FFE07A'/>
            <Legend iconSize={10} width={120} height={140} layout='vertical' verticalAlign='middle' align="right" />
            <Tooltip />
        </RadialBarChart>
        // </ResponsiveContainer>


    )
}

export default Radial
