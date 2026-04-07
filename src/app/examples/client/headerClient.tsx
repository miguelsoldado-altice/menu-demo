"use client";

import React, { useEffect, useMemo } from "react";
import { Header } from "@ddg-frontend/header-footer/meo";
import { useQuery } from "@tanstack/react-query";
import headerFooterConfig from "@/features/menu/config";
import { useIdentifiedUser } from "@/features/menu/hooks/useIdentifiedUser";
import { headerFooterQueryKeys } from "@/features/menu/queryKeys";
import { getCampaigns, getHeader } from "@/features/menu/services/client";
import { transformCampaigns, transformHeader } from "@/features/menu/utils";
import type { HeaderProps } from "@ddg-frontend/header-footer/meo";

interface HeaderClientProps {
  siteContext: HeaderProps["siteContext"];
  environment: HeaderProps["environment"];
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ siteContext, environment }) => {
  const { data: headerData, isPending: isHeaderPending } = useQuery({
    queryKey: headerFooterQueryKeys.header(),
    queryFn: getHeader,
  });

  const { data: user } = useIdentifiedUser();
  const { data: campaigns } = useQuery({
    queryKey: headerFooterQueryKeys.campaigns(user?.NavId),
    queryFn: () => getCampaigns(user?.NavId),
    enabled: !!user?.NavId,
  });

  const headerWithUser = useMemo(() => {
    return transformHeader({ headerData, user });
  }, [headerData, user]);

  const transformedHeader = useMemo(() => {
    return campaigns ? transformCampaigns({ headerData: headerWithUser, campaigns }) : headerWithUser;
  }, [headerWithUser, campaigns]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isellFrontEndUrl = headerFooterConfig.ISites.Configurations.ExternalSites.ISellFrontEnd.Url;

    window.ISites = {
      Configurations: {
        ExternalSites: {
          ISellFrontEnd: {
            Url: isellFrontEndUrl,
          },
        },
      },
    };
  }, []);

  return (
    <Header {...transformedHeader} siteContext={siteContext} environment={environment} skeleton={isHeaderPending} />
  );
};
