import UserProvider from "@/context/UserContext";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "World Cup Fantasy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </UserProvider>
  );
}
