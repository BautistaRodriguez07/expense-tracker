import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export const Footer = () => {
  const t = useTranslations("footer");
  return (
    <footer className="flex w-full justify-center text-xs py-5 ">
      <Link href="/">
        <span>Expenso </span>
        <span>&copy;{new Date().getFullYear()}</span>
      </Link>
      <Link href="/" className="mx-3 link underline">
        {t("footer")}
      </Link>
    </footer>
  );
};
