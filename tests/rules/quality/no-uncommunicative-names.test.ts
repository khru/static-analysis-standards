import { RuleTester } from "@typescript-eslint/rule-tester";
import tseslint from "typescript-eslint";

import { noUncommunicativeNames } from "../../../src/rules/quality/no-uncommunicative-names.js";

const ruleTester = new RuleTester({
  languageOptions: { parser: tseslint.parser },
});

ruleTester.run("no-uncommunicative-names", noUncommunicativeNames, {
  valid: [
    {
      name: "uses an intention-revealing variable name",
      code: "const reportedAt = new Date(reportedAtIso);",
      filename: "src/modules/incidents/application/report-incident.ts",
    },
    {
      name: "allows conventional single-letter loop counters",
      code: "for (let i = 0; i < rows.length; i += 1) { sum += rows[i]; }",
      filename: "src/infrastructure/persistence/incident-repository.ts",
    },
    {
      name: "allows the discard marker",
      code: "items.forEach((_) => accumulate());",
      filename: "src/infrastructure/persistence/incident-repository.ts",
    },
    {
      name: "allows the canonical zod import name",
      code: 'import { z } from "zod"; const schema = z.object({ id: z.string() });',
      filename: "src/modules/incidents/infrastructure/report-incident-http-request.ts",
    },
    {
      name: "allows a meaningful import alias",
      code: 'import { object as incidentSchema } from "zod";',
      filename: "src/modules/incidents/infrastructure/report-incident-http-request.ts",
    },
    {
      name: "allows a conventional namespace import",
      code: 'import * as pg from "pg";',
      filename: "src/infrastructure/persistence/postgres-community.ts",
    },
    {
      name: "allows an intention-revealing default import",
      code: 'import express from "express";',
      filename: "src/infrastructure/http/app.ts",
    },
    {
      name: "allows short precise names that are not placeholders",
      code: "const id = attempt.incidentId;",
      filename: "src/modules/incidents/application/report-incident.ts",
    },
    {
      name: "allows vague names in test files",
      code: "const x = 1;",
      filename: "test/unit/incidents/report-incident.test.ts",
    },
    {
      name: "allows a parameter that names its unit",
      code: "function enrich(row: PostgresRow) { return row; }",
      filename: "src/infrastructure/persistence/incident-repository.ts",
    },
    {
      name: "allows a method name that states its effect",
      code: "export class IncidentRepository { findByCommunity(communityId: string) {} }",
      filename: "src/infrastructure/persistence/incident-repository.ts",
    },
    {
      name: "allows a named class expression with a revealing name",
      code: "export const build = class IncidentFactory {};",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "allows an anonymous function expression",
      code: "export const transform = function (rows: Row[]) { return rows; };",
      filename: "src/infrastructure/persistence/incident-repository.ts",
    },
    {
      name: "allows a named function expression with a revealing name",
      code: "export const transform = function aggregate(rows: Row[]) { return rows; };",
      filename: "src/infrastructure/persistence/incident-repository.ts",
    },
    {
      name: "allows an anonymous class expression",
      code: "export const build = class {};",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "allows a destructured function parameter",
      code: "export function run({ incidentId }: Options) { return incidentId; }",
      filename: "src/modules/incidents/application/report-incident.ts",
    },
    {
      name: "allows a destructured variable binding",
      code: "export function summarize(input: IncidentSnapshot) { const { reportedAt } = input; return reportedAt; }",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "allows an intention-revealing type alias",
      code: "export type ReportedIncidentId = string;",
      filename: "src/modules/incidents/domain/incident-id.ts",
    },
    {
      name: "allows an intention-revealing enum",
      code: "export enum IncidentStatus { Reported }",
      filename: "src/modules/incidents/domain/incident.ts",
    },
    {
      name: "allows an intention-revealing interface",
      code: "export interface IncidentRepository {}",
      filename: "src/modules/incidents/application/incident-repository.ts",
    },
    {
      name: "allows an intention-revealing constructor parameter property",
      code: "export class Session { constructor(private readonly duration: number) {} }",
      filename: "src/modules/identity/application/browser-sessions.ts",
    },
    {
      name: "allows an intention-revealing property name",
      code: "export class Session { private duration: number = 0; }",
      filename: "src/modules/identity/application/browser-sessions.ts",
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
      name: "allows a computed property key",
      code: 'export class Session { [key]: string = ""; }',
      filename: "src/modules/identity/application/browser-sessions.ts",
    },
    {
      name: "allows a string-named property key",
      code: 'export class Session { "duration": string = ""; }',
      filename: "src/modules/identity/application/browser-sessions.ts",
    },
  ],
  invalid: [
    {
      name: "reports a temp placeholder variable",
      code: "const temp = rows[0];",
      filename: "src/infrastructure/persistence/incident-repository.ts",
      errors: [{ messageId: "uncommunicativeName", data: { name: "temp" } }],
    },
    {
      name: "reports a vague interface name",
      code: "export interface Data {}",
      filename: "src/modules/incidents/application/incident-repository.ts",
      errors: [{ messageId: "uncommunicativeName", data: { name: "Data" } }],
    },
    {
      name: "reports a vague type alias name",
      code: "export type Tmp = string;",
      filename: "src/modules/incidents/domain/incident-id.ts",
      errors: [{ messageId: "uncommunicativeName", data: { name: "Tmp" } }],
    },
    {
      name: "reports a single-letter enum name",
      code: "export enum N { A }",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "uncommunicativeName", data: { name: "N" } }],
    },
    {
      name: "reports a vague method name",
      code: "export class IncidentLifecycle { temp() {} }",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "uncommunicativeName", data: { name: "temp" } }],
    },
    {
      name: "reports a data placeholder variable",
      code: "const data = await fetchIncidents();",
      filename: "src/modules/incidents/application/list-community-incidents.ts",
      errors: [{ messageId: "uncommunicativeName", data: { name: "data" } }],
    },
    {
      name: "reports a single-letter variable",
      code: "const x = await resolveIncident();",
      filename: "src/modules/incidents/application/list-community-incidents.ts",
      errors: [{ messageId: "uncommunicativeName", data: { name: "x" } }],
    },
    {
      name: "reports a single-letter parameter",
      code: "function run(q: Query) { return q.toString(); }",
      filename: "src/infrastructure/persistence/incident-repository.ts",
      errors: [{ messageId: "uncommunicativeName", data: { name: "q" } }],
    },
    {
      name: "reports a single-letter class name",
      code: "export class M {}",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "uncommunicativeName", data: { name: "M" } }],
    },
    {
      name: "reports a vague property name",
      code: "export class Session { private d: Date = new Date(); }",
      filename: "src/modules/identity/application/browser-sessions.ts",
      errors: [{ messageId: "uncommunicativeName", data: { name: "d" } }],
    },
    {
      name: "reports an import alias that shortens the imported name",
      code: 'import { object as o } from "zod";',
      filename: "src/modules/incidents/infrastructure/report-incident-http-request.ts",
      errors: [{ messageId: "uncommunicativeName", data: { name: "o" } }],
    },
    {
      name: "reports a single-letter default import alias",
      code: 'import x from "express";',
      filename: "src/infrastructure/http/app.ts",
      errors: [{ messageId: "uncommunicativeName", data: { name: "x" } }],
    },
    {
      name: "reports a single-letter namespace import alias",
      code: 'import * as p from "pg";',
      filename: "src/infrastructure/persistence/postgres-community.ts",
      errors: [{ messageId: "uncommunicativeName", data: { name: "p" } }],
    },
    {
      name: "reports a single-letter alias for a string-named import",
      code: 'import { "schema" as s } from "zod";',
      filename: "src/modules/incidents/infrastructure/report-incident-http-request.ts",
      errors: [{ messageId: "uncommunicativeName", data: { name: "s" } }],
    },
    {
      name: "reports a vague function name",
      code: "export function thing() {}",
      filename: "src/modules/incidents/application/report-incident.ts",
      errors: [{ messageId: "uncommunicativeName", data: { name: "thing" } }],
    },
    {
      name: "reports a vague named class expression",
      code: "export const build = class Foo {};",
      filename: "src/modules/incidents/domain/incident.ts",
      errors: [{ messageId: "uncommunicativeName", data: { name: "Foo" } }],
    },
  ],
});
