import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { disconnectedMethodClusters } from "../../../src/rules/quality/disconnected-method-clusters.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("disconnected-method-clusters", disconnectedMethodClusters, {
  valid: [
    {
      name: "accepts a class whose methods share instance state",
      code: "class Account { deposit(amount) { this.balance += amount; } withdraw(amount) { this.balance -= amount; } }",
      filename: "src/modules/accounts/domain/account.ts",
    },
    {
      name: "accepts a class with fewer than two stateful methods",
      code: 'class Report { summarize() { this.title = "summary"; } render() { return "<div></div>"; } }',
      filename: "src/modules/reports/domain/report.ts",
    },
    {
      name: "accepts a class whose clusters overlap in shared state",
      code: "class Profile { rename(value) { this.name = value; this.age += 1; } describe() { return this.name; } }",
      filename: "src/modules/profile/domain/profile.ts",
    },
    {
      name: "accepts a class whose only cluster touches one property",
      code: "class Counter { increment() { this.value += 1; } reset() { this.value = 0; } }",
      filename: "src/modules/counters/domain/counter.ts",
    },
    {
      name: "accepts a class with a literal method key",
      code: 'class Runner { ["run"]() { this.state = "running"; } stop() { this.flag = false; } }',
      filename: "src/modules/runners/domain/runner.ts",
    },
    {
      name: "accepts a class whose method only touches computed state",
      code: "class Index { one() { this[key] = 1; } two() { this.value = 2; } }",
      filename: "src/modules/index/domain/index.ts",
    },
    {
      name: "accepts a class whose method only touches private state",
      code: "class Secret { one() { this.#hidden = 1; } two() { this.value = 2; } }",
      filename: "src/modules/secret/domain/secret.ts",
    },
    {
      name: "accepts a class whose methods only read collaborator state",
      code: "class Reader { one() { other.name; } two() { other.age; } }",
      filename: "src/modules/reader/domain/reader.ts",
    },
    {
      name: "accepts a class with an overload declaration that has no body",
      code: "class Model { refresh(): void; refresh(): void {} }",
      filename: "src/modules/models/domain/model.ts",
    },
    {
      name: "accepts a class outside domain and application code",
      code: "class Adapter { one() { this.a = 1; } two() { this.b = 2; } }",
      filename: "src/infrastructure/persistence/table-mapper.ts",
    },
    {
      name: "accepts a class inside a test file",
      code: "class Probe { one() { this.a = 1; } two() { this.b = 2; } }",
      filename: "tests/unit/probe.test.ts",
    },
  ],
  invalid: [
    {
      name: "reports a class whose methods touch disjoint instance clusters",
      code: "class Report { setTitle(title) { this.title = title; } addLine(line) { this.lines.push(line); } }",
      filename: "src/modules/reports/domain/report.ts",
      errors: [{ messageId: "disconnectedMethodClusters" }],
    },
    {
      name: "reports a class with three disjoint clusters",
      code: "class Processor { start() { this.started = true; } stop() { this.stopped = true; } reset() { this.tokens = []; } }",
      filename: "src/modules/processor/application/processor.ts",
      errors: [{ messageId: "disconnectedMethodClusters" }],
    },
    {
      name: "reports a class expression with disjoint clusters",
      code: 'const runner = class { run() { this.state = "running"; } stop() { this.flag = false; } };',
      filename: "src/modules/runners/domain/runner.ts",
      errors: [{ messageId: "disconnectedMethodClusters" }],
    },
  ],
});
