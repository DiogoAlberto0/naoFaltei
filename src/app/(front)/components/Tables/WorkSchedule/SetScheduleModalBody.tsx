import { dateUtils } from "@/src/utils/date";
import { Input, Switch } from "@heroui/react";
import { ISchedule } from "./WorkSchedule";

const daysOfWeek = [
  { name: "Domingo", key: "sunday" },
  { name: "Segunda", key: "monday" },
  { name: "Terça", key: "tuesday" },
  { name: "Quarta", key: "wednesday" },
  { name: "Quinta", key: "thursday" },
  { name: "Sexta", key: "friday" },
  { name: "Sábado", key: "saturday" },
];

const WeekDayInputs = ({
  weekDay,
  name,
  switchState,
  onSwitchChange,
  isDisabled,
  isRequired,
  defaultBreakTime,
  defaultStartTime,
  defaultEndTime,
}: {
  weekDay: string;
  name: string;
  isRequired: boolean;
  isDisabled: boolean;
  switchState: boolean;
  defaultBreakTime: number;
  defaultStartTime: string | undefined;
  defaultEndTime: string | undefined;
  onSwitchChange: (key: string) => void;
}) => {
  return (
    <div className="border p-4 rounded-xl shadow-md space-y-2 bg-content2">
      <div className="flex justify-between items-center">
        <h2 className="text-md font-semibold">{name}</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm">Folga:</label>
          <Input
            name={`${weekDay}_dayoff`}
            type="hidden"
            value={switchState.toString()}
          />
          <Switch
            isSelected={switchState}
            onChange={() => onSwitchChange(weekDay)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          name={`${weekDay}_start`}
          label="Entrada"
          type="time"
          isDisabled={isDisabled}
          isRequired={isRequired}
          defaultValue={defaultStartTime}
        />
        <Input
          name={`${weekDay}_end`}
          label="Saída"
          type="time"
          isDisabled={isDisabled}
          isRequired={isRequired}
          defaultValue={defaultEndTime}
        />
        <Input
          name={`${weekDay}_break`}
          label="Descanso (min)"
          type="number"
          min={0}
          step={5}
          defaultValue={defaultBreakTime.toString()}
          isDisabled={isDisabled}
          isRequired={isRequired}
        />
      </div>
    </div>
  );
};

export const SetScheduleModalBody = ({
  workerId,
  daysOff,
  toggleDayOff,
  prevSchedule,
}: {
  workerId: string;
  daysOff: Record<string, boolean>;
  toggleDayOff: (key: string) => void;
  prevSchedule?: ISchedule;
}) => {
  return (
    <div className="space-y-6">
      <Input type="hidden" name="workerId" value={workerId} />
      {daysOfWeek.map(({ name, key }) => {
        const schedule = prevSchedule?.[key as keyof ISchedule];

        const getDefaultStartTime = () => {
          if (schedule) {
            const { hour: startHour, minute: startMinute } =
              dateUtils.convertTimeFromUTCtoLocale({
                hour: schedule.startHour,
                minute: schedule.startMinute,
              });
            return dateUtils.formatTime(startHour, startMinute);
          }
        };

        const getDefaultEndTime = () => {
          if (schedule) {
            const { hour: endHour, minute: endMinute } =
              dateUtils.convertTimeFromUTCtoLocale({
                hour: schedule.endHour,
                minute: schedule.endMinute,
              });
            return dateUtils.formatTime(endHour, endMinute);
          }
        };
        return (
          <WeekDayInputs
            key={key}
            weekDay={key}
            name={name}
            switchState={!!daysOff[key]}
            onSwitchChange={toggleDayOff}
            isDisabled={daysOff[key]}
            isRequired={!daysOff[key]}
            defaultStartTime={getDefaultStartTime()}
            defaultEndTime={getDefaultEndTime()}
            defaultBreakTime={schedule?.restTimeInMinutes ?? 0}
          />
        );
      })}
    </div>
  );
};
