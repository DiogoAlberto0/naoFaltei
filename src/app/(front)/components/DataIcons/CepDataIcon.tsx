import { DetailedHTMLProps, HTMLAttributes } from "react";

import { AddressIcon } from "@/assets/icons/AddressIcon";

interface ICepDataIconProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  cep: string;
}
export const CepDataIcon = ({
  cep,
  className,
  ...otherProps
}: ICepDataIconProps) => {
  return (
    <div
      className={`flex justify-center items-center gap-1 w-fit ${className}`}
      {...otherProps}
    >
      <AddressIcon className="h-5 w-5 fill-primary-500" />
      <p className="text-small text-default-500">{cep}</p>
    </div>
  );
};
