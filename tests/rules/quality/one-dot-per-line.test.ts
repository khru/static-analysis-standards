import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { oneDotPerLine } from "../../../src/rules/quality/one-dot-per-line.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("one-dot-per-line", oneDotPerLine, {
  valid: [
    {
      name: "accepts a plain call",
      code: "register(entry);",
      filename: "src/modules/registrar/application/registrar.ts",
    },
    {
      name: "accepts a single member call",
      code: "queue.push(entry);",
      filename: "src/modules/queue/domain/queue.ts",
    },
    {
      name: "accepts a functional collection pipeline",
      code: "users.map((user) => user.name).filter((name) => name.length > 0);",
      filename: "src/modules/users/application/user-query.ts",
    },
    {
      name: "accepts a computed member call",
      code: "lookup[methodName]();",
      filename: "src/modules/lookup/application/lookup.ts",
    },
    {
      name: "accepts a private member call",
      code: "this.#handler();",
      filename: "src/modules/handlers/domain/handler.ts",
    },
    {
      name: "accepts a property access without a call chain",
      code: "config.repositories.users;",
      filename: "src/modules/config/application/config-reader.ts",
    },
    {
      name: "accepts chained calls inside a test file",
      code: "account.overview().refresh().persist();",
      filename: "tests/unit/account.test.ts",
    },
    {
      name: "accepts a this-rooted two-call chain with one extra dot",
      code: "this.account.overview().refresh();",
      filename: "src/modules/accounts/domain/account.ts",
    },
    {
      name: "accepts a super-rooted two-call chain with one extra dot",
      code: "super.render().update();",
      filename: "src/modules/views/infrastructure/view-renderer.ts",
    },
  ],
  invalid: [
    {
      name: "reports a two-call chain",
      code: "audit.trail().append(entry);",
      filename: "src/modules/audit/application/audit-trail.ts",
      errors: [{ messageId: "oneDotPerLine" }],
    },
    {
      name: "reports a chain that mixes a pipeline step with a command",
      code: "config.repositories.find().refresh();",
      filename: "src/modules/repositories/application/repository-refresh.ts",
      errors: [{ messageId: "oneDotPerLine" }],
    },
    {
      name: "reports a three-call chain once",
      code: "account.overview().refresh().persist();",
      filename: "src/modules/accounts/application/account-service.ts",
      errors: [{ messageId: "oneDotPerLine" }],
    },
    {
      name: "reports a this-rooted chain at the three-call boundary",
      code: "this.account.overview().refresh().persist();",
      filename: "src/modules/accounts/domain/account.ts",
      errors: [{ messageId: "oneDotPerLine" }],
    },
    {
      name: "reports a this-rooted chain beyond the single extra dot",
      code: "this.account.overview().refresh().persist().notify();",
      filename: "src/modules/accounts/domain/account.ts",
      errors: [{ messageId: "oneDotPerLine" }],
    },
    {
      name: "reports a super-rooted chain beyond the single extra dot",
      code: "super.render().update().commit().log();",
      filename: "src/modules/views/infrastructure/view-renderer.ts",
      errors: [{ messageId: "oneDotPerLine" }],
    },
  ],
});
