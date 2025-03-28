import { Chip } from "@heroui/react";

export const TypeRegisterChipLegend = () => {
  return (
    <div className="block sm:hidden">
      <h2 className="text-sm">Legenda:</h2>
      <TypeRegisterChip clockIn />
      <TypeRegisterChip clockIn={false} />
    </div>
  );
};
export const TypeRegisterChip = ({ clockIn }: { clockIn: boolean }) => {
  return (
    <Chip variant="flat" color={clockIn ? "success" : "danger"}>
      {clockIn ? "Entrada" : "Saída"}
    </Chip>
  );
};
