//hero ui components
import { Button, ButtonProps } from "@heroui/button";

//icon
import { RemoveIcon } from "@/assets/icons/RemoveIcon";
export const RemoveIconButton = (props: ButtonProps) => {
  return (
    <Button size="sm" isIconOnly color="danger" {...props}>
      <RemoveIcon className="fill-current h-5 w-5" />
    </Button>
  );
};
