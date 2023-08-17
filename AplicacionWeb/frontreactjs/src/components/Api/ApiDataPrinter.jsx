import React from "react";

const ApiDataPrinter = ({ responseData, onApiResponse }) => {
  // Llamar a la función onApiResponse con los datos de la respuesta de la API
  // Esto enviará los datos de vuelta a App.js
  if (responseData && onApiResponse) {
    onApiResponse(responseData);
  }

  return (
    <div>
      <pre>{responseData ? JSON.stringify(responseData.lista_datos, null, 2) : ""}</pre>
    </div>
  );
};

export default ApiDataPrinter;
