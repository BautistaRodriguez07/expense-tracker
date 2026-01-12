"use client";

import { useEffect } from "react";

const FONT_SIZES_MOBILE = [10, 12, 16, 18];
const FONT_SIZES_DESKTOP = [14, 16, 18, 20];
const STORAGE_KEY = "font-size-preference";
const DEFAULT_SIZE_INDEX = 1; // M size by default

export const FontSizeInitializer = () => {
  useEffect(() => {
    // Function to apply font size based on screen width
    const applyFontSize = (index: number) => {
      const isMobile = window.innerWidth < 768;
      const fontSize = isMobile
        ? FONT_SIZES_MOBILE[index]
        : FONT_SIZES_DESKTOP[index];
      document.documentElement.style.fontSize = `${fontSize}px`;
    };

    // Load saved preference or apply default
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved !== null) {
      const savedValue = parseInt(saved, 10);
      applyFontSize(savedValue);
    } else {
      // Apply and save default size M
      applyFontSize(DEFAULT_SIZE_INDEX);
      localStorage.setItem(STORAGE_KEY, DEFAULT_SIZE_INDEX.toString());
    }

    // Handle window resize
    const handleResize = () => {
      const currentSaved = localStorage.getItem(STORAGE_KEY);
      if (currentSaved !== null) {
        applyFontSize(parseInt(currentSaved, 10));
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // This component doesn't render anything
  return null;
};
