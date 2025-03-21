import { DetailedHTMLProps, HTMLAttributes } from "react";

import { IdentityIcon } from "@/assets/icons/IdentityIcon";

interface ICpfDataIconProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  cpf: string;
}
export const CpfDataIcon = ({
  cpf,
  className,
  ...otherProps
}: ICpfDataIconProps) => {
  return (
    <div
      className={`flex justify-center items-center gap-1 w-fit ${className}`}
      {...otherProps}
    >
      <IdentityIcon className="h-5 w-5 text-primary-500 font-bold" />
      <p className="text-small text-default-500">{cpf}</p>
    </div>
  );
};
