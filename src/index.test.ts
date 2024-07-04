import { describe, expect, it, jest } from "@jest/globals";
import axios from "axios";
import { table } from "table";
jest.mock("axios");
jest.mock("table");

import { Sonar, Hotspot } from "./index";

const mockSonarHotspotSearchResponseOneFound = {
  paging: {
    pageIndex: 1,
    pageSize: 100,
    total: 1,
  },
  hotspots: [
    {
      key: "hotspot-2",
      component:
        "com.sonarsource:test-project:src/main/java/com/sonarsource/FourthClass.java",
      project: "com.sonarsource:test-project",
      securityCategory: "others",
      vulnerabilityProbability: "LOW",
      status: "TO_REVIEW",
      line: 12,
      message: "message-1",
      assignee: "assignee-uuid",
      author: "joe",
      creationDate: "2024-03-25T16:58:38+0100",
      updateDate: "2020-01-02T15:43:10+0100",
      ruleKey: "repository:rule-key",
    },
  ],
  components: [
    {
      organization: "default-organization",
      key: "com.sonarsource:test-project:src/main/java/com/sonarsource/FourthClass.java",
      qualifier: "FIL",
      name: "FourthClass.java",
      longName: "src/main/java/com/sonarsource/FourthClass.java",
      path: "src/main/java/com/sonarsource/FourthClass.java",
    },
    {
      organization: "default-organization",
      key: "com.sonarsource:test-project",
      qualifier: "TRK",
      name: "test-project",
      longName: "test-project",
    },
  ],
};

const mockSonarHotspotSearchResponseTwoFound = {
  paging: {
    pageIndex: 1,
    pageSize: 100,
    total: 2,
  },
  hotspots: [
    {
      key: "hotspot-2",
      component:
        "com.sonarsource:test-project:src/main/java/com/sonarsource/FourthClass.java",
      project: "com.sonarsource:test-project",
      securityCategory: "others",
      vulnerabilityProbability: "LOW",
      status: "TO_REVIEW",
      line: 12,
      message: "message-1",
      assignee: "assignee-uuid",
      author: "joe",
      creationDate: "2024-03-25T16:58:38+0100",
      updateDate: "2020-01-02T15:43:10+0100",
      ruleKey: "repository:rule-key",
    },
    {
      key: "hotspot-3",
      component:
        "com.sonarsource:test-project:src/main/java/com/sonarsource/FourthClass.java",
      project: "com.sonarsource:test-project",
      securityCategory: "others",
      vulnerabilityProbability: "HIGH",
      status: "TO_REVIEW",
      line: 12,
      message: "message-2",
      assignee: "assignee-uuid",
      author: "joe",
      creationDate: "2024-03-25T16:58:38+0100",
      updateDate: "2020-01-02T15:43:10+0100",
      ruleKey: "repository:rule-key",
    },
  ],
  components: [
    {
      organization: "default-organization",
      key: "com.sonarsource:test-project:src/main/java/com/sonarsource/FourthClass.java",
      qualifier: "FIL",
      name: "FourthClass.java",
      longName: "src/main/java/com/sonarsource/FourthClass.java",
      path: "src/main/java/com/sonarsource/FourthClass.java",
    },
    {
      organization: "default-organization",
      key: "com.sonarsource:test-project",
      qualifier: "TRK",
      name: "test-project",
      longName: "test-project",
    },
  ],
};

