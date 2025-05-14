"use client";
import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

// hero ui
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";

// assets
import LogoName from "@/public/LogoName.svg";

export const Logo = () => {
  return <Image height={32} src={LogoName} alt="Logomarca do aplicativo" />;
};

const items = [
  { title: "Inicio", href: "/" },
  { title: "Sobre nós", href: "/aboutus" },
  { title: "Contate-nos", href: "/contactus" },
  { title: "Demonstração", href: "/demo" },
];
export const PublicNavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const currentPath = usePathname();

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand as="a" href="/">
          <Logo />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {items.map(({ title, href }, index) => {
          return (
            <NavbarItem isActive={currentPath == href} key={index}>
              <Link
                aria-current={currentPath == href && "page"}
                color={currentPath !== href ? "foreground" : "primary"}
                href={href}
              >
                {title}
              </Link>
            </NavbarItem>
          );
        })}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button as={Link} color="primary" href="/signin" variant="flat">
            Entrar
          </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {items.map(({ title, href }, index) => {
          return (
            <NavbarMenuItem isActive={currentPath == href} key={index}>
              <Link
                aria-current={currentPath == href && "page"}
                color={currentPath !== href ? "foreground" : "primary"}
                href={href}
                className="w-full"
                size="lg"
              >
                {title}
              </Link>
            </NavbarMenuItem>
          );
        })}
      </NavbarMenu>
    </Navbar>
  );
};
