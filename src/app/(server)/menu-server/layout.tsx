import React from "react";
import { Footer, Header, HeaderProps } from "@ddg-frontend/header-footer/meo";
import menuConfigs from "@/menu/configs";
import { getFooter, getHeader } from "@/menu/taxonomyServices";
import "../../globals.scss";

const siteContext = (menuConfigs.ISites.Configurations.Site?.Name || "MEO") as HeaderProps["siteContext"];
const environment = menuConfigs.Environment as HeaderProps["environment"];

const ServerLayout = async ({ children }: { children: React.ReactNode }) => {
  const [headerData, footerData] = await Promise.all([getHeader(), getFooter()]);

  return (
    <html lang="pt">
      <body>
        <Header {...headerData} siteContext={siteContext} environment={environment} />
        {children}
        <Footer {...footerData} siteContext={siteContext} />
      </body>
    </html>
  );
};

export default ServerLayout;
