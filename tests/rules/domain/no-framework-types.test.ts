import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { noFrameworkTypes } from "../../../src/rules/domain/no-framework-types.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("no-framework-types", noFrameworkTypes, {
  valid: [
    {
      name: "domain imports its own vocabulary",
      code: "import { IncidentId } from './incident-id.js';",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "infrastructure imports a framework",
      code: "import express from 'express';",
      filename: "src/infrastructure/http/http.ts",
    },
    {
      name: "application imports a node builtin",
      code: "import { readFile } from 'node:fs/promises';",
      filename: "src/modules/incidents/application/reader.ts",
    },
    {
      name: "tests may import a framework",
      code: "import express from 'express';",
      filename: "test/unit/incidents/report-incident.test.ts",
    },
    {
      name: "a domain test file is excluded from framework analysis",
      code: "import express from 'express';",
      filename: "src/modules/incidents/domain/incident.test.ts",
    },
    {
      name: "a domain test directory is excluded from framework analysis",
      code: "import express from 'express';",
      filename: "src/modules/incidents/domain/test/incident.ts",
    },
  ],
  invalid: [
    {
      name: "reports express in application",
      code: "import express from 'express';",
      filename: "src/modules/incidents/application/report-incident.ts",
      errors: [{ messageId: "frameworkImport", data: { source: "express" } }],
    },
    {
      name: "reports a scoped framework import in domain",
      code: "import { defineStore } from 'pinia';",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "frameworkImport", data: { source: "pinia" } }],
    },
    {
      name: "reports a subpath framework import in domain",
      code: "import { render } from '@testing-library/vue';",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "frameworkImport", data: { source: "@testing-library/vue" } }],
    },
    {
      name: "honors a custom framework list",
      code: "import { something } from 'my-http';",
      filename: "src/modules/incidents/domain/incident.ts",
      options: [["my-http"]],
      errors: [{ messageId: "frameworkImport", data: { source: "my-http" } }],
    },
    {
      name: "reports a custom framework subpath",
      code: "import { something } from 'my-http/client';",
      filename: "src/modules/incidents/domain/incident.ts",
      options: [["my-http"]],
      errors: [{ messageId: "frameworkImport", data: { source: "my-http/client" } }],
    },
  ],
});

describe("no-framework-types metadata", () => {
  it("should expose its framework-independent contract", () => {
    expect(noFrameworkTypes.meta.docs?.description).toContain("framework-independent");
    expect(noFrameworkTypes.defaultOptions).toEqual([[]]);
    expect(noFrameworkTypes.meta.schema).toEqual([expect.objectContaining({ uniqueItems: true })]);
  });
});
