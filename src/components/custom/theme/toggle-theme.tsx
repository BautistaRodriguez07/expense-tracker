"use client";

import * as React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export function ToggleTheme() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div className="relative inline-block w-14 h-7">
      <input
        type="checkbox"
        checked={isDark}
        onChange={toggleTheme}
        id="theme-switch"
        className="peer appearance-none w-full h-full bg-light rounded-full cursor-pointer transition-colors duration-300"
      />
      <label
        htmlFor="theme-switch"
        className="absolute top-0 left-0 w-7 h-7 btn-info rounded-full shadow-sm transition-transform duration-300 flex items-center justify-center peer-checked:translate-x-7 peer-checked:border-slate-800"
      >
        {isDark ? <Moon className="h-4 w-4 " /> : <Sun className="h-4 w-4" />}
      </label>
    </div>
  );
}
