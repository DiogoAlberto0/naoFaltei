import { DetailedHTMLProps, HTMLAttributes } from "react";

import { EmailIcon } from "@/assets/icons/EmailIcon";

interface IEmailDataIconProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  email: string;
}
export const EmailDataIcon = ({
  email,
  className,
  ...otherProps
}: IEmailDataIconProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`} {...otherProps}>
      <EmailIcon className="w-4 h-4 text-zinc-500" />
      <span className="font-medium text-zinc-600 dark:text-zinc-300">
        Email:
      </span>
      <span className="text-zinc-800 dark:text-zinc-100">{email}</span>
    </div>
  );
};
