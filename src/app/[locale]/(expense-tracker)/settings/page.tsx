import { CustomTitle } from "@/components/custom/custom-title/custom-title";
import { ToggleTheme } from "@/components/custom/theme/toggle-theme";
import LocaleSwitcher from "@/components/custom/locale/locale-switcher";
import { Separator } from "@/components/ui/separator";
import { getTranslations } from "next-intl/server";
import { AccountInformation } from "@/features/user/components/account-information";
import { FontSizeSlider } from "@/components/custom/slider/font-size-slider";
import { CreateSpaceDialog } from "@/features/space/components/create-space-dialog";
import { SpaceList } from "@/features/space/components/space-list";
import { Suspense } from "react";
import { Loading } from "@/components";

export default async function SettingsPage() {
  const t = await getTranslations("settings");
  return (
    <div className="w-full items-center justify-center flex flex-col">
      <div className="md:w-2xl lg:w-3xl w-full ">
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

        {/* spaces section */}
        <CustomTitle
          title={t("spaces")}
          tag="h4"
          className="py-3 txt-muted text-xl"
        />
        <div className="card-container">
          <div className="flex justify-between items-center mb-4">
            <p className="txt-muted text-sm">{t("manageSpaces")}</p>
            <CreateSpaceDialog />
          </div>
          <Suspense fallback={<Loading />}>
            <SpaceList />
          </Suspense>
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
