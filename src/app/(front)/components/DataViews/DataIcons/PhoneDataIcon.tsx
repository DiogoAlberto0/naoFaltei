import { DetailedHTMLProps, HTMLAttributes } from "react";

import { PhoneIcon } from "@/assets/icons/PhoneIcon";
import { phoneUtils } from "@/src/utils/phone";

interface IPhoneDataIconProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  phone: string;
}
export const PhoneDataIcon = ({
  phone,
  className,
  ...otherProps
}: IPhoneDataIconProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`} {...otherProps}>
      <PhoneIcon className="w-4 h-4 fill-zinc-500" />
      <span className="font-medium text-zinc-600 dark:text-zinc-300">
        Telefone:
      </span>
      <span className="text-zinc-800 dark:text-zinc-100">
        {phoneUtils.format(phone)}
      </span>
    </div>
  );
};
