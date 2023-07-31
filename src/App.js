import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Sensorlist from './components/Sensore'
import Login from './components/Login';
import Register from './components/Resgister';
import { AuthProvider } from './context/authContext'
import ProtectedRoute from './components/ProtectedRoute';
import Tarjeta from './hook/tarjetas';
import Tablero from './components/Tablero';

function App() {
  return (
    <div >
      
      <AuthProvider>
        <Routes>
          <Route path='/' element={
            <ProtectedRoute>
              <Home />

            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/sensores" element={<Sensorlist />} /> 
          <Route path="/tarjeta" element={<Tarjeta />} /> 
          <Route path="/tablero" element={<Tablero />} /> 
        </Routes>
      </AuthProvider>
    </div>
  )
}

export default App;