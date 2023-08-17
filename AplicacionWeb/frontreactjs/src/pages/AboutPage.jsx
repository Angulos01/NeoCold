import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar/Sidebar';

const AboutPage = () => {
  return (
    <div className='everything'>
    <div className="company-section">
    <Sidebar/>
    <div className="content-section">
        <div className="about-page">
            <h2>About Us</h2>
            <p>Welcome to our company</p>
            <br />
            <p>The general objective of our project is to provide an efficient solution that allows the monitoring and control of the temperature and humidity in real time in cold rooms. The implementation of an autonomous and sustainable monitoring system seeks to guarantee the adequate conservation of the stored products and minimize the risk of losses.</p>
            <br /><br />
            <p>The cold room monitoring system is a solution designed to address the challenges of maintaining the integrity of products stored in cold environments, such as in the food or pharmaceutical industry. This system seeks to present a fundamental tool for the efficient supervision of temperature and humidity in these spaces, allowing to guarantee that the products are kept in optimal conservation conditions.</p>
            <br /><br />
            <p>This system is configured as an independent entity, with the ability to function autonomously without depending on other products. Its core purpose is to give users complete control over cold room conditions and provide real-time alerts when abnormal conditions are detected.</p>
        </div>
        <div className="team-members">
            <h2>Our Team</h2>
            <br />
            <ul className="member-list">
                <li>Diaz Azuara Erick Moises - Electronics engineer</li>
                <li>Galvez Silvas Angel - Web engineer</li>
                <li>Garcia Barron Esmeralda - Mobile engineer</li>
            </ul>
        </div>
    </div>
    </div>
    </div>
  );
};

export default AboutPage;