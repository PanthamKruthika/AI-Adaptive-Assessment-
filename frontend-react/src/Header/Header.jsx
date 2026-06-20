import React from "react";
import Navbar from "./Navbar"; // Importing your new simplified Navbar

const Header = ({ onLogout }) => { 
  // Navigation items simplified to use standard paths
  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Subjects', path: '/subjects' },
    { label: 'Selection', path: '/assessment-selection' }, // Matched to your App.jsx routes
    { label: 'Assessment', path: '/assessment' }
  ];

  return (
    <header style={{ 
      position: 'fixed', 
      top: 0, 
      width: '100%', 
      zIndex: 2000, // High z-index to stay above background and content
      boxSizing: 'border-box'
    }}>
      <Navbar
        items={navItems}
        onLogout={onLogout} // Standard logout function
      />
    </header>
  );
};

export default Header;