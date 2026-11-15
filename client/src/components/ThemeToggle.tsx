import { Moon, Sun } from "lucide-react"; // icons (installed by shadcn)
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  const handleClick = () => {
    // Look at the page right now: is the "dark" class on <html>? Then switch to light, and vice versa.
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Button variant="outline" size="icon" onClick={handleClick} aria-label="Toggle theme">
      {/* "dark:hidden" = hide this icon in dark mode. "hidden dark:block" = show it only in dark mode. */}
      <Sun className="h-5 w-5 dark:hidden" />
      <Moon className="hidden h-5 w-5 dark:block" />
    </Button>
  );
}