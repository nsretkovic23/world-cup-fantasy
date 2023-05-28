import UserProvider from "@/context/user-context";
import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/app/(components)/header";

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
        <body className={inter.className}>
          <Header/>
          {children}
        </body>
      </html>
    </UserProvider>
  );
}
