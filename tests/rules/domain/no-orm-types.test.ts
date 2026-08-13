import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { noOrmTypes } from "../../../src/rules/domain/no-orm-types.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("no-orm-types", noOrmTypes, {
  valid: [
    {
      name: "domain defines its own vocabulary types",
      code: "import type { IncidentSnapshot } from './incident.ts';",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "infrastructure imports ORM types",
      code: "import type { IncidentRow } from './incident-table.ts';",
      filename: "src/modules/incidents/infrastructure/postgres-incident-repository.ts",
    },
  ],
  invalid: [
    {
      name: "reports kysely in application",
      code: "import type { IncidentTable } from 'kysely';",
      filename: "src/modules/incidents/application/report-incident.ts",
      errors: [{ messageId: "ormImport", data: { source: "kysely" } }],
    },
    {
      name: "reports pg in domain",
      code: "import type { Pool } from 'pg';",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "ormImport", data: { source: "pg" } }],
    },
    {
      name: "honors a custom ORM list",
      code: "import type { Row } from 'my-orm';",
      filename: "src/modules/incidents/domain/incident.ts",
      options: [["my-orm"]],
      errors: [{ messageId: "ormImport", data: { source: "my-orm" } }],
    },
  ],
});
