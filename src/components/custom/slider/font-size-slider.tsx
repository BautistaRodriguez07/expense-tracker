"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RiFontSize } from "react-icons/ri";
import { useTranslations } from "next-intl";

const FONT_SIZES = [14, 16, 18, 20];

export const FontSizeSlider = () => {
  const t = useTranslations("settings");
  const [value, setValue] = useState<number[]>([1]);
  const fontSizeLabels = ["S", "M", "L", "XL"];

  // change font size when value changes
  useEffect(() => {
    document.documentElement.style.fontSize = `${FONT_SIZES[value[0]]}px`;
  }, [value]);

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
