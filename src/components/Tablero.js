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
            <h1>
                Bienvenido al tablero de control.
            </h1>
            <Barras />  
            <Area /> 
            <Pastel />
            <Radial />

        </div>
    );

}
export default Tablero;
