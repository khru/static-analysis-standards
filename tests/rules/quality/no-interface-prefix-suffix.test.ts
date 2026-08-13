import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { noInterfacePrefixSuffix } from "../../../src/rules/quality/no-interface-prefix-suffix.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("no-interface-prefix-suffix", noInterfacePrefixSuffix, {
  valid: [
    {
      name: "accepts a plain interface name",
      code: "interface Incident {}",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "accepts an interface starting with a lowercase i segment",
      code: "interface Identity {}",
      filename: "src/modules/identity/application/identity-provider.ts",
    },
    {
      name: "accepts a two letter interface beginning with I",
      code: "interface Io {}",
      filename: "src/infrastructure/io.ts",
    },
    {
      name: "accepts an interface without the suffix",
      code: "interface ReportForm {}",
      filename: "src/modules/incidents/application/report-incident.ts",
    },
    {
      name: "accepts a prefixed interface inside a test file",
      code: "interface IFoo {}",
      filename: "test/unit/incident.test.ts",
    },
    {
      name: "accepts a class with an I prefix because only interfaces are checked",
      code: "class IReport {}",
      filename: "src/modules/incidents/domain/incident.ts",
    },
  ],
  invalid: [
    {
      name: "reports an I prefixed interface",
      code: "interface IIncident {}",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "interfacePrefix" }],
    },
    {
      name: "reports an Interface suffixed interface",
      code: "interface IncidentInterface {}",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "interfaceSuffix" }],
    },
    {
      name: "reports a short I prefixed interface",
      code: "interface IThing {}",
      filename: "src/modules/audit/domain/audit-event.ts",
      errors: [{ messageId: "interfacePrefix" }],
    },
    {
      name: "reports an I prefixed interface with digits",
      code: "interface IReport2 {}",
      filename: "src/modules/incidents/application/report-incident.ts",
      errors: [{ messageId: "interfacePrefix" }],
    },
    {
      name: "reports an interface named exactly Interface",
      code: "interface Interface {}",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "interfaceSuffix" }],
    },
  ],
});
