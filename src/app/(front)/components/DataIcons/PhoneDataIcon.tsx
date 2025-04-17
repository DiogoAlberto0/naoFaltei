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
    <div
      className={`flex justify-center items-center gap-1 w-fit ${className}`}
      {...otherProps}
    >
      <PhoneIcon className="h-5 w-5 fill-primary" />
      <p className="text-small text-default-500">{phoneUtils.format(phone)}</p>
    </div>
  );
};
