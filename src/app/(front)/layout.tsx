// Tipos
import type { Metadata } from "next";

// Estilos
import "./globals.css";

// Pacotes de terceiros
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { ToastProvider } from "@heroui/toast";

//PWA PROVIDER
import { PwaInstallProvider } from "./components/Pwa/PwaInstallContext";
import { GoogleScripts } from "./Google/Script";
import { CookieConsentModal } from "./components/Modal/CookieModal/CookieModal";

export const metadata: Metadata = {
  title: "Não faltei",
  description: "Developed by Diogo Alberto",
  other: {
    "google-adsense-account": `${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT_METATAG}`,
    "apple-mobile-web-app-title": "Não Faltei",
    monetag: "18f53497b5fa6caba76711d892c33430",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <GoogleScripts />
      <CookieConsentModal />
      <body className={`relative`}>
        <PwaInstallProvider>
          <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="dark">
              <ToastProvider placement="top-right" />
              {children}
            </ThemeProvider>
          </SessionProvider>
        </PwaInstallProvider>
      </body>
    </html>
  );
}
