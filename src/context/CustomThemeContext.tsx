
import React, { createContext, useState, useEffect, useContext } from 'react';

type ThemeType = 'minimalist' | 'dark-delight' | 'playful' | 'futuristic' | 'nature';

interface CustomThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const CustomThemeContext = createContext<CustomThemeContextType>({
  theme: 'minimalist',
  setTheme: () => {},
});

export const useCustomTheme = () => useContext(CustomThemeContext);

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get the initial theme from localStorage if available
  const getInitialTheme = (): ThemeType => {
    const storedTheme = localStorage.getItem('customTheme') as ThemeType | null;
    return storedTheme || 'minimalist';
  };

  const [theme, setTheme] = useState<ThemeType>(getInitialTheme);

  // Effect to apply theme to document and store in localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('theme-minimalist', 'theme-dark-delight', 'theme-playful', 'theme-futuristic', 'theme-nature');
    
    // Add the current theme class
    root.classList.add(`theme-${theme}`);
    
    // Save to localStorage
    localStorage.setItem('customTheme', theme);
  }, [theme]);

  return (
    <CustomThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </CustomThemeContext.Provider>
  );
};
