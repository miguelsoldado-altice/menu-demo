import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: {
    default: "Header Footer Demo",
    template: "%s | Header Footer Demo",
  },
  description: "Reference implementations for server and client header-footer integration.",
  icons: {
    icon: "https://conteudos.meo.pt/Style%20Library/consumo/images/favicons/favicon-32x32.png",
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
