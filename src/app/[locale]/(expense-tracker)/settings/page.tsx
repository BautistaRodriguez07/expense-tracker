import { CustomTitle, ToggleTheme, UserAvatar } from "@/components";
import LocaleSwitcher from "@/components/custom/locale/LocaleSwitcher";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";

export default function SettingsPage() {
  const t = useTranslations("settings");
  return (
    <>
      <CustomTitle title={t("title")} tag="h1" className="py-3" />
      <CustomTitle
        title={t("account")}
        tag="h3"
        className="py-3 txt-muted text-xl"
      />

      {/* account information */}
      <div className="card-container">
        {/* image */}
        <div className="flex items-center justify-between text-lg">
          <p className="txt-muted">{t("image")}</p>
          <UserAvatar userName="David" />
        </div>
        <Separator className="my-5" />
        {/* name */}
        <div className="flex items-center justify-between text-lg">
          <p className="txt-muted">{t("name")}</p>
          <p className="font-semibold">User1</p>
        </div>
        {/* email */}
        <Separator className="my-5" />
        <div className="flex items-center justify-between text-lg">
          <p className="txt-muted">{t("email")}</p>
          <p className="font-semibold">test@google.com</p>
        </div>
      </div>

      {/* preferences */}
      <CustomTitle
        title="Preferences"
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
    </>
  );
}
