import React from "react";
import { HeaderProps } from "@ddg-frontend/header-footer/meo";
import type { Metadata } from "next";
import menuConfigs from "@/menu/configs";
import { Providers } from "../../providers";
import { FooterClient } from "./footerClient";
import { HeaderClient } from "./headerClient";
import "../../globals.scss";

const siteContext = (menuConfigs.ISites.Configurations.Site?.Name || "MEO") as HeaderProps["siteContext"];
const environment = menuConfigs.Environment as HeaderProps["environment"];

export const metadata: Metadata = {
  title: "Menu Demo - Client",
  icons: {
    icon: "https://conteudos.meo.pt/Style%20Library/consumo/images/favicons/favicon-32x32.png",
  },
};

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="pt">
      <body>
        <Providers>
          <HeaderClient siteContext={siteContext} environment={environment} />
          {children}
          <FooterClient siteContext={siteContext} />
        </Providers>
      </body>
    </html>
  );
};

export default ClientLayout;
