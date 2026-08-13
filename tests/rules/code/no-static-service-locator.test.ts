import { RuleTester } from "@typescript-eslint/rule-tester";

import { noStaticServiceLocator } from "../../../src/rules/code/no-static-service-locator.js";

const ruleTester = new RuleTester();

ruleTester.run("no-static-service-locator", noStaticServiceLocator, {
  valid: [
    {
      name: "readonly static constant",
      code: "class Limits { static readonly MAX = 5; }",
    },
    {
      name: "static method that does not construct itself",
      code: "class Parser { static parse(input) { return toAst(input); } }",
    },
    {
      name: "instance constructor returns instance",
      code: "class Parser { build() { return new Parser(); } }",
    },
    {
      name: "a static method constructing itself inside a nested closure is not a locator",
      code: "class Locator { static get() { const build = () => new Locator(); return build(); } }",
    },
    {
      name: "a static method returning a different class is not a locator",
      code: "class Factory { static get() { return new Parser(); } }",
    },
    {
      name: "a factory-named static method constructing its own value object is a legitimate factory",
      code: "class IncidentId { static create(value) { return new IncidentId(value); } }",
    },
    {
      name: "a factory-named static method constructing its own aggregate is a legitimate factory",
      code: "class AuditEvent { static record(event, recordedAt) { return new AuditEvent(); } }",
    },
    {
      name: "a with-prefixed static method constructing its own class is a legitimate factory",
      code: "class SecretEncryptionKeyRing { static withCurrentKey(id, key) { return new SecretEncryptionKeyRing(); } }",
    },
    {
      name: "a static method with a computed key cannot be classified and is not reported",
      code: 'class Locator { static ["get"]() { return new Locator(); } }',
    },
  ],
  invalid: [
    {
      name: "reports assignable static mutable state",
      code: "class Registry { static cache = {}; }",
      errors: [{ messageId: "staticMutableState" }],
    },
    {
      name: "reports static mutable state on an anonymous exported class",
      code: "export default class { static cache = {}; }",
      errors: [{ messageId: "staticMutableState" }],
    },
    {
      name: "reports static mutable state on an anonymous class expression",
      code: "const Registry = class { static cache = {}; };",
      errors: [{ messageId: "staticMutableState" }],
    },
    {
      name: "reports assignable static state without an initializer",
      code: "class Registry { static cache; }",
      errors: [{ messageId: "staticMutableState" }],
    },
    {
      name: "reports a static method returning a new instance of its own class",
      code: "class Locator { static get() { return new Locator(); } }",
      errors: [{ messageId: "staticSelfReturning" }],
    },
    {
      name: "reports a static self-returning method on a class expression",
      code: "const Factory = class Locator { static get() { return new Locator(); } };",
      errors: [{ messageId: "staticSelfReturning" }],
    },
    {
      name: "reports a static instance method returning its own class",
      code: "class Locator { static instance() { return new Locator(); } }",
      errors: [{ messageId: "staticSelfReturning" }],
    },
    {
      name: "reports a static getInstance method returning its own class",
      code: "class Locator { static getInstance() { return new Locator(); } }",
      errors: [{ messageId: "staticSelfReturning" }],
    },
    {
      name: "reports a static singleton method returning its own class",
      code: "class Locator { static singleton() { return new Locator(); } }",
      errors: [{ messageId: "staticSelfReturning" }],
    },
  ],
});
