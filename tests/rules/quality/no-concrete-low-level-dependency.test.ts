import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { noConcreteLowLevelDependency } from "../../../src/rules/quality/no-concrete-low-level-dependency.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("no-concrete-low-level-dependency", noConcreteLowLevelDependency, {
  valid: [
    {
      name: "accepts a domain import of an owning port",
      code: 'import { AccountRepository } from "../ports/account-repository";',
      filename: "src/modules/accounts/domain/account.ts",
    },
    {
      name: "accepts a domain import of a pure module",
      code: 'import { Money } from "../domain/money";',
      filename: "src/modules/accounts/domain/account.ts",
    },
    {
      name: "accepts a dynamic import of a clean module",
      code: 'const schema = await import("../validation/report-schema");',
      filename: "src/modules/reports/application/report-service.ts",
    },
    {
      name: "accepts a dynamic import with a non-literal source",
      code: "const module = await import(moduleName);",
      filename: "src/modules/reports/application/report-service.ts",
    },
    {
      name: "accepts an import outside domain and application code",
      code: 'import { incidentRepository } from "./infrastructure/incident-repository";',
      filename: "src/infrastructure/incident-repository.ts",
    },
    {
      name: "accepts an import inside a test file",
      code: 'import { handler } from "../infrastructure/client";',
      filename: "tests/integration/handler.test.ts",
    },
  ],
  invalid: [
    {
      name: "reports a domain import of a persistence module",
      code: 'import { ReportRepository } from "../infrastructure/persistence/report-repository";',
      filename: "src/modules/reports/domain/report.ts",
      errors: [{ messageId: "concreteLowLevelDependency" }],
    },
    {
      name: "reports an application import of an adapter",
      code: 'import { notificationClient } from "./adapters/notification-client";',
      filename: "src/modules/notifications/application/notification-service.ts",
      errors: [{ messageId: "concreteLowLevelDependency" }],
    },
    {
      name: "reports a dynamic import of a client module",
      code: 'const client = await import("../infrastructure/clients/http-client");',
      filename: "src/modules/notifications/application/notification-service.ts",
      errors: [{ messageId: "concreteLowLevelDependency" }],
    },
  ],
});
