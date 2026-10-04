import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadTheme, saveTheme } from '../utils/storage';

export const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

export function applyThemeClass(theme) {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => loadTheme());

  // Aplicar classe inicial no mount (evita flash junto com o script no index.html)
  useEffect(() => {
    applyThemeClass(theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Atualizar classe e persistir quando o tema muda
  useEffect(() => {
    applyThemeClass(theme);
    saveTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      applyThemeClass(next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
