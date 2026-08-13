import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { noAbbreviatedNames } from "../../../src/rules/quality/no-abbreviated-names.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("no-abbreviated-names", noAbbreviatedNames, {
  valid: [
    {
      name: "accepts a full word identifier",
      code: "const button = createButton();",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts camel case full words",
      code: "function currentPosition() {}",
      filename: "src/modules/incidents/application/list-community-incidents.ts",
    },
    {
      name: "accepts a catalog expansion as segment",
      code: "const currentIndex = 0;",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts standard protocol vocabulary",
      code: "const id = incidentId;",
      filename: "src/modules/incidents/domain/incident-id.ts",
    },
    {
      name: "accepts an abbreviation inside a test file",
      code: "const btn = submit;",
      filename: "test/unit/incident.test.ts",
    },
    {
      name: "accepts a catalog word embedded in a longer segment",
      code: "const buttonlike = control;",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts an uppercased full word",
      code: "const BUTTON = submit;",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts an acronym followed by a full word",
      code: "const httpClient = transport;",
      filename: "src/modules/incidents/infrastructure/http-client.ts",
    },
    {
      name: "accepts a destructured parameter",
      code: "const publish = ({ index }) => index;",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts a destructured declaration",
      code: "const { index } = config;",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts an anonymous default export function",
      code: "export default function () {}",
      filename: "src/modules/incidents/application/report-incident.ts",
    },
    {
      name: "accepts an anonymous default export class",
      code: "export default class {}",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts an anonymous class expression",
      code: "const factory = class {};",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts a computed method key",
      code: 'class Recorder { ["process"]() {} }',
      filename: "src/modules/audit/application/audit-event-recorder.ts",
    },
    {
      name: "accepts a computed property key",
      code: 'class Trail { ["quantity"] = 0; }',
      filename: "src/modules/audit/application/audit-trail.ts",
    },
  ],
  invalid: [
    {
      name: "reports an abbreviated variable name",
      code: "const btn = submit;",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "abbreviatedName" }],
    },
    {
      name: "reports an abbreviated camel case segment",
      code: "function currState() {}",
      filename: "src/modules/incidents/application/report-incident.ts",
      errors: [{ messageId: "abbreviatedName" }],
    },
    {
      name: "reports an abbreviated class name",
      code: "class Elem {}",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "abbreviatedName" }],
    },
    {
      name: "reports an abbreviated interface name",
      code: "interface Msg {}",
      filename: "src/modules/audit/domain/audit-event.ts",
      errors: [{ messageId: "abbreviatedName" }],
    },
    {
      name: "reports an abbreviated method name",
      code: "class Recorder { proc() {} }",
      filename: "src/modules/audit/application/audit-event-recorder.ts",
      errors: [{ messageId: "abbreviatedName" }],
    },
    {
      name: "reports an abbreviated parameter name",
      code: "function save(idx) {}",
      filename: "src/modules/incidents/application/report-incident.ts",
      errors: [{ messageId: "abbreviatedName" }],
    },
    {
      name: "reports an abbreviated type alias",
      code: "type Resp = string;",
      filename: "src/modules/identity/application/identity-provider.ts",
      errors: [{ messageId: "abbreviatedName" }],
    },
    {
      name: "reports an uppercased abbreviation",
      code: "const PREV = snapshot;",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "abbreviatedName" }],
    },
    {
      name: "reports an abbreviated class expression",
      code: "const recorder = class Elem {};",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "abbreviatedName" }],
    },
    {
      name: "reports an abbreviated arrow parameter",
      code: "const publish = (evt) => evt;",
      filename: "src/modules/audit/application/record-audit-event.ts",
      errors: [{ messageId: "abbreviatedName" }],
    },
    {
      name: "reports an abbreviated property definition",
      code: "class Trail { qty = 0; }",
      filename: "src/modules/audit/application/audit-trail.ts",
      errors: [{ messageId: "abbreviatedName" }],
    },
    {
      name: "reports an abbreviated named function expression",
      code: "const recorder = function evt() {};",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "abbreviatedName" }],
    },
    {
      name: "reports an abbreviated enum name",
      code: "enum Evt { Created }",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "abbreviatedName" }],
    },
  ],
});
