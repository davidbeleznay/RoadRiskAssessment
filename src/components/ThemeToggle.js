// src/components/ThemeToggle.js

import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { MdLightMode, MdDarkMode } from 'react-icons/md';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button 
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? <MdDarkMode /> : <MdLightMode />}
    </button>
  );
};

export default ThemeToggle;