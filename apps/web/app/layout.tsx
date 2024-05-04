import Footer from "@/components/Footer";
import { ReactQueryClientProvider } from "@/components/ReactQueryClientProvider";
import { fontSans } from "@/config/fonts";
import { siteConfig } from "@/config/site";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/globals.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import clsx from "clsx";
import { Metadata, Viewport } from "next";
import { ToastContainer } from "react-toastify";
import Navbar from "../components/Navbar";
import { Providers } from "./providers";

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
    <ReactQueryClientProvider>
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
            <ToastContainer position="bottom-right" theme="colored"  />
            <ReactQueryDevtools buttonPosition="bottom-left" />
          </Providers>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
