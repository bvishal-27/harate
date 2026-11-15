import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; // loads Tailwind + theme colors for the whole app
import App from "./App.tsx";
import { ThemeProvider } from "@/components/ThemeProvider";

// "!" tells TypeScript "I promise this element exists" (it does: it's in index.html).
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Everything inside ThemeProvider can use the theme */}
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);