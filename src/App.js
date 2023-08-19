import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Sensorlist from './components/Sensore'
import Login from './components/Login';
import Register from './components/Resgister';
import { AuthProvider } from './context/authContext'
import { AlertProvider } from './context/alertContext';
import ProtectedRoute from './components/ProtectedRoute';
import Tablero from './components/Tablero';
import Usuarios from './components/Usuarios';
import EditarUsuario from "./components/EditarUsuario";
import IoT from './components/IoT'

function App() {
  return (
    <div >

      <AuthProvider>
        <AlertProvider>
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
            {/* <Route path='/register' element={
            <ProtectedRoute>
              <Register />

            </ProtectedRoute>
          } /> */}
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
            <Route path="/register" element={<Register />} />
          </Routes>
        </AlertProvider>
      </AuthProvider>
    </div>
  )
}

export default App;