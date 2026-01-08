import { CustomTitle } from "@/components/custom/custom-title/custom-title";
import { ToggleTheme } from "@/components/custom/theme/toggle-theme";
import LocaleSwitcher from "@/components/custom/locale/locale-switcher";
import { Separator } from "@/components/ui/separator";
import { getTranslations } from "next-intl/server";
import { AccountInformation } from "@/features/user/components/account-information";
import { FontSizeSlider } from "@/components/custom/slider/font-size-slider";

export default async function SettingsPage() {
  const t = await getTranslations("settings");
  return (
    <div className="w-full items-center justify-center flex flex-col">
      <div className="md:w-2xl lg:w-3xl w-full">
        <CustomTitle title={t("title")} tag="h1" className="py-3" />
        <CustomTitle
          title={t("account")}
          tag="h3"
          className="py-3 txt-muted text-xl"
        />
        {/* account information */}
        <div className="card-container">
          <AccountInformation />
        </div>
        {/* preferences */}
        <CustomTitle
          title={t("preferences")}
          tag="h2"
          className="py-3 txt-muted text-xl"
        />
        <div className="card-container">
          {/* theme toggler */}
          <div className="flex items-center justify-between">
            <p className="txt">{t("theme")}</p>
            <ToggleTheme />
          </div>
          <Separator className="my-5" />
          {/* language switcher */}
          <div className="flex items-center justify-between">
            <p className="txt">{t("language")}</p>
            <LocaleSwitcher />
          </div>
          <Separator className="my-5" />
          {/* font size slider */}
          <div className="flex items-center justify-between">
            <p className="txt">{t("fontSize")}</p>
            <FontSizeSlider />
          </div>
        </div>
      </div>
    </div>
  );
}
