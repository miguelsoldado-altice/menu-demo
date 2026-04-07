"use client";

import { Footer, HeaderProps } from "@ddg-frontend/header-footer/meo";
import { useQuery } from "@tanstack/react-query";
import { getFooter } from "@/menu/clientServices";
import { menuDetailsKeys } from "@/queryKeyFactory";

interface FooterClientProps {
  siteContext: HeaderProps["siteContext"];
}

export const FooterClient = ({ siteContext }: FooterClientProps) => {
  const { data: footerData, isPending } = useQuery({
    queryKey: menuDetailsKeys.footer(),
    queryFn: getFooter,
  });

  return <Footer {...footerData} siteContext={siteContext} skeleton={isPending} />;
};

