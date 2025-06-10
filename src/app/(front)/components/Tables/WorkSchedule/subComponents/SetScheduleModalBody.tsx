import { useState } from "react";
import { DayOffInputGroup } from "./DayOffsInputGroup";
import { TimeInputGroup } from "./TimeInputGroup";
import { ITypes, TypeInputGroup } from "./TypeInputGroup";
import { ISchedule } from "@/src/app/(front)/hooks/schedule/schedule.types";

export const SetScheduleModalBody = ({
  prevSchedule,
}: {
  prevSchedule: ISchedule | undefined;
}) => {
  const [selectedType, setSelectedType] = useState<ITypes>(
    prevSchedule && prevSchedule.type != "month"
      ? prevSchedule.type
      : "nothing",
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Escala de trabalho</h1>

      {/* Tipo de escala */}
      <TypeInputGroup
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />

      {selectedType !== "nothing" && (
        <>
          <DayOffInputGroup prevSchedule={prevSchedule} />
          <TimeInputGroup prevSchedule={prevSchedule} type={selectedType} />
        </>
      )}
    </div>
  );
};
