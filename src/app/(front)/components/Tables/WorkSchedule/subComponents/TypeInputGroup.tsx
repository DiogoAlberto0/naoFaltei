import { Select, SelectItem, Alert, Input } from "@heroui/react";
import { Dispatch, SetStateAction } from "react";

export type ITypes = "nothing" | "day" | "week";
const types = {
  nothing: {
    label: "Sem escala fixa definida",
    description:
      "Escolha esta opção quando o funcionário não tiver uma escala fixa de trabalho. Serão registradas apenas as entradas e saídas, sem controle de banco de horas ou faltas automáticas.",
  },
  day: {
    label: "Horas diárias",
    description:
      "Ideal para funcionários com uma carga horária fixa por dia e folgas em dias específicos da semana. O sistema irá calcular automaticamente o banco de horas e possíveis faltas com base nas horas previstas para cada dia.",
  },
  week: {
    label: "Horas semanais",
    description:
      "Recomendada quando o funcionário tem uma carga horária semanal definida, mas com flexibilidade nos dias trabalhados. Ele pode compensar horas de um dia em outro. Caso não haja uma folga fixa, faltas precisarão ser registradas manualmente. O sistema atualiza banco de horas e faltas toda segunda-feira.",
  },
};
export const TypeInputGroup = ({
  selectedType,
  setSelectedType,
}: {
  selectedType: ITypes;
  setSelectedType: Dispatch<SetStateAction<ITypes>>;
}) => {
  return (
    <section className="p-4 border-y flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Tipo de escala</h2>
      <Input type="hidden" name="type" value={selectedType} />
      <Select
        isRequired
        selectedKeys={selectedType && [selectedType]}
        onSelectionChange={(keys) =>
          setSelectedType((keys.currentKey?.toString() as ITypes) || "nothing")
        }
        label="Tipo de escala"
        labelPlacement="outside"
        placeholder="Selecione o tipo de escala"
      >
        {Object.entries(types).map(([key, value]) => (
          <SelectItem key={key}>{value.label}</SelectItem>
        ))}
      </Select>
      {selectedType && (
        <Alert
          variant="solid"
          color="primary"
          title={types[selectedType].label}
          description={types[selectedType].description}
        />
      )}
    </section>
  );
};
