import { SearchIcon } from "@/assets/icons/SearchIcon";
import { Button, ButtonProps } from "@heroui/button";

export const SearchIconButton = ({ ...props }: ButtonProps) => {
  return (
    <Button
      color="primary"
      startContent={<SearchIcon className="h-5 w-5" />}
      isIconOnly
      {...props}
    />
  );
};
