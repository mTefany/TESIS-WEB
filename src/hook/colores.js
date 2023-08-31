import React from 'react'

function colores() {
    return (
        <div className="row ">
            <div className="col-sm-3">
                <div className="card  color1">
                    <div className="card-body">
                        Valores Normales.
                    </div>
                </div>
            </div>
            <div className="col-sm-3">
                <div className="card color2">
                    <div className="card-body">
                        Valores medios.
                    </div>
                </div>
            </div>
            <div className="col-sm-3">
                <div className="card color3">
                    <div className="header">

                    </div>
                    <div className="card-body">
                        Valores altos.
                    </div>
                </div>
            </div>
            <div className="col-sm-3">
                <div className="card color4">
                    <div className="header">

                    </div>
                    <div className="card-body">
                        Valores preocupantes.
                    </div>
                </div>
            </div>
        </div>
    )
}

export default colores
