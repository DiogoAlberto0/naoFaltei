import { DetailedHTMLProps, HTMLAttributes } from "react";

import { UserIcon } from "@/assets/icons/UserIcon";

interface IUserNameDataIconProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  username: string;
}
export const UserNameDataIcon = ({
  username,
  className,
  ...otherProps
}: IUserNameDataIconProps) => {
  return (
    <div
      className={`flex justify-center items-center gap-1 w-fit ${className}`}
      {...otherProps}
    >
      <UserIcon className="h-5 w-5 text-primary-500" />
      <p className="text-small text-default-500">{username}</p>
    </div>
  );
};
