import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// A "type" with a fixed set of allowed texts. Any other text is a red error.
type Theme = "light" | "dark" | "system";

// The shape of what we share through the context: the current theme, and a function to change it.
interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// The key under which we save the choice in the browser's localStorage
const STORAGE_KEY = "harate-theme";

// A context starts empty ("undefined"). The Provider below fills it.
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Reads the saved theme. If nothing valid is saved (or storage is blocked), use "system".
function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    // localStorage can fail (private mode). Ignore it and use the default.
  }
  return "system";
}

// "children" = whatever we wrap inside <ThemeProvider> ... </ThemeProvider>
export function ThemeProvider({ children }: { children: ReactNode }) {
  // useState gives the component MEMORY. readStoredTheme runs only once, at the start.
  const [theme, setThemeState] = useState<Theme>(readStoredTheme);

  // useEffect runs code AFTER the screen is drawn, and again whenever "theme" changes.
  useEffect(() => {
    const root = document.documentElement; // the <html> tag
    const media = window.matchMedia("(prefers-color-scheme: dark)"); // the OS setting

    const applyTheme = () => {
      const isDark = theme === "dark" || (theme === "system" && media.matches);
      // Add the "dark" class when dark, remove it when light. Tailwind does the rest.
      root.classList.toggle("dark", isDark);
    };

    applyTheme();
    // If the user changes their OS theme while "system" is selected, follow it live.
    media.addEventListener("change", applyTheme);
    // The returned function is "cleanup": it removes the listener when theme changes.
    return () => media.removeEventListener("change", applyTheme);
  }, [theme]);

  const setTheme = (next: Theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, next); // remember the choice for next visit
    } catch {
      // Ignore storage errors
    }
    setThemeState(next); // updating state makes React re-run the effect above
  };

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

// A small helper hook so other components can write:  const { theme, setTheme } = useTheme();
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    // This catches a mistake: using useTheme outside of <ThemeProvider>
    throw new Error("useTheme must be used inside <ThemeProvider>");
  }
  return context;
}