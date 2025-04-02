import { EditIcon } from "@/assets/icons/EditIcon";
import { Button, ButtonProps } from "@heroui/button";

export const EditButton = ({ isIconOnly, ...props }: ButtonProps) => {
  return (
    <Button
      startContent={<EditIcon className="h-5 w-5 stroke-primary-500" />}
      isIconOnly={isIconOnly}
      {...props}
    >
      {!isIconOnly && "Editar"}
    </Button>
  );
};
