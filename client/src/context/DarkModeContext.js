import React, {useState} from 'react';

export const DarkModeContext = React.createContext();

export const DarkModeProvider = ({children}) => {
  const [isDarkMode, setDarkMode] = useState(null);

  return (
    <DarkModeContext.Provider value={{isDarkMode, setDarkMode}}>
      {children}
    </DarkModeContext.Provider>
  );
};
