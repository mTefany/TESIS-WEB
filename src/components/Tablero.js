import React from 'react';
import Barras from '../hook/Barras';
import Area from '../hook/Area';
import Pastel from '../hook/Pastel';
import Radial from '../hook/Radial';
import Nav from '../partials/Nav'

function Tablero() {

    return(
        <div>
            <Nav/>
            <div class="container bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4 mt-3">
                <h4 class="text-xl mb-4 text-uppercase">
                    Bienvenido al tablero de control.
                </h4>
                <Barras />  
                <Area /> 
                <Pastel />
                <Radial />
            </div>
        </div>
    );

}
export default Tablero;
