import menuConfigs from "./configs";
import { resolveAppId } from "./menuUtils";

export const getCampaigns = async (navId: string | undefined) => {
  if (!navId) return null;

  const response = await fetch(menuConfigs.TaxonomyAPI.CampaignsEndpointUrl, {
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
  const response = await fetch(menuConfigs.TaxonomyAPI.IdentifiedUserEndpointUrl, { credentials: "include" });

  if (!response.ok) {
    throw new Error(`Failed to fetch identified user data: ${response.statusText}`);
  }

  return await response.json();
};
