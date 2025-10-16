import Image from "next/image";
export const ExpensoLogo = () => {
  return (
    <div>
      <Image
        width={150}
        height={50}
        src="/expensoLogo.png"
        alt="logo"
        className="hidden sm:block"
      />
      <Image
        width={80}
        height={80}
        src="/expensoLogoMobile.png"
        alt="logo"
        className="sm:hidden flex"
      />
    </div>
  );
};
