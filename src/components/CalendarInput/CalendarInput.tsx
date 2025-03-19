"use client";
//next
import { useState } from "react";
import { useRouter } from "next/navigation";

//heroui
import { I18nProvider } from "@react-aria/i18n";
import { today, getLocalTimeZone } from "@internationalized/date";
import {
  Button,
  Card,
  CardHeader,
  Divider,
  RangeCalendar,
} from "@heroui/react";
import { SearchIcon } from "@/assets/icons/SearchIcon";

interface ICalendarInputProps {
  className?: string;
  title: string;
  onSubmitRedirect: string;
}
export const CalendarInput = ({
  title,
  className,
  onSubmitRedirect,
}: ICalendarInputProps) => {
  const [value, setValue] = useState({
    start: today(getLocalTimeZone()).set({ day: 0 }),
    end: today(getLocalTimeZone()).set({ day: 0 }).add({ months: 1 }),
  });

  const router = useRouter();
  return (
    <Card
      className={`w-full h-full flex justify-center items-center ${className}`}
    >
      <CardHeader className="flex justify-between items-center flex-1">
        <h1 className="text-lg">{title}</h1>
        <Button
          color="primary"
          startContent={<SearchIcon className="h-5 w-5" />}
          isIconOnly
          onPress={() =>
            router.replace(
              `${onSubmitRedirect}/${1}?inicialDate=${value.start}&endDate=${value.end}`,
            )
          }
        />
      </CardHeader>
      <Divider />
      <I18nProvider locale="pt-br">
        <RangeCalendar
          showMonthAndYearPickers
          aria-label="Date (Controlled)"
          value={value}
          onChange={setValue}
          // topContent={
          //   <div className="flex items-center p-2">
          //     <h1 className="text-lg">{title}</h1>
          //   </div>
          // }
          // bottomContent={
          //   <div className="flex p-2">
          //     <Button
          //       color="primary"
          //       className="w-full"

          //     >
          //       Buscar
          //     </Button>
          //   </div>
          // }
        />
      </I18nProvider>
    </Card>
  );
};
