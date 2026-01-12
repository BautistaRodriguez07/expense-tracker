"use client";

import { useEffect, useState, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RiFontSize } from "react-icons/ri";
import { useTranslations } from "next-intl";

const FONT_SIZES_MOBILE = [10, 12, 16, 18];
const FONT_SIZES_DESKTOP = [14, 16, 18, 20];
const STORAGE_KEY = "font-size-preference";
const DEFAULT_SIZE_INDEX = 1; // M size by default

export const FontSizeSlider = () => {
  const t = useTranslations("settings");
  const [value, setValue] = useState<number[]>([DEFAULT_SIZE_INDEX]);
  const fontSizeLabels = ["S", "M", "L", "XL"];

  // Function to apply font size based on screen width
  const applyFontSize = useCallback((index: number) => {
    const isMobile = window.innerWidth < 768;
    const fontSize = isMobile
      ? FONT_SIZES_MOBILE[index]
      : FONT_SIZES_DESKTOP[index];
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, []);

  // Load current saved preference on mount (already initialized by FontSizeInitializer)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      setValue([parseInt(saved, 10)]);
    }
  }, []);

  // Handle value changes (only when user interacts with slider)
  const handleValueChange = useCallback(
    (newValue: number[]) => {
      setValue(newValue);
      applyFontSize(newValue[0]);
      localStorage.setItem(STORAGE_KEY, newValue[0].toString());
    },
    [applyFontSize]
  );

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
        onValueChange={handleValueChange}
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
