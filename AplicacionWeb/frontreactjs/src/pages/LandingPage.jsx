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
import { faChevronDown, faChevronUp, faL } from '@fortawesome/free-solid-svg-icons';
import AddBoxForm from '../components/AddBoxForm'; // Asegúrate de la ruta correcta del componente
import AddBoxModal from '../components/modal/AddBoxModal';
import DeleteBoxModal from '../components/modal/Delete_box_modal';
import ModalTemp from '../components/modal/ModalTemp';
import GpsModal from '../components/modal/GPS_modal';
import GpsModalAll from '../components/modal/GPSALL_Modal';
import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LimTemp = 26.5;
const LimHum = 50;
const LimLight = 3000;

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
  const [dataLoaded, setDataLoaded] = useState(false);
  

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
    //console.log(resp.data);
    // Guardar los parámetros en el almacenamiento local
    localStorage.setItem('userParams', JSON.stringify(params));
    setUser(resp.data);

  } else {
    // Crear el objeto de datos con los parámetros de usuario
    const userParams = JSON.parse(localStorage.getItem('userParams'));
    console.log('no')
    console.log(userParams)
    const resp = await httpClient.post("//127.0.0.1:5000/@me", userParams);
   // console.log(resp.data);
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


  /*--------Llamar alerta de acuerdo a la ----------*/
  useEffect(() => {
    if (userss && userss.logs) {
        setDataLoaded(true);

        for (const logKey in userss.logs) {
            if (userss.logs.hasOwnProperty(logKey)) {
                const logsArray = userss.logs[logKey];
                const lastLog = logsArray[logsArray.length - 1]; // Obtén el último log

                {/*
                console.log(`Logs de ${logKey}:`);
                logsArray.forEach((log, index) => {
                    console.log(log.temperatura_actual);
                });
                */}

                if (lastLog.temperatura_actual >= LimTemp) {
                    notify('temperature',logKey, lastLog.temperatura_actual);
                }
                if(lastLog.humedad_actual >= LimHum){
                  notify('humidity',logKey, lastLog.humedad_actual);
                }
                if(lastLog.luz_photores >= LimLight){
                  notify('light',logKey, lastLog.luz_photores);
                }
            }
        }

        setDataLoaded(false);
    }
}, [userss]);


/*--------------------*/
  const toggleBoxVisibility = () => {
    setIsBoxOpen(!isBoxOpen);
  };

  /*--------Funcion alerta temp----------*/
  const notify = (message ,caja, temp) => {
    toast.error(`An anomaly of ${message} was detected inside: ${caja} with a value of: ${temp}`,{
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });
};
console.log(userss);
  return (
    <div>
      <Sidebar user={userss}/>
      <div className='everything'>
      <br />
        <div className='BoxModal'>
          <AddBoxModal onBoxAdded={handleBoxAdded} cliente={userss && userss.user.number} />
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            />
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
                  <ModalComponent client={caja.client} hola={caja.transports.conductor} company={caja.transports.conductor.company} />
                  </section>
            </section>
          </section>

            {isBoxOpen && (
              <div>

                <div className="container">
                  <div className="grid-container">
                    <div className='btn&chart'>
                      <div className="chart-container">
                        <LineChart dates={userss.logs[caja.key_box]} lim={LimTemp} />
                      </div>
                      <ModalTemp data={"Temperature graph, the solid lines represent the evolution of the temperature of the container. The dashed line indicates the critical temperature limit, indicating the point before which the product risks being damaged."} />
                    </div>
                    <div className='btn&chart'>
                      <div className="chart-container">
                        <Chart_hum  dates={userss.logs[caja.key_box]} lim={LimHum} />
                      </div>
                      <ModalTemp data={"The humidity graph presents the variations in humidity levels over time. Each bar represents the humidity level within a specific period of time. The dotted line marks the critical limit of humidity."} />
                    </div>
                    <div className='btn&chart'>
                      <div className="chart-container">
                        <Chart_light  dates={userss.logs[caja.key_box]} lim={LimLight} />
                      </div>
                      <ModalTemp data={"This graph represents the lighting levels inside the container, the containers are usually closed, so the presence of light is an anomaly that is sought to be detected."} />
                    </div>
                    <div className='btn&chart'>
                      <div className="chart-container">
                        <Chart_coint  dates={userss.logs[caja.key_box]} />
                      </div>
                      <ModalTemp data={"This graph shows the level of Co2 concentration in the environment. High levels of these gases can affect the quality of the products, especially in fruits, since it accelerates their maturation."} />
                    </div>
                    <div className='btn&chart'>
                      <div className="chart-container">
                        <Gauge  dates={userss.logs[caja.key_box]} />
                      </div>
                      <ModalTemp data={"This graph shows the charge of the system battery, offering information about its status and duration. Fundamental to anticipate when a recharge or replacement of the battery will be required."} />
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
