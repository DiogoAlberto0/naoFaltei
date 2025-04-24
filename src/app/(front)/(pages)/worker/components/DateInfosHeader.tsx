"use client";
import { DetailedHTMLProps, HTMLAttributes } from "react";

// custom components
import { DateText } from "@/src/app/(front)/components/DataViews/Date/DateText";
import { WorkerLastRegisters } from "./WorkerLastRegisters";
import { HourText } from "@/src/app/(front)/components/DataViews/Date/HourText";

//hooks
import { useCurrentTime } from "./useCurrentTime";

interface IDateInfosHeader
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}
export const DateInfosHeader = ({
  className,
  ...otherProps
}: IDateInfosHeader) => {
  const { now, hour, minute, second } = useCurrentTime();

  const greetings = (date: Date, name: string) => {
    const hours = date.getHours();
    if (hours >= 5 && hours < 12) return `Bom dia, ${name}!`;
    else if (hours >= 12 && hours < 18) return `Boa tarde, ${name}!`;
    else return `Boa noite, ${name}!`;
  };
  return (
    <div
      className={`
       w-full
       p-2
       bg-primary bg-opacity-70 dark:bg-primary-100 dark:bg-opacity-70 text-white
       flex flex-col justify-center items-center 
       ${className}
    `}
      {...otherProps}
    >
      <h1 className="text-base">{greetings(now, "Diogo")}</h1>
      <HourText
        className="text-2xl font-bold"
        hour={hour}
        minute={minute}
        seconds={second}
      />
      <DateText isFullDate={true} date={now} />
      <WorkerLastRegisters />
    </div>
  );
};