const mockSonarHotspotSearchResponsePaginated = {
  paging: {
    pageIndex: 1,
    pageSize: 5,
    total: 10,
  },
  hotspots: [
    {
      key: "hotspot-2",
      component:
        "com.sonarsource:test-project:src/main/java/com/sonarsource/FourthClass.java",
      project: "com.sonarsource:test-project",
      securityCategory: "others",
      vulnerabilityProbability: "LOW",
      status: "TO_REVIEW",
      line: 12,
      message: "message-1",
      assignee: "assignee-uuid",
      author: "joe",
      creationDate: "2024-03-25T16:58:38+0100",
      updateDate: "2020-01-02T15:43:10+0100",
      ruleKey: "repository:rule-key",
    },
    {
      key: "hotspot-3",
      component:
        "com.sonarsource:test-project:src/main/java/com/sonarsource/FourthClass.java",
      project: "com.sonarsource:test-project",
      securityCategory: "others",
      vulnerabilityProbability: "HIGH",
      status: "TO_REVIEW",
      line: 12,
      message: "message-2",
      assignee: "assignee-uuid",
      author: "joe",
      creationDate: "2024-03-25T16:58:38+0100",
      updateDate: "2020-01-02T15:43:10+0100",
      ruleKey: "repository:rule-key",
    },
  ],
  components: [
    {
      organization: "default-organization",
      key: "com.sonarsource:test-project:src/main/java/com/sonarsource/FourthClass.java",
      qualifier: "FIL",
      name: "FourthClass.java",
      longName: "src/main/java/com/sonarsource/FourthClass.java",
      path: "src/main/java/com/sonarsource/FourthClass.java",
    },
    {
      organization: "default-organization",
      key: "com.sonarsource:test-project",
      qualifier: "TRK",
      name: "test-project",
      longName: "test-project",
    },
  ],
};

const mockSonarVulnerabilityResponseOneFound = {
  paging: {
    pageIndex: 1,
    pageSize: 100,
    total: 1,
  },
  issues: [
    {
      key: "01fc972e-2a3c-433e-bcae-0bd7f88f5123",
      component:
        "com.github.kevinsawicki:http-request:com.github.kevinsawicki.http.HttpRequest",
      project: "com.github.kevinsawicki:http-request",
      rule: "checkstyle:com.puppycrawl.tools.checkstyle.checks.coding.MagicNumberCheck",
      status: "TO_REVIEW",
      resolution: "FALSE-POSITIVE",
      severity: "MINOR",
      message: "'3' is a magic number.",
      line: 81,
      hash: "a227e508d6646b55a086ee11d63b21e9",
      author: "Developer 1",
      effort: "2h1min",
      creationDate: "2013-05-13T17:55:39+0200",
      updateDate: "2013-05-13T17:55:39+0200",
      tags: ["bug"],
      type: "VULNERABILITY",
      comments: [
        {
          key: "7d7c56f5-7b5a-41b9-87f8-36fa70caa5ba",
          login: "john.smith",
          htmlText: "Must be &quot;final&quot;!",
          markdown: 'Must be "final"!',
          updatable: false,
          createdAt: "2013-05-13T18:08:34+0200",
        },
      ],
      attr: {
        "jira-issue-key": "SONAR-1234",
      },
      transitions: ["unconfirm", "resolve", "falsepositive"],
      actions: ["comment"],
      textRange: {
        startLine: 2,
        endLine: 2,
        startOffset: 0,
        endOffset: 204,
      },
      flows: [
        {
          locations: [
            {
              textRange: {
                startLine: 16,
                endLine: 16,
                startOffset: 0,
                endOffset: 30,
              },
              msg: "Expected position: 5",
            },
          ],
        },
        {
          locations: [
            {
              textRange: {
                startLine: 15,
                endLine: 15,
                startOffset: 0,
                endOffset: 37,
              },
              msg: "Expected position: 6",
            },
          ],
        },
      ],
      ruleDescriptionContextKey: "spring",
      cleanCodeAttributeCategory: "INTENTIONAL",
      cleanCodeAttribute: "CLEAR",
      impacts: [
        {
          softwareQuality: "MAINTAINABILITY",
          severity: "HIGH",
        },
      ],
    },
  ],
  components: [
    {
      key: "com.github.kevinsawicki:http-request:src/main/java/com/github/kevinsawicki/http/HttpRequest.java",
      enabled: true,
      qualifier: "FIL",
      name: "HttpRequest.java",
      longName: "src/main/java/com/github/kevinsawicki/http/HttpRequest.java",
      path: "src/main/java/com/github/kevinsawicki/http/HttpRequest.java",
    },
    {
      key: "com.github.kevinsawicki:http-request",
      enabled: true,
      qualifier: "TRK",
      name: "http-request",
      longName: "http-request",
    },
  ],
  rules: [
    {
      key: "checkstyle:com.puppycrawl.tools.checkstyle.checks.coding.MagicNumberCheck",
      name: "Magic Number",
      status: "READY",
      lang: "java",
      langName: "Java",
    },
  ],
  users: [
    {
      login: "admin",
      name: "Administrator",
      active: true,
      avatar: "ab0ec6adc38ad44a15105f207394946f",
    },
  ],
};

