import type { Metadata, Viewport } from "next";
import "@fontsource/funnel-sans/400.css";
import "@fontsource/funnel-sans/500.css";
import "@fontsource/funnel-sans/600.css";
import "@fontsource/funnel-display/600.css";
import "@fontsource/unbounded/500.css";
import "@fontsource/unbounded/600.css";
import "@fontsource/unbounded/700.css";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: { default: "TownLoop", template: "%s · TownLoop" },
  description: "Lend, borrow and help out with verified neighbours in Elmina Valley.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F6F5F1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
