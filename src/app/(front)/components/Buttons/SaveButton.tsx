import { SaveIcon } from "@/assets/icons/SaveIcon";
import { Button, ButtonProps } from "@heroui/button";

export const SaveButton = (props: ButtonProps) => {
  return (
    <Button color="success" startContent={<SaveIcon />} {...props}>
      Salvar
    </Button>
  );
};
