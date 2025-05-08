"use client";
import { DetailedHTMLProps, HTMLAttributes, useState } from "react";

//icons
import { CloseIcon } from "@/assets/icons/CloseIcon";
import { HamburguerMenuIcon } from "@/assets/icons/HamburguerMenu";

interface IToggleMenuProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const smallScreensStyles = `
        max-sm:h-14 max-sm:w-full
        max-sm:left-0 max-sm:bottom-0
`;
export const ToggleMenu = ({ children }: IToggleMenuProps) => {
  const [isOpenToggle, setIsOpenToggle] = useState(false);

  return (
    <div
      className={`
        absolute z-50
        bg-primary-200
        flex flex-col
        justify-center items-center

        ${smallScreensStyles}

        sm:flex-row-reverse
        sm:h-full ${isOpenToggle ? "sm:w-64" : "sm:w-14"}

        transition-all duration-500 ease-in-out
        
        ${isOpenToggle && "max-sm:h-[90%]"}
      `}
      onClick={() => setIsOpenToggle(!isOpenToggle)}
    >
      <div className="max-sm:h-14 max-sm:w-full  sm:h-full sm:w-14 flex justify-center items-center">
        {isOpenToggle ? (
          <CloseIcon size={32} className="animate-bounce" />
        ) : (
          <HamburguerMenuIcon size={32} className="animate-bounce" />
        )}
      </div>
      <div
        className={`h-full w-full overflow-auto px-2 py-4  ${isOpenToggle ? "flex" : "hidden"}`}
      >
        {isOpenToggle && children}
      </div>
    </div>
  );
};
