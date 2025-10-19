import React from 'react';
import Logo from '../../atoms/Logo/Logo';
import NavigationMenu from '../../molecules/NavigationMenu/NavigationMenu';
import './Header.css';

const Header = () => {
  return (
    <header className="site-header">
      <div className="header-content">
        <Logo />
        <NavigationMenu />
      </div>
    </header>
  );
};

export default Header;