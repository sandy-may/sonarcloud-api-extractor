import assert from "assert";
import { Sonar } from "./index.js";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const SONAR_TOKEN = process.env["SONAR_TOKEN"];
if (!SONAR_TOKEN) throw Error("SONAR_TOKEN environment variable not set");
const sonar = new Sonar();

let projectKeys: string[] = [];

try {
  const scriptPath = fileURLToPath(import.meta.url);
  const directoryPath = path.dirname(scriptPath);
  const configFilePath = path.join(directoryPath, "/config/config.json");
  const config = JSON.parse(readFileSync(configFilePath, { encoding: "utf8" }));

  assert(
    config.projectKeys,
    "Ensure there are project keys in the config file",
  );
  projectKeys = config.projectKeys;
} catch (error: any) {
  console.log(error.message);
  console.error(
    "Ensure you have a config.json file that follows the format in config-template.json",
  );
  process.exit();
}

projectKeys.forEach(async (projectKey) => {
  const hotspots = await sonar.getHotspotsByProject(
    projectKey,
    SONAR_TOKEN,
  );
  sonar.printHotspotData(hotspots, projectKey);

  const vulnerabilities = await sonar.getVulnerabilitiesByProject(
    projectKey,
    SONAR_TOKEN,
  );
  sonar.printVulnerabilityData(vulnerabilities, projectKey);
});
