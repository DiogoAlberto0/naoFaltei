import { DeleteIcon } from "@/assets/icons/DeleteIcon";
import { Button, ButtonProps } from "@heroui/button";

export const DeleteIconButton = (props: ButtonProps) => {
  return (
    <Button
      color="danger"
      variant="flat"
      startContent={<DeleteIcon className="h-5 w-5" />}
      isIconOnly
      {...props}
    />
  );
};
