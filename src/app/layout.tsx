import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ToastProvider } from "@heroui/toast";
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={``}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <ToastProvider />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
