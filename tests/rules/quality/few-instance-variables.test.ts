import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { fewInstanceVariables } from "../../../src/rules/quality/few-instance-variables.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

const fiveFields = `class Report {
  title = "";
  body = "";
  author = "";
  publishedAt = new Date();
  status = "draft";
}`;

const sixFields = `class Report {
  title = "";
  body = "";
  author = "";
  publishedAt = new Date();
  status = "draft";
  version = 1;
}`;

const sixFieldsOneStatic = `class Report {
  static type = "report";
  title = "";
  body = "";
  author = "";
  publishedAt = new Date();
  status = "draft";
}`;

ruleTester.run("few-instance-variables", fewInstanceVariables, {
  valid: [
    {
      name: "accepts a class with three instance variables",
      code: 'class Account { balance = 0; owner = ""; opened = new Date(); }',
      filename: "src/modules/accounts/domain/account.ts",
    },
    {
      name: "accepts a class with five instance variables",
      code: fiveFields,
      filename: "src/modules/reports/domain/report.ts",
    },
    {
      name: "accepts five instance variables beside a static field",
      code: sixFieldsOneStatic,
      filename: "src/modules/reports/domain/report.ts",
    },
    {
      name: "accepts six instance variables outside domain and application code",
      code: sixFields,
      filename: "src/infrastructure/report-mappers/report.ts",
    },
    {
      name: "accepts six instance variables inside a test file",
      code: sixFields,
      filename: "tests/unit/report.test.ts",
    },
  ],
  invalid: [
    {
      name: "reports a class with six instance variables",
      code: sixFields,
      filename: "src/modules/reports/domain/report.ts",
      errors: [{ messageId: "manyInstanceVariables", data: { count: 6 } }],
    },
    {
      name: "reports a class expression with six instance variables",
      code: `const report = class {
  title = "";
  body = "";
  author = "";
  publishedAt = new Date();
  status = "draft";
  version = 1;
};`,
      filename: "src/modules/reports/application/report-service.ts",
      errors: [{ messageId: "manyInstanceVariables", data: { count: 6 } }],
    },
  ],
});
