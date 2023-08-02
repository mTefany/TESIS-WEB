import React from 'react';
import Barras from '../hook/Barras';
import Area from '../hook/Area';
import Pastel from '../hook/Pastel';
import Radial from '../hook/Radial';
import Nav from '../partials/Nav';
import Notify from './Notificacion';

function Tablero() {
  return (
    <div>
      <Nav />
      <Notify />
      <div className="container bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4 mt-3">
        <h4 className="text-xl mb-4 text-uppercase">
          Bienvenido al tablero de control.
        </h4>
        <div className='grip grap-4'>
          <div className="grid md:flex-row gap-4">
            {/* Contenedor de Area y Barras */}
            <div className='grid md:flex-row gap-4' style={{ display: 'flex' }}>
              <div style={{ flex: 1 }}>
                <Area />
              </div>
              <div style={{ flex: 1 }}>
                <Barras />
              </div>
            </div>
            {/* Contenedor de Pastel y Radial */}
            <div className='grid md:flex-row gap-4' style={{ display: 'flex' }}>
              <div style={{ flex: 1 }}>
                <Pastel />
              </div>
              <div style={{ flex: 1 }}>
                <Radial />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Tablero;
