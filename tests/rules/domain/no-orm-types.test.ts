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
    {
      name: "tests may import ORM types",
      code: "import type { IncidentTable } from 'kysely';",
      filename: "test/unit/incidents/report-incident.test.ts",
    },
    {
      name: "an application test file is excluded from ORM analysis",
      code: "import type { IncidentTable } from 'kysely';",
      filename: "src/modules/incidents/application/report-incident.test.ts",
    },
    {
      name: "an application test directory is excluded from ORM analysis",
      code: "import type { IncidentTable } from 'kysely';",
      filename: "src/modules/incidents/application/test/report-incident.ts",
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
    {
      name: "reports a custom ORM subpath",
      code: "import type { Row } from 'my-orm/client';",
      filename: "src/modules/incidents/domain/incident.ts",
      options: [["my-orm"]],
      errors: [{ messageId: "ormImport", data: { source: "my-orm/client" } }],
    },
  ],
});

describe("no-orm-types metadata", () => {
  it("should expose its domain-vocabulary contract", () => {
    expect(noOrmTypes.meta.docs?.description).toContain("domain vocabulary");
    expect(noOrmTypes.defaultOptions).toEqual([[]]);
    expect(noOrmTypes.meta.schema).toEqual([expect.objectContaining({ uniqueItems: true })]);
  });
});
