import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

//heroui
import { RangeValue, CalendarDate } from "@heroui/calendar";
import { addToast } from "@heroui/toast";
import { today, getLocalTimeZone, parseDate } from "@internationalized/date";

//utils
import { dateUtils } from "@/src/utils/date";

export const useCalendarInput = (onSubmitRedirect: string) => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const inicialDateString = searchParams.get("inicialDate")?.toString();
  const finalDateString = searchParams.get("finalDate")?.toString();

  const [dates, setDates] = useState<RangeValue<CalendarDate> | null>({
    start: inicialDateString
      ? parseDate(inicialDateString)
      : today(getLocalTimeZone()).subtract({ months: 1 }),
    end: finalDateString
      ? parseDate(finalDateString)
      : today(getLocalTimeZone()),
  });

  const searchTimeSheet = () => {
    if (!dates)
      return addToast({
        title: "Datas Inválidas",
        description:
          "Selecione duas datas válidas para busca da filha de ponto do funcionário",
        color: "danger",
      });

    const inicialDate = new Date(dates.start.toString());
    const finalDate = new Date(dates.end.toString());

    if (
      inicialDate.getTime() > new Date().getTime() ||
      finalDate.getTime() > new Date().getTime()
    )
      return addToast({
        title: "A data para busca não pode ser maior que a data atual",
        description: `Altere as datas para uma data anterior a ${new Date().toLocaleDateString()}`,
        color: "danger",
      });

    const providedPeriod = dateUtils.calculateFullDaysBetween(
      inicialDate,
      finalDate,
    );
    if (providedPeriod > 60)
      return addToast({
        title: "O Período para busca deve ser inferior a 60 dias",
        description: `O período informado foi de ${providedPeriod} dias`,
        color: "danger",
      });

    router.replace(
      `${onSubmitRedirect}/?inicialDate=${dates.start}&endDate=${dates.end}`,
    );
  };

  return {
    searchTimeSheet,
    dates,
    setDates,
  };
};
