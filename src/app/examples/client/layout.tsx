import React from "react";
import { HeaderProps } from "@ddg-frontend/header-footer/meo";
import { Providers } from "@/app/providers";
import headerFooterConfig from "@/features/menu/config";
import { FooterClient } from "./footerClient";
import { HeaderClient } from "./headerClient";
import type { Metadata } from "next";

const siteContext = (headerFooterConfig.ISites.Configurations.Site?.Name || "MEO") as HeaderProps["siteContext"];
const environment = headerFooterConfig.Environment as HeaderProps["environment"];

export const metadata: Metadata = {
  title: "Menu Demo - Client",
};

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Providers>
      <HeaderClient siteContext={siteContext} environment={environment} />
      {children}
      <FooterClient siteContext={siteContext} />
    </Providers>
  );
};

export default ClientLayout;
