import type { TSESTree } from "@typescript-eslint/utils";

import { NESTED_SCOPE_NODE_TYPES } from "../data/nested-scope-node-types.js";
import {
  TEST_CALL_OBJECT_NAMES,
  TEST_CALL_PROPERTY_NAMES,
} from "../data/test-framework-catalogs.js";

export function isNode(value: unknown): value is TSESTree.Node {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { type?: unknown }).type === "string"
  );
}

function visitNestedNodes(node: TSESTree.Node, visit: (node: TSESTree.Node) => void): void {
  for (const [key, value] of Object.entries(node)) {
    if (key === "parent") continue;
    visitChildValue(value, visit);
  }
}

function visitChildValue(value: unknown, visit: (node: TSESTree.Node) => void): void {
  if (Array.isArray(value)) {
    value.filter(isNode).forEach(visit);
    return;
  }
  if (isNode(value)) visit(value);
}

export function walkNode(node: TSESTree.Node, visit: (node: TSESTree.Node) => boolean): void {
  if (!visit(node)) {
    return;
  }
  visitNestedNodes(node, (child) => {
    walkNode(child, visit);
  });
}

const nestedScopeNodeTypes = new Set(NESTED_SCOPE_NODE_TYPES);

export function walkOwnScope(node: TSESTree.Node, visit: (node: TSESTree.Node) => void): void {
  visit(node);
  if (nestedScopeNodeTypes.has(node.type)) {
    return;
  }
  visitNestedNodes(node, (child) => {
    walkOwnScope(child, visit);
  });
}

export function isPureLiteralExpression(node: TSESTree.Node): boolean {
  if (node.type === "Literal") {
    return true;
  }
  if (node.type === "UnaryExpression") {
    return isPureLiteralExpression(node.argument);
  }
  if (node.type === "BinaryExpression") {
    return isPureLiteralExpression(node.left) && isPureLiteralExpression(node.right);
  }
  return false;
}

export function staticMemberCallName(node: TSESTree.CallExpression): string | undefined {
  const callee = node.callee;
  if (
    callee.type === "MemberExpression" &&
    !callee.computed &&
    callee.property.type === "Identifier"
  ) {
    return callee.property.name;
  }
  return undefined;
}

export function isAmbientDateConstruction(node: TSESTree.Node): boolean {
  return (
    (node.type === "NewExpression" &&
      node.callee.type === "Identifier" &&
      node.callee.name === "Date" &&
      node.arguments.length === 0) ||
    (node.type === "CallExpression" &&
      node.callee.type === "MemberExpression" &&
      node.callee.object.type === "Identifier" &&
      node.callee.object.name === "Date" &&
      node.callee.property.type === "Identifier" &&
      node.callee.property.name === "now")
  );
}

const testCallObjectNames = new Set(TEST_CALL_OBJECT_NAMES);
const testCallPropertyNames = new Set(TEST_CALL_PROPERTY_NAMES);

export function isTestCaseCall(node: TSESTree.CallExpression): boolean {
  const callee = node.callee;
  if (callee.type === "Identifier") {
    return testCallObjectNames.has(callee.name);
  }
  if (callee.type === "MemberExpression") {
    return (
      callee.object.type === "Identifier" &&
      testCallObjectNames.has(callee.object.name) &&
      callee.property.type === "Identifier" &&
      testCallPropertyNames.has(callee.property.name)
    );
  }
  if (callee.type === "CallExpression" && callee.callee.type === "MemberExpression") {
    return (
      callee.callee.object.type === "Identifier" &&
      testCallObjectNames.has(callee.callee.object.name) &&
      callee.callee.property.type === "Identifier" &&
      callee.callee.property.name === "each"
    );
  }
  return false;
}

export function testCaseCallback(
  node: TSESTree.CallExpression,
): TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression | undefined {
  if (!isTestCaseCall(node)) {
    return undefined;
  }
  const argument = node.arguments[1];
  if (argument?.type === "FunctionExpression" || argument?.type === "ArrowFunctionExpression") {
    return argument;
  }
  return undefined;
}
