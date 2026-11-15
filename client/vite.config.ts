import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Plugins add abilities to Vite: "react()" understands JSX, "tailwindcss()" builds Tailwind.
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      // Lets us write  import x from "@/components/..."  instead of "../../components/..."
      // "@" means "the src folder".
      "@": path.resolve(__dirname, "./src"),
    },
  },
});