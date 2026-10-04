import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadTheme, saveTheme } from '../utils/storage';

export const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => loadTheme());

  // Aplicar classe inicial no mount
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, []);

  // Atualizar classe quando o tema muda
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
    saveTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
