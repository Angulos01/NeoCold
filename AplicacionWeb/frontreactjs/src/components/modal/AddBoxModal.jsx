import React, { useState, useEffect } from 'react';
import httpClient from '../../httpClient';
import ModalComponent from './ModalComponent';

const AddBoxModal = ({ handleBoxAdded, cliente  }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [boxname, setBoxname] = useState('NCB');
  
  const [claveTransport, setClaveTransport] = useState('');
  const [matricula, setMatricula] = useState('');
  const [seguroVehiculo, setSeguroVehiuclo] = useState('');

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [last, setLast] = useState('');
  const [curp, setCurp] = useState('');
  const [rfc, setRfc] = useState('');
  const [social_service, setSocialService] = useState('');
  const [phone, setPhone] = useState('');
  const [companies, setCompanies] = useState([]);
  const [transportes, setTransportes] = useState([]);
  const [conductor, setConductor] = useState('');
  
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedTransport, setSelectedTransport] = useState("");
  const [selectedConductor, setSelectedConductor] = useState("");
  

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
    setBoxName('');
  };

  const handleBoxnameChange = (event) => {
    setBoxname(event.target.value);
  };
  const handleidChange = (event) => {
    setId(event.target.value);
  };
  const handlenameChange = (event) => {
    setName(event.target.value);
  };
  const handlelastChange = (event) => {
    setLast(event.target.value);
  };
  const handlecurpChange = (event) => {
    setCurp(event.target.value);
  };
  const handlerfcChange = (event) => {
    setRfc(event.target.value);
  };
  const handlesocial_serviceChange = (event) => {
    setSocialService(event.target.value);
  };
  const handlephoneChange = (event) => {
    setPhone(event.target.value);
  };
  const handleclavetransportChange = (event) => {
    setClaveTransport(event.target.value);
  };
  const handlematriculaChange = (event) => {
    setMatricula(event.target.value);
  };
  const handlesegurovehiculoChange = (event) => {
    setSeguroVehiuclo(event.target.value);
  };
  const handlecompanyChange = (event) => {
    setCompanies(event.target.value);
  };


  useEffect(() => {
    const fetchCompanies = async () => {
        try {
            const response = await httpClient.get("//localhost:5000/optioncompany"); // Cambia la URL a la ruta correcta de tu API
            setCompanies(response.data.listcompany);
        } catch (error) {
            console.error("Error fetching companies:", error);
        }
    };
    fetchCompanies();
}, []);


useEffect(() => {
  const fetchTransports = async () => {
      try {
          const response = await httpClient.get("//localhost:5000/transportList"); // Cambia la URL a la ruta correcta de tu API
          setTransportes(response.data.listaTransports);
      } catch (error) {
          console.error("Error fetching companies:", error);
      }
  };
  fetchTransports();
}, []);


useEffect(() => {
  const fetchConductors = async () => {
      try {
          const response = await httpClient.get("//localhost:5000/conductorList"); // Cambia la URL a la ruta correcta de tu API
          setConductor(response.data.listaConductors);
      } catch (error) {
          console.error("Error fetching companies:", error);
      }
  };
  fetchConductors();
}, []);


  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(boxname + cliente );


    try {
      const response = await httpClient.post('//localhost:5000/addboxtoclient', {

        boxname: boxname,
        claveTransport: claveTransport,
        seguroVehiculo: seguroVehiculo,
        matricula: matricula,
        id: id,
        name: name,
        last: last,
        curp: curp,
        rfc: rfc,
        social_service: social_service,
        phone: social_service,
        company: selectedCompany,
        conductor: selectedConductor,
        transport: selectedTransport,
        cliente: cliente,
      });

      (response.data);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al agregar la caja:', error);
    }


  };

  return (
    <div>
      <button className='modal-button' onClick={handleModalToggle}>
        Add box
      </button>
      {isModalOpen && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <button className='modal-close' onClick={handleModalToggle}>
              X
            </button>
            <form onSubmit={handleSubmit}>
                <h1>Data of the new box</h1>
                <br />
                <br />                
              <label className=''><h1>Serial</h1> </label>
              <label>Name box: </label><input type="text" value={boxname} onChange={handleBoxnameChange} /><br />
              <label></label><input type="hidden" value={cliente} onChange={handleBoxnameChange} readOnly/>

              <label><h1>Conductor</h1></label>
              <select id="" value={selectedConductor} onChange={(e) => setSelectedConductor(e.target.value)}
                >
                  <option value="">Select an existent Conductor</option>
                  {conductor.map((conductor, index) => (
                    <option value={conductor} key={index}>{conductor}</option>
                  ))}
                </select>
                <br /><br />
                {!selectedConductor ? (
                  <>
                    <label>ID: </label><input type="text" value={id} onChange={handleidChange} /><br />
                    <label>Name: </label><input type="text" value={name} onChange={handlenameChange} /><br />
                    <label>Last Name: </label><input type="text" value={last} onChange={handlelastChange} /><br />
                    <label>CURP: </label><input type="text" value={curp} onChange={handlecurpChange} /><br />
                    <label>RFC: </label><input type="text" value={rfc} onChange={handlerfcChange} /><br />
                    <label>Social Service: </label><input type="text" value={social_service} onChange={handlesocial_serviceChange} /><br />
                    <label>Phone Number: </label><input type="text" value={phone} onChange={handlephoneChange} /><br />
                  </>
                ) : null}

              <br />
              <label><h1>Company: </h1></label>
                <select id="" value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}
                >
                  <option value="">Select a company</option>
                  {companies.map((company, index) => (
                    <option value={company} key={index}>{company}</option>
                  ))}
                </select>
                    
                    {/* 
                    <select
                        value={selectedCompany}
                        onChange={(e) => setSelectedCompany(e.target.value)}
                        id=""
                    >
                        <option value="">Select a company</option>
                        {companies.map((company, index) => (
                            <option key={index} value={company}>
                                {company}
                            </option>
                        ))}
                    </select>
                    */}

              <label className=''><h1>Transport</h1></label>
              <select id="" value={selectedTransport} onChange={(e) => setSelectedTransport(e.target.value)}
                >
                  <option value="">Select an existent Transport</option>
                  {transportes.map((transporte, index) => (
                    <option value={transporte} key={index}>{transporte}</option>
                  ))}
                </select>
                <br /><br />
                {!selectedTransport ? (
                  <>
                    <label>Transport Key: </label>
                    <input type="text" value={claveTransport} onChange={handleclavetransportChange} /><br />
                    <label>Matricula: </label>
                    <input type="text" value={matricula} onChange={handlematriculaChange} /><br />
                    <label>Vehicule Insurance: </label>
                    <input type="text" value={seguroVehiculo} onChange={handlesegurovehiculoChange} /><br />
                  </>
                ) : null}
              <br />
              <br />
              <br />
              <button type="submit">Add box</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddBoxModal;

