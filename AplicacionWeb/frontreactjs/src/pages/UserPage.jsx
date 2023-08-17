import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar/Sidebar';

const UserPage = () => {
  return (
    <div>
        <Sidebar/>
        <div className='Not_logged'>
          <p>User page</p>
        </div>
    </div>
  );
};

export default UserPage;