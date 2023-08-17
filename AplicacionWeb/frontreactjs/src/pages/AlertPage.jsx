import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import httpClient from '../httpClient';
import { useLocation } from 'react-router-dom';
import GpsComponent from './GpsComponent';

const LimTemp = 30;
const LimHum = 30;
const LimLight = 500;

const logOutUser = async () => {
  await httpClient.post("//localhost:5000/logout");
  window.location.href = "/";
};


const AlertPage = () => {
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
            <h1 className='TableName'>Alerts</h1>
            <h1 className='TableName'>Temperatures</h1>
            <TempsLogs logs={user.logs} />
            <br /><br /><br /><br />
            <h1 className='TableName'>Humidity</h1>
            <HumLogs logs={user.logs} />
            <br /><br /><br /><br />
            <h1 className='TableName'>Light</h1>
            <LightLogs logs={user.logs} />
          </div>
        )}
        <br /><br /><br />
      </div>
    </div>
  );
};


const TempsLogs = ({ logs }) => {
  const filteredLogs = [];

  Object.entries(logs).forEach(([box, logsData]) => {
    logsData.forEach(log => {
      if (log.temperatura_actual >= LimTemp) {
        filteredLogs.push({
          box: log.box,
          temperatura_actual: log.temperatura_actual,
          time: log.time
        });
      }
    });
  });

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Box</th>
            <th>Temperature</th>
            <th>Date and time</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.map((log, index) => (
            <tr key={index}>
              <td>{log.box}</td>
              <td>{log.temperatura_actual}</td>
              <td>{log.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


const HumLogs = ({ logs }) => {
  const filteredLogs = [];

  Object.entries(logs).forEach(([box, logsData]) => {
    logsData.forEach(log => {
      if (log.humedad_actual >= LimHum) {
        filteredLogs.push({
          box: log.box,
          humedad_actual: log.humedad_actual,
          time: log.time
        });
      }
    });
  });

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Box</th>
            <th>Humidity</th>
            <th>Date and Time</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.map((log, index) => (
            <tr key={index}>
              <td>{log.box}</td>
              <td>{log.humedad_actual}</td>
              <td>{log.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


const LightLogs = ({ logs }) => {
  const filteredLogs = [];

  Object.entries(logs).forEach(([box, logsData]) => {
    logsData.forEach(log => {
      if (log.luz_photores >= LimLight) {
        filteredLogs.push({
          box: log.box,
          luz_photores: log.luz_photores,
          time: log.time
        });
      }
    });
  });

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Box</th>
            <th>Light</th>
            <th>Date and Time</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.map((log, index) => (
            <tr key={index}>
              <td>{log.box}</td>
              <td>{log.luz_photores}</td>
              <td>{log.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default AlertPage;
