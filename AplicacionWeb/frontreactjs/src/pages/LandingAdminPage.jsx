import React, { useState, useEffect } from 'react';
import httpClient from '../httpClient';
import ApiDataPrinter from '../components/Api/ApiDataPrinter';
import LineChart from '../components/charts/Chart_line';
import Chart_hum from '../components/charts/Chart_hum';
import Chart_light from '../components/charts/Chart_light';
import Chart_coint from '../components/charts/Chart_coint';
import Gauge from '../components/charts/Chart_energy';
import Sidebar from '../components/sidebar/Sidebar';
import ModalComponent from '../components/modal/ModalComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import AddBoxForm from '../components/AddBoxForm'; // Asegúrate de la ruta correcta del componente
import AddBoxModal from '../components/modal/AddBoxModal';
import DeleteBoxModal from '../components/modal/Delete_box_modal';
import ModalTemp from '../components/modal/ModalTemp';
import GpsModal from '../components/modal/GPS_modal';
import GpsModalAll from '../components/modal/GPSALL_Modal';

const LandingPage = () => {
  const [userss, setUser] = useState(null);
  const [temperaturasActuales, setTemperaturasActuales] = useState([]);
  const [cointActuales, setcointActuales] = useState([]);
  const [humedadActuales, sethumedadActuales] = useState([]);
  const [luzActuales, setluzActuales] = useState([]);
  const [energiaActuales, setenergiaActuales] = useState([]);
  const [latitudActuales, setlatitudActuales] = useState([]);
  const [longitudActuales, setlongitudActuales] = useState([]);
  const [timeActuales, settimeActuales] = useState([]);
  const [userPar, setUserPar] = useState(null);
  const [isBoxOpen, setIsBoxOpen] = useState(true);
  const [isButtonsOpen, setIsButtonsOpen] = useState(true);
  

  const handleBoxAdded = (newBox) => {
    // Actualizar la lista de cajas del usuario después de agregar una nueva caja
    setUser((prevUser) => ({
      ...prevUser,
      boxes: [...prevUserss.boxes, newBox],
    }));
  };
  

  const logOutUser = async () => {
    await httpClient.post("//127.0.0.1:5000/logout");
    localStorage.setItem('userParams', null);
    window.location.href = "/";
  };

  const urlParams = new URLSearchParams(window.location.search);
  const parames = {
      'username': urlParams.get("username"),
      'password': urlParams.get("password"),
  }
  

// Función para obtener la información actualizada de la API
const fetchUserData = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const params = {
    'username': urlParams.get("username"),
    'password': urlParams.get("password"),
  };

  
  // Si no hay parámetros de usuario en la URL, obtener los parámetros del almacenamiento local
  if (params.username != null) {
    const resp = await httpClient.post("//127.0.0.1:5000/@me", params);
    console.log(resp.data);
    // Guardar los parámetros en el almacenamiento local
    localStorage.setItem('userParams', JSON.stringify(params));
    setUser(resp.data);

  } else {
    // Crear el objeto de datos con los parámetros de usuario
    const userParams = JSON.parse(localStorage.getItem('userParams'));
    console.log('no')
    console.log(userParams)
    const resp = await httpClient.post("//127.0.0.1:5000/@me", userParams);
    console.log(resp.data);
    setUser(resp.data);
  }
}

  useEffect(() => {
    // Llamar a fetchUserData cuando el componente se monte
    fetchUserData();

    // Establecer un intervalo para actualizar la información cada cierto tiempo (por ejemplo, cada 5 segundos)
    const interval = setInterval(() => {
      fetchUserData();
    }, 30000);

    // Limpieza: detener el intervalo cuando el componente se desmonte para evitar fugas de memoria
    return () => {
      clearInterval(interval);
    };
  }, []);

  const toggleBoxVisibility = () => {
    setIsBoxOpen(!isBoxOpen);
  };

  const toggleButtonsVisibility = () => {
    setIsButtonsOpen(!isButtonsOpen);
  };

  console.log(userss)
  return (
    <div>
      <Sidebar user={userss}/>
      <div className='everything'>
      <br />
        <div className='BoxModal'>
          <AddBoxModal onBoxAdded={handleBoxAdded} cliente={userss && userss.user.number} />
        </div>
        {userss && userss.boxes.map((caja) => (
          <div key={caja.key_box} className={`box_class`}>
            <section className='boxesmenus'>
            <p className='box_title' onClick={toggleBoxVisibility}>
              {caja.key_box}
              <FontAwesomeIcon
                icon={isBoxOpen ? faChevronUp : faChevronDown}
                className='chevron-icon'
              />
            </p>
            <section className='botonazos'>
                  <section className='buttons_modals'>
                  <DeleteBoxModal box_deleted={caja.key_box} cliente={caja.client}></DeleteBoxModal>
                  <GpsModal data={userss.logs[caja.key_box]} />
                  <ModalComponent data={userss.boxes} />
                  </section>
            </section>
          </section>

            {isBoxOpen && (
              <div>

                <div className="container">
                  <div className="grid-container">
                    <div className='btn&chart'>
                      <div className="chart-container">
                        <LineChart dates={userss.logs[caja.key_box]} />
                      </div>
                      <ModalTemp data={"Grafica de temperaturas, las lineas solidas representan la evolución de la temperatura del contenedor. La linea rayada señala el limite critico de temperatura, indicando el punto antes del cual el producto corre el riesgo de dañarse"} />
                    </div>
                    <div className='btn&chart'>
                      <div className="chart-container">
                        <Chart_hum  dates={userss.logs[caja.key_box]} />
                      </div>
                      <ModalTemp data={"La grafica de humedad presenta las variaciones en los niveles de humedad a lo largo del tiempo. Cada barra representa el nivel de humedad dentro de un periodo de tiempo especifico. La linea punteada marca el limite critico de humedad"} />
                    </div>
                    <div className='btn&chart'>
                      <div className="chart-container">
                        <Chart_light  dates={userss.logs[caja.key_box]} />
                      </div>
                      <ModalTemp data={"Esta grafica representa los niveles de iluminación en el interior del contenedor, los contenedores usualmente se encuentran cerrados por lo que la presencia de luz es una anomalia que se busca detectar"} />
                    </div>
                    <div className='btn&chart'>
                      <div className="chart-container">
                        <Chart_coint  dates={userss.logs[caja.key_box]} />
                      </div>
                      <ModalTemp data={"Esta grafica muestra los el nivel de concentracion de Co2 en el ambiente. Unos niveles altos de estos gases pueden afectar la calidad de los productos, especialmente en frutas, pues acelera su maduración"} />
                    </div>
                    <div className='btn&chart'>
                      <div className="chart-container">
                        <Gauge  dates={userss.logs[caja.key_box]} />
                      </div>
                      <ModalTemp data={"Esta grafica muestra la carga de la bateria del sistema, ofreciendo información sobre su estado y duración. Fundamental para anticipar cuando se requerirá una recarga o reemplazo de la bateria."} />
                    </div>
                  </div>
                </div>
            </div>
            )}
          </div>
        ))}
      </div>
      {!userss && (
        <div className='Not_logged'>
          <p>You are not logged in</p>
          <div className='button-span'>
            <a href="/login"><button>Login</button></a>
            <a href="/register"><button>Register</button></a>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
