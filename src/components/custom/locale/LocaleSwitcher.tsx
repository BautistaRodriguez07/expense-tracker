"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";

interface SwitcherOptionProp {
  label: string;
  value: string;
  isActive: boolean;
  country: string;
}

function SwitcherOption({
  label,
  value,
  isActive,
  country,
}: SwitcherOptionProp) {
  return (
    <SelectItem
      className={cn("bg text-lg", isActive ? "font-semibold" : "txt-muted")}
      value={value}
    >
      <span className={`fi fi-${country} rounded-sm`} />
      {label}
    </SelectItem>
  );
}

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const t = useTranslations("locale");

  const LOCALE_OPTIONS = [
    { label: t("en"), value: "en" },
    { label: t("es"), value: "es" },
    { label: t("fr"), value: "fr" },
  ];

  const switchLocale = (newLocale: string) => {
    if (newLocale !== locale) {
      router.replace(pathname, { locale: newLocale });
      router.refresh();
    }
  };

  return (
    <>
      <Select value={locale} onValueChange={switchLocale}>
        <SelectTrigger className="text-lg font-semibold txt card-container">
          <SelectValue placeholder="language" />
        </SelectTrigger>
        <SelectContent className={cn("card-container ", "!p-1")}>
          {LOCALE_OPTIONS.map(({ value, label }) => (
            <SwitcherOption
              country=""
              key={value}
              value={value}
              label={label}
              isActive={value === locale}
            />
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
