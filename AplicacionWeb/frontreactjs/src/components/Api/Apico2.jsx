import React from "react";

const ApiCoint = ({ responseData, onApiResponse }) => {
  // Llamar a la función onApiResponse con los datos de la respuesta de la API
  // Esto enviará los datos de vuelta a App.js
  if (responseData && onApiResponse) {
    onApiResponse(responseData);
  }

  // Filtrar y guardar solo los valores correspondientes a la clave "temperatura_actual" en un nuevo array
  const cointsActuales = responseData ? responseData.lista_datos.map(item => item.coint) : [];
  const cointsUnidas = cointsActuales.join(", ");
  console.log(cointsUnidas);
  return cointsUnidas
};

export default ApiCoint;