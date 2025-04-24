import { DetailedHTMLProps, HTMLAttributes } from "react";

import { IdentityIcon } from "@/assets/icons/IdentityIcon";
import { cpfUtils } from "@/src/utils/cpf";

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
    <div className={`flex items-center gap-2 ${className}`} {...otherProps}>
      <IdentityIcon className="w-4 h-4 stroke-zinc-500" />
      <span className="font-medium text-zinc-600 dark:text-zinc-300">CPF:</span>
      <span className="text-zinc-800 dark:text-zinc-100">
        {cpfUtils.format(cpf)}
      </span>
    </div>
  );
};
