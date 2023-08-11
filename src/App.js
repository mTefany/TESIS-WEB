import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Sensorlist from './components/Sensore'
import Login from './components/Login';
import Register from './components/Resgister';
import { AuthProvider } from './context/authContext'
import ProtectedRoute from './components/ProtectedRoute';
import Tablero from './components/Tablero';
import Usuarios from './components/Usuarios';

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
          <Route path="/tablero" element={<Tablero />} /> 
          <Route path="/usuarios" element={<Usuarios />} /> 
        </Routes>
      </AuthProvider>
    </div>
  )
}

export default App;