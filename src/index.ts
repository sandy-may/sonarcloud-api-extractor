import axios from "axios";
import { table } from "table";

export class Sonar {
  async getVulnerabilitiesByProject(
    projectKey: string,
    SONAR_TOKEN: string,
  ): Promise<Vulnerability[]> {
    const result = await axios.post(`${SONAR_URL}/issues/search`, null, {
      params: {
        componentKeys: `${projectKey}`,
        impactSoftwareQualities: "SECURITY",
      },
      headers: { Authorization: `Bearer ${SONAR_TOKEN}` },
    });
    if (result.data.paging.total > result.data.paging.pageSize) {
      console.log(result.data);
      throw Error("Response was paginated - this is not yet supported!");
    }
    const issues = result.data.issues as [];

    const vulnerabilities = issues.filter((issue: any) => {
      return issue.type === "VULNERABILITY";
    });

    return vulnerabilities.map((vulnerability: any) => {
      return {
        message: vulnerability.message,
        projectKey,
        severity: vulnerability.severity,
        creationDate: vulnerability.creationDate,
        status: vulnerability.status,
      };
    });
  }

  async getHotspotsByProject(
    projectKey: string,
    SONAR_TOKEN: string,
  ): Promise<Hotspot[]> {
    const result = await axios.post(
      `${SONAR_URL}/hotspots/search?projectKey=${projectKey}`,
      null,
      {
        params: { projectKey },
        headers: { Authorization: `Bearer ${SONAR_TOKEN}` },
      },
    );
    if (result.data.paging.total > result.data.paging.pageSize)
      throw Error("Response was paginated - this is not yet supported!");
    const hotspots = result.data.hotspots as [];

    return hotspots.map((hotspot: any) => {
      return {
        message: hotspot.message,
        projectKey,
        vulnerabilityProbability: hotspot.vulnerabilityProbability,
        creationDate: hotspot.creationDate,
        status: hotspot.status,
      };
    });
  }

  printHotspotData(data: Hotspot[], projectKey: string): void {
    const openVulnerabilities = data.filter((hotspot: Hotspot) => {
      return hotspot.status !== "REVIEWED";
    });

    const formattedVulnerabilities = openVulnerabilities.map((vulnerabilty) => {
      return [
        vulnerabilty.message,
        vulnerabilty.creationDate,
        vulnerabilty.vulnerabilityProbability,
        vulnerabilty.status,
      ];
    });
    if (formattedVulnerabilities.length === 0) {
      formattedVulnerabilities.push(["No open hotspots :) "]);
    } else
      formattedVulnerabilities.unshift([
        "Title",
        "Creation Data",
        "Probability",
        "status",
      ]);

    console.log(
      table(formattedVulnerabilities, {
        header: { alignment: "center", content: projectKey },
      }),
    );
  }

  printVulnerabilityData(data: Vulnerability[], projectKey: string): void {
    const openVulnerabilities = data.filter((vulnerability: Vulnerability) => {
      return vulnerability.status !== "RESOLVED";
    });

    const formattedVulnerabilities = openVulnerabilities.map((vulnerabilty) => {
      return [
        vulnerabilty.message,
        vulnerabilty.creationDate,
        vulnerabilty.severity,
        vulnerabilty.status,
      ];
    });
    if (formattedVulnerabilities.length === 0) {
      formattedVulnerabilities.push(["No open Vulnerabilities :) "]);
    } else
      formattedVulnerabilities.unshift([
        "Title",
        "Creation Data",
        "Severity",
        "status",
      ]);

    console.log(
      table(formattedVulnerabilities, {
        header: { alignment: "center", content: projectKey },
      }),
    );
  }
}

export interface Hotspot {
  projectKey: string;
  vulnerabilityProbability: string;
  creationDate: number;
  message: string;
  status: string;
}

export interface Vulnerability {
  projectKey: string;
  severity: string;
  creationDate: number;
  message: string;
  status: string;
}

const SONAR_URL = "https://sonarcloud.io/api";
