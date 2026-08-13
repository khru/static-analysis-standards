import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { noAbbreviations } from "../../../src/rules/quality/no-abbreviations.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("no-abbreviations", noAbbreviations, {
  valid: [
    {
      name: "accepts a descriptive identifier",
      code: "const balance = 0;",
      filename: "src/modules/accounts/domain/account.ts",
    },
    {
      name: "accepts an allowed conventional short name",
      code: "const id = 1;",
      filename: "src/modules/accounts/domain/account.ts",
    },
    {
      name: "accepts a standard protocol vocabulary name",
      code: 'const api = "/v1";',
      filename: "src/modules/accounts/domain/account.ts",
    },
    {
      name: "accepts a common English word that is not an abbreviation",
      code: "const key = entry.id;",
      filename: "src/modules/accounts/domain/account.ts",
    },
    {
      name: "accepts a standard collection verb that is not an abbreviation",
      code: "const has = values.has(entry);",
      filename: "src/modules/accounts/domain/account.ts",
    },
    {
      name: "accepts an abbreviation from the deterministic catalog",
      code: "const evt = new Event();",
      filename: "src/modules/accounts/domain/account.ts",
    },
    {
      name: "accepts a short identifier inside a test file",
      code: "const val = 1;",
      filename: "tests/unit/probe.test.ts",
    },
  ],
  invalid: [
    {
      name: "reports an unexplained short identifier",
      code: "const itm = 1;",
      filename: "src/modules/accounts/domain/account.ts",
      errors: [{ messageId: "shortIdentifier", data: { name: "itm" } }],
    },
    {
      name: "reports a buffer short identifier",
      code: 'let buf = "";',
      filename: "src/modules/accounts/application/account-service.ts",
      errors: [{ messageId: "shortIdentifier", data: { name: "buf" } }],
    },
    {
      name: "reports a maximum-length short identifier",
      code: "const sum = total + 1;",
      filename: "src/modules/reports/domain/report.ts",
      errors: [{ messageId: "shortIdentifier", data: { name: "sum" } }],
    },
  ],
});
