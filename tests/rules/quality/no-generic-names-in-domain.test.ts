import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { noGenericNamesInDomain } from "../../../src/rules/quality/no-generic-names-in-domain.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("no-generic-names-in-domain", noGenericNamesInDomain, {
  valid: [
    {
      name: "uses a domain class name from the ubiquitous language",
      code: "export class ReportedIncident {}",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "names a use case with an explicit business verb",
      code: "export async function reportIncident(attempt: IncidentAttempt): Promise<void> {}",
      filename: "src/modules/incidents/application/report-incident.ts",
    },
    {
      name: "names a port with its precise business role",
      code: "export interface IdentitySessionStore {}",
      filename: "src/modules/identity/application/identity-session-store.ts",
    },
    {
      name: "allows the provider role for an identity provider",
      code: "export interface IdentityProvider {}",
      filename: "src/modules/identity/application/identity-provider.ts",
    },
    {
      name: "allows a value object named after its concept",
      code: "export class IncidentId { constructor(private readonly id: string) {} }",
      filename: "src/modules/incidents/domain/incident-id.ts",
    },
    {
      name: "allows a named class expression with a domain name",
      code: "export const create = class IncidentFactory {};",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "allows an anonymous class expression",
      code: "export const anonymous = class {};",
      filename: "src/modules/incidents/application/report-incident.ts",
    },
    {
      name: "allows a computed method key",
      code: "export class IncidentLifecycle { [methodName]() {} }",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "allows a string-named method key",
      code: 'export class IncidentLifecycle { "execute"() {} }',
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "allows a destructured variable binding",
      code: "export function summarize(input: IncidentSnapshot) { const { reportedAt } = input; return reportedAt; }",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "allows a domain type alias",
      code: "export type ReportedIncidentId = string;",
      filename: "src/modules/incidents/domain/incident-id.ts",
    },
    {
      name: "allows a domain enum",
      code: "export enum IncidentStatus { Reported }",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "allows an anonymous named function expression",
      code: "export const transform = function aggregate(rows: Row[]) { return rows; };",
      filename: "src/modules/incidents/application/report-incident.ts",
    },
    {
      name: "allows an anonymous function expression without a name",
      code: "export const transform = function (rows: Row[]) { return rows; };",
      filename: "src/modules/incidents/application/report-incident.ts",
    },
    {
      name: "allows a destructured parameter property",
      code: "export function run({ incidentId }: Options) { return incidentId; }",
      filename: "src/modules/incidents/application/report-incident.ts",
    },
    {
      name: "allows an arrow function with a domain parameter",
      code: "export const enrich = (snapshot: IncidentSnapshot) => snapshot;",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "allows generic names in a domain test file",
      code: "export class IncidentManager { execute() {} }",
      filename: "test/unit/incidents/domain/incident.test.ts",
    },
    {
      name: "allows generic technical names in infrastructure",
      code: "export class RequestHandler { execute() {} }",
      filename: "src/infrastructure/http/request-handler.ts",
    },
    {
      name: "allows generic names in test fixtures",
      code: "export class TestService { perform() {} }",
      filename: "test/unit/fixtures/test-service.ts",
    },
    {
      name: "uses explicit business verbs on methods",
      code: "export class BrowserSessionAuthentication { start(attempt: LoginAttempt) {} }",
      filename: "src/modules/identity/application/browser-session-authentication.ts",
    },
  ],
  invalid: [
    {
      name: "reports a manager-named domain class",
      code: "export class IncidentManager {}",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "genericTypeName", data: { name: "IncidentManager" } }],
    },
    {
      name: "reports a service-named application interface",
      code: "export interface IdentityService {}",
      filename: "src/modules/identity/application/identity-provider.ts",
      errors: [{ messageId: "genericTypeName", data: { name: "IdentityService" } }],
    },
    {
      name: "reports a data-named application function",
      code: "export function processIncidentData(reportedAt: string) {}",
      filename: "src/modules/incidents/application/report-incident.ts",
      errors: [{ messageId: "genericTypeName", data: { name: "processIncidentData" } }],
    },
    {
      name: "reports a data-named domain variable",
      code: "export function normalize() { const data = [1, 2]; return data; }",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "genericTypeName", data: { name: "data" } }],
    },
    {
      name: "reports a helper-named domain alias",
      code: "export type AuditHelper = string;",
      filename: "src/modules/audit/domain/audit-event.ts",
      errors: [{ messageId: "genericTypeName", data: { name: "AuditHelper" } }],
    },
    {
      name: "reports an info-named application parameter",
      code: "export function record(info: AuditEvent) {}",
      filename: "src/modules/audit/application/record-audit-event.ts",
      errors: [{ messageId: "genericTypeName", data: { name: "info" } }],
    },
    {
      name: "reports a named class expression with a generic name",
      code: "export const holder = class DataHolder {};",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "genericTypeName", data: { name: "DataHolder" } }],
    },
    {
      name: "reports a generic execute method in a domain class",
      code: "export class IncidentLifecycle { execute() {} }",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "genericMethodName", data: { name: "execute" } }],
    },
    {
      name: "reports a generic perform method in an application class",
      code: "export class ReportIncident { perform(attempt: IncidentAttempt) {} }",
      filename: "src/modules/incidents/application/report-incident.ts",
      errors: [{ messageId: "genericMethodName", data: { name: "perform" } }],
    },
    {
      name: "reports a handler-named method",
      code: "export class AuditTrail { handler() {} }",
      filename: "src/modules/audit/application/audit-trail.ts",
      errors: [{ messageId: "genericMethodName", data: { name: "handler" } }],
    },
    {
      name: "reports an entity-named application enum",
      code: "export enum AuditEntity { Target }",
      filename: "src/modules/audit/application/audit-trail.ts",
      errors: [{ messageId: "genericTypeName", data: { name: "AuditEntity" } }],
    },
  ],
});
