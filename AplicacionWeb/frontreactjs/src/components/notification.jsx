import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Notifications = ({ logs }) => {
  const notify = (caja) => {
    toast.error(`Se ha excedido el límite de temperatura dentro de: ${caja}`, {
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
  
  if (logs) {
    for (const logKey in logs) {
      if (logs.hasOwnProperty(logKey)) {
        logs[logKey].forEach((log, index) => {
          if (log.temperatura_actual > 30.4) {
            notify(logKey);
          }
        });
      }
    }
  }

  return null; // El componente no renderiza nada visible
};

export default Notifications;
