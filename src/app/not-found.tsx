import { CustomTitle } from "@/components";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { IoChevronForward } from "react-icons/io5";

export default function NotFoundPage() {
  const t = useTranslations("notFound");
  return (
    <main className="flex flex-col items-center justify-center h-screen text-center p-3">
      <CustomTitle
        title="Upss! Pagina no encontrada"
        tag="h1"
        className="text-3xl sm:text-5xl"
      />
      <CustomTitle
        title="Lo siento no encontramos la pagina que estas buscando"
        tag="h2"
        className="txt-muted text-xl sm:text-2xl pt-5"
      />

      <div className="m-10 flex items-center justify-center gap-x-6">
        <Link href="/" className="btn p-3 text-sm sm:text-md">
          {t("homeLink")}
        </Link>
        <Link href="/" className="flex items-center gap-2 text-sm sm:text-md">
          {t("contact")}
          <IoChevronForward />
        </Link>
      </div>
    </main>
  );
}
