import React, { useState } from 'react';
import httpClient from '../httpClient';

const AddBoxForm = ({ onBoxAdded }) => {
  const [boxName, setBoxName] = useState('');

  const handleInputChange = (event) => {
    setBoxName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Realizar el POST request al backend para agregar la nueva caja
      const response = await httpClient.post('//localhost:5000/addBox', {
        boxName: boxName,
      });

      // Llamar a la función de manejo después de agregar la caja para actualizar la lista de cajas del usuario
      onBoxAdded(response.data);
      // Limpiar el input después de agregar la caja
      setBoxName('');
    } catch (error) {
      console.error('Error al agregar la caja:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={boxName} onChange={handleInputChange} />
      <button type="submit">Agregar Caja</button>
    </form>
  );
};

export default AddBoxForm;
