"use client";

import { DetailedHTMLProps, HTMLAttributes, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowIcon } from "@/assets/icons/ArrowIcon";

interface IToggleMenuProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export const ToggleMenu = ({ children }: IToggleMenuProps) => {
  const [isOpenToggle, setIsOpenToggle] = useState(false);

  const route = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsOpenToggle(false);
  }, [route, searchParams]);

  return (
    <div
      className={`
        absolute z-30 bottom-0 sm:left-0 
        max-sm:w-full sm:h-full sm:flex-row
        flex flex-col-reverse
        rounded-t-xl sm:rounded-r-xl
        border border-default-200 dark:border-default-100
        bg-background bg-opacity-60 backdrop-blur-md shadow-xl
        transition-all duration-500 ease-in-out
        ${isOpenToggle ? "h-[90%] sm:w-[260px]" : "h-12 sm:w-12"}
      `}
    >
      {/* Conteúdo do menu (visível apenas quando aberto) */}
      <div className="h-full w-full overflow-auto px-2 py-4">
        {isOpenToggle && children}
      </div>

      {/* Botão toggle */}
      <button
        onClick={() => setIsOpenToggle((prev) => !prev)}
        className={`
          flex justify-center items-center
          w-full h-12 sm:w-12 sm:h-full
          border-t sm:border-t-0 sm:border-r border-default-200 dark:border-default-100
          bg-background bg-opacity-30 hover:bg-opacity-100
          transition-colors
        `}
      >
        <span
          className={`transition-transform duration-300 ease-in-out ${
            isOpenToggle
              ? "rotate-180 sm:rotate-[-90deg] max-sm:rotate-180"
              : "rotate-0 sm:rotate-90 max-sm:rotate-0"
          }`}
        >
          <ArrowIcon direction="top" />
        </span>
      </button>
    </div>
  );
};
