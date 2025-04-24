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
    <div className={`flex items-center gap-2 ${className}`} {...otherProps}>
      <UserIcon className="w-4 h-4 text-zinc-500" />
      <span className="font-medium text-zinc-600 dark:text-zinc-300">
        Login:
      </span>
      <span className="text-zinc-800 dark:text-zinc-100">{username}</span>
    </div>
  );
};
