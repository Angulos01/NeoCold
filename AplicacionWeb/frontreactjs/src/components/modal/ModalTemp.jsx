import React, { useState } from 'react';
import './modal.css';

const ModalTemp = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [info, setInfo] = useState(null);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
    setInfo(data);

  };
  return (
    <div className='modal-data'>
      <button className='modal-button' onClick={handleModalToggle}>
        Info
      </button>
      {isModalOpen && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <button className='modal-close' onClick={handleModalToggle}>
              X
            </button>
            <section className='modalText2'>
              <h1>
                {data}
              </h1>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalTemp;