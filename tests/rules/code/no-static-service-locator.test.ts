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
      name: "a nested closure returning itself is not a locator",
      code: "class Locator { static get() { const build = () => { return new Locator(); }; return build(); } }",
    },
    {
      name: "nested class context is restored after the class expression exits",
      code: "class Outer { static get() { return new Parser(); } } const Nested = class Inner { static get() { return new Parser(); } }; class Parser {}",
    },
    {
      name: "function expressions inside locator methods are skipped",
      code: "class Locator { static get() { const build = function() { return new Locator(); }; return build(); } }",
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
    {
      name: "readonly static initialized state is allowed",
      code: "class Registry { static readonly cache = {}; }",
    },
    {
      name: "instance mutable state is not static state",
      code: "class Registry { cache = {}; }",
    },
    {
      name: "uninitialized readonly static state is allowed",
      code: "class Registry { static readonly cache; }",
    },
    {
      name: "a static method returning an unrelated constructor is allowed",
      code: "class Locator { static get() { return new Parser(); } } class Parser {}",
    },
    {
      name: "a following class with unrelated static method remains classified independently",
      code: "class Locator { static get() { return new Parser(); } } class Parser { static parse() { return new Parser(); } }",
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
    {
      name: "reports all supported self-returning locator method names",
      code: "class Locator { static get() { return new Locator(); } static instance() { return new Locator(); } static getInstance() { return new Locator(); } static singleton() { return new Locator(); } }",
      errors: [
        { messageId: "staticSelfReturning" },
        { messageId: "staticSelfReturning" },
        { messageId: "staticSelfReturning" },
        { messageId: "staticSelfReturning" },
      ],
    },
    {
      name: "reports writable static properties with mutable initializer forms",
      code: "class Registry { static cache = {}; static list = []; static value = new Map(); static call = factory(); }",
      errors: [
        { messageId: "staticMutableState" },
        { messageId: "staticMutableState" },
        { messageId: "staticMutableState" },
        { messageId: "staticMutableState" },
      ],
    },
    {
      name: "reports every initialized writable static property",
      code: "class Registry { static first = {}; static second = []; }",
      errors: [{ messageId: "staticMutableState" }, { messageId: "staticMutableState" }],
    },
    {
      name: "allows readonly and instance properties beside mutable static state",
      code: "class Registry { static cache = {}; static readonly fixed = {}; cache = {}; static readonly pending; }",
      errors: [{ messageId: "staticMutableState" }],
    },
    {
      name: "reports primitive static state when it is uninitialized",
      code: "class Registry { static count; }",
      errors: [{ messageId: "staticMutableState" }],
    },
  ],
});

describe("no-static-service-locator metadata", () => {
  it("should expose its public diagnostic descriptions", () => {
    expect(noStaticServiceLocator.meta.docs?.description).toContain("static mutable state");
    expect(noStaticServiceLocator.meta.messages.staticMutableState).toContain("Static");
  });
});
