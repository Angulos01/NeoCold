import React, { useEffect } from "react";

const ApiTemp = ({ responseData, onApiResponse }) => {
  useEffect(() => {
    // Llamar a la función onApiResponse con los datos de la respuesta de la API
    // Esto enviará los datos de vuelta a App.js
    if (responseData && onApiResponse) {
      onApiResponse(responseData);
    }
  }, [responseData, onApiResponse]);

  // Filtrar y guardar solo los valores correspondientes a la clave "temperatura_actual" en un nuevo array
  const temperaturasActuales = responseData
    ? responseData.lista_datos.map(item => parseFloat(item.temperatura_actual))
    : [];
  
  return (
    // Devolvemos los datos como un array de números entre corchetes para que se muestren correctamente en React
    <div>
      {JSON.stringify(temperaturasActuales)}
    </div>
  );
};

export default ApiTemp;

