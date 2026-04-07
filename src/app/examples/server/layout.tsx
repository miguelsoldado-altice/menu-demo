import React from "react";
import { Footer, HeaderProps } from "@ddg-frontend/header-footer/meo";
import { Providers } from "@/app/providers";
import headerFooterConfig from "@/features/menu/config";
import { getFooter, getHeader } from "@/features/menu/services/server";
import { HeaderClient } from "./headerClient";
import type { Metadata } from "next";

const siteContext = (headerFooterConfig.ISites.Configurations.Site?.Name || "MEO") as HeaderProps["siteContext"];
const environment = headerFooterConfig.Environment as HeaderProps["environment"];

export const metadata: Metadata = {
  title: "Menu Demo - Server",
};

const ServerLayout = async ({ children }: { children: React.ReactNode }) => {
  const [headerData, footerData] = await Promise.all([getHeader(), getFooter()]);

  return (
    <Providers>
      <HeaderClient headerData={headerData} siteContext={siteContext} environment={environment} />
      {children}
      <Footer {...footerData} siteContext={siteContext} />
    </Providers>
  );
};

export default ServerLayout;