const mockSonarVulnerabilityResponseTwoFound = {
  paging: {
    pageIndex: 1,
    pageSize: 100,
    total: 1,
  },
  issues: [
    {
      key: "01fc972e-2a3c-433e-bcae-0bd7f88f5123",
      component:
        "com.github.kevinsawicki:http-request:com.github.kevinsawicki.http.HttpRequest",
      project: "com.github.kevinsawicki:http-request",
      rule: "checkstyle:com.puppycrawl.tools.checkstyle.checks.coding.MagicNumberCheck",
      status: "TO_REVIEW",
      resolution: "FALSE-POSITIVE",
      severity: "MAJOR",
      message: "'3' is a magic number.",
      line: 81,
      hash: "a227e508d6646b55a086ee11d63b21e9",
      author: "Developer 1",
      effort: "2h1min",
      creationDate: "2013-05-13T17:55:39+0200",
      updateDate: "2013-05-13T17:55:39+0200",
      tags: ["bug"],
      type: "VULNERABILITY",
      comments: [
        {
          key: "7d7c56f5-7b5a-41b9-87f8-36fa70caa5ba",
          login: "john.smith",
          htmlText: "Must be &quot;final&quot;!",
          markdown: 'Must be "final"!',
          updatable: false,
          createdAt: "2013-05-13T18:08:34+0200",
        },
      ],
      attr: {
        "jira-issue-key": "SONAR-1234",
      },
      transitions: ["unconfirm", "resolve", "falsepositive"],
      actions: ["comment"],
      textRange: {
        startLine: 2,
        endLine: 2,
        startOffset: 0,
        endOffset: 204,
      },
      flows: [
        {
          locations: [
            {
              textRange: {
                startLine: 16,
                endLine: 16,
                startOffset: 0,
                endOffset: 30,
              },
              msg: "Expected position: 5",
            },
          ],
        },
        {
          locations: [
            {
              textRange: {
                startLine: 15,
                endLine: 15,
                startOffset: 0,
                endOffset: 37,
              },
              msg: "Expected position: 6",
            },
          ],
        },
      ],
      ruleDescriptionContextKey: "spring",
      cleanCodeAttributeCategory: "INTENTIONAL",
      cleanCodeAttribute: "CLEAR",
      impacts: [
        {
          softwareQuality: "MAINTAINABILITY",
          severity: "HIGH",
        },
      ],
    },
    {
      key: "01fc972e-2a3c-433e-bcae-0bd7f88f5123",
      component:
        "com.github.kevinsawicki:http-request:com.github.kevinsawicki.http.HttpRequest",
      project: "com.github.kevinsawicki:http-request",
      rule: "checkstyle:com.puppycrawl.tools.checkstyle.checks.coding.MagicNumberCheck",
      status: "TO_REVIEW",
      resolution: "FALSE-POSITIVE",
      severity: "MINOR",
      message: "'3' is a magic number.",
      line: 81,
      hash: "a227e508d6646b55a086ee11d63b21e9",
      author: "Developer 1",
      effort: "2h1min",
      creationDate: "2013-05-13T17:55:39+0200",
      updateDate: "2013-05-13T17:55:39+0200",
      tags: ["bug"],
      type: "VULNERABILITY",
      comments: [
        {
          key: "7d7c56f5-7b5a-41b9-87f8-36fa70caa5ba",
          login: "john.smith",
          htmlText: "Must be &quot;final&quot;!",
          markdown: 'Must be "final"!',
          updatable: false,
          createdAt: "2013-05-13T18:08:34+0200",
        },
      ],
      attr: {
        "jira-issue-key": "SONAR-1234",
      },
      transitions: ["unconfirm", "resolve", "falsepositive"],
      actions: ["comment"],
      textRange: {
        startLine: 2,
        endLine: 2,
        startOffset: 0,
        endOffset: 204,
      },
      flows: [
        {
          locations: [
            {
              textRange: {
                startLine: 16,
                endLine: 16,
                startOffset: 0,
                endOffset: 30,
              },
              msg: "Expected position: 5",
            },
          ],
        },
        {
          locations: [
            {
              textRange: {
                startLine: 15,
                endLine: 15,
                startOffset: 0,
                endOffset: 37,
              },
              msg: "Expected position: 6",
            },
          ],
        },
      ],
      ruleDescriptionContextKey: "spring",
      cleanCodeAttributeCategory: "INTENTIONAL",
      cleanCodeAttribute: "CLEAR",
      impacts: [
        {
          softwareQuality: "MAINTAINABILITY",
          severity: "HIGH",
        },
      ],
    },
  ],
  components: [
    {
      key: "com.github.kevinsawicki:http-request:src/main/java/com/github/kevinsawicki/http/HttpRequest.java",
      enabled: true,
      qualifier: "FIL",
      name: "HttpRequest.java",
      longName: "src/main/java/com/github/kevinsawicki/http/HttpRequest.java",
      path: "src/main/java/com/github/kevinsawicki/http/HttpRequest.java",
    },
    {
      key: "com.github.kevinsawicki:http-request",
      enabled: true,
      qualifier: "TRK",
      name: "http-request",
      longName: "http-request",
    },
  ],
  rules: [
    {
      key: "checkstyle:com.puppycrawl.tools.checkstyle.checks.coding.MagicNumberCheck",
      name: "Magic Number",
      status: "READY",
      lang: "java",
      langName: "Java",
    },
  ],
  users: [
    {
      login: "admin",
      name: "Administrator",
      active: true,
      avatar: "ab0ec6adc38ad44a15105f207394946f",
    },
  ],
};

