import { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import './App.css'

function App() {

  const apiUrl = `http://localhost:8000`;
  const sensorEndpoint = `sensor`;
  const leituraEndpoint = `leitura`;

  const [sensores, setSensores] = useState([]);
  const [leituras, setLeituras] = useState([]);
  const [leiturasFiltradas, setLeiturasFiltradas] = useState([]);
  const [table, setTable] = useState('');
  const [qtdBuscas, setQtdBuscas] = useState(0);
  const [idSensor, setIdSensor] = useState(null);

  // Troca a quantidade de buscas a cada 10s
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log(qtdBuscas + 1);
      setQtdBuscas(qtd => qtd + 1);
    }, 5000);

    return () => clearTimeout(timer);
  },[qtdBuscas]);

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

  // Buscando Leituras
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
        setLeituras(leituras);
        if(idSensor === null){
          setLeiturasFiltradas(leituras);
        }
      })
  }, [sensores, qtdBuscas]);

  // Tabela
  useEffect(() => {
    if (leiturasFiltradas.length == 0) {
      return;
    }

    const headers = {
      id: 'ID',
      valor: 'Valor',
      data_ocorrencia: 'Data ocorrência',
      data_cadastro: 'Data cadastro'
    };

    setTable(
      <table className='table table-stripped table-dark table-bordless'>
        <thead>
          <tr>
            {Object.entries(headers).map(([chave, valor]) => <th key={chave}>{valor}</th>)}
          </tr>
        </thead>
        <tbody>
          {leiturasFiltradas.map((leitura) => (
            <tr key={leitura.id}>
              {Object.keys(headers).map((chave,index) => (
                <td key={index}>{leitura[chave]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }, [leiturasFiltradas]);

  // Definir ID sensor
  const handleSensorChange = (e) => setIdSensor(e.target.id);

  // Filtrar leituras
  const filtrarLeituras = (novo_id_sensor) => {
    const novasLeituras = leituras.filter(leitura => leitura.id_sensor == novo_id_sensor);

    setLeiturasFiltradas(novasLeituras);
  }

  useEffect(() => {
    filtrarLeituras(idSensor)
  },[idSensor,leituras]);

  return (
    <section className='mt-3'>
      <article className='container alert alert-secondary'>
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
          {sensores.map((sensor) => (
            <button onClick={handleSensorChange} id={sensor.id} key={sensor.id} className='btn btn-dark'>
              {sensor.tipo}
            </button>
          ))}
        </div>
      </article>
      <main className='container mt-4'>
        <h2 className='text-center'>Leituras</h2>
        {table}
      </main>
      <ToastContainer position="bottom-right" />
    </section>
  )
}

export default App
