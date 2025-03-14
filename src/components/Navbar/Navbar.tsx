"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/react";
import { AvatarDropdown } from "./AvatarDropdown";
import { useState } from "react";

export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
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
          <Link className="w-full" color="primary" href="#" size="lg">
            Estabelecimentos
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
