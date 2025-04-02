//hero ui components
import { Button, ButtonProps } from "@heroui/button";

//icon
import { FullScreenIcon } from "@/assets/icons/FullScreenIcon";
export const FullScreenIconButton = (props: ButtonProps) => {
  return (
    <Button
      startContent={<FullScreenIcon className="h-5 w-5" />}
      isIconOnly
      color="primary"
      {...props}
    />
  );
};
