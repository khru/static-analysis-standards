export const COLLABORATOR_QUERY_INIT_TYPES: readonly string[] = ["CallExpression", "NewExpression"];

export const INLINE_INIT_TYPES: readonly string[] = [
  "BinaryExpression",
  "LogicalExpression",
  "ConditionalExpression",
];

export const LOOP_STATEMENT_TYPES: readonly string[] = [
  "ForStatement",
  "ForOfStatement",
  "ForInStatement",
  "WhileStatement",
  "DoWhileStatement",
];
