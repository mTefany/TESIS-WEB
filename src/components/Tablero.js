import React from 'react';
import Barras from '../hook/Barras';
import Area from '../hook/Area';
import Pastel from '../hook/Pastel';
import Prueba from '../hook/Prueba';
import Nav from '../partials/Nav';
import Notify from './Notificacion';
import BarraBasica from '../hook/barraBasica';

function Tablero() {
  const graphStyle = {
    flex: '1',
  };
  return (
    <div>
      <Nav />
      <Notify />
      <div className="container bg-white rounded shadow-md px-4 pt-4 pb-4 mb-4 mt-3">
        <h4 className="text-xl mb-4 text-uppercase">
          Bienvenido al tablero de control.
        </h4>

        <div className="row">
          {/* Contenedor de Area y Barras */}
          <div className='col-md-12'>
            <div className="d-md-flex gap-4">
              <div style={graphStyle}>
                <Barras />
              </div>
              <div style={graphStyle}>
                <Pastel />
              </div>
              <div style={graphStyle}>
                <Area />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          {/* Contenedor de Pastel y Radial */}
          <div className='col-md-12'>
            <div className="d-md-flex gap-4">
              <div style={graphStyle}>
                <Barras />
              </div>
              <div style={graphStyle}>
                <Area />
              </div>
              <div style={graphStyle}>
                <Barras />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div >
  );
}

export default Tablero;
