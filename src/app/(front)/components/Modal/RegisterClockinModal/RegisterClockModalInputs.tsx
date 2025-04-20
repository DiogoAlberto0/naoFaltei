import { useState } from "react";

//components
import { AddIconButton } from "../../Buttons/AddIconButton";
import { DeleteIconButton } from "../../Buttons/DeleteIconButton";
import { RemoveIconButton } from "../../Buttons/RemoveIconButton";
import { DoubleSwitch } from "../../Inputs/DoubleSwitch";

//hero ui
import { I18nProvider } from "@react-aria/i18n";
import { Input, DatePicker } from "@heroui/react";

export const ClockInputs = ({
  groupId,
  onRemove,
}: {
  groupId: number;
  onRemove: () => void;
}) => {
  const [timeInputs, setTimeInputs] = useState([0]);
  const [counter, setCounter] = useState(1);
  const [isFirstEntry, setIsFirstEntry] = useState(true);

  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-content2 rounded-lg p-4 even:bg-content4">
      <div className="flex-1 space-y-4">
        <I18nProvider locale="pt-br">
          <DatePicker
            isRequired
            label="Data:"
            name={`clockGroup-${groupId}-day`}
          />
        </I18nProvider>

        <DoubleSwitch
          rightLabel="Entrada"
          leftLabel="Saída"
          title="O Primeiro registro é uma:"
          isSelected={isFirstEntry}
          onValueChange={setIsFirstEntry}
        />

        <Input
          type="hidden"
          name={`clockGroup-${groupId}-isFirstEntry`}
          value={String(isFirstEntry)}
        />

        <div className="flex flex-wrap items-center gap-2">
          {timeInputs.map((id, idx) => (
            <Input
              key={id}
              label={
                (isFirstEntry ? idx % 2 === 0 : idx % 2 !== 0)
                  ? "Entrada"
                  : "Saída"
              }
              variant={
                (isFirstEntry ? idx % 2 === 0 : idx % 2 !== 0)
                  ? "bordered"
                  : "underlined"
              }
              type="time"
              name={`clockGroup-${groupId}-time`}
            />
          ))}

          <RemoveIconButton
            onPress={() => setTimeInputs((prev) => prev.slice(0, -1))}
          />
          <AddIconButton
            onPress={() => {
              setCounter((prev) => prev + 1);
              setTimeInputs((prev) => [...prev, counter]);
            }}
          />
        </div>
      </div>
      <DeleteIconButton onPress={onRemove} />
    </div>
  );
};
