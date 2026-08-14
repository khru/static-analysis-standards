import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { dependOnPortNotAdapter } from "../../../src/rules/architecture/depend-on-port-not-adapter.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("depend-on-port-not-adapter", dependOnPortNotAdapter, {
  valid: [
    {
      name: "application depends on its own port",
      code: "import type { IncidentRepository } from './incident-repository.js';",
      filename: "src/modules/incidents/application/report-incident.ts",
    },
    {
      name: "application depends on the module public API",
      code: "import { reportIncident } from '#incidents';",
      filename: "src/modules/incidents/application/report-incident.ts",
    },
    {
      name: "infrastructure depends on infrastructure",
      code: "import { IncidentTable } from './incident-table.js';",
      filename: "src/modules/incidents/infrastructure/postgres-incident-repository.ts",
    },
    {
      name: "tests may import infrastructure adapters",
      code: "import { PostgresIncidentRepository } from '../infrastructure/postgres-incident-repository.js';",
      filename: "test/architecture/modular-monolith.test.ts",
    },
    {
      name: "an application test file is excluded from adapter analysis",
      code: "import { PostgresIncidentRepository } from '../infrastructure/postgres-incident-repository.js';",
      filename: "src/modules/incidents/application/report-incident.test.ts",
    },
  ],
  invalid: [
    {
      name: "reports application importing an infrastructure adapter",
      code: "import { PostgresIncidentRepository } from '../infrastructure/postgres-incident-repository.js';",
      filename: "src/modules/incidents/application/report-incident.ts",
      errors: [
        {
          messageId: "concreteAdapterDependency",
          data: { source: "../infrastructure/postgres-incident-repository.js" },
        },
      ],
    },
    {
      name: "reports application importing a nested infrastructure path",
      code: "import { something } from '../../infrastructure/persistence/adapter.js';",
      filename: "src/modules/incidents/application/report-incident.ts",
      errors: [
        {
          messageId: "concreteAdapterDependency",
          data: { source: "../../infrastructure/persistence/adapter.js" },
        },
      ],
    },
  ],
});

describe("depend-on-port-not-adapter metadata", () => {
  it("should expose its port dependency contract", () => {
    expect(dependOnPortNotAdapter.meta.docs?.description).toContain("owning port");
  });
});
