"use client";

import { useEffect, useState, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RiFontSize } from "react-icons/ri";
import { useTranslations } from "next-intl";

const FONT_SIZES_MOBILE = [10, 12, 16, 18];
const FONT_SIZES_DESKTOP = [14, 16, 18, 20];
const STORAGE_KEY = "font-size-preference";

export const FontSizeSlider = () => {
  const t = useTranslations("settings");
  const [value, setValue] = useState<number[]>([1]);
  const [isMounted, setIsMounted] = useState(false);
  const fontSizeLabels = ["S", "M", "L", "XL"];

  // Function to apply font size based on screen width
  const applyFontSize = useCallback((index: number) => {
    const isMobile = window.innerWidth < 768;
    const fontSize = isMobile
      ? FONT_SIZES_MOBILE[index]
      : FONT_SIZES_DESKTOP[index];
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, []);

  // Load saved preference on mount
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      const savedValue = parseInt(saved, 10);
      setValue([savedValue]);
      applyFontSize(savedValue);
    }
  }, [applyFontSize]);

  // Handle value changes
  useEffect(() => {
    if (!isMounted) return;

    applyFontSize(value[0]);
    localStorage.setItem(STORAGE_KEY, value[0].toString());
  }, [value, isMounted, applyFontSize]);

  // Handle window resize
  useEffect(() => {
    if (!isMounted) return;

    const handleResize = () => {
      applyFontSize(value[0]);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [value, isMounted, applyFontSize]);

  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RiFontSize className="size-4" />
          <Label htmlFor="slider">{t("fontSize")}</Label>
        </div>
      </div>
      <Slider
        id="slider"
        max={3}
        min={0}
        onValueChange={setValue}
        step={1}
        value={value}
      />
      <div className="flex items-center justify-between text-muted-foreground text-xs">
        {fontSizeLabels.map(label => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
};
