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
  ],
});
