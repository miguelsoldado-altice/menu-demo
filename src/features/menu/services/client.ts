import headerFooterConfig from "../config";
import { buildTaxonomyConfigs, resolveAppId, resolveSegment } from "../utils";
import type { FooterData, HeaderData } from "./server";

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

export const getCampaigns = async (navId: string | undefined) => {
  if (!navId) return null;

  const response = await fetch(headerFooterConfig.TaxonomyAPI.CampaignsEndpointUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ navId: navId, appId: resolveAppId() }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch campaigns data: ${response.statusText}`);
  }

  return await response.json();
};

export const getIdentifiedUser = async () => {
  const response = await fetch(headerFooterConfig.TaxonomyAPI.IdentifiedUserEndpointUrl, { credentials: "include" });

  if (!response.ok) {
    throw new Error(`Failed to fetch identified user data: ${response.statusText}`);
  }

  return await response.json();
};
