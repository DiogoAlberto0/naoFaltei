"use client";
// next

// heroui
import { I18nProvider } from "@react-aria/i18n";
import { Card, CardBody, CardHeader, DateRangePicker } from "@heroui/react";
import { today, getLocalTimeZone } from "@internationalized/date";

//icons
import { SearchIconButton } from "../../Buttons/SearchIconButton";

//hook
import { useCalendarInput } from "./useCalendarInput";

//utils
import { dateUtils } from "@/src/utils/date";

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
  const { dates, setDates, searchTimeSheet } =
    useCalendarInput(onSubmitRedirect);

  return (
    <Card className={`min-h-min ${className}`}>
      <CardHeader className="flex gap-2">
        <div className="flex-1">
          <h1 className="text-lg font-semibold">{title}</h1>
          <h2>
            Selecione um período com duas datas para visualizar a folha de
            ponto.
          </h2>
        </div>
        <SearchIconButton onPress={searchTimeSheet} />
      </CardHeader>
      <CardBody>
        <I18nProvider locale="pt-br">
          <div className="w-full">
            <DateRangePicker
              label="Data inicial e data final: "
              labelPlacement="outside"
              maxValue={today(getLocalTimeZone())}
              errorMessage={(value) => {
                if (value.validationDetails.rangeOverflow)
                  return "A data não pode ser maior que a data atual";
                if (value.isInvalid) return value.validationErrors;
              }}
              value={dates}
              onChange={setDates}
              validate={(value) => {
                if (
                  dateUtils.calculateFullDaysBetween(
                    new Date(value.start.toString()),
                    new Date(value.end.toString()),
                  ) >= 60
                )
                  return "O Período máximo para consulta é de 60 dias";
              }}
            />
          </div>
        </I18nProvider>
      </CardBody>
    </Card>
  );
};
