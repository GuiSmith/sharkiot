import { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import './App.css'

function App() {

  const apiUrl = `http://localhost:8000`;
  const sensorEndpoint = `sensor`;
  const leituraEndpoint = `leitura`;

  const [sensores, setSensores] = useState([]);
  const [leituras, setLeituras] = useState([]);

  // Buscando sensores
  useEffect(() => {
    fetch(`${apiUrl}/${sensorEndpoint}`)
      .then(async response => {
        if (response.status == 204) {
          toast("Nenhum sensor encontrado");
          return;
        }

        if (![200, 204].includes(response.status)) {
          toast("Erro ao listar sensores");
          return;
        }

        const sensores = await response.json();
        setSensores(sensores);
      })
      .catch(error => {
        console.debug(error);
      });
  }, []);

  useEffect(() => {
    if (sensores.length == 0) return;

    fetch(`${apiUrl}/${leituraEndpoint}`)
      .then(async response => {
        if (response.status == 204) {
          toast("Nenhuma leitura encontrada");
          return;
        }

        if (![200, 204].includes(response.status)) {
          toast("Erro ao listar leituras");
          return;
        }

        const leituras = await response.json();
        console.log('Novas leituras: ', leituras);
        setLeituras((prev) => [...prev, leituras]);
      })
  }, [sensores]);

  return (
    <section className='mt-3'>
      <article className='container alert alert-primary'>
        <h1 className='text-center'>Sensores</h1>
        <div className='row text-center mt-5'>
          {/* Presença */}
          <div className='col-lg-6 col-sm-12 col-md-12'>
            <h4>Presença</h4>
            <p style={{ textIndent: '1rem' }}>
              Identifica se há algum objeto na direção em que o sensor aponta.
            </p>
          </div>
          {/* Proximidade */}
          <div className='col-lg-6 col-sm-12 col-md-12'>
            <h4>Proximidade</h4>
            <p style={{ textIndent: '1rem' }}>
              Identifica a distância entre o sensor e o objeto, em centímetros.
            </p>
          </div>
        </div>
        <hr />
        <div className='d-flex justify-content-around'>
          {sensores.map((sensor, index) => (
            <button key={index} className='btn btn-info'>
              {sensor.tipo}
            </button>
          ))}
        </div>
      </article>
      <main className='container mt-4'>
        <h2 className='text-center'>Leituras</h2>
        <table className='table table-stripped table-light'>
          <thead>
            {leituras.length}
          </thead>
          <tbody>
            {leituras.length == 0
              ? ''
              : leituras.map((leitura, index) => (
                <tr id={leitura.id} key={index}>

                </tr>
              ))}
          </tbody>
        </table>
      </main>
      <ToastContainer position="bottom-right" />
    </section>
  )
}

export default App
