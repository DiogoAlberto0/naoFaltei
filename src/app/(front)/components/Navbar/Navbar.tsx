"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Link,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  NavbarProps,
} from "@heroui/react";
import { AvatarDropdown } from "./AvatarDropdown";

//pwa context
import { usePwaInstallContext } from "../Pwa/PwaInstallContext";

interface INavBarProps extends NavbarProps {}
export function NavBar({ ...otherProps }: INavBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();
  const { setIsPwaInstallDismissed } = usePwaInstallContext();

  const searchParams = useSearchParams();
  const demo = searchParams.get("demo");
  const isDemo = demo?.toString().toLowerCase() === "true";

  return (
    <Navbar
      position="static"
      onMenuOpenChange={setIsMenuOpen}
      isBordered
      {...otherProps}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
        <NavbarBrand>
          <p className="font-bold text-inherit">Não Faltei</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent as="div" justify="end">
        <AvatarDropdown isDemo={isDemo} />
      </NavbarContent>

      <NavbarMenu>
        <NavbarMenuItem key={`establishments`}>
          <Link
            className="w-full"
            color="primary"
            href={`/manager/dashboard${isDemo ? "?demo=true" : ""}`}
            size="lg"
          >
            Estabelecimentos
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            className="w-full"
            color="primary"
            size="lg"
            onPress={() => {
              setIsPwaInstallDismissed(false);
              router.refresh();
            }}
          >
            Habilitar Instalação
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
