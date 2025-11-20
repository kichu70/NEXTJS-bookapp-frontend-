import type { Metadata } from "next";
import "./style/globals.css";
import {AuthProvider} from "../lib/auth"
import { getCookie } from "@/lib/cookies/getCookie";
export const metadata: Metadata = {
  title: "Book app ",
  description: "Ansifs project",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieData = await getCookie()

  return (
    <html lang="en">
      <body>
        <AuthProvider cookieData={cookieData}>
        {children}
        </AuthProvider>
      </body>
    </html>
  );
}
