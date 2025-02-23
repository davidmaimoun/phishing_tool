import React from 'react';
import MyButton from './all/Button';
import logo from '../assets/logo1.webp'
import { Link } from 'react-router-dom';
import { User } from '../types/types';

interface HeaderProps {
  user: User|null
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="header">
      <div className="header-logo">
        <img src={logo} alt="Logo" className="header-logo-image" />
      </div>

      <nav className="nav">
        <a href="/scan" className="nav-link">Scan</a>
        <a href="/help" className="nav-link">Help</a>
      </nav>

      <div className="header-login">
      { user &&   
            <Link to={{ pathname:'/logout' }} >
            <MyButton label={'Logout'} color='secondary' variant='outlined'/>
          </Link>    
      }
      </div>
      
    </header>
  );
};

export default Header;
