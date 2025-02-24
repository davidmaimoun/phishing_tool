import React from 'react';
import MyButton from './all/Button';
import logo from '../assets/logo1.webp'
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-logo">
        <img src={logo} alt="Logo" className="header-logo-image" />
      </div>

      <nav className="nav">
        <Link to='/dashboard' >
          <p className="nav-link">Dashboard</p>
        </Link>
        <Link to='/campaigns' >
          <p className="nav-link">Campaigns</p>
        </Link>
        {/* <p href="/help" className="nav-link">Help</p> */}
      </nav>

      <div className="header-login">
        <Link to='/logout' >
          <MyButton 
              label={'Logout'} 
              color='secondary'
              />
        </Link>
      </div>
    </header>
  );
};

export default Header;
