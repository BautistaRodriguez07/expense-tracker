import { CustomTitle } from "@/components";
import Link from "next/link";
import { IoChevronForward } from "react-icons/io5";

export default function NotFoundPage() {
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
          Vuelve al inicio
        </Link>
        <Link href="/" className="flex items-center gap-2 text-sm sm:text-md">
          Contacta al soporte
          <IoChevronForward />
        </Link>
      </div>
    </main>
  );
}
