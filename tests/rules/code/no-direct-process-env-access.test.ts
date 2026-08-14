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
    {
      name: "does not report an unrelated object property",
      code: "const value = configuration.env.DATABASE_URL;",
      filename: "src/bootstrap.ts",
    },
    {
      name: "does not report a process property other than env",
      code: "const value = process.config.DATABASE_URL;",
      filename: "src/bootstrap.ts",
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
    {
      name: "reports a nested environment key read in a call",
      code: "load(process.env.DATABASE_URL);",
      filename: "src/bootstrap.ts",
      errors: [{ messageId: "directEnvAccess" }],
    },
    {
      name: "reports a nested environment key read in a constructor",
      code: "new Configuration(process.env.DATABASE_URL);",
      filename: "src/bootstrap.ts",
      errors: [{ messageId: "directEnvAccess" }],
    },
    {
      name: "reports computed environment key reads",
      code: "const value = process.env[key];",
      filename: "src/bootstrap.ts",
      errors: [{ messageId: "directEnvAccess" }],
    },
    {
      name: "reports an environment key read nested inside another member access",
      code: "const value = process.env.DATABASE_URL.trim();",
      filename: "src/bootstrap.ts",
      errors: [{ messageId: "directEnvAccess" }],
    },
    {
      name: "reports an environment key used as a computed property",
      code: "const value = configuration[process.env.DATABASE_URL];",
      filename: "src/bootstrap.ts",
      errors: [{ messageId: "directEnvAccess" }],
    },
    {
      name: "allows only direct whole-environment forwarding",
      code: "load(process.env); const value = process.env.DATABASE_URL;",
      filename: "src/bootstrap.ts",
      errors: [{ messageId: "directEnvAccess" }],
    },
    {
      name: "reports a member environment access used as a constructor argument",
      code: "new Loader(process.env.DATABASE_URL);",
      filename: "src/bootstrap.ts",
      errors: [{ messageId: "directEnvAccess" }],
    },
    {
      name: "reports whole environment assignment outside configuration",
      code: "const all = process.env;",
      filename: "src/bootstrap.ts",
      errors: [{ messageId: "directEnvAccess" }],
    },
  ],
});

describe("no-direct-process-env-access metadata", () => {
  it("should expose its public diagnostic description", () => {
    expect(noDirectProcessEnvAccess.meta.docs?.description).toContain("process.env");
  });
});
