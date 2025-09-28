import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      // Check localStorage first, then system preference, default to light
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        return savedTheme;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch (error) {
      console.warn('Error accessing localStorage or matchMedia:', error);
      return 'light';
    }
  });

  useEffect(() => {
    try {
      const root = window.document.documentElement;
      
      // Remove both classes first to avoid conflicts
      root.classList.remove('dark', 'light');
      
      // Add the current theme class
      root.classList.add(theme);
      
      // Save to localStorage
      localStorage.setItem('theme', theme);
      
      console.log('Theme changed to:', theme); // Debug log
    } catch (error) {
      console.warn('Error applying theme:', error);
    }
  }, [theme]);

  const toggleTheme = () => {
    console.log('Toggling theme from:', theme); // Debug log
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      console.log('New theme will be:', newTheme); // Debug log
      return newTheme;
    });
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
    isLight: theme === 'light',
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};