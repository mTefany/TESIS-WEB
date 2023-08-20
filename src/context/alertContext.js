import React, { createContext, useContext, useState } from 'react';

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([]);

  const addAlert = (alertMessage, timestamp) => {
    setAlerts((prevAlerts) => [...prevAlerts, { message: alertMessage, timestamp }]);
  };

  const removeAlert = (index) => {
    const newAlerts = alerts.filter((_, i) => i !== index);
    setAlerts(newAlerts);
  };

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  return useContext(AlertContext); 
}
