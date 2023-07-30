import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Sensorlist from './components/Sensore'
import Login from './components/Login';
import Register from './components/Resgister';
import { AuthProvider } from './context/authContext'
import ProtectedRoute from './components/ProtectedRoute';
import Tarjeta from './hook/tarjetas';

function App() {
  return (
    <div className='bg-slate-300 h-screen text-black flex'>
      
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
        </Routes>
      </AuthProvider>
    </div>
  )
}

export default App;