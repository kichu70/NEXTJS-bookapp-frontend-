import type { Metadata } from "next";
import "./style/globals.css";
import {AuthProvider} from "../lib/auth"
export const metadata: Metadata = {
  title: "Book app ",
  description: "Ansifs project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
        {children}
        </AuthProvider>
      </body>
    </html>
  );
}
