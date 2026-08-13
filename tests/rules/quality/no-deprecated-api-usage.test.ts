import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { noDeprecatedApiUsage } from "../../../src/rules/quality/no-deprecated-api-usage.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("no-deprecated-api-usage", noDeprecatedApiUsage, {
  valid: [
    {
      name: "accepts the modern encoding function",
      code: "const encoded = encodeURIComponent(value);",
      filename: "src/modules/identity/application/browser-session-authentication.ts",
    },
    {
      name: "accepts the modern slice method",
      code: "const tail = text.slice(1);",
      filename: "src/modules/incidents/domain/incident-id.ts",
    },
    {
      name: "accepts the UTC year getter",
      code: "const year = date.getUTCFullYear();",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts an unrelated method with a similar name",
      code: "const clean = text.trim();",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts a computed member access because only static members are matched",
      code: 'const part = text["substr"](1);',
      filename: "src/modules/incidents/domain/incident-id.ts",
    },
    {
      name: "accepts a deprecated call inside a test file",
      code: "const encoded = escape(value);",
      filename: "test/unit/encoding.test.ts",
    },
  ],
  invalid: [
    {
      name: "reports the deprecated escape function",
      code: "const encoded = escape(value);",
      filename: "src/modules/identity/application/browser-session-authentication.ts",
      errors: [{ messageId: "deprecatedGlobal" }],
    },
    {
      name: "reports the deprecated unescape function",
      code: "const decoded = unescape(raw);",
      filename: "src/modules/identity/application/browser-session-authentication.ts",
      errors: [{ messageId: "deprecatedGlobal" }],
    },
    {
      name: "reports the deprecated substr method",
      code: "const part = text.substr(1);",
      filename: "src/modules/incidents/domain/incident-id.ts",
      errors: [{ messageId: "deprecatedMethod" }],
    },
    {
      name: "reports the deprecated trimLeft method",
      code: "const clean = text.trimLeft();",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "deprecatedMethod" }],
    },
    {
      name: "reports the deprecated getYear method",
      code: "const year = date.getYear();",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "deprecatedMethod" }],
    },
    {
      name: "reports the deprecated toGMTString method",
      code: "const stamp = date.toGMTString();",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "deprecatedMethod" }],
    },
    {
      name: "reports a deprecated method inside a call chain",
      code: "const clean = text.trimRight().toUpperCase();",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "deprecatedMethod" }],
    },
  ],
});
