"use client";

import { Footer, HeaderProps } from "@ddg-frontend/header-footer/meo";
import { useQuery } from "@tanstack/react-query";
import { headerFooterQueryKeys } from "@/features/menu/queryKeys";
import { getFooter } from "@/features/menu/services/client";

interface FooterClientProps {
  siteContext: HeaderProps["siteContext"];
}

export const FooterClient = ({ siteContext }: FooterClientProps) => {
  const { data: footerData, isPending } = useQuery({
    queryKey: headerFooterQueryKeys.footer(),
    queryFn: getFooter,
  });

  return <Footer {...footerData} siteContext={siteContext} skeleton={isPending} />;
};
