"use server";

import headerFooterConfig from "../config";
import { buildTaxonomyConfigs, resolveAppId, resolveSegment } from "../utils";
import type { FooterProps, HeaderProps } from "@ddg-frontend/header-footer/meo";

export type FooterData = Omit<FooterProps, "siteContext" | "useWrapper" | "skeleton">;
export type HeaderData = Omit<HeaderProps, "siteContext" | "useWrapper" | "skeleton">;

export const getHeader = async (): Promise<HeaderData> => {
  const appId = resolveAppId();
  const segment = resolveSegment(appId);
  const configs = buildTaxonomyConfigs();

  const response = await fetch(headerFooterConfig.TaxonomyAPI.HeaderEndpointUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ segment, appId, configs }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch header data: ${response.statusText}`);
  }

  return response.json();
};

export const getFooter = async (): Promise<FooterData> => {
  const appId = resolveAppId();
  const segment = resolveSegment(appId);

  const response = await fetch(headerFooterConfig.TaxonomyAPI.FooterEndpointUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ segment, appId, configs: {} }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch footer data: ${response.statusText}`);
  }

  return response.json();
};
