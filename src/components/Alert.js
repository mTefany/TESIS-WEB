//importar las dependencias de Reacr
import React from "react";

//Aquí, se define una función llamada Alert que acepta un solo parámetro llamado message
//Este es el mensaje de errores
function Alert({message}){
    //retorna el componente con el mensaje modificadopar que tnenga una mejor interfaz y se ubique en n lugar especifico
    return <div className="bg-green-100 border border-green-400 text-black-700 px-4 py-3 rounded relative mb-2 text center">
        <span className="sm:inline block">{message}</span>
    </div>
}

//exportar función
export default Alert;