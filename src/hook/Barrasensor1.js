import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from "../firebase";
import { useAuth } from '../context/authContext';
import { epochToDateTime } from '../context/dateTime';
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from 'recharts';

const BarraSensor1 = () => {
    const { user } = useAuth();
    const uidUser = user?.uid;
    const dbPath = 'UsersData/' + 'NOnpj85jxhdS3SZw7dTXdLyLqz82' + "/readings";
    const dbRef = ref(db, dbPath);

    const [data, setData] = useState([]);
    const [lastTenData, setLastTenData] = useState([]);

    useEffect(() => {
        if (uidUser) {
            onValue(dbRef, (snapshot) => {
                const data = snapshot.val();
                if (data !== null) {
                    const sortedData = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);
                    setLastTenData(sortedData.slice(0, 10));
                }
            });
        }
    }, [uidUser]);

    return (
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
    );
}

export default BarraSensor1;
