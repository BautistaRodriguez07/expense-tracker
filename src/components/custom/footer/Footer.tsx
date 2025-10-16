import Link from "next/link";

export const Footer = () => {
  return (
    <div className="flex w-full justify-center text-xs my-5">
      <Link href="/">
        <span>Expenso </span>
        <span>&copy;{new Date().getFullYear()}</span>
      </Link>
      <Link href="/" className="mx-3 text-cyan-700">
        Privacy &amp; Legal
      </Link>
    </div>
  );
};
