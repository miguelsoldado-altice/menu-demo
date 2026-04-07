"use client";

import React, { useEffect, useMemo } from "react";
import { Header } from "@ddg-frontend/header-footer/meo";
import { useQuery } from "@tanstack/react-query";
import { useIdentifiedUser } from "@/hooks/useIdentifiedUser";
import { getCampaigns, getHeader } from "@/menu/clientServices";
import configs from "@/menu/configs";
import { transformCampaigns, transformHeader } from "@/menu/menuUtils";
import { menuDetailsKeys } from "@/queryKeyFactory";
import type { HeaderProps } from "@ddg-frontend/header-footer/meo";

interface HeaderClientProps {
  siteContext: HeaderProps["siteContext"];
  environment: HeaderProps["environment"];
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ siteContext, environment }) => {
  const { data: headerData, isPending: isHeaderPending } = useQuery({
    queryKey: menuDetailsKeys.header(),
    queryFn: getHeader,
  });

  const { data: user } = useIdentifiedUser();
  const { data: campaigns } = useQuery({
    queryKey: menuDetailsKeys.campaigns(user?.NavId),
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

    const isellFrontEndUrl = configs.ISites.Configurations.ExternalSites.ISellFrontEnd.Url;

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

