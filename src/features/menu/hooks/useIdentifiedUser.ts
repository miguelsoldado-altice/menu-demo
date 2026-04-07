"use client";

import { useQuery } from "@tanstack/react-query";
import { headerFooterQueryKeys } from "@/features/menu/queryKeys";
import { getIdentifiedUser } from "@/features/menu/services/client";

export const useIdentifiedUser = () => {
  return useQuery({
    queryKey: headerFooterQueryKeys.identifiedUser(),
    queryFn: getIdentifiedUser,
    select: (data) => data.Result ?? undefined,
  });
};
