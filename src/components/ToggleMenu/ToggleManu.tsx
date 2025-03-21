"use client";
import { DetailedHTMLProps, HTMLAttributes, useState } from "react";

// hero ui components

// icons
import { ArrowIcon } from "@/assets/icons/ArrowIcon";

export const ToggleMenu = ({
  children,
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  const [isOpenToggle, setIsOpenToggle] = useState(true);

  return (
    <div
      className={`
        border-small border-default-200 dark:border-default-100 rounded-r-small
        bg-primary bg-opacity-50 hover:bg-opacity-90
        absolute z-20 bottom-0
        max-sm:w-full
        flex flex-col-reverse
        sm:h-[calc(100vh-4rem)] sm:flex-row
        transition-all duration-500 ease-in-out 
        ${isOpenToggle ? "h-[calc(100vh-4rem)] sm:w-[250px]" : "h-12 sm:w-12"}
        `}
    >
      {isOpenToggle && children}
      <button
        onClick={() => setIsOpenToggle(!isOpenToggle)}
        className=" flex justify-center items-center w-full h-12 sm:h-full sm:w-12"
      >
        {isOpenToggle ? (
          <>
            <ArrowIcon direction="down" className="sm:hidden" />
            <ArrowIcon direction="left" className="max-sm:hidden" />
          </>
        ) : (
          <>
            <ArrowIcon direction="top" className="sm:hidden" />
            <ArrowIcon direction="right" className="max-sm:hidden" />
          </>
        )}
      </button>
    </div>
  );
};
