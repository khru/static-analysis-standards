import type { TSESLint } from "@typescript-eslint/utils";

import { isDomainOrApplicationFile, isTestFile } from "../../shared/file-scope.js";

const messages = {
  concreteRepository:
    "Dependency on the concrete repository '{{name}}'. Depend on the repository port in the owning module instead.",
} as const;

const CONCRETE_REPOSITORY =
  /^(Postgres|Kysely|Prisma|Sqlite|SQLite|Mongo|MongoDB|Redis|InMemory|TypeOrm|Sequelize).*Repository$/;

export const noConcreteRepositoryDependency: TSESLint.RuleModule<keyof typeof messages, []> = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Reports dependencies on concrete repository implementations from domain and application code. Refactor suggested: depend on the repository port in the owning module.",
    },
    messages,
    schema: [],
  },
  create(context) {
    const filename = context.filename;
    if (!isDomainOrApplicationFile(filename) || isTestFile(filename)) {
      return {};
    }
    return {
      ImportDeclaration(node) {
        for (const specifier of node.specifiers) {
          if (specifier.type !== "ImportSpecifier") continue;
          const imported = specifier.imported;
          const name = imported.type === "Identifier" ? imported.name : imported.value;
          if (!CONCRETE_REPOSITORY.test(name)) continue;
          context.report({ node: specifier, messageId: "concreteRepository", data: { name } });
        }
      },
    };
  },
};
