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

export const metadata: Metadata = {
  title: "Não faltei",
  description: "Developed by Diogo Alberto",
  other: {
    "google-adsense-account": `${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT_METATAG}`,
    "apple-mobile-web-app-title": "Não Faltei",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
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
