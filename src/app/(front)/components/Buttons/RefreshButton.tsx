//hero ui components
import { Button, ButtonProps } from "@heroui/button";

//icon
import { RefreshIcon } from "@/assets/icons/RefreshIcon";
export const RefreshIconButton = (props: ButtonProps) => {
  return (
    <Button size="sm" isIconOnly color="success" {...props}>
      <RefreshIcon className="stroke-current h-5 w-5" />
    </Button>
  );
};
