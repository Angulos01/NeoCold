import React, { useState } from 'react';
import './modal.css';
import httpClient from '../../httpClient';

const ModalComponent = ({ client, hola, company }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [info, setInfo] = useState(null);



  const handleModalToggle = (item) => {
    setIsModalOpen(!isModalOpen);
    setInfo(item);
    setFormData({
      id: hola.id,
      name: hola.name,
      last: hola.last,
      phone: hola.phone,
      rfc: hola.rfc,
      curp: hola.curp,
      social_service: hola.social_service,
    });
  };

  const handleFieldChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = JSON.stringify(formData)

    try {
      const response = fetch('//127.0.0.1:5000/updconductor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      });
      if (response.ok) {
        const responseData = response.json();
        console.log('Respuesta del servidor:', responseData);
      } else {
        console.error('Error en la respuesta del servidor:', response.status);
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
    }
    setIsModalOpen(false)
    window.location.href = "/"
  };

  return (
    <div className='modal-data'>
      <button className='modal-button' onClick={() => handleModalToggle()}>
        Info
      </button>
      {isModalOpen && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <button className='modal-close' onClick={handleModalToggle}>
              X
            </button>
            <section className='modalText'>
              <p>Modify data of the conductor: </p><br />
              <form onSubmit={handleSubmit}>
                <div>
                  <label>User: </label>
                  <input type="text" value={client} readOnly />
                  <br />
                  <label>Company: </label>
                  <input type="text" value={company} readOnly />
                  <br />
                  <input type="hidden" value={formData.id} onChange={(e) => handleFieldChange('id', formData.id)} />
                  <label>Name: </label>
                  <input type='text' value={formData.name} onChange={(e) => handleFieldChange('name', e.target.value)} />
                  <label>Last name: </label>
                  <input type='text' value={formData.last} onChange={(e) => handleFieldChange('last', e.target.value)} />
                  <label>Phone: </label>
                  <input type='text' value={formData.phone} onChange={(e) => handleFieldChange('phone', e.target.value)} />
                  <br />
                  <label>CURP: </label>
                  <input type='text' value={formData.curp} onChange={(e) => handleFieldChange('curp', e.target.value)} />
                  <label>RFC: </label>
                  <input type='text' value={formData.rfc} onChange={(e) => handleFieldChange('rfc', e.target.value)} />
                  <label>Social Service: </label>
                  <input type='text' value={formData.social_service} onChange={(e) => handleFieldChange('social_service', e.target.value)} />
                  <button type='submit'>Modify data</button>
                </div>
              </form>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalComponent;

