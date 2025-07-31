import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';

const lightTheme = {
  background: '#ffffff',
  cardBackground: '#f5f5f5',
  text: '#333333',
  secondaryText: '#666666',
  primary: '#e91e63',
  accent: '#ff4081',
  emergency: '#f44336',
  border: '#e0e0e0',
  success: '#4caf50',
  icon: '#666666',
};

const darkTheme = {
  background: '#121212',
  cardBackground: '#1e1e1e',
  text: '#ffffff',
  secondaryText: '#aaaaaa',
  primary: '#e91e63',
  accent: '#ff4081',
  emergency: '#f44336',
  border: '#333333',
  success: '#4caf50',
  icon: '#cccccc',
};

// Default theme context
const defaultTheme = {
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
};

export const ThemeContext = createContext(defaultTheme);

// ThemeProvider component
export const ThemeProvider = ({ children }) => {
  const colorScheme = Appearance.getColorScheme();
  const [isDark, setIsDark] = useState(colorScheme === 'dark');
  const [theme, setTheme] = useState(isDark ? darkTheme : lightTheme);

  // Automatically listen to system appearance change
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      const dark = colorScheme === 'dark';
      setIsDark(dark);
      setTheme(dark ? darkTheme : lightTheme);
    });

    return () => subscription.remove();
  }, []);

  const toggleTheme = () => {
    const dark = !isDark;
    setIsDark(dark);
    setTheme(dark ? darkTheme : lightTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to access theme
export const useTheme = () => useContext(ThemeContext);
