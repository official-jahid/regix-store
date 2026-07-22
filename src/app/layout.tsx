import Header from "@/components/Header/Header";
import ThemeProvider from "@/components/Providers/ThemeProvider";
import { auth } from "@/lib/auth";
import { geistMono, geistSans } from "@/lib/fonts";
import { headers } from "next/headers";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

const RootLayout = async ({ children }: RootLayoutProps) => {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute={"class"}
          defaultTheme="dark"
          enableSystem={false}>
          <Header session={session as any} />
          <main className="mx-auto min-h-screen">{children}</main>
          <Toaster
            richColors
            position="top-right"
          />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
