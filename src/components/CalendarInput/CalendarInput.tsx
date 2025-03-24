"use client";
// next
import { useState } from "react";
import { useRouter } from "next/navigation";

// heroui
import { I18nProvider } from "@react-aria/i18n";
import { today, getLocalTimeZone } from "@internationalized/date";
import {
  Button,
  Card,
  CardHeader,
  DateRangePicker,
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
      className={`w-full max-w-4xl mx-auto p-4 flex flex-col justify-center items-center ${className}`}
    >
      <CardHeader className="w-full flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">{title}</h1>
        <Button
          color="primary"
          startContent={<SearchIcon className="h-5 w-5" />}
          isIconOnly
          onPress={() =>
            router.replace(
              `${onSubmitRedirect}/?inicialDate=${value.start}&endDate=${value.end}`,
            )
          }
          className="ml-2"
        />
      </CardHeader>
      <Divider className="my-4" />

      <I18nProvider locale="pt-br">
        <div className="w-full">
          <RangeCalendar
            showMonthAndYearPickers
            aria-label="Date (Controlled)"
            value={value}
            onChange={setValue}
            className="flex w-full items-center justify-center max-h-[400px] sm:max-h-[500px] md:max-h-[600px] overflow-auto"
          />
        </div>
      </I18nProvider>
    </Card>
  );
};
