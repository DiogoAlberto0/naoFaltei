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
    <div
      className={`flex justify-center items-center gap-1 w-fit ${className}`}
      {...otherProps}
    >
      <EmailIcon className="h-5 w-5 stroke-primary-500" />
      <p className="text-small text-default-500">{email}</p>
    </div>
  );
};