const mockSonarVulnerabilitySearchResponsePaginated = {
  paging: {
    pageIndex: 1,
    pageSize: 100,
    total: 101,
  },
  issues: [
    {
      key: "01fc972e-2a3c-433e-bcae-0bd7f88f5123",
      component:
        "com.github.kevinsawicki:http-request:com.github.kevinsawicki.http.HttpRequest",
      project: "com.github.kevinsawicki:http-request",
      rule: "checkstyle:com.puppycrawl.tools.checkstyle.checks.coding.MagicNumberCheck",
      status: "TO_REVIEW",
      resolution: "FALSE-POSITIVE",
      severity: "MINOR",
      message: "'3' is a magic number.",
      line: 81,
      hash: "a227e508d6646b55a086ee11d63b21e9",
      author: "Developer 1",
      effort: "2h1min",
      creationDate: "2013-05-13T17:55:39+0200",
      updateDate: "2013-05-13T17:55:39+0200",
      tags: ["bug"],
      type: "VULNERABILITY",
      comments: [
        {
          key: "7d7c56f5-7b5a-41b9-87f8-36fa70caa5ba",
          login: "john.smith",
          htmlText: "Must be &quot;final&quot;!",
          markdown: 'Must be "final"!',
          updatable: false,
          createdAt: "2013-05-13T18:08:34+0200",
        },
      ],
      attr: {
        "jira-issue-key": "SONAR-1234",
      },
      transitions: ["unconfirm", "resolve", "falsepositive"],
      actions: ["comment"],
      textRange: {
        startLine: 2,
        endLine: 2,
        startOffset: 0,
        endOffset: 204,
      },
      flows: [
        {
          locations: [
            {
              textRange: {
                startLine: 16,
                endLine: 16,
                startOffset: 0,
                endOffset: 30,
              },
              msg: "Expected position: 5",
            },
          ],
        },
        {
          locations: [
            {
              textRange: {
                startLine: 15,
                endLine: 15,
                startOffset: 0,
                endOffset: 37,
              },
              msg: "Expected position: 6",
            },
          ],
        },
      ],
      ruleDescriptionContextKey: "spring",
      cleanCodeAttributeCategory: "INTENTIONAL",
      cleanCodeAttribute: "CLEAR",
      impacts: [
        {
          softwareQuality: "MAINTAINABILITY",
          severity: "HIGH",
        },
      ],
    },
  ],
  components: [
    {
      key: "com.github.kevinsawicki:http-request:src/main/java/com/github/kevinsawicki/http/HttpRequest.java",
      enabled: true,
      qualifier: "FIL",
      name: "HttpRequest.java",
      longName: "src/main/java/com/github/kevinsawicki/http/HttpRequest.java",
      path: "src/main/java/com/github/kevinsawicki/http/HttpRequest.java",
    },
    {
      key: "com.github.kevinsawicki:http-request",
      enabled: true,
      qualifier: "TRK",
      name: "http-request",
      longName: "http-request",
    },
  ],
  rules: [
    {
      key: "checkstyle:com.puppycrawl.tools.checkstyle.checks.coding.MagicNumberCheck",
      name: "Magic Number",
      status: "READY",
      lang: "java",
      langName: "Java",
    },
  ],
  users: [
    {
      login: "admin",
      name: "Administrator",
      active: true,
      avatar: "ab0ec6adc38ad44a15105f207394946f",
    },
  ],
};
describe("Sonar", () => {
  describe("Hotspots", () => {
    it("Returns one hotspot", async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      mockedAxios.post.mockResolvedValue({
        data: mockSonarHotspotSearchResponseOneFound,
        statusCode: 200,
      });
      const sonar = new Sonar();
      const result = await sonar.getHotspotsByProject(
        "di-ipv-dca-front",
        "sonarToken",
      );
      expect(result).toStrictEqual([
        {
          projectKey: "di-ipv-dca-front",
          vulnerabilityProbability: "LOW",
          creationDate: "2024-03-25T16:58:38+0100",
          message: "message-1",
          status: "TO_REVIEW",
        },
      ]);
    });

    it("Returns two hotspots", async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      mockedAxios.post.mockResolvedValue({
        data: mockSonarHotspotSearchResponseTwoFound,
        statusCode: 200,
      });
      const sonar = new Sonar();
      const result = await sonar.getHotspotsByProject(
        "di-ipv-dca-front",
        "sonarToken",
      );
      expect(result).toStrictEqual([
        {
          projectKey: "di-ipv-dca-front",
          vulnerabilityProbability: "LOW",
          creationDate: "2024-03-25T16:58:38+0100",
          message: "message-1",
          status: "TO_REVIEW",
        },
        {
          projectKey: "di-ipv-dca-front",
          vulnerabilityProbability: "HIGH",
          creationDate: "2024-03-25T16:58:38+0100",
          message: "message-2",
          status: "TO_REVIEW",
        },
      ]);
    });

    it("Throws error if response is paginated :D", async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      mockedAxios.post.mockResolvedValue({
        data: mockSonarHotspotSearchResponsePaginated,
        statusCode: 200,
      });
      const sonar = new Sonar();
      try {
        await sonar.getHotspotsByProject(
          "di-ipv-dca-front",
          "sonarToken",
        );
      } catch (error: any) {
        expect(error.message).toBe(
          "Response was paginated - this is not yet supported!",
        );
      }
      expect.assertions(1);
    });

    it("Prints to console", () => {
      const mockVulnerabilities: Hotspot[] = [
        {
          status: "STATUS",
          vulnerabilityProbability: "LOW",
          message: "message",
          creationDate: 12345,
          projectKey: "di-ipv-dca-front",
        },
      ];

      const sonar = new Sonar();
      sonar.printHotspotData(mockVulnerabilities, "di-ipv-dca-front");
      expect(table).toBeCalledWith(
        [
          ["Title", "Creation Data", "Probability", "status"],
          ["message", 12345, "LOW", "STATUS"],
        ],
        { header: { alignment: "center", content: "di-ipv-dca-front" } },
      );
    });

    it("Prints to console and filters out REVIEWED hotspots", () => {
      const mockVulnerabilities: Hotspot[] = [
        {
          status: "REVIEWED",
          vulnerabilityProbability: "LOW",
          message: "message1",
          creationDate: 12345,
          projectKey: "di-ipv-dca-front",
        },
        {
          status: "MOCKSTATUS",
          vulnerabilityProbability: "LOW",
          message: "message2",
          creationDate: 12345,
          projectKey: "di-ipv-dca-front",
        },
      ];

      const sonar = new Sonar();
      sonar.printHotspotData(mockVulnerabilities, "di-ipv-dca-front");
      expect(table).toBeCalledWith(
        [
          ["Title", "Creation Data", "Probability", "status"],
          ["message2", 12345, "LOW", "MOCKSTATUS"],
        ],
        { header: { alignment: "center", content: "di-ipv-dca-front" } },
      );
    });
    it("Prints row if there are no hotspots that are open", () => {
      const mockVulnerabilities: Hotspot[] = [
        {
          status: "REVIEWED",
          vulnerabilityProbability: "LOW",
          message: "message1",
          creationDate: 12345,
          projectKey: "di-ipv-dca-front",
        },
        {
          status: "REVIEWED",
          vulnerabilityProbability: "LOW",
          message: "message2",
          creationDate: 12345,
          projectKey: "di-ipv-dca-front",
        },
      ];

      const sonar = new Sonar();
      sonar.printHotspotData(mockVulnerabilities, "di-ipv-dca-front");
      expect(table).toBeCalledWith([["No open hotspots :) "]], {
        header: { alignment: "center", content: "di-ipv-dca-front" },
      });
    });
  });

  describe("Vulnerabilities", () => {
    it("Returns one vulnerability", async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      mockedAxios.post.mockResolvedValue({
        data: mockSonarVulnerabilityResponseOneFound,
        statusCode: 200,
      });
      const sonar = new Sonar();
      const result = await sonar.getVulnerabilitiesByProject(
        "di-ipv-dca-front",
        "sonarToken",
      );
      expect(result).toStrictEqual([
        {
          projectKey: "di-ipv-dca-front",
          severity: "MINOR",
          creationDate: "2013-05-13T17:55:39+0200",
          message: "'3' is a magic number.",
          status: "TO_REVIEW",
        },
      ]);
    });

    it("Returns two vulnerabilities", async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      mockedAxios.post.mockResolvedValue({
        data: mockSonarVulnerabilityResponseTwoFound,
        statusCode: 200,
      });
      const sonar = new Sonar();
      const result = await sonar.getVulnerabilitiesByProject(
        "di-ipv-dca-front",
        "sonarToken",
      );
      expect(result).toStrictEqual([
        {
          projectKey: "di-ipv-dca-front",
          severity: "MAJOR",
          creationDate: "2013-05-13T17:55:39+0200",
          message: "'3' is a magic number.",
          status: "TO_REVIEW",
        },
        {
          projectKey: "di-ipv-dca-front",
          severity: "MINOR",
          creationDate: "2013-05-13T17:55:39+0200",
          message: "'3' is a magic number.",
          status: "TO_REVIEW",
        },
      ]);
    });

    it("Throws error if response is paginated :D", async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      mockedAxios.post.mockResolvedValue({
        data: mockSonarVulnerabilitySearchResponsePaginated,
        statusCode: 200,
      });
      const sonar = new Sonar();
      try {
        await sonar.getHotspotsByProject(
          "di-ipv-dca-front",
          "sonarToken",
        );
      } catch (error: any) {
        expect(error.message).toBe(
          "Response was paginated - this is not yet supported!",
        );
      }
      expect.assertions(1);
    });
  });
});
