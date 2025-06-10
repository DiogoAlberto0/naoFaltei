import { Alert } from "@heroui/alert";
import { Checkbox, CheckboxGroup, Input } from "@heroui/react";
import { useState } from "react";

import { ISchedule } from "@/src/app/(front)/hooks/schedule/schedule.types";

const englishDays = [
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
export const DayOffInputGroup = ({
  prevSchedule,
}: {
  prevSchedule: ISchedule | undefined;
}) => {
  const [selectedDayOff, setSelectedDayOff] = useState<string[]>(
    prevSchedule ? [...prevSchedule.daysOff] : [],
  );

  const [isFlexibleDayOff, setIsFlexibleDayOff] = useState(false);
  return (
    <section className="p-4 border-y flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Folgas</h2>

      <Input
        type="hidden"
        name="daysOff"
        value={JSON.stringify(selectedDayOff)}
      />
      <Checkbox
        size="lg"
        onValueChange={(isSelected) => {
          setIsFlexibleDayOff(isSelected);
          setSelectedDayOff(isSelected ? englishDays : []);
        }}
        isSelected={isFlexibleDayOff}
      >
        Não possui folgas fixas
      </Checkbox>
      {isFlexibleDayOff && (
        <Alert
          color="warning"
          title="As faltas precisarão ser registradas manualmente."
        />
      )}
      <CheckboxGroup
        color="secondary"
        value={selectedDayOff}
        onValueChange={setSelectedDayOff}
        label="Selecione os dias de folga"
        size="lg"
        orientation="horizontal"
        isDisabled={isFlexibleDayOff}
      >
        {englishDays.map((day, index) => (
          <Checkbox key={index} value={day}>
            {ptDays[index]}
          </Checkbox>
        ))}
      </CheckboxGroup>
    </section>
  );
};
