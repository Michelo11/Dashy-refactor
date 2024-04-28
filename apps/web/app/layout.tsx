import { fontSans } from "@/config/fonts";
import { siteConfig } from "@/config/site";
import "@/styles/globals.css";
import clsx from "clsx";
import { Metadata, Viewport } from "next";
import Navbar from "../components/Navbar";
import { Providers } from "./providers";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "black" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head />
      <body
        suppressHydrationWarning={true}
        className={clsx(
          "min-h-screen bg-background font-sans antialiased default-dark",
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="lg:w-2/3 w-full relative flex flex-col mx-auto lg:px-0 px-3">
            <Navbar />
            <main>{children}</main>
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
