"use client";
// next
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// heroui
import { I18nProvider } from "@react-aria/i18n";
import { today, getLocalTimeZone, CalendarDate } from "@internationalized/date";
import {
  addToast,
  Card,
  CardBody,
  CardHeader,
  DateRangePicker,
  RangeValue,
} from "@heroui/react";

//icons
import { SearchIconButton } from "../../Buttons/SearchIconButton";

const searchTimeSheet = (
  value: RangeValue<CalendarDate> | null,
  {
    router,
    onSubmitRedirect,
  }: { router: AppRouterInstance; onSubmitRedirect: string },
) => {
  if (!value)
    return addToast({
      title: "Datas Inválidas",
      description:
        "Selecione duas datas válidas para busca da filha de ponto do funcionário",
      color: "danger",
    });
  router.replace(
    `${onSubmitRedirect}/?inicialDate=${value.start}&endDate=${value.end}`,
  );
};

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
  const [value, setValue] = useState<RangeValue<CalendarDate> | null>({
    start: today(getLocalTimeZone()).set({ day: 0 }),
    end: today(getLocalTimeZone()).set({ day: 0 }).add({ months: 1 }),
  });

  const router = useRouter();

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
        <SearchIconButton
          onPress={() => searchTimeSheet(value, { router, onSubmitRedirect })}
        />
      </CardHeader>
      <CardBody>
        <I18nProvider locale="pt-br">
          <div className="w-full">
            <DateRangePicker
              label="Data inicial e data final: "
              value={value}
              onChange={setValue}
            />
          </div>
        </I18nProvider>
      </CardBody>
    </Card>
  );
};
