import { Input } from "@heroui/input";
import { useState } from "react";
import { ISchedule } from "@/src/app/(front)/hooks/schedule/schedule.types";
import { weekDays, dateUtils } from "@/src/utils/date";

const englishDays: weekDays[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const ptDays = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

const TimePerDayInputs = ({
  prevSchedule,
}: {
  prevSchedule: ISchedule | undefined;
}) => {
  return (
    <section className="p-4 border-y flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Horas por dia</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {englishDays.map((day, index) => (
          <Input
            name={`${day}_minutes`}
            key={day}
            className="min-w-[120px]"
            label={ptDays[index]}
            type="time"
            isRequired
            defaultValue={
              prevSchedule && prevSchedule.type === "day"
                ? dateUtils.transformMinutesInTime(
                    prevSchedule.daily_minutes[day],
                    { variant: "clock" },
                  )
                : "08:00"
            }
          />
        ))}
      </div>
    </section>
  );
};

const TimePerWeekInputs = ({
  prevSchedule,
}: {
  prevSchedule: ISchedule | undefined;
}) => {
  const [weekTime, setWeekTime] = useState({
    hours:
      prevSchedule && prevSchedule.type === "week"
        ? Math.floor(prevSchedule.week_minutes / 60)
        : 0,
    minutes:
      prevSchedule && prevSchedule.type === "week"
        ? prevSchedule.week_minutes % 60
        : 0,
  });
  return (
    <section className="p-4 border-y flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Horas por semana</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Input
          type="hidden"
          name="week_minutes"
          value={String(weekTime.hours * 60 + weekTime.minutes)}
        />
        <Input
          type="number"
          label="Horas"
          min={0}
          max={168}
          value={weekTime.hours.toString()}
          onValueChange={(value) => {
            setWeekTime((prevState) => ({
              ...prevState,
              hours: Number(value),
            }));
          }}
          isRequired
          placeholder="Ex: 44"
        />
        <Input
          type="number"
          label="Minutos"
          min={0}
          max={59}
          value={weekTime.minutes.toString()}
          onValueChange={(value) => {
            setWeekTime((prevState) => ({
              ...prevState,
              minutes: Number(value),
            }));
          }}
          isRequired
          placeholder="Ex: 30"
        />
      </div>
    </section>
  );
};
export const TimeInputGroup = ({
  prevSchedule,
  type,
}: {
  type: "day" | "week";
  prevSchedule: ISchedule | undefined;
}) => {
  if (type === "day") return <TimePerDayInputs prevSchedule={prevSchedule} />;
  if (type === "week") return <TimePerWeekInputs prevSchedule={prevSchedule} />;
};
