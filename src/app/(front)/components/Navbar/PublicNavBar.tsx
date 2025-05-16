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
  NavbarMenuToggle,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";

// assets
import LogoName from "@/public/LogoName.svg";

//icons
import { ArrowIcon } from "@/assets/icons/ArrowIcon";

export const Logo = () => {
  return <Image height={32} src={LogoName} alt="Logomarca do aplicativo" />;
};

const DemoDropDown = () => {
  return (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <Button
            disableRipple
            className="p-0 bg-transparent data-[hover=true]:bg-transparent"
            endContent={<ArrowIcon direction="down" size={10} />}
            radius="sm"
            variant="light"
          >
            Demonstração
          </Button>
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu
        aria-label="Demo pages"
        itemClasses={{
          base: "gap-4",
        }}
      >
        <DropdownItem
          key="workerDemoPages"
          description="Páginas que serão vistas pelo funcionário"
          as="a"
          href="/worker?demo=true"
        >
          Funcionário
        </DropdownItem>
        <DropdownItem
          key="managerDemoPages"
          description="Páginas que serão vistas pelo gestor"
          as="a"
          href="/manager/dashboard?demo=true"
        >
          Gestor
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
const items = [
  { title: "Inicio", href: "/" },
  { title: "Sobre nós", href: "/aboutus" },
  { title: "Contate-nos", href: "/contactus" },
];

const NavBarItems = ({ currentPath }: { currentPath: string }) => {
  return (
    <>
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
      <DemoDropDown />
    </>
  );
};
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
      {/* Telas Maiores */}
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavBarItems currentPath={currentPath} />
      </NavbarContent>
      {/* Telas Menores */}
      <NavbarContent justify="end">
        <NavbarItem>
          <Button as={Link} color="primary" href="/signin" variant="flat">
            Entrar
          </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        <NavBarItems currentPath={currentPath} />
      </NavbarMenu>
    </Navbar>
  );
};
