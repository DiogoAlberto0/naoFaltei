"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Link,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/react";
import { AvatarDropdown } from "./AvatarDropdown";

//pwa context
import { usePwaInstallContext } from "../Pwa/PwaInstallContext";

export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();
  const { setIsPwaInstallDismissed } = usePwaInstallContext();
  return (
    <Navbar position="static" onMenuOpenChange={setIsMenuOpen} isBordered>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
        <NavbarBrand>
          <p className="font-bold text-inherit">Não Faltei</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent as="div" justify="end">
        <AvatarDropdown />
      </NavbarContent>

      <NavbarMenu>
        <NavbarMenuItem key={`establishments`}>
          <Link
            className="w-full"
            color="primary"
            href="/manager/dashboard"
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
