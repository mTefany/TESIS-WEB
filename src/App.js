import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Sensorlist from './components/Sensore'
import Login from './components/Login';
import Register from './components/Resgister';
import { AuthProvider } from './context/authContext'
import ProtectedRoute from './components/ProtectedRoute';
import Tablero from './components/Tablero';
import Usuarios from './components/Usuarios';
import EditarUsuario from "./components/EditarUsuario";

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
          <Route path='/register' element={
            <ProtectedRoute>
              <Register />

            </ProtectedRoute>
          } />
          <Route path='/sensores' element={
            <ProtectedRoute>
              <Sensorlist />

            </ProtectedRoute>
          } />
          <Route path='/tablero' element={
            <ProtectedRoute>
              <Tablero />

            </ProtectedRoute>
          } />
          <Route path='/usuarios' element={
            <ProtectedRoute>
              <Usuarios />

            </ProtectedRoute>
          } />
          <Route path='/editar-usuario/:userId' element={
            <ProtectedRoute>
              <EditarUsuario />

            </ProtectedRoute>
          } />

          <Route path="/login" element={<Login />} />  
        </Routes>
      </AuthProvider>
    </div>
  )
}

export default App;