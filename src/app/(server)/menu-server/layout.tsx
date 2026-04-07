import React from "react";
import { Footer, HeaderProps } from "@ddg-frontend/header-footer/meo";
import menuConfigs from "@/menu/configs";
import { getFooter, getHeader } from "@/menu/taxonomyServices";
import { Providers } from "../../providers";
import { HeaderClient } from "../headerClient";
import type { Metadata } from "next";
import "../../globals.scss";

const siteContext = (menuConfigs.ISites.Configurations.Site?.Name || "MEO") as HeaderProps["siteContext"];
const environment = menuConfigs.Environment as HeaderProps["environment"];

export const metadata: Metadata = {
  title: "Menu Demo - Server",
  icons: {
    icon: "https://conteudos.meo.pt/Style%20Library/consumo/images/favicons/favicon-32x32.png",
  },
};

const ServerLayout = async ({ children }: { children: React.ReactNode }) => {
  const [headerData, footerData] = await Promise.all([getHeader(), getFooter()]);

  return (
    <html lang="pt">
      <body>
        <Providers>
          <HeaderClient headerData={headerData} siteContext={siteContext} environment={environment} />
          {children}
          <Footer {...footerData} siteContext={siteContext} />
        </Providers>
      </body>
    </html>
  );
};

export default ServerLayout;

