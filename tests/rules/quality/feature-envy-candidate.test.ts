import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { featureEnvyCandidate } from "../../../src/rules/quality/feature-envy-candidate.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("feature-envy-candidate", featureEnvyCandidate, {
  valid: [
    {
      name: "accepts a method that reads its own state",
      code: "class Account { total() { return this.balance * 2; } }",
      filename: "src/modules/accounts/domain/account.ts",
    },
    {
      name: "accepts a method that reads a single collaborator member",
      code: "class Greeter { greet(user) { return user.name; } }",
      filename: "src/modules/greetings/application/greeter.ts",
    },
    {
      name: "accepts a method that reads own state beside several collaborators",
      code: "class Invoice { tax; total(user, group) { return user.net + group.total + this.tax; } }",
      filename: "src/modules/invoicing/domain/invoice.ts",
    },
    {
      name: "accepts a method whose collaborator reads live in a local variable",
      code: "class Accountant { total(user) { const account = user.account; return account.balance + account.limit; } }",
      filename: "src/modules/accounting/application/accountant.ts",
    },
    {
      name: "accepts a computed member access on a collaborator",
      code: 'class Greeter { greet(user) { return user["name"]; } }',
      filename: "src/modules/greetings/application/greeter.ts",
    },
    {
      name: "accepts a destructured parameter",
      code: "class Greeter { greet({ name }) { return name.length; } }",
      filename: "src/modules/greetings/application/greeter.ts",
    },
    {
      name: "accepts a literal method key",
      code: 'class Runner { ["run"]() { return this.state; } }',
      filename: "src/modules/runners/domain/runner.ts",
    },
    {
      name: "accepts a method that only reads private own state",
      code: "class Secret { read() { return this.#hidden; } }",
      filename: "src/modules/secret/domain/secret.ts",
    },
    {
      name: "accepts a method outside domain and application code",
      code: "class Formatter { message(user) { return user.name + user.email; } }",
      filename: "src/infrastructure/presentation/line-formatter.ts",
    },
    {
      name: "accepts an overload declaration that has no body",
      code: "class Stream { next(): void; next(): void {} }",
      filename: "src/modules/streams/domain/stream.ts",
    },
    {
      name: "accepts a method inside a test file",
      code: "class Probe { message(user) { return user.name + user.email; } }",
      filename: "tests/unit/probe.test.ts",
    },
  ],
  invalid: [
    {
      name: "reports a method reading two or more collaborator members",
      code: 'class Notifier { message(user) { return user.name + " " + user.email; } }',
      filename: "src/modules/notifications/application/notifier.ts",
      errors: [{ messageId: "featureEnvyCandidate" }],
    },
    {
      name: "reports a method reading two collaborators",
      code: "class Aggregator { score(left, right) { return left.points + right.points; } }",
      filename: "src/modules/scoring/application/aggregator.ts",
      errors: [{ messageId: "featureEnvyCandidate" }],
    },
    {
      name: "reports a method that composes collaborators without own state",
      code: "class Formatter { render(post) { return post.title.toUpperCase() + post.author; } }",
      filename: "src/modules/posts/application/formatter.ts",
      errors: [{ messageId: "featureEnvyCandidate" }],
    },
  ],
});
