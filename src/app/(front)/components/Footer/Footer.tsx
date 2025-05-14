"use client";

import { EmailIcon } from "@/assets/icons/EmailIcon";
import { LinkedinIcon } from "@/assets/icons/LinkedinIcon";
import { WhatsAppIcon } from "@/assets/icons/WhatsAppIcon";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="w-full border-t py-6 bg-muted text-muted-foreground">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Logo e nome */}
        <div className="text-sm font-semibold tracking-wide">
          Não Faltei © {new Date().getFullYear()}
        </div>

        {/* Links de navegação */}
        <nav className="flex gap-6 text-sm">
          <Link href="/aboutus" className="hover:underline">
            Sobre
          </Link>
          <Link href="/contactus" className="hover:underline">
            Contato
          </Link>
          <Link href="/privacityPolitics" className="hover:underline">
            Privacidade
          </Link>
          <Link
            href="/privacityPolitics#cookiesPolitics"
            className="hover:underline"
          >
            Politica de cookies
          </Link>
          <Link
            href="/privacityPolitics#termsOfUse"
            className="hover:underline"
          >
            Termos de uso
          </Link>
        </nav>

        {/* Ícones sociais */}
        <div className="flex gap-4">
          <Link
            href="https://www.linkedin.com/in/diogo-alberto-fontes-2a233831a/"
            target="_blank"
            aria-label="GitHub"
          >
            <LinkedinIcon className="h-5 w-5 hover:text-foreground" />
          </Link>
          <Link
            href="mailto:contato@naofaltei.com.br"
            target="_blank"
            aria-label="Twitter"
          >
            <EmailIcon className="h-5 w-5 hover:text-foreground" />
          </Link>
          <Link
            href="https://wa.me/5561986548270"
            target="_blank"
            aria-label="LinkedIn"
          >
            <WhatsAppIcon className="h-5 w-5 hover:text-foreground" />
          </Link>
        </div>
      </div>
    </footer>
  );
};
