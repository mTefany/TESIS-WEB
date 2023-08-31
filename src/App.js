import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Sensorlist from './components/Sensore'
import Login from './components/Login';
import Register from './components/Resgister';
import { AuthProvider } from './context/authContext'
import ProtectedRoute from './components/ProtectedRoute';
import Tablero from './components/Tablero';
import Usuarios from './components/Usuarios';
import EditarUsuario from "./components/EditarUsuario";
import IoT from './components/IoT'
import Notify from './components/Notificacion'

function App() {
  const location = useLocation();

  // Verificar si no estamos en la ruta de login
  const shouldShowNotify = location.pathname !== '/login';
  console.log(shouldShowNotify)

  return (
    <div >

      <AuthProvider>
        {shouldShowNotify && <Notify />}

        <Routes>

          <Route path='/' element={
            <ProtectedRoute>
              <Home />

            </ProtectedRoute>
          } />
          <Route path='/iot' element={
            <ProtectedRoute>
              <IoT />
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
          <Route path='/register' element={
            <ProtectedRoute>
              <Register />
            </ProtectedRoute>
          } />

          <Route path="/login" element={<Login />} />
        </Routes>

      </AuthProvider>
    </div>
  )
}

export default App;