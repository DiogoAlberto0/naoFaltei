import { DetailedHTMLProps, HTMLAttributes } from "react";

import { AddressIcon } from "@/assets/icons/AddressIcon";
import { cepUtils } from "@/src/utils/cep";

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
    <div className={`flex items-center gap-2 ${className}`} {...otherProps}>
      <AddressIcon className="w-4 h-4 fill-zinc-500" />
      <span className="font-medium text-zinc-600 dark:text-zinc-300">CEP:</span>
      <span className="text-zinc-800 dark:text-zinc-100">
        {cepUtils.format(cep)}
      </span>
    </div>
  );
};
