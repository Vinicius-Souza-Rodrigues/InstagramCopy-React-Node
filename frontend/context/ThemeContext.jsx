import { createContext, useContext, useEffect, useReducer, useState } from "react";

export const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

const THEME_CHANGE = "THEME_CHANGE";
const SET_THEME = "SET_THEME";

// hook reducer
const themeReducer = (state, action) => {
  switch (action.type) {
    case THEME_CHANGE:
      return state === "light" ? "dark" : "light";
    case SET_THEME:
      return action.payload;
    default:
      return state;
  }
};

const ThemeProvider = ({ children }) => {
  const [theme, dispatch] = useReducer(themeReducer, null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const verifyTheme = savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark"
    console.log(savedTheme)
    console.log(verifyTheme)
    dispatch({ type: SET_THEME, payload: verifyTheme });
    document.body.className = verifyTheme;
    setLoading(false);
  }, []);

  useEffect(() => {
    if (theme) {
      document.body.className = theme;
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    dispatch({ type: THEME_CHANGE });
  };

  // correcao do erro -FOUR-
  if (loading) return null;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeProvider }
