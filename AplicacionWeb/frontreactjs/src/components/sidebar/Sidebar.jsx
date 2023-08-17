import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import './sidebar.scss';
import httpClient from '../../httpClient';

const logOutUser = async () => {
    await httpClient.post("//127.0.0.1:5000/logout");
    localStorage.setItem('userParams', null);
    window.location.href = "/";
  };

const sidebarNavItems = [
    {
        display: 'Dashboard',
        icon: <i className='bx bx-home'></i>,
        to: '/',
        section: ''
    },
    {
        display: 'Alerts',
        icon: <i className='bx bx-home'></i>,
        to: '/alerts',
        section: 'alerts'
    },
    {
        display: 'Tables',
        icon: <i className='bx bx-star'></i>,
        to: '/tables',
        section: 'tables'
    },
    {
        display: 'About us',
        icon: <i className='bx bx-user'></i>,
        to: '/about',
        section: 'about'
    }
]

const Sidebar = ({user}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [stepHeight, setStepHeight] = useState(0);
    const sidebarRef = useRef();
    const indicatorRef = useRef();
    const location = useLocation();

    useEffect(() => {
        setTimeout(() => {
            const sidebarItem = sidebarRef.current.querySelector('.sidebar__menu__item');
            indicatorRef.current.style.height = `${sidebarItem.clientHeight}px`;
            setStepHeight(sidebarItem.clientHeight);
        }, 50);
    }, []);

    // change active index
    useEffect(() => {
        const curPath = window.location.pathname.split('/')[1];
        const activeItem = sidebarNavItems.findIndex(item => item.section === curPath);
        setActiveIndex(curPath.length === 0 ? 0 : activeItem);
    }, [location]);

    return <div className='sidebar'>
        <div className="sidebar__logo">
            NeoCold
        </div>
        <div ref={sidebarRef} className="sidebar__menu">
            <div
                ref={indicatorRef}
                className="sidebar__menu__indicator"
                style={{
                    transform: `translateX(-50%) translateY(${activeIndex * stepHeight}px)`
                }}
            ></div>
            {
                sidebarNavItems.map((item, index) => (
                    <Link to={{ pathname: item.to, state: { user: user } }} key={index}>
                        <div className={`sidebar__menu__item ${activeIndex === index ? 'active' : ''}`}>
                            <div className="sidebar__menu__item__icon">
                                {item.icon}
                            </div>
                            <div className="sidebar__menu__item__text">
                                {item.display}
                            </div>
                        </div>
                    </Link>
                ))
            }
            <br /><br /><br /><br />
            <div className="logout-container">
                <button onClick={logOutUser}>Logout</button>
            </div>
        </div>
    </div>;
};

export default Sidebar;
