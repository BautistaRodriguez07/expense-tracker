import { CustomTitle, ToggleTheme } from "@/components";
import LocaleSwitcher from "@/components/custom/locale/locale-switcher";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";
import { AccountInformation } from "../../../../features/user/components/account-information";

export default function SettingsPage() {
  const t = useTranslations("settings");
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
          <div className="flex items-center justify-between">
            <p className="txt">{t("language")}</p>
            <LocaleSwitcher />
          </div>
        </div>
      </div>
    </div>
  );
}
