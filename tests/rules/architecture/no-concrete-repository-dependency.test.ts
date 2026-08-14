import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { noConcreteRepositoryDependency } from "../../../src/rules/architecture/no-concrete-repository-dependency.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("no-concrete-repository-dependency", noConcreteRepositoryDependency, {
  valid: [
    {
      name: "imports a repository port",
      code: "import type { IncidentRepository } from './incident-repository.js';",
      filename: "src/modules/incidents/application/report-incident.ts",
    },
    {
      name: "defines the concrete repository implementation",
      code: "export class PostgresIncidentRepository implements IncidentRepository {}",
      filename: "src/modules/incidents/infrastructure/postgres-incident-repository.ts",
    },
    {
      name: "namespace imports of ports are not bindings",
      code: "import * as incidentPorts from '../ports/incident-repository.js';",
      filename: "src/modules/incidents/application/report-incident.ts",
    },
    {
      name: "tests may import concrete repositories",
      code: "import { PostgresIncidentRepository } from '../infrastructure/postgres-incident-repository.js';",
      filename: "test/architecture/modular-monolith.test.ts",
    },
    {
      name: "an application test file is excluded from repository analysis",
      code: "import { PostgresIncidentRepository } from '../infrastructure/postgres-incident-repository.js';",
      filename: "src/modules/incidents/application/report-incident.test.ts",
    },
    {
      name: "a repository prefix without the concrete suffix is allowed",
      code: "import { PostgresIncidentRepositoryFactory } from '../infrastructure/repository.js';",
      filename: "src/modules/incidents/application/report-incident.ts",
    },
    {
      name: "a repository suffix without the concrete prefix is allowed",
      code: "import { CustomIncidentRepository } from '../infrastructure/repository.js';",
      filename: "src/modules/incidents/application/report-incident.ts",
    },
    {
      name: "a foreign prefix with a repository suffix is allowed",
      code: "import { LegacyIncidentRepository } from '../infrastructure/repository.js';",
      filename: "src/modules/incidents/application/report-incident.ts",
    },
    {
      name: "a supported repository name must begin with its technology prefix",
      code: "import { LegacyPostgresIncidentRepository } from '../infrastructure/repository.js';",
      filename: "src/modules/incidents/application/report-incident.ts",
    },
  ],
  invalid: [
    {
      name: "reports a concrete repository import by binding name",
      code: "import { PostgresIncidentRepository } from '../infrastructure/postgres-incident-repository.js';",
      filename: "src/modules/incidents/application/report-incident.ts",
      errors: [{ messageId: "concreteRepository", data: { name: "PostgresIncidentRepository" } }],
    },
    {
      name: "reports a Kysely concrete repository import",
      code: "import { KyselyIncidentRepository } from '../infrastructure/repository.js';",
      filename: "src/modules/incidents/application/report-incident.ts",
      errors: [{ messageId: "concreteRepository", data: { name: "KyselyIncidentRepository" } }],
    },
    {
      name: "reports a string-named concrete repository import",
      code: "import { 'PostgresIncidentRepository' as Repo } from '../infrastructure/postgres-incident-repository.js';",
      filename: "src/modules/incidents/application/report-incident.ts",
      errors: [{ messageId: "concreteRepository", data: { name: "PostgresIncidentRepository" } }],
    },
    {
      name: "reports a concrete repository default alongside a namespace import",
      code: "import DefaultRepository, { RedisIncidentRepository } from '../infrastructure/repository.js';",
      filename: "src/modules/incidents/application/report-incident.ts",
      errors: [{ messageId: "concreteRepository", data: { name: "RedisIncidentRepository" } }],
    },
    {
      name: "reports a supported repository prefix with a nonstandard suffix only when the suffix matches",
      code: "import { PostgresIncidentRepository } from '../infrastructure/repository.js';",
      filename: "src/modules/incidents/application/report-incident.ts",
      errors: [{ messageId: "concreteRepository", data: { name: "PostgresIncidentRepository" } }],
    },
  ],
});

describe("no-concrete-repository-dependency metadata", () => {
  it("should expose its repository port contract", () => {
    expect(noConcreteRepositoryDependency.meta.docs?.description).toContain("repository port");
  });
});
