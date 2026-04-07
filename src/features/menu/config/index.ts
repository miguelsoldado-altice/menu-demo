/* eslint-disable @typescript-eslint/no-require-imports */
import type menuProductionConfig from "./menu.production.json";

// setting the return type of this function to the production json configuration...
// it may be worth setting up a JSONSchema just to make sure all the configs have the same structure.
const loadConfig = (): typeof menuProductionConfig => {
  const environment = process.env.NEXT_PUBLIC_CONFIG_ENV || "production";
  try {
    return require(`./menu.${environment}.json`);
  } catch (error) {
    console.error(`Error loading configuration: ${error}`);
    return require("./menu.production.json");
  }
};

export default loadConfig();
