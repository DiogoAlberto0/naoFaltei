import { Footer } from "../components/Footer/Footer";
import { PublicNavBar } from "../components/Navbar/PublicNavBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <PublicNavBar />
      {children}
      <Footer />
    </div>
  );
}
