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
  ],
});
