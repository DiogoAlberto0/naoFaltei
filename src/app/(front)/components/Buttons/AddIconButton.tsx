//hero ui components
import { Button, ButtonProps } from "@heroui/button";

//icon
import { AddIcon } from "@/assets/icons/AddIcon";
export const AddIconButton = (props: ButtonProps) => {
  return (
    <Button size="sm" isIconOnly color="success" {...props}>
      <AddIcon className="stroke-current h-5 w-5" />
    </Button>
  );
};
