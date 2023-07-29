import React from "react";

function Alert({message}){
    return <div className="bg-green-100 border border-green-400 text-black-700 px-4 py-3 rounded relative mb-2 text center">
        <span className="sm:inline block">{message}</span>
    </div>
}

export default Alert;