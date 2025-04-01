import { useSession } from "next-auth/react";
import {
  Dropdown,
  DropdownTrigger,
  Avatar,
  DropdownMenu,
  DropdownItem,
  Divider,
  Skeleton,
} from "@heroui/react";
import defaultAvatar from "@/assets/defaultAvatar.png";

import { signOut } from "next-auth/react";
import Image from "next/image";

export const AvatarDropdown = () => {
  const { data } = useSession();
  if (!data?.user) return <Skeleton className="flex rounded-full w-10 h-10" />;
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="secondary"
          name={data.user.name || undefined}
          src={data.user.image || undefined}
          size="sm"
          showFallback
          fallback={
            <Image alt="default user avatar" src={defaultAvatar}></Image>
          }
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <h2 className="font-semibold">logado como:</h2>
          <p className="font-semibold text-primary">{data?.user.name}</p>
        </DropdownItem>
        <DropdownItem key="email" className="h-14 gap-2">
          <h2 className="font-semibold">email:</h2>
          <p className="font-semibold text-primary">{data?.user.email}</p>
          <Divider />
        </DropdownItem>
        <DropdownItem key="logout" color="danger" onPress={() => signOut()}>
          Sair
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
