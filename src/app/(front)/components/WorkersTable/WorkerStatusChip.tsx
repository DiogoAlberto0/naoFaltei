import { Chip } from "@heroui/chip";

export const StatusChip = ({
  isWorking,
  responsive = false,
}: {
  isWorking: boolean;
  responsive?: boolean;
}) => (
  <Chip
    className="capitalize border-none gap-1 text-default-600"
    color={isWorking ? "success" : "danger"}
    size="sm"
    variant="dot"
  >
    <p className={`${responsive && "hidden sm:flex"}`}>
      {isWorking ? "Trabalhando" : "Ausente"}
    </p>
  </Chip>
);
