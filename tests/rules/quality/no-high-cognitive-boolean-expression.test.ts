import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { noHighCognitiveBooleanExpression } from "../../../src/rules/quality/no-high-cognitive-boolean-expression.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("no-high-cognitive-boolean-expression", noHighCognitiveBooleanExpression, {
  valid: [
    {
      name: "allows a short boolean condition",
      code: "if (entry.active && entry.approved) { publish(entry); }",
      filename: "src/modules/entries/application/publish-entry.ts",
    },
    {
      name: "allows the same expression in tests",
      code: "it('publishes', () => { if (a && b && c && d) publish(); });",
      options: [{ max: 1 }],
      filename: "test/unit/publish-entry.test.ts",
    },
    {
      name: "allows a configured higher cognitive limit",
      code: "if (a && b && c && d) publish();",
      options: [{ max: 7 }],
      filename: "src/modules/entries/application/publish-entry.ts",
    },
    {
      name: "allows a simple conditional expression",
      code: "const label = active && approved ? 'ready' : 'pending';",
      filename: "src/modules/entries/application/publish-entry.ts",
    },
    {
      name: "allows an expression exactly at the cognitive limit",
      code: "if (a === b && c === d) publish();",
      options: [{ max: 3 }],
      filename: "src/modules/entries/application/publish-entry.ts",
    },
    {
      name: "allows a three-operand expression exactly at the cognitive limit",
      code: "if (a && b && c) publish();",
      options: [{ max: 5 }],
      filename: "src/modules/entries/application/publish-entry.ts",
    },
    {
      name: "allows an expression exactly at the cognitive limit",
      code: "if (a && b && c && d) publish();",
      options: [{ max: 7 }],
      filename: "src/modules/entries/application/publish-entry.ts",
    },
    {
      name: "does not inspect complex infrastructure expressions",
      code: "if (a && b && c && d) publish();",
      options: [{ max: 1 }],
      filename: "src/infrastructure/parser.ts",
    },
  ],
  invalid: [
    {
      name: "reports the complex comparison chain from application policy",
      code: "if (node.type === 'BinaryExpression' && (node.operator === '===' || node.operator === '==' || node.operator === '!==' || node.operator === '!=')) return true;",
      filename: "src/modules/entries/application/inspect-expression.ts",
      errors: [{ messageId: "highCognitiveLoad", data: { score: 9 } }],
    },
    {
      name: "reports an expression at a lower exact limit",
      code: "if (a === b && c === d) publish();",
      options: [{ max: 2 }],
      filename: "src/modules/entries/application/publish-entry.ts",
      errors: [{ messageId: "highCognitiveLoad", data: { score: 3 } }],
    },
    {
      name: "reports an expression one point above the configured limit",
      code: "if (a && b && c && d) publish();",
      options: [{ max: 2 }],
      filename: "src/modules/entries/application/publish-entry.ts",
      errors: [{ messageId: "highCognitiveLoad", data: { score: 3 } }],
    },
    {
      name: "reports a deeply nested boolean condition",
      code: "while (a && b && c && d) { consume(); }",
      filename: "src/modules/entries/domain/entry.ts",
      options: [{ max: 2 }],
      errors: [{ messageId: "highCognitiveLoad", data: { score: 3 } }],
    },
    {
      name: "reports a complex do-while condition",
      code: "do { consume(); } while (a && b && c);",
      filename: "src/modules/entries/domain/entry.ts",
      options: [{ max: 1 }],
      errors: [{ messageId: "highCognitiveLoad", data: { score: 2 } }],
    },
    {
      name: "reports a complex conditional expression",
      code: "const label = a && b && c && d ? 'ready' : 'pending';",
      options: [{ max: 2 }],
      filename: "src/modules/entries/application/publish-entry.ts",
      errors: [{ messageId: "highCognitiveLoad", data: { score: 3 } }],
    },
  ],
});

describe("no-high-cognitive-boolean-expression metadata", () => {
  it("should expose its configurable cognitive limit", () => {
    expect(noHighCognitiveBooleanExpression.meta.docs?.description).toContain("cognitive load");
    expect(noHighCognitiveBooleanExpression.defaultOptions).toEqual([{ max: expect.any(Number) }]);
    expect(noHighCognitiveBooleanExpression.meta.schema).toEqual([
      expect.objectContaining({ additionalProperties: false }),
    ]);
  });
});
