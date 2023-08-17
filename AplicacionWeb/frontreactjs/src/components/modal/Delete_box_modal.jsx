import React, { useState } from 'react';
import httpClient from '../../httpClient';
import ModalComponent from './ModalComponent';

const DeleteBoxModal = ({ box_deleted, cliente }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(box_deleted);


    try {
      const response = await httpClient.post('//localhost:5000/deleteboxclient', {
        boxname: box_deleted,
        cliente: cliente
      });

      (response.data);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al eliminar la caja:', error);
    }


  };

  return (
    <div>
      <button className='modal-button' onClick={handleModalToggle}>
        Delete box
      </button>
      {isModalOpen && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <button className='modal-close' onClick={handleModalToggle}>
              X
            </button>
            <form onSubmit={handleSubmit}>
                <h1>ARE YOU SURE YOU WANT TO DELETE THIS BOX</h1>
                <br />
                <h1>{box_deleted}</h1>
                <h1>{cliente}</h1>
              <br />
              <br />
              <br />
              <button type="submit">Delete box</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteBoxModal;
