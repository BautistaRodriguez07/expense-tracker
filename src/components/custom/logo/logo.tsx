"use client";

import { useTheme } from "next-themes";
import Image from "next/image";

export const Logo = () => {
  return (
    <div className="relative w-15 h-4 sm:w-22 sm:h-6 -my-2 sm:ml-8 ml-3">
      <Image
        src="/expensoLight.svg"
        alt="Expenso Logo"
        fill
        className="object-cover object-center scale-[1.8] "
        priority
      />
      <Image
        src="/expensoDark.svg"
        alt="Expenso Logo"
        fill
        className="object-cover object-center scale-[1.8] hidden dark:block"
        priority
      />
    </div>
  );
};

export default Logo;
