import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import httpClient from '../httpClient';
import { useLocation } from 'react-router-dom';
import GpsComponent from './GpsComponent';

const logOutUser = async () => {
  await httpClient.post("//localhost:5000/logout");
  window.location.href = "/";
};


const TablesPage = () => {
  const [user, setUser] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const fetchUserData = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {
      'username': urlParams.get("username"),
      'password': urlParams.get("password"),
    };

    if (params.username != null) {
      try {
        const resp = await httpClient.post("//127.0.0.1:5000/@me", params);
        setUser(resp.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    } else {
      const userParams = JSON.parse(localStorage.getItem('userParams'));
      try {
        const resp = await httpClient.post("//127.0.0.1:5000/@me", userParams);
        setUser(resp.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (user) {
      setDataLoaded(true);
    }
  }, [user]);

  useEffect(() => {
    if (dataLoaded) {
      // Now the user data is fully loaded, you can perform further actions
      console.log("User data loaded:", user);
      // For example, you can call functions or render components that depend on user data
    }
  }, [dataLoaded, user]);


  return (
    <div>
      <Sidebar />
      <div className='everything'>
        {user && (
          <div>
            <h1 className='TableName'>General Map</h1>
            <GpsComponent data={user.logs}/>
            <h1 className='TableName'>User</h1>
            <UserDataTable user={user.user} />
            <br /><br />
            <h1 className='TableName'>Boxes</h1>
            <BoxDataTable boxes={user.boxes} />
            <br /><br />
            <h1 className='TableName'>Logs</h1>
            <LogsDataTable logs={user.logs} />
            <br /><br /><br /><br /><br /><br /><br /><br />
            <h1 className='TableName'>Company</h1>
            <CompanyDataTable company={user.user.company} />
            <br /><br />
          </div>
        )}
        <br />
        <br />
        <br />
        <br />
      </div>
    </div>
  );
};

const BoxDataTable = ({ boxes }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Client</th>
          <th>Key Box</th>
          <th>Name</th>
          <th>Vehicule insurance</th>
          <th>Transport Key</th>
          <th>Conductor ID</th>
          <th>Conductor Name</th>
          <th>Conductor LastName</th>
          <th>Conductor Phone</th>
          <th>Conductor RFC</th>
          <th>Vehicule Registration</th>
        </tr>
      </thead>
      <tbody>
        {boxes.map((box) => (
          <tr key={box.key_box}>
            <td>{box.client}</td>
            <td>{box.key_box}</td>
            <td>{box.nombre}</td>
            <td>{box.transports.SeguroVehiculo}</td>
            <td>{box.transports.claveTransport}</td>
            <td>{box.transports.conductor.id}</td>
            <td>{box.transports.conductor.name}</td>
            <td>{box.transports.conductor.last}</td>
            <td>{box.transports.conductor.phone}</td>
            <td>{box.transports.conductor.rfc}</td>
            <td>{box.transports.matriculavehi}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const LogsDataTable = ({ logs }) => {
  return (
    <div>
      {Object.entries(logs).map(([box, logsData]) => (
        <div key={box}>
          <h1 className='TableName'>{box} Logs</h1>
          <table>
            <thead>
              <tr>
                <th>Box</th>
                <th>Coint</th>
                <th>Energy</th>
                <th>Actual Humidity</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Light</th>
                <th>Actual Temperature</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {logsData.map((log, index) => (
                <tr key={index}>
                  <td>{log.box}</td>
                  <td>{log.coint}</td>
                  <td>{log.energia}</td>
                  <td>{log.humedad_actual}</td>
                  <td>{log.latitud}</td>
                  <td>{log.longitud}</td>
                  <td>{log.luz_photores}</td>
                  <td>{log.temperatura_actual}</td>
                  <td>{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

const UserDataTable = ({ user }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Last name</th>
          <th>Age</th>
          <th>Birthday date</th>
          <th>Occupation</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{user.name}</td>
          <td>{user.last}</td>
          <td>{user.age}</td>
          <td>{user.birthdate}</td>
          <td>{user.occupation}</td>
        </tr>
      </tbody>
    </table>
  );
};


const CompanyDataTable = ({ company }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone number</th>
          <th>Address</th>
          <th>City</th>
          <th>Country</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{company.id}</td>
          <td>{company.nombre}</td>
          <td>{company.correo_electronico}</td>
          <td>{company.telefono}</td>
          <td>{company.direccion}</td>
          <td>{company.ciudad}</td>
          <td>{company.pais}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default TablesPage;
