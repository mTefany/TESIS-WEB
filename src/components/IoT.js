import React from 'react'
import Nav from '../partials/Nav'
import Footer from '../partials/footer'
import Emisor from '../image/Emisor.png'
import Receptor from '../image/Receptor.png'
import Transmision from '../image/Transmision.png'

function IoT() {
  return (
    <div >
      <Nav />
      <div className="superior">
        <div className="container bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4 mt-3">
          <div className="row ">
            <div className="card text-center">
              <center>
                <div className="card-header">
                  <h5>Transmisión de datos</h5>
                </div>
                <img className='transmision img-fluid' src={Transmision} alt="" />
              </center>
              <div className="card-body">
                <h6>Valores de transmisión</h6>
                <div className="containertabla">
                  <table className="table table-hover ">
                    <thead>
                      <tr>
                        <th scope="col" className='text-uppercase'>Dato</th>
                        <th scope="col" className='text-uppercase'>Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td scope="row" className="filas" >Frecuencia de transmisión de datos</td>
                        <td scope="row" className="filas" >15 segundos</td>
                      </tr>
                      <tr>
                        <td scope="row" className="filas" >Intensidad de la señal recibida</td>
                        <td scope="row" className="filas" >-30 dBm (decibelios)</td>
                      </tr>
                      <tr>
                        <td scope="row" className="filas" >Banda de frecuencia</td>
                        <td scope="row" className="filas" >915 MHz (megahertz)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="col-sm-6 mb-3 mb-sm-0">
              <h5 className="card-header">Emisor</h5>
              <div className="card mb-3 " >
                <div className="row g-0">
                  <div className="col-md-5">
                    <img className='emisorimagen img-fluid' src={Emisor} alt="" />
                  </div>
                  <div className="col-md-6">
                    <div className="card-body info-card">
                      <p className="card-text">
                        El módulo emisor cuenta con tres sensores ubicados en tres áreas diferentes dentro de los cultivos de pitahaya.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 mb-3 mb-sm-0">
              <h5 className="card-header">Receptor</h5>
              <div className="card mb-3 " >
                <div className="row g-0">
                  <div className="col-md-6">
                    <img className=' img-fluid' src={Receptor} alt="" />
                  </div>
                  <div className="col-md-6">
                    <div className="card-body info-card">
                      <p className="card-text">
                        El módulo receptor recibe los datos cada <strong>15 segundos</strong>. Este módulo se encuentra a 50 m del módulo emisor
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container4"></div>
      <Footer />
    </div>
  )
}

export default IoT
