"use client";
import { DetailedHTMLProps, HTMLAttributes, useState } from "react";

// hero ui components

// icons
import { ArrowIcon } from "@/assets/icons/ArrowIcon";

interface IToggleMenuProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  hasHeader?: boolean;
}
export const ToggleMenu = ({
  children,
  hasHeader = false,
}: IToggleMenuProps) => {
  const [isOpenToggle, setIsOpenToggle] = useState(true);

  const height = hasHeader ? "[calc(100vh-4rem)]" : "screen";
  return (
    <div
      className={`
        border-small border-default-200 dark:border-default-100 rounded-r-small
        bg-primary bg-opacity-50 hover:bg-opacity-90
        absolute z-20 bottom-0
        max-sm:w-full
        flex flex-col-reverse
        sm:h-${height} sm:flex-row
        transition-all duration-500 ease-in-out 
        ${isOpenToggle ? `h-${height} sm:w-[250px]` : "h-12 sm:w-12"}
        `}
    >
      <div className="h-full w-full">{isOpenToggle && children}</div>
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
