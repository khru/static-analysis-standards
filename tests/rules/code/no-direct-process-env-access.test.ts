import { RuleTester } from "@typescript-eslint/rule-tester";

import { noDirectProcessEnvAccess } from "../../../src/rules/code/no-direct-process-env-access.js";

const ruleTester = new RuleTester();

ruleTester.run("no-direct-process-env-access", noDirectProcessEnvAccess, {
  valid: [
    {
      name: "reads environment inside the configuration module",
      code: "const value = process.env.DATABASE_URL;",
      filename: "src/infrastructure/configuration/load-configuration.ts",
    },
    {
      name: "reads environment in a config file",
      code: "const value = process.env.DATABASE_URL;",
      filename: "vitest.config.ts",
    },
    {
      name: "sets environment in a test file",
      code: "process.env.NODE_ENV = 'test';",
      filename: "test/unit/configuration.test.ts",
    },
    {
      name: "forwards the whole environment object to the typed configuration loader",
      code: "loadRuntimeConfiguration(process.env);",
      filename: "src/main.ts",
    },
    {
      name: "forwards the whole environment object to a configuration constructor",
      code: "new ConfigurationLoader(process.env);",
      filename: "src/main.ts",
    },
    {
      name: "reads a property of a typed configuration object",
      code: "const webBaseUrl = configuration.http.webBaseUrl;",
      filename: "src/modules/incidents/infrastructure/postgres-incident-repository.ts",
    },
  ],
  invalid: [
    {
      name: "reports direct environment access in production code",
      code: "const value = process.env.DATABASE_URL;",
      filename: "src/modules/incidents/infrastructure/postgres-incident-repository.ts",
      errors: [{ messageId: "directEnvAccess" }],
    },
    {
      name: "reports the whole process.env object outside configuration",
      code: "const all = process.env;",
      filename: "src/bootstrap.ts",
      errors: [{ messageId: "directEnvAccess" }],
    },
    {
      name: "reports a computed environment read in production code",
      code: "const value = process.env[key];",
      filename: "src/modules/incidents/infrastructure/postgres-incident-repository.ts",
      errors: [{ messageId: "directEnvAccess" }],
    },
    {
      name: "reports spreading the whole environment object outside configuration",
      code: "const all = { ...process.env };",
      filename: "src/bootstrap.ts",
      errors: [{ messageId: "directEnvAccess" }],
    },
    {
      name: "reports calling the whole environment object outside configuration",
      code: "process.env();",
      filename: "src/bootstrap.ts",
      errors: [{ messageId: "directEnvAccess" }],
    },
  ],
});
