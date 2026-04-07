"use client";

import { useQuery } from "@tanstack/react-query";
import { getIdentifiedUser } from "@/menu/clientServices";
import { menuDetailsKeys } from "@/queryKeyFactory";

export const useIdentifiedUser = () => {
  return useQuery({
    queryKey: menuDetailsKeys.identifiedUser(),
    queryFn: getIdentifiedUser,
    select: (data) => data.Result ?? undefined,
  });
};
